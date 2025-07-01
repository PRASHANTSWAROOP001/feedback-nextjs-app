import { Grid2x2Check, Route } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardTitle,
  CardHeader,
  CardFooter,
  CardContent,
} from "../ui/card";
import { Badge } from "../ui/badge";
import ReusablePopover from "./AddCategory";
import { getAllCategory } from "@/app/action/getAllCategory";
import { Category } from "@/app/generated/prisma";
import { CategoryResponse } from "@/types/types";
import createCategory from "@/app/action/createCategory";
import RouteManageButton from "./ManageButton";

async function CategoryCard() {
  const categoryResponse: CategoryResponse = await getAllCategory(6);
  const categories: Category[] | undefined = categoryResponse?.data;

  const possibleVar: ("default" | "secondary" | "destructive" | "outline")[] = [
    "default",
    "outline",
    "destructive",
    "secondary",
  ];

  return (
    <Card className="w-full m-2 border-2 flex flex-col min-h-full">
      <CardHeader className="pt-2">
        <CardTitle className="flex gap-x-3 items-center justify-center">
          <Grid2x2Check />
          <h1>Manage Category</h1>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 flex-grow w-full">
        {!categoryResponse.success || !categories || categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-lg font-semibold mb-2">Create your First Category</h1>
            <Badge>Category</Badge>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {categories.map((item, index) => (
              <Badge
                className="w-full text-center whitespace-normal break-words"
                variant={possibleVar[index % possibleVar.length]}
                id={item.id}
                key={item.id}
              >
                {item.name}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-4 mt-auto">
        <RouteManageButton buttonName="Manage" routeAddress="/dashboard/category"></RouteManageButton>
        <ReusablePopover action_button="Save" actionHanlder={createCategory} />
      </CardFooter>
    </Card>
  );
}

export default CategoryCard;