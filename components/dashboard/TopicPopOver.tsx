"use client"
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type ResuablePop = {
  action_button: string,
  actionHanlder: (title: string, description: string) => Promise<{success: boolean, message: string}>
}

function TopicPopover({action_button, actionHanlder}: ResuablePop) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const onSave = async () => {
    if (!title.trim() || !description.trim()) {
      toast("Please fill in both title and description");
      return;
    }

    const response = await actionHanlder(title, description);
    
    setIsOpen(false);
    if(response.success){
      toast("Category Created");
    } else {
      toast("Error while creating category");
    }
    
    // Reset inputs after save
    setTitle("");
    setDescription("");
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="secondary" size="lg">
          Create
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none pb-1">Add Topic</h4>
            
            <div className="space-y-2">
              <Label htmlFor="category-title">Topic Title</Label>
              <Input
                id="category-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter category title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category-description">Topic Description</Label>
              <Textarea
                id="category-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter category description"
                rows={4}
              />
            </div>
          </div>
          
          <div className="space-y-2 pt-2 flex justify-between items-center">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={onSave} variant="default">
              {action_button}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default TopicPopover;