
"use client"
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";


interface DeleteWorkspacePopoverProps {
  id: string ;
  handleDelete: (id: string ) => void;
}

function DeleteCategoryPopover({ id, handleDelete }: DeleteWorkspacePopoverProps) {
  const [isOpen, setIsOpen] = useState(false); // State to control Popover

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="destructive" size="lg">
          Delete
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">Are You Sure You Want To Delete This?</h4>
            <p className="text-muted-foreground text-center">Action Can’t Be Undone.</p>
          </div>
          <div className="space-y-2 pt-2 flex justify-between items-center">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              No
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                handleDelete(id); // Call the delete handler
                setIsOpen(false); // Close the Popover
              }}
            >
              Yes
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default DeleteCategoryPopover;