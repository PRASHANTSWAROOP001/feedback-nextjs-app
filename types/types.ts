import { Category, Topic } from "@/app/generated/prisma"

export type CategoryResponse = {
    success:boolean,
    message:string,
    data?:Category[]
}


export type TopicResponse = {
    success:boolean,
    message:string,
    data?: Topic[]
}


