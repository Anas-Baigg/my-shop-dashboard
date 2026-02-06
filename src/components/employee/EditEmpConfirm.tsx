"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { updateEmployeeAction } from "@/app/(dashboard)/employee/action";

type Employee = {
  id: string;
  shop_id: string | null;
  name: string;
  passcode?: number;
  created_at: string;
  last_synced_at: string | null;
  isActive: boolean;
};

export function EditEmployeeDialog({ employee }: { employee: Employee }) {
  const [name, setName] = useState(employee.name);
  const [passcode, setPasscode] = useState(employee.passcode?.toString() || "");
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  // Keep the form in sync if the employee prop changes or dialog re-opens
  useEffect(() => {
    if (open) {
      setName(employee.name);
      setPasscode(employee.passcode?.toString() || "");
    }
  }, [open, employee.name, employee.passcode]);

  async function handleUpdate() {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("passcode", passcode);
    try {
      const result = await updateEmployeeAction(employee.id, formData);

      if (result?.success) {
        toast.success(result.message);
        setOpen(false);
      } else {
        toast.error(result?.message || "Failed to update");
      }
    } catch (error) {
      toast.error("Server error");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <Input
              value={name}
              onChange={(e) => {
                // Prevent typing non-alphabets immediately
                const val = e.target.value;
                if (val === "" || /^[a-zA-Z\s]*$/.test(val)) {
                  setName(val);
                }
              }}
              placeholder="Alphabets only"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">New Passcode</label>
            <Input
              type="text"
              inputMode="numeric"
              value={passcode}
              onChange={(e) => {
                // Only allow numbers
                const val = e.target.value;
                if (val === "" || /^\d*$/.test(val)) {
                  setPasscode(val);
                }
              }}
              placeholder="Leave blank to keep current"
              maxLength={5}
            />
            <p className="text-[11px] text-muted-foreground italic">
              ID: {employee.id.slice(0, 8)}... (Fixed for POS Sync)
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleUpdate} disabled={isPending}>
            {isPending ? "Updating..." : "Update Employee"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
