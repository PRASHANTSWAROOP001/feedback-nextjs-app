import { NextRequest, NextResponse, } from "next/server"
import {prisma} from "../../../lib/prisma"



export async function GET(req:NextRequest){
 try {

  const {searchParams} = req.nextUrl;

  const search = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page")||"1")
  const limit = parseInt(searchParams.get("limit")||"10")
  const workspaceId = searchParams.get("workspaceId")
  if(limit > 10){
    NextResponse.json({error:"limit cant be greater than 10"}, {status:401})
  }

  const skip = (page-1)*limit;

  if(!workspaceId){
    NextResponse.json({error:"missing workspaceId param"}, {status:400})
  }

  const where:any = {
    workspaceId
  }

  if(search){
    where.name = {
    contains:search,
    mode:"insensitive",
    }
  }

  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      where,
      skip,
      take:limit,
      orderBy:{
        createdAt:"desc"
      }
    }),
    prisma.category.count({where:where})
  ]) 

      return NextResponse.json({
      data: categories,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })


 } catch (err) {
    console.error("GET /api/category error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
}

}