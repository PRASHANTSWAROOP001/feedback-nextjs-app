
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "../../../lib/prisma"


async function GET(req: NextRequest) {
    try {

        const { searchParams } = req.nextUrl;

        const search = searchParams.get("q") || ""
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "10")
        const workspaceId = searchParams.get("workspaceId")

        if (limit > 10) {
            return NextResponse.json({ error: "limit cant be greater than 10" }, { status: 401 })
        }

        const skip = (page - 1) * limit;

        if (!workspaceId) {
            return NextResponse.json({ error: "missing workspaceId param" }, { status: 400 })
        }

        const where: any = {
            workspaceId
        }

        if (search) {
            where.title = {
                contains: search,
                mode: "insensitive",
            }
        }

        const [topics, total] = await Promise.all([
            prisma.topic.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc"
                }
            }),
            prisma.topic.count({ where })
        ])

        NextResponse.json({
            success: true,
            message: "data fetched sucessfully",
            data: topics,
            total,
            page,
            totalPage: Math.ceil(total / limit)
        })


    } catch (error) {
        console.error("error happend while getting topic", error)
        return NextResponse.json({ success: false, message: "Error happened at our side" }, { status: 500 })
    }
}