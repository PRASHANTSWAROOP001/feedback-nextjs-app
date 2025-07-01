"use client";
import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectLabel,
  SelectGroup
} from "../ui/select";
interface EditTopicPopoverProp {
  id: string;
  currentTitle: string;
  currentDescription: string;
  handleEdit: (
    id: string,
    title: string,
    description: string,
    isActive: boolean
  ) =>Promise <{ success: boolean; message: string }>;
}

export default function EditTopicPopover({
  id,
  currentTitle,
  currentDescription,
  handleEdit,
}: EditTopicPopoverProp) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(true);

  useEffect(() => {
  setTitle(currentTitle);
  setDescription(currentDescription);
}, [currentTitle, currentDescription]);

  async function onEdit() {
    try {
      const result = await handleEdit(id, title, description, isActive);

      if (result.success) {
        toast("updated successfull", {
          description: result.message,
        });
      } else {
        toast("could not update the topic", {
          description: result.message,
        });
      }
    } catch (error) {
      toast("error happend");
    } finally {
      setIsOpen(false);
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant={"secondary"} size={"lg"}>
          Edit
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none pb-1">Edit Topic</h4>

            <div className="space-y-2">
              <Label htmlFor="topic-title">Title</Label>
              <Input
                id="topic-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter Topic Title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="topic-desc">Description</Label>
              <Textarea
                id="topic-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter Topic Title"
              />
            </div>

            <div className="space-y-2 pb-2">
              <Select
                value={String(isActive)}
                onValueChange={(val) => setIsActive(val === "true")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Topic Status"></SelectValue>
                </SelectTrigger>
                <SelectContent>
                 <SelectGroup>
                    <SelectLabel>Choose Active Status</SelectLabel>
                     <SelectItem value="false">False</SelectItem>
                  <SelectItem value="true">True</SelectItem>
                 </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 pt-2 flex justify-between items-center">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={onEdit} variant="default">
                Save
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
