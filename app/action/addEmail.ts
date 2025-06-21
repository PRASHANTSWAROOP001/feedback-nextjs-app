"use server"
import { prisma } from "../../lib/prisma"

async function addEmail(email: string, category: string, workspaceId: string): Promise<{ success: boolean, message: string }> {
  try {

    if (!email || !category || !workspaceId) {
      return { success: false, message: "missing paramas" }
    }

    const findCategoryId = await prisma.category.findUnique({
      where: {
        workspaceId_name: {
          workspaceId,
          name: category
        }
      }
    })

    if (!findCategoryId) {
      return { success: false, message: "could not find category with given name" }
    }


    const addEmails = await prisma.emailEntry.create({
      data: {
        email: email,
        workspaceId: workspaceId,
        categories: {
          create: {
            category: {
              connect: { id: findCategoryId.id },
            },
          },
        },
      },
    });

    return {success:true, message:"added successfully"}

  } catch (error) {
    console.error("Error happend while fetching", error)

    return {
      success: false,
      message: "Failed to fetch categories: " + (error instanceof Error ? error.message : "Unknown error"),
    };
  }
}

export default addEmail;