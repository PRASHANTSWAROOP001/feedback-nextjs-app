import { Category, Topic, EmailEntry } from "@prisma/client"

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


export type EmailResponse = {
    success:boolean,
    message:string,
    data?:EmailEntry[]
}



