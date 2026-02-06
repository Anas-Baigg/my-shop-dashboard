"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

type ServiceDialogProps = {
  shopId?: string;
  id?: string;
  title: string;
  nameLabel: string;
  nameField: string;
  initialName?: string;
  initialPrice?: number;
  onSubmit: (shopIdOrId: string, formData: FormData) => Promise<any>;
  mode?: "create" | "edit";
};

export function ServiceDialog({
  shopId,
  id,
  title,
  nameLabel,
  nameField,
  initialName = "",
  initialPrice = 0,
  onSubmit,
  mode = "create",
}: ServiceDialogProps) {
  const [open, setOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    const targetId = mode === "create" ? shopId! : id!;
    const result = await onSubmit(targetId, formData);

    if (result?.success) {
      toast.success(result.message);
      setOpen(false);
    } else {
      toast.error(result?.message || "Operation failed");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "create" ? (
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add {title}
          </Button>
        ) : (
          <Button size="icon" variant="outline">
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent>
        <form action={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {mode === "create" ? "New" : "Edit"} {title}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Input
              name={nameField}
              placeholder={`${nameLabel} name`}
              defaultValue={initialName}
              required
            />

            <Input
              name="price"
              type="number"
              step="0.01"
              placeholder="Price"
              defaultValue={initialPrice}
              required
            />
          </div>

          <DialogFooter>
            <Button type="submit">
              {mode === "create" ? "Save" : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
