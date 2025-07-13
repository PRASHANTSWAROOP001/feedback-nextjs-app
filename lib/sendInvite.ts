import { resend } from "./resendClient";
import { generateInviteHTML } from "./template";

export async function sendInviteEmail({
  to,
  inviteLink,
  topicTitle,
  topicDescription,
}: {
  to: string;
  inviteLink: string;
  topicTitle: string;
  topicDescription: string;
}) {
  const html = generateInviteHTML({ inviteLink, topicTitle, topicDescription });

  return resend.emails.send({
    from: "noreply@swaroop101.me", 
    to,
    subject: `You're invited to join ${topicTitle}`,
    html,
  });
}
