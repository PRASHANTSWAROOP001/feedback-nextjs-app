
import { MailPlus} from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardTitle,
  CardHeader,
  CardFooter,
  CardContent,
} from "../ui/card";
import { Badge } from "../ui/badge";

import EmailPopover from "./EmailPopover";
import { Category } from "@/app/generated/prisma"
import {CategoryResponse} from "../../types/types"
import { getAllCategory } from "@/app/action/getAllCategory";
import addEmail from "@/app/action/addEmail";
import RouteManageButton from "./ManageButton";


type EmailCardProp = {
    workspaceId:string
}

async function EmailCard({workspaceId}:EmailCardProp){

   const categoryResponse:CategoryResponse = await getAllCategory();
   const categories:Category[]|undefined = categoryResponse?.data;
   const categoriesName: string[] = categories?.map(item => item.name) ?? [];

    return(
        <Card className="w-full m-2 border-2 flex flex-col min-h-full">
      <CardHeader className="pt-2">
        <CardTitle className="flex gap-x-3 items-center justify-center">
          <MailPlus />
          <h1>Add Emails</h1>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 flex-grow w-full">
        {/* {!topicResponse.success || !topicData|| topicData.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-lg font-semibold mb-2">Create your First Category</h1>
            <Badge>topic</Badge>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {topicData.map((item) => (
                <Badge className="w-full text-center" variant={randomVar()}  id={item.id} key={item.id}>{item.title}</Badge>
            ))}
          </div>
        )} */}
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-4 mt-auto">
        <RouteManageButton buttonName="Manage" routeAddress="/dashboard/email"></RouteManageButton>
        <EmailPopover  action_button="Save" actionHanlder={addEmail} selectOptions={categoriesName} workspaceId={workspaceId} ></EmailPopover>

      </CardFooter>
    </Card>
    )
}

export default EmailCard;