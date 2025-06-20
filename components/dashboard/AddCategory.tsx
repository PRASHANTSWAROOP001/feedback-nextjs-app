"use client"
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import createCategory from "@/app/action/createCategory";

function ReusablePopover() {
  const [isOpen, setIsOpen] = useState(false); // Control Popover visibility
  const [name, setName] = useState(""); // Initialize with current name

  const onSave = async () => {
    if (!name.trim()) {
      toast("Error");
      return;
    }
     const response = await createCategory(name)// Pass ID and new name

    setIsOpen(false); // Close Popover
    if(response.success){
      toast("Category Created");
    }
    else{
      toast("Error while creating category");
    }
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
            <h4 className="font-medium leading-none pb-1">Add Category</h4>
            <Label htmlFor="category-name">Category Name</Label>
            <Input
              id="category-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Category name"
            />
          </div>
          <div className="space-y-2 pt-2 flex justify-between items-center">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              No
            </Button>
            <Button onClick={()=>onSave()} variant="default">
                Save
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default ReusablePopover;