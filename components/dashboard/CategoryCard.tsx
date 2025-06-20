import { Grid2x2Check } from "lucide-react";
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
import { Category } from "@/app/generated/prisma"
import { CategoryResponse } from "@/types/types";

async function CategoryCard() {
   const categoryResponse:CategoryResponse = await getAllCategory();
   const categories:Category[]|undefined = categoryResponse?.data

   console.log(categoryResponse)
  return (
    <Card className="w-full m-2 border-2 flex flex-col min-h-full">
      <CardHeader className="pt-2">
        <CardTitle className="flex gap-x-3 items-center justify-center">
          <Grid2x2Check />
          <h1>Manage Category</h1>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 flex-grow">
        {!categoryResponse.success || !categories || categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-lg font-semibold mb-2">Create your First Category</h1>
            <Badge>Category</Badge>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {categories.map((item) => (
              <div key={item.id} className="flex justify-center">
                <Badge className="text-center">{item.name}</Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-4 mt-auto">
        <Button>Manage</Button>
        <ReusablePopover />
      </CardFooter>
    </Card>
  );
}

export default CategoryCard;