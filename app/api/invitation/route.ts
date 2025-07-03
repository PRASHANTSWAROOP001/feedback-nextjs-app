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
        const invite = createInviteArray.find((i) => i.emailEntryId === entry.id);
        const inviteLink = `${process.env.DOMAIN || "http://localhost:3000"}/invite/${invite?.token}`;
        const htmlContent = getInviteEmailHTML({
          inviteLink,
          topicDescription: topicDetails?.description ?? "",
          topicTitle: topicDetails?.title ?? ""
        })

        await transporter.sendMail({
          from: process.env.GMAIL_USER,
          to: entry.email,
          subject: "You're invited!",
          html: htmlContent,
        });

        return { email: entry.email, token: invite?.token };
      })
    );

    const success: { email: string; token: string }[] = [];
    const failed: { email: string; reason: any }[] = [];

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
