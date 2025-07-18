
import { Tag } from "lucide-react";
import {
  Card,
  CardTitle,
  CardHeader,
  CardFooter,
  CardContent,
} from "../ui/card";
import { Badge } from "../ui/badge";
import TopicPopover from "./TopicPopOver";
import { createTopic, getAllTopics } from "@/app/action/topic/topicActions";
import { Topic } from "@prisma/client";
import { TopicResponse } from "@/types/types";
import RouteManageButton from "./ManageButton";
async function TopicCard() {
  const topicResponse: TopicResponse = await getAllTopics();
  const topicData: Topic[] | undefined = topicResponse?.data;

  const possibleVar: ("default" | "secondary" | "destructive" | "outline")[] = [
    "default",
    "outline",
    "destructive",
    "secondary",
  ];

  return (
    <Card className="w-full m-2 border-2 bg-white/70 backdrop-blur-md border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col min-h-full">
      <CardHeader className="pt-2">
        <CardTitle className="flex gap-x-3 items-center justify-center">
          <Tag />
          <h1>Manage Topics</h1>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 flex-grow w-full">
        {!topicResponse.success || !topicData || topicData.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-lg font-semibold mb-2">
              Create your First Category
            </h1>
            <Badge>topic</Badge>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-4 w-full">
            {topicData.map((item, index) => (
              <Badge
                className="w-full text-center"
                variant={possibleVar[index % possibleVar.length]}
                id={item.id}
                key={item.id}
              >
                {item.title}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-4 mt-auto">
        <RouteManageButton
          buttonName="Manage"
          routeAddress="/dashboard/topic"
        ></RouteManageButton>
        <TopicPopover
          action_button="save"
          actionHanlder={createTopic}
        ></TopicPopover>
      </CardFooter>
    </Card>
  );
}

export default TopicCard;
