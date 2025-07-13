import { prisma } from "../../../lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import crypto from "crypto";
import { validateQuota } from "@/lib/emailQuota";
import { sendInviteEmail } from "@/lib/sendInvite";


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

    const invites = emailEntries.map((entry) => ({
      emailEntryId: entry.id,
      topicId,
      token: crypto.randomUUID(),
    }));

    await prisma.$transaction([
      prisma.invitation.createMany({ data: invites, skipDuplicates: true }),
    ]);

    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      select: { title: true, description: true },
    });

    if (!topic) {
      return NextResponse.json({ success: false, message: "Topic not found" });
    }

const results = await Promise.allSettled(
  emailEntries.map((entry) => {
    const invite = invites.find((i) => i.emailEntryId === entry.id);
    const inviteLink = `${process.env.DOMAIN}/invite?token=${invite?.token}`;
    return sendInviteEmail({
      to: entry.email,
      inviteLink,
      topicTitle: topic.title,
      topicDescription: topic.description,
    });
  })
)
   results.forEach((r, i) => {
  if (r.status === "rejected") {
    console.error(`Failed to send email to ${emailEntries[i].email}:`, r.reason);
  }
});
    const sent = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.length - sent;

    return NextResponse.json({
      success: true,
      message: "Processed invites",
      total: emailEntries.length,
      sent,
      failed,
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
