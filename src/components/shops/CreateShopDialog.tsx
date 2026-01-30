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
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { CreateShopAction } from "@/app/(dashboard)/shops/action";

export function CreateShopDialog() {
  const [open, setOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    const result = await CreateShopAction(formData);
    if (result?.success) {
      toast.success(result.message);
      setOpen(false);
    } else {
      toast.error(result?.message || "Failed to create shop");
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Shop
        </Button>
      </DialogTrigger>

      <DialogContent>
        <form action={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Shop</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Input name="name" placeholder="Shop Name" required />

            <Input
              name="password"
              placeholder="Admin Password (5 digits, not starting with 0)"
              type="password"
              inputMode="numeric"
              maxLength={5}
            />
          </div>

          <DialogFooter>
            <Button type="submit">Save Shop</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
