"use client";

import React from "react";
import { useState } from "react";
import {
  Card,
  CardTitle,
  CardHeader,
  CardFooter,
  CardContent,
} from "../ui/card";
import updateWorkspace from "@/app/action/editWorkspace";
import { deleteWorkSpace } from "../../app/action/deleteWorkspace";
import { LaptopMinimal } from "lucide-react";
import DeleteWorkspacePopover from "./DeleteWorkspacepop";
import  EditWorkspacePopover from "./WorkspaceEditPop"
import { Badge } from "../ui/badge";
import { toast} from "sonner";

type WorkspaceCardProps = {
  id: string;
  name: string;
  createdAt: Date;
};

async function handleEdit(id: string, name:string) {
  console.log(id);
  console.log(name,"new name")
  const response = await updateWorkspace(id, name);
  if(response.success){
    toast("updated the workspace name")
  }
  else{
    toast("could not update the workspace")
  }
}

async function handleDelete(id: string) {
  console.log(id);
  await deleteWorkSpace(id);
  toast("Workspace Deleted successfully")
}


function WorkspaceCard({ id, name, createdAt }: WorkspaceCardProps) {
  return (
<Card className="relative w-full m-2 border-2">
  {/* Badge positioned absolutely relative to the Card */}
  <Badge className="absolute top-2 right-2 "  >{new Date(createdAt).toLocaleDateString()}</Badge>

  <CardHeader className="pt-2">
    <CardTitle className="flex gap-x-3 items-center justify-center">
      <LaptopMinimal />
      <h1>Workspace</h1>
    </CardTitle>
  </CardHeader>

  <CardContent>
    <h1 className="text-center text-muted-foreground text-lg">{name}</h1>
  </CardContent>
  <CardFooter className="flex items-center justify-between ">
     <EditWorkspacePopover currentName={name} id={id} handleEdit={handleEdit}></EditWorkspacePopover>
    <DeleteWorkspacePopover id={id} handleDelete={handleDelete}/>
  </CardFooter>
</Card>
  );
}

export default WorkspaceCard;
