"use server"
import z from "zod"
import { prisma } from "../../../lib/prisma"

const emailSchema = z.object({
  email: z.string().trim().email("Please provide a valid email")
})

type emailType = z.infer<typeof emailSchema>

async function updateEmail(emailId: string, newEmail: string): Promise<{ success: boolean; message: string }> {
  try {
    if (!emailId || !newEmail) {
      return { success: false, message: "Missing emailId or newEmail" }
    }

    // ✅ Zod validation
    const parseResult = emailSchema.safeParse({ email: newEmail })

    if (!parseResult.success) {
      const zodError = parseResult.error.format()
      return {
        success: false,
        message: zodError.email?._errors?.[0] || "Invalid email format"
      }
    }

    // ✅ Check if the email exists
    const searchEmailId = await prisma.emailEntry.findUnique({
      where: {
        id: emailId
      }
    })

    if (!searchEmailId) {
      return {
        success: false,
        message: "Could not find the email"
      }
    }

    // ✅ Perform the update
    await prisma.emailEntry.update({
      where: {
        id: emailId
      },
      data: {
        email: newEmail
      }
    })

    return { success: true, message: "Updated successfully" }
  } catch (error) {
    console.error("Error while updating email:", error)
    return {
      success: false,
      message: "Server error while updating email"
    }
  }
}

export default updateEmail;
