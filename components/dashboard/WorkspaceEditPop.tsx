import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface EditPopover{
    id:string,
    currentName:string,
    editAttribute:string,
    handleEdit: (id:string, name:string)=> void
}

function EditWorkspacePopover({ id, currentName,editAttribute, handleEdit}:EditPopover) {
  const [isOpen, setIsOpen] = useState(false); // Control Popover visibility
  const [name, setName] = useState(currentName || ""); // Initialize with current name

  const onSave = () => {
    if (!name.trim()) {
      toast("Error");
      return;
    }
    handleEdit(id, name); // Pass ID and new name
    setIsOpen(false); // Close Popover
    toast("Workspace Updated");
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="secondary" size="lg">
          Edit
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Edit {editAttribute}</h4>
            <Label htmlFor={`${editAttribute}-name`}>{editAttribute} Name</Label>
            <Input
              id={`${editAttribute}-name`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={`Edit ${editAttribute}`}
            />
          </div>
          <div className="space-y-2 pt-2 flex justify-between items-center">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              No
            </Button>
            <Button variant="default" onClick={onSave}>
              Save
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default EditWorkspacePopover;