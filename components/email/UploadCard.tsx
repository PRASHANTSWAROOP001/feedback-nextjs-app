"use client";
import { useState, useRef } from "react";
import {
  Card,
  CardDescription,
  CardContent,
  CardFooter,
  CardTitle,
  CardHeader,
} from "../ui/card";
import { Button } from "../ui/button";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { FileUp } from "lucide-react";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import { toast } from "sonner";
import axios from "axios"

type UploadEmailProp = {
  selectCategory: {
    id: string;
    category: string;
  }[];
};

export default function UploadEmailCard({ selectCategory }: UploadEmailProp) {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const {workspaceId} = useWorkspaceStore()

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "text/csv") {
      setFile(droppedFile);
    } else {
      toast("Only CSV files are allowed.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
    } else {
      toast("Only CSV files are allowed.");
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmitEmails = async ()=>{
    console.log("clicked")
    if(!file || !categoryId){
      toast("please add file and also select a category")
      return;
    }

    if(!workspaceId){
      toast("missing workspaceId please create a workspaceId")
      return;
    }

    const formData = new FormData();
    formData.append("workspaceId", workspaceId)
    formData.append("categoryId", categoryId)
    formData.append("csvFile", file)

    const result = await axios.post("/api/email",formData);

    if(result.status == 200 || result.status == 201){
      console.log(result.data,"server response");
      toast("data addedd successfully")
    }
    else{
      toast("error happend probably")
    }
    
  }

  return (
    <Card className="w-[20rem]  border-2 p-4 flex flex-col justify-between">
      <CardHeader>
        <div className="space-y-2 flex flex-col items-center">
          <Label htmlFor="category" className="text-sm text-muted-foreground">
            Choose a Category
          </Label>
          <Select onValueChange={(value)=>(setCategoryId(value))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a Category" />
            </SelectTrigger>
            <SelectContent>
              {selectCategory.map((value) => (
                <SelectItem key={value.id} value={value.id}>
                  {value.category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <div className="px-4">
        <p className="text-xs text-muted-foreground text-center mb-2">
          Drag and Drop your CSV file here
        </p>
        <CardContent
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="flex items-center justify-center border-2 border-dashed border-gray-400 rounded-md h-40 cursor-pointer"
          onClick={handleUploadClick}
        >
          <div className="text-center flex flex-col items-center space-y-2">
            <FileUp className="w-6 h-6 text-gray-500" />
            <p className="font-semibold text-sm">
              {file ? file.name : "Upload File"}
            </p>
          </div>
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            onChange={handleFileChange}
            hidden
          />
        </CardContent>
      </div>

      <CardFooter className="flex items-center justify-center ">
        <Button onClick={()=>handleSubmitEmails()} variant="outline" size="sm">
          Save
        </Button>
      </CardFooter>
    </Card>
  );
}
