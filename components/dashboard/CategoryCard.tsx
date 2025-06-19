"use client";

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

function CategoryCard() {
  return (
    <Card className="w-full m-2 border-2 flex flex-col min-h-full">
      {/* Badge removed as it’s not present in the original */}
      <CardHeader className="pt-2">
        <CardTitle className="flex gap-x-3 items-center justify-center">
          <Grid2x2Check />
          <h1>Manage Category</h1>
        </CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-4 gap-2 flex-grow">
        <Badge>User</Badge>
        <Badge variant={"destructive"}>Tester</Badge>
        <Badge>User</Badge>
        <Badge variant={"outline"}>Developer</Badge>
        <Badge>User</Badge>
        <Badge variant={"secondary"}>QA</Badge>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-4 mt-auto">
        <Button>Manage</Button>
        <Button>Create</Button>
      </CardFooter>
    </Card>
  );
}

export default CategoryCard;