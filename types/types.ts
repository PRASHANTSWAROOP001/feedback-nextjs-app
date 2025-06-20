import { Category } from "@/app/generated/prisma"

export type CategoryResponse = {
    success:boolean,
    message:string,
    data?:Category[]
}


