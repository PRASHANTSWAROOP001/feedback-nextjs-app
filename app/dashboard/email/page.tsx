import { Button } from "@/components/ui/button"
import addEmail from "@/app/action/addEmail"
import EmailPagePopover from "@/components/email/emailPagePopover"
import { Category } from "@/app/generated/prisma"
import {CategoryResponse} from "../../../types/types"
import { getAllCategory } from "@/app/action/getAllCategory";
import UploadEmailCard from "@/components/email/UploadCard"

export default async function EmailPage(){

   const categoryResponse:CategoryResponse = await getAllCategory();
   const categories:Category[]|undefined = categoryResponse?.data;
   const categoriesName: {category:string, id:string}[] = categories?.map(item => ({
    id:item.id,
    category:item.name
   })) ?? [];


    return (<main className='w-full h-screen relative'>
              <div className="sticky top-0 z-20 bg-white  pb-4">
        <div className="flex justify-between items-center px-4 pt-4">
          <h1 className="text-3xl font-bold">Email</h1>
          <EmailPagePopover action_button="Save" actionHanlder={addEmail} selectOptions={categoriesName}></EmailPagePopover>
        </div>
        <div className="px-4 mt-4 max-w-xl mx-auto">
          <UploadEmailCard selectCategory={categoriesName}></UploadEmailCard>
        </div>
      </div>
    </main>)
}