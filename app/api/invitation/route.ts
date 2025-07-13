import { prisma } from "../../../lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import crypto from "crypto";
import { validateQuota } from "@/lib/emailQuota";
import { sendInviteEmail } from "@/lib/sendInvite";

type InviteResult = {
  status: "SENT" | "FAILED";
  emailEntryId: string;
  token: string;
  errorMessage: string | null;
};



export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const emailIds = formData.getAll("emailIds") as string[];
    const topicId = formData.get("topicId") as string;
    const workspaceId = formData.get("workspaceId") as string;

    if (!emailIds?.length || !topicId || !workspaceId) {
      return NextResponse.json({ success: false, message: "Invalid form data" }, { status: 400 });
    }

    const quotaError = await validateQuota(workspaceId);
    if (quotaError) return quotaError;

    const existing = await prisma.invitation.findMany({
      where: { emailEntryId: { in: emailIds }, topicId },
      select: { emailEntryId: true },
    });

    const alreadyInvited = new Set(existing.map((e) => e.emailEntryId));
    const toInvite = emailIds.filter((id) => !alreadyInvited.has(id));

    if (!toInvite.length) {
      return NextResponse.json({ success: false, message: "All invites already sent" });
    }

    const emailEntries = await prisma.emailEntry.findMany({
      where: { id: { in: toInvite } },
    });

    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      select: { title: true, description: true },
    });

    if (!topic) {
      return NextResponse.json({ success: false, message: "Topic not found" });
    }
  // lesson how to use Promise.allSettled with custom values to later filter the fulfilled/rejected Promises
    const result = await Promise.allSettled(
      emailEntries.map((entry)=>{
         const token = crypto.randomUUID()
         const inviteLink = `${process.env.DOMAIN}/invite/?token=${token}`
         return sendInviteEmail({
          to:entry.email,
          inviteLink,
          topicDescription:topic.description,
          topicTitle:topic.title
         }).then<InviteResult>(()=>({
          status:'SENT' as const,
          emailEntryId:entry.id,
          token,
          errorMessage:null
         }))
         .catch<InviteResult>((error)=>({
           status:'FAILED' as const,
          emailEntryId:entry.id,
          token,
          errorMessage:error?.message || "Unknown error"
         }))
      })
    )

    const successfulInvite = result.filter((r): r is PromiseFulfilledResult<InviteResult> => r.status === "fulfilled")
    .map((r)=>r.value)
    .filter((r)=>r.status === "SENT")

    const failedInvite = result.filter((r): r is PromiseFulfilledResult<InviteResult> => r.status ==="rejected")
    .map((r)=>r.value)
    .filter((r)=> r.status === "FAILED")

    //we can add the expiryDate here for inviteSubmission.

    if(successfulInvite.length > 0){
      await prisma.$transaction(
        successfulInvite.map((invite)=>
          prisma.invitation.create({
            data:{
              emailEntryId:invite.emailEntryId,
              token: invite.token,
              topicId,
              inviteStatus:"SENT",
              sentAt:new Date(),
              error:null
            }
          })
        )
      )
    }


    if(failedInvite.length > 0){
      await prisma.$transaction(
        failedInvite.map((invite)=>
          prisma.invitation.create({
            data:{
              emailEntryId:invite.emailEntryId,
              topicId,
              token: invite.token,
              inviteStatus:"FAILED",
              error:invite.errorMessage,
            }
          })
        )
      )
    }

    await prisma.emailUsage.update({
      where:{
        workspaceId
      },
      data:{
        sentCount:{increment: successfulInvite.length}
      }
    })


    return NextResponse.json({
      success: true,
      message: "Processed invites",
      total: emailEntries.length,
      sent:successfulInvite.length,
      failed:successfulInvite.length
    });

    
  } catch (error) {
    console.error("Send invite error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const search = searchParams.get("q") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const topicId = searchParams.get("topicId");

    if (!topicId) {
      return NextResponse.json(
        { success: false, message: "please send the topicId in url" },
        { status: 400 }
      );
    }

    const [getAllInviteForTopic, count] = await Promise.all([
      prisma.invitation.findMany({
        where: {
          topicId,
          ...(search && {
            emailEntryId: {
              contains: search,
              mode: "insensitive",
            },
          }),
        },
        take: limit,
        select: {
          emailEntryId: true,
          id: true,
          used: true,
          sentAt: true,
          expiresAt: true,
          submittedAt: true,
        },
        orderBy: {
          sentAt: "desc",
        },
      }),
      await prisma.invitation.count({
        where: {
          topicId,
          ...(search && {
            emailEntryId: {
              contains: search,
              mode: "insensitive",
            },
          }),
        },
      }),
    ]);

    return NextResponse.json({
      data: getAllInviteForTopic,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.error("error happend while fetching the invitation List", error);

    return NextResponse.json(
      {
        success: false,
        error: "Error happend while getting invite list",
      },
      { status: 500 }
    );
  }
}
