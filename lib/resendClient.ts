import { Resend } from "resend";

if (!process.env.RESEND_KEY) {
  throw new Error("Missing Resend API Key");
}

// console.log(process.env.RESEND_KEY)

export const resend = new Resend(process.env.RESEND_KEY);
