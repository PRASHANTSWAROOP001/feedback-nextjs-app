
import { MailPlus} from "lucide-react";
import {
  Card,
  CardTitle,
  CardHeader,
  CardFooter,
  CardContent,
} from "../ui/card";
import { Badge } from "../ui/badge";

import EmailPopover from "./EmailPopover";
import { Category, EmailEntry } from "@prisma/client"
import {CategoryResponse} from "../../types/types"
import { getAllCategory } from "@/app/action/getAllCategory";
import addEmail from "@/app/action/addEmail";
import RouteManageButton from "./ManageButton";
import { EmailResponse } from "../../types/types";
import { getLatestEmails } from "@/app/action/email/emailActions";

type EmailCardProp = {
    workspaceId:string
}

async function EmailCard({workspaceId}:EmailCardProp){

   const categoryResponse:CategoryResponse = await getAllCategory();
   const categories:Category[]|undefined = categoryResponse?.data;
   const categoriesName: string[] = categories?.map(item => item.name) ?? [];

   const emailResponse:EmailResponse = await getLatestEmails(workspaceId)
   const emailData:EmailEntry[]|undefined = emailResponse?.data;
   const emailIdData:{email:string, id:string}[] = emailData?.map((val)=>({
    email:val.email,
    id:val.id
   })) ?? []

    const possibleVar: ("default" | "secondary" | "destructive" | "outline")[] = [
    "default",
    "outline",
    "destructive",
    "secondary",
  ];

    return(
        <Card className="w-full m-2 bg-white/70 backdrop-blur-md border-2 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col min-h-full">
      <CardHeader className="pt-2">
        <CardTitle className="flex gap-x-3 items-center justify-center">
          <MailPlus />
          <h1>Add Emails</h1>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 flex-grow w-full">
        {!emailResponse.success || !emailData|| emailIdData.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-lg font-semibold mb-2">Add Your First Email</h1>
            <Badge>topic</Badge>
          </div>
        ) : (
          <div className="grid grid-cols-1  gap-4 w-full">
            {emailIdData.map((item, index) => (
                <Badge className="w-full text-center" variant={possibleVar[index%possibleVar.length]}  id={item.id} key={item.id}>{item.email}</Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-4 mt-auto">
        <RouteManageButton buttonName="Manage" routeAddress="/dashboard/email"></RouteManageButton>
        <EmailPopover  action_button="Save" actionHanlder={addEmail} selectOptions={categoriesName} workspaceId={workspaceId} ></EmailPopover>

      </CardFooter>
    </Card>
    )
}

export default EmailCard;