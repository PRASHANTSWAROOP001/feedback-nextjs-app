"use client";

import React from "react";
import {
  Card,
  CardTitle,
  CardHeader,
  CardFooter,
  CardContent,
} from "../ui/card";
import { updateWorkspace, deleteWorkSpace } from "@/app/action/workspace/workspace";
import { LaptopMinimal } from "lucide-react";
import DeleteWorkspacePopover from "./DeleteWorkspacepop";
import EditWorkspacePopover from "./WorkspaceEditPop";
import { toast } from "sonner";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import { useEffect } from "react";

type WorkspaceCardProps = {
  id: string;
  name: string;
  createdAt: Date;
};

async function handleEdit(id: string, name: string) {
  console.log(id);
  console.log(name, "new name");
  const response = await updateWorkspace(id, name);
  if (response.success) {
    toast("updated the workspace name");
  } else {
    toast("could not update the workspace");
  }
}

async function handleDelete(id: string) {
  console.log(id);
  await deleteWorkSpace(id);
  toast("Workspace Deleted successfully");
}

function WorkspaceCard({ id, name, createdAt }: WorkspaceCardProps) {
  const {setWorkspaceId} = useWorkspaceStore()

  useEffect(()=>{
    console.log("workspaceId", id)
    setWorkspaceId(id)
  },[id,setWorkspaceId])

  return (
    <Card className=" w-full m-2 border-2 bg-white/70 backdrop-blur-md border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col min-h-full">
    

      <CardHeader className="pt-2">
        <CardTitle className="flex gap-x-3 items-center justify-center">
          <LaptopMinimal />
          <h1>Manage {name}</h1>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-grow">
        <h1 className="text-center text-muted-foreground text-sm">{createdAt.toLocaleDateString()}</h1>
        
      </CardContent>

      <CardFooter className="flex items-center justify-between mt-auto">
        <EditWorkspacePopover
        editAttribute="Workspace"
          currentName={name}
          id={id}
          handleEdit={handleEdit}
        />
        <DeleteWorkspacePopover id={id} handleDelete={handleDelete} />
      </CardFooter>
    </Card>
  );
}

export default WorkspaceCard;