import { NextRequest, NextResponse } from "next/server";
import { parse } from "papaparse"
import { prisma } from "../../../lib/prisma"
import z from "zod";
import { CategoryToEmailEntry, EmailEntry } from "@/app/generated/prisma";


const emailSchema = z.object({
  email: z.string().trim().email("invalidEmail Provided")
})

type emailRow = z.infer<typeof emailSchema>


export async function POST(req: NextRequest) {

  try {

    const formData = await req.formData();

    const workspaceId = formData.get("workspaceId");
    const categoryId = formData.get("categoryId");
    const csvFile = formData.get("csvFile");

    if (!workspaceId || !categoryId) {
      return NextResponse.json({ success: false, message: "workspaceId is missing " }, { status: 400 });
    }

    if (!csvFile || !(csvFile instanceof Blob)) {
      return NextResponse.json({ success: false, message: "CSV file missing" }, { status: 400 });
    }

    const text = await csvFile.text();

    const result = parse(text, {
      delimiter: ",",
      header: true, // assumes first row is column headers like "email"
      skipEmptyLines: true,
    });

    if (result.errors.length > 0) {
      console.error(" CSV Parse errors:", result.errors);
      return NextResponse.json({ success: false, message: "CSV parsing failed" }, { status: 400 });
    }

    const emailData = result.data as any[]

    const validRows: emailRow[] = []

    const invalidRows: { row: any, error: any }[] = []

    for (const row of emailData) {
      const parsed = emailSchema.safeParse({
        email: row.email?.trim()
      })

      if (parsed.success) {
        validRows.push(parsed.data)
      }
      else {
        invalidRows.push({ row, error: parsed.error.message })
      }
    }

    const emails = Array.from(new Set(validRows.map((r) => r.email)))

    if (!emails.length) {
      return NextResponse.json({ success: false, message: "no unique/valid email" }, { status: 400 })
    }

    const resultTx = await prisma.$transaction(async (tx) => {

      const getAllExistingEmails:EmailEntry[] = await tx.emailEntry.findMany({
        where:{
          email:{in: emails},
          workspaceId:workspaceId as string
        }
      })

      const existingEmailMap = new Map(
        getAllExistingEmails.map((entry)=>[entry.email, entry])
      ) 

      // created a map for easy and constant lookup

      const newEmails = emails.filter((email)=>(!existingEmailMap.has(email)))

      // this checks the map by comparing emails field if nothing matches we return the emails 

      // now add all the new emails to database
      const addNewEmails = await Promise.all(
        newEmails.map((data)=>(
            tx.emailEntry.create({
            data:{
              email:data,
              workspaceId:workspaceId as string
            }
          })
        ))
      )

      // now link new email with category and add it to the pivot table

      const linkNewEmails = await tx.categoryToEmailEntry.createMany({
        data:addNewEmails.map((data)=>(
          {
            emailEntryId:data.id,
            categoryId:categoryId as string
          }
        ))
      })

      // check which existing email is linked 
      // now this linkedemail could either be linked to category which user has currently given or existing one
      // even if email is linked to any other category we still have to link it to our new categor
      // so what do we have to sort -> emails that are linked with current category

      // how do we do that getAllExisting Linked Emails
      // check which one is already linked to our new/current category discard that we dont need that
      // now link all the filtered emails to current category

      const linkedEntriesOnly = getAllExistingEmails

      const existingPivotLinks = await tx.categoryToEmailEntry.findMany({
        where:{emailEntryId:{in: linkedEntriesOnly.map((e)=>e.id)},
      categoryId:categoryId as string}
      })

      const existingPivotLinksMap = new Map(
        existingPivotLinks.map((value)=>[value.emailEntryId, value])
      )

      const notLinkedData = getAllExistingEmails.filter((emailData)=>(!existingPivotLinksMap.has(emailData.id)))

      if(notLinkedData.length  > 0){
        await tx.categoryToEmailEntry.createMany({
          data:notLinkedData.map((data)=>({
            emailEntryId:data.id,
            categoryId:categoryId as string
          }))
        })
      }

      return [...addNewEmails, ...notLinkedData]

    })

    return NextResponse.json({
      success: true,
      added: resultTx.length,
      skipped: invalidRows.length,
      invalid: invalidRows, // if you want to show it in frontend
    });

  } catch (error) {

    console.error("error happend while adding emails", error)
    return NextResponse.json({ success: false, message: "error while adding emails" }, { status: 500 })

  }

}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const search = searchParams.get("q") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const categoryId = searchParams.get("categoryId");
    const workspaceId = searchParams.get("workspaceId");

    if (!workspaceId) {
      return NextResponse.json({ error: "Missing workspaceId param" }, { status: 400 });
    }

    if (limit > 10) {
      return NextResponse.json({ error: "Limit cannot be greater than 10" }, { status: 401 });
    }

    const skip = (page - 1) * limit;

    const where: any = {
      workspaceId,
    };

    if (categoryId) {
      where.categories = {
        some: {
          categoryId,
        },
      };
    }

    if (search) {
      where.email = {
        contains: search,
        mode: "insensitive",
      };
    }

    const [emails, count] = await Promise.all([
      prisma.emailEntry.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          email: true,
          name: true,
          id: true,
          createdAt: true,
        },
      }),
      prisma.emailEntry.count({ where }),
    ]);

    return NextResponse.json({
      emails,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.error("Error occurred while fetching emails:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

