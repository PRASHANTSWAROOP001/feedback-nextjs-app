"use client";
import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardFooter,
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
  const [loading, setLoading] = useState<boolean>(false)
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
    setLoading(true)
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
      setLoading(false)
    }
    else{
      toast("error happend probably")
      setLoading(false)
    }
    
  }

  return (
<Card className="w-full md:w-[350px] h-[350px] border-2 border-orange-400 flex flex-col justify-between">
  <CardHeader className="text-center">
    <Label className="text-sm">Upload CSV to Add Email</Label>
  </CardHeader>

  <CardContent className="flex flex-col gap-4 px-6">
    <Select onValueChange={(value) => setCategoryId(value)}>
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

    <div>
      <p className="text-xs text-gray-600 text-center mb-2">
        Drag and Drop your CSV file here
      </p>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="flex items-center justify-center border-2 border-dashed border-sky-400 rounded-md h-32 cursor-pointer"
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
      </div>
    </div>
  </CardContent>

  <CardFooter className="px-6">
    <Button onClick={handleSubmitEmails} disabled={loading} variant="outline" size="sm" className="w-full">
      Save
      {loading && (
        <svg
          aria-hidden="true"
          className="inline w-4 h-4 ml-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 
            100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 
            50 0.59082C77.6142 0.59082 100 22.9766 100 
            50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 
            91.5094 50 91.5094C72.5987 91.5094 90.9186 
            73.1895 90.9186 50.5908C90.9186 27.9921 
            72.5987 9.67226 50 9.67226C27.4013 9.67226 
            9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 
            38.4038 97.8624 35.9116 97.0079 
            33.5539C95.2932 28.8227 92.871 
            24.3692 89.8167 20.348C85.8452 
            15.1192 80.8826 10.7238 75.2124 
            7.41289C69.5422 4.10194 63.2754 
            1.94025 56.7698 1.05124C51.7666 
            0.367541 46.6976 0.446843 41.7345 
            1.27873C39.2613 1.69328 37.813 
            4.19778 38.4501 6.62326C39.0873 
            9.04874 41.5694 10.4717 44.0505 
            10.1071C47.8511 9.54855 51.7191 
            9.52689 55.5402 10.0491C60.8642 
            10.7766 65.9928 12.5457 70.6331 
            15.2552C75.2735 17.9648 79.3347 
            21.5619 82.5849 25.841C84.9175 
            28.9121 86.7997 32.2913 88.1811 
            35.8758C89.083 38.2158 91.5421 
            39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
      )}
    </Button>
  </CardFooter>
</Card>
  );
}
