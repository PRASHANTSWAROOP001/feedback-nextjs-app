"use client"
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
type EmailPagePopover = {
  action_button: string,
  actionHanlder: (email: string, selectedValue: string, workspaceId:string) => Promise<{success: boolean, message: string}>,
  selectOptions: {
    id:string,
    category:string
  }[]
}

function EmailPagePopover({action_button, actionHanlder, selectOptions}: EmailPagePopover) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [selectedValue, setSelectedValue] = useState(selectOptions[0]);
  const {workspaceId} = useWorkspaceStore()

  const onSave = async () => {
    if (!email.trim() || !selectedValue) {
      toast("Please fill in Email, category, and select an option");
      return;
    }

    if(!workspaceId){
        toast("worksspaceId is missing")
        return;
    }

    const response = await actionHanlder(email, selectedValue.category, workspaceId);
    
    setIsOpen(false);
    if(response.success){
      toast("Category Created");
    } else {
      toast("Error while creating category");
    }
    
    // Reset inputs after save
    setEmail("");
    setSelectedValue(selectOptions[0]);
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
            <h4 className="font-medium leading-none pb-1">Add Email</h4>
            
            <div className="space-y-2">
              <Label htmlFor="category-title"> Email</Label>
              <Input
                id="category-title"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter category title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category-type">Choose Category</Label>
              <select
                id="category-type"
                value={selectedValue.id}
                onChange={(e) => {
                  const selected = selectOptions.find(option => option.id === e.target.value);
                  if (selected) setSelectedValue(selected);
                }}
                className="w-full border rounded-md p-2"
              >
                {selectOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.category}
                  </option>
                ))}
              </select>
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

export default EmailPagePopover;