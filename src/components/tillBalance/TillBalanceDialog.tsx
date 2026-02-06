"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { updateTillBalanceAction } from "@/app/(dashboard)/tillBalance/action";

export function TillBalanceDialog({ record }: { record: any }) {
  const [open, setOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    const result = await updateTillBalanceAction(record.id, formData);
    if (result.success) {
      toast.success(result.message);
      setOpen(false);
    } else {
      toast.error(result.message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form action={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Balance</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Entry for: {record.balance_date}
            </p>
          </DialogHeader>
          <div className="py-4">
            <Input
              name="balance_amount"
              type="number"
              step="0.01"
              defaultValue={record.balance_amount}
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit">Update Amount</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
