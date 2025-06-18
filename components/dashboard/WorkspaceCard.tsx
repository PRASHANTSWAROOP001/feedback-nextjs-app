"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardTitle, CardHeader, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Pencil, Trash2 } from "lucide-react";

import { Badge } from "../ui/badge";

type WorkspaceCardProps = {
  id: string;
  name: string;
  createdAt?: Date;
};

async function  handleEdit(id:string) {

    console.log(id);
    
}

async function handleDelete(id:string){
    console.log(id);
}

function WorkspaceCard({ id, name, createdAt}: WorkspaceCardProps) {
  return (
    <Card className="w-full max-w-sm h-[200px] m-2">

        <CardHeader>
            <CardTitle className="text-2xl text-center">Your Workspace {name}</CardTitle>
            <CardDescription className="text-center text-xl text-accent-foreground">Manage Your Workspace From Here ☺️</CardDescription>
        </CardHeader>

      <CardFooter className=" flex items-center justify-around border-2">
                    <Button variant="secondary" size="lg" onClick={() => handleEdit(id)}>
          Edit
        </Button>

        <Button variant="destructive" size="lg" onClick={() => handleDelete(id)}>
           Delete
        </Button>

                        <Badge>
  Created At {createdAt && new Date(createdAt).toLocaleDateString()}
</Badge>


      </CardFooter>
    </Card>
  );
}

export default WorkspaceCard;
