"use client";

import React from "react";
import {
  Card,
  CardDescription,
  CardTitle,
  CardHeader,
  CardFooter,
  CardContent,
} from "../ui/card";
import { Button } from "../ui/button";
import { deleteWorkSpace } from "../../app/action/deleteWorkspace";
import { LaptopMinimal } from "lucide-react";
import { Avatar } from "../ui/avatar";

import { Badge } from "../ui/badge";

type WorkspaceCardProps = {
  id: string;
  name: string;
  createdAt: Date;
};

async function handleEdit(id: string) {
  console.log(id);
}

async function handleDelete(id: string) {
  console.log(id);
  await deleteWorkSpace(id);
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
    <Button variant="secondary" size="lg" onClick={() => handleEdit(id)}>
      Edit
    </Button>
    <Button variant="destructive" size="lg" onClick={() => handleDelete(id)}>
      Delete
    </Button>
  </CardFooter>
</Card>
  );
}

export default WorkspaceCard;
