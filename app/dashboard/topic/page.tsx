"use client";
import TopicPopover from "@/components/dashboard/TopicPopOver";
import SearchInput from "@/components/category/seachbar";
import DeleteWorkspacePopover from "@/components/dashboard/DeleteWorkspacepop";
import EditTopicPopover from "@/components/topic/editPopover";
import { SkeletonCard } from "@/components/shared/SkeltonCard";
import { editTopic, deleteTopic, createTopic } from "@/app/action/topic/topicActions";

import dynamic from "next/dynamic";

const PaginatedList = dynamic(()=>import("@/components/category/PaginatedList"), {
  ssr:false,
  loading:()=><SkeletonCard></SkeletonCard>
})

export default function TopicMainPage() {
  return (
    <main className="w-full min-h-screen relative">
      <div className="sticky top-0 z-20 bg-white  pb-4">
        <div className="flex justify-between items-center px-4 pt-4">
          <h1 className="text-3xl font-bold text-center">Topic Management</h1>
          <TopicPopover
            actionHanlder={createTopic}
            action_button="Save"
          ></TopicPopover>
        </div>
        <div className="px-4 mt-4 max-w-xl mx-auto">
          <SearchInput
            baseUrl="/dashboard/topic"
            placeholder="Search Topic ..."
          ></SearchInput>
        </div>
      </div>
      <div className="px-4">
        <PaginatedList
          fetchUrl="/api/topic"
          queryKey="topic"
          renderItem={(cat: any) => (
            <li
              key={cat.id}
              className="p-4 rounded border border-gray-300 shadow-sm flex justify-between items-start flex-wrap gap-y-2"
            >
              <div className="flex w-full items-center justify-between ">
                <span className="text-lg font-medium text-gray-800">
                  {cat.title}
                </span>
                <div className="flex gap-x-2">
                  <EditTopicPopover
                    id={cat.id}
                    currentDescription={cat.description}
                    currentTitle={cat.title}
                    handleEdit={editTopic}
                  ></EditTopicPopover>
                  <DeleteWorkspacePopover
                    handleDelete={deleteTopic}
                    id={cat.id}
                  ></DeleteWorkspacePopover>
                </div>
              </div>
              <div className="pt-2">
                <span className="text-sm text-muted-foreground">
                  {cat.description}
                </span>
              </div>
            </li>
          )}
        ></PaginatedList>
      </div>
    </main>
  );
}
