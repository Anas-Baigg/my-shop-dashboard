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
import { createEmployeeAction } from "@/app/(dashboard)/employee/action";

export function CreateEmpDialog({ shopId }: { shopId: string }) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  async function handleSubmit(formDate: FormData) {
    const result = await createEmployeeAction(shopId, formDate);
    if (result?.success) {
      toast.success(result.message);
      setIsAddOpen(false);
    } else {
      toast.error(result?.message || "Failed to create Employee");
    }
  }

  return (
    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Employee
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form action={handleSubmit}>
          <DialogHeader>
            <DialogTitle>New Employee</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input name="name" placeholder="Name (Alphabets only)" required />
            <Input
              name="passcode"
              placeholder="Passcode (5 digits, no 0 at start)"
              type="password"
              maxLength={5}
              inputMode="numeric"
            />
          </div>
          <DialogFooter>
            <Button type="submit">Save Employee</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
