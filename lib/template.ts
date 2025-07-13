import fs from "fs";
import path from "path";
import handlebars from "handlebars";

const filePath = path.resolve(process.cwd(), "template", "inviteEmail.hbs");
const source = fs.readFileSync(filePath, "utf-8");
const compiledTemplate = handlebars.compile(source);

export function generateInviteHTML({
  inviteLink,
  topicDescription,
  topicTitle,
}: {
  inviteLink: string;
  topicDescription: string;
  topicTitle: string;
}): string {
  return compiledTemplate({ inviteLink, topicDescription, topicTitle });
}
