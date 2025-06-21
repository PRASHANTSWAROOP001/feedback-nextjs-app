import { Tag} from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardTitle,
  CardHeader,
  CardFooter,
  CardContent,
} from "../ui/card";
import { Badge } from "../ui/badge";
import TopicPopover from "./TopicPopOver";
import createTopic from "@/app/action/createTopic";
import getAllTopics from "@/app/action/getAllTopic";
import { Topic } from "@/app/generated/prisma";
import { TopicResponse } from "@/types/types";
async function TopicCard(){

  const topicResponse:TopicResponse = await getAllTopics()
  const topicData:Topic[]|undefined = topicResponse?.data

  const possibleVar: ("default" | "secondary" | "destructive" | "outline")[] = [
  "default",
  "outline",
  "destructive",
  "secondary",
];

// Function to return a random variant with the correct type
function randomVar(): "default" | "secondary" | "destructive" | "outline" {
  const newValue = Math.floor(Math.random() * possibleVar.length);
  return possibleVar[newValue];
}

    return (    <Card className="w-full m-2 border-2 flex flex-col min-h-full">
      <CardHeader className="pt-2">
        <CardTitle className="flex gap-x-3 items-center justify-center">
          <Tag />
          <h1>Manage Topics</h1>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 flex-grow w-full">
        {!topicResponse.success || !topicData|| topicData.length === 0 ? (
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
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-4 mt-auto">
        <Button>Manage</Button>
        <TopicPopover action_button="save" actionHanlder={createTopic} ></TopicPopover>

      </CardFooter>
    </Card>)
}

export default TopicCard;