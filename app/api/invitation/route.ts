import { prisma } from "../../../lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import nodeMailer from "nodemailer";
import crypto from "crypto";
import fs from "fs"
import handlebars from "handlebars"
import path from "path";


const filePath = path.resolve(process.cwd(), "template", "inviteEmail.hbs") // imports the hbs file path

const sourceFile = fs.readFileSync(filePath, "utf-8") // reads the file

const template = handlebars.compile(sourceFile)// compiles it


// Email transporter
const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
});

// Email HTML template function

type EmailTemplateType = {
    inviteLink:string,
    topicTitle:string,
    topicDescription:string
}

function getInviteEmailHTML({inviteLink, topicDescription, topicTitle}: EmailTemplateType): string {
  return template({
    inviteLink: inviteLink,
    topicTitle: topicTitle,
    topicDescription: topicDescription,
  });
}

// returns the template



export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const emailId = formData.getAll("emailIds") as string[];
    const topicId = formData.get("topicId") as string;

    if (!emailId || !emailId.length) {
      return NextResponse.json(
        {
          success: false,
          message: "Either emailId is not sent or empty array sent",
        },
        { status: 400 }
      );
    }

    if (!topicId) {
      return NextResponse.json(
        {
          success: false,
          message: "Please send topicId",
        },
        { status: 400 }
      );
    }

    // Generate tokens and prepare data for insert
    const createInviteArray = emailId.map((val: string) => ({
      emailEntryId: val,
      topicId: topicId,
      token: crypto.randomUUID(),
    }));

    // Insert invitations in bulk
    await prisma.invitation.createMany({
      data: createInviteArray,
      skipDuplicates: true,
    });

    // Fetch email addresses based on IDs
    const emailEntries = await prisma.emailEntry.findMany({
      where: { id: { in: emailId } },
      select: {
        email: true,
        id: true,
      },
    });

    const topicDetails = await prisma.topic.findUnique({
        where:{
            id:topicId
        }
    })



    const emailResults = await Promise.allSettled(
      emailEntries.map(async (entry) => {
        const invite = createInviteArray.find((i) => i.emailEntryId === entry.id); // matching emailId from frontend with fetched from db
        const inviteLink = `${process.env.DOMAIN || "http://localhost:3000"}/invite?token=${invite?.token}`;
      // once we have match we can decode the respective token id from field token 
        const htmlContent = getInviteEmailHTML({
          inviteLink,
          topicDescription: topicDetails?.description ?? "",
          topicTitle: topicDetails?.title ?? ""
        })

        // this creates the dynamic content for the invite

        await transporter.sendMail({
          from: process.env.GMAIL_USER,
          to: entry.email,
          subject: "You're invited!",
          html: htmlContent,
        });

        // sending the email

        return { email: entry.email, token: invite?.token };
      })
    );

    const success: { email: string; token: string }[] = [];
    const failed: { email: string; reason: any }[] = [];

    // counting success and failures cause of promise.allSettled this allows to proceed even if there is a failure
    
    emailResults.forEach((result, index) => {
      const entry = emailEntries[index];
      if (result.status === "fulfilled") {
        success.push({
          email: entry.email,
          token: createInviteArray.find((i) => i.emailEntryId === entry.id)?.token || "unknown",
        });
      } else {
        failed.push({
          email: entry.email,
          reason: result.reason,
        });
      }
    });

    return NextResponse.json({
      success: true,
      message: "Emails processed",
      total: emailEntries.length,
      sent: success.length,
      failed: failed.length,
      data: {
        successfulEmails: success,
        failedEmails: failed,
      },
    });
  } catch (error) {
    console.error("Error while adding invitation data:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error on our side",
      },
      {
        status: 500,
      }
    );
  }
}


export async function GET(req:NextRequest){
  try {

    const {searchParams} = req.nextUrl;
    const search = searchParams.get("q") || ""
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const topicId = searchParams.get("topicId")

    if(!topicId){
      return NextResponse.json({success:false, message:"please send the topicId in url"}, {status:400})
    }

  const [getAllInviteForTopic, count] = await Promise.all([prisma.invitation.findMany({
      where:{
        topicId,
        ...(search && {
          emailEntryId:{
            contains:search,
            mode:"insensitive"
          }
        })
      },
      take:limit,
      select:{
        emailEntryId:true,
        id:true,
        used:true,
        sentAt:true,
        expiresAt:true,
        submittedAt:true
      },
      orderBy:{
        sentAt:"desc"
      }
    }), 
    await prisma.invitation.count({      where:{
        topicId,
        ...(search && {
          emailEntryId:{
            contains:search,
            mode:"insensitive"
          }
        })
      }})
  ])
  
  return NextResponse.json({
    data:getAllInviteForTopic,
    total:count,
    page,
    totalPages: Math.ceil(count/limit)
  })

  } catch (error) {
    console.error("error happend while fetching the invitation List", error);

    return NextResponse.json({
      success:false,
      error:"Error happend while getting invite list"
    }, {status:500})
  }
}