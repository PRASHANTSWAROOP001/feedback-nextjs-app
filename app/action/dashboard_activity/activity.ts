"use server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "../../../lib/prisma"

export async function getLastHourFeedback() {
    try {

        const { userId } = await auth();

        if (!userId) {
            return {
                success: false,
                message: "Missing auth details. Please log in.",
            };
        }

        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

        const feedbackCount = await prisma.feedback.count({
            where: {
                submittedAt: {
                    gte: oneHourAgo,
                },
                invitation: {
                    emailEntry: {
                        workspace: {
                            clerkId: userId,
                        },
                    },
                },
            },
        });

        const lastHourFeedback = await prisma.feedback.findMany({
            where: {
                submittedAt: {
                    gte: oneHourAgo
                },
            },
            select: {
                rating: true,
                submittedAt: true
            },
            orderBy: {
                submittedAt: "desc"
            }

        })

        let validAverage = 0;

        if (lastHourFeedback.length > 0) {
            let validCount = 0;
            let total = 0;

            for (const feedback of lastHourFeedback) {
                if (feedback.rating !== null) {
                    total += feedback.rating;
                    validCount += 1;
                }
            }

            if (validCount > 0) {
                validAverage = total / validCount;
            }
        }


        return {
            success: true,
            message: "Fetched successfully",
            count: feedbackCount,
            validAverage,
            lastSent: lastHourFeedback.at(0)?.submittedAt ?? null
        };

    } catch (error) {
        console.error("Error while getting last hour feedback:", error);
        return {
            success: false,
            message: "An error occurred while fetching the last hour feedback.",
        };
    }
}


export async function getLastHourInvites() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return {
                success: false,
                message: "Missing auth details. Please log in.",
            };
        }

        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

        const invites = await prisma.invitation.findMany({
            where: {
                sentAt: {
                    gte: oneHourAgo,
                },
                emailEntry: {
                    workspace: {
                        clerkId: userId,
                    },
                },
            },
            orderBy: {
                sentAt: "desc", // so recent one is at index 0
            },
            take: 1, // just the most recent one
            include: {
                emailEntry: {
                    select: {
                        email: true,
                    },
                },
                topic: {
                    select: {
                        title: true,
                    },
                },
            },
        });

        const inviteCount = await prisma.invitation.count({
            where: {
                sentAt: {
                    gte: oneHourAgo,
                },
                emailEntry: {
                    workspace: {
                        clerkId: userId,
                    },
                },
            },
        });

        return {
            success: true,
            message: "Fetched successfully",
            count: inviteCount,
            recent: invites[0]
                ? {
                    email: invites[0].emailEntry.email,
                    topic: invites[0].topic.title,
                    sentAt: invites[0].sentAt,
                }
                : null,
        };

    } catch (error) {
        console.error("Error while fetching last hour invites:", error);
        return {
            success: false,
            message: "Error while fetching last hour invites",
        };
    }
}
