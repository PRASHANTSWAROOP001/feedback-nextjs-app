"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { addWorkspace } from "@/app/action/workspace/workspace";
import { useTransition, useState, useRef } from "react";
import { toast } from "sonner";

function DashboardDialog() {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false); // controls Dialog open state
  const formRef = useRef<HTMLFormElement>(null); // to reset the form

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await addWorkspace(formData);

      if (result.success) {
        // Optional: reset the form
        formRef.current?.reset();
        // Close the dialog
        setOpen(false);
        toast("Workspace successfully created")
      } else {
        toast("Some Error occurred while creatinf workspace.")
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="relative ">
          <Button variant=
          'outline'>Create A Workspace</Button>

          <span className="absolute -top-0 -right-0 flex size-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex size-3 rounded-full bg-sky-500"></span>
          </span>
        </div>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Workspace Details</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} ref={formRef} className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="workspace-name">Name</Label>
            <Input
              id="workspace-name"
              name="workspace-name"
              placeholder="My workspace"
              required
            />
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="destructive" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant="secondary" disabled={isPending}>
              {isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default DashboardDialog;
