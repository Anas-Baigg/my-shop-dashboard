"use client";

import { useState, useEffect } from "react"; // Added useEffect
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
import {
  validateEmployeeName,
  validatePasscode,
} from "@/lib/validators/employee";

type Employee = {
  id: string;
  shop_id: string | null;
  name: string;
  passcode?: number;
  created_at: string;
  last_synced_at: string | null;
  isActive: boolean;
};

export function EditEmployeeDialog({
  employee,
  onSave,
  disabled,
}: {
  employee: Employee;
  onSave: (id: string, patch: any) => void;
  disabled: boolean;
}) {
  const [name, setName] = useState(employee.name);
  const [passcode, setPasscode] = useState("");
  const [open, setOpen] = useState(false);

  // Keep the form in sync if the employee prop changes or dialog re-opens
  useEffect(() => {
    if (open) {
      setName(employee.name);
      setPasscode("");
    }
  }, [open, employee.name]);

  const handleUpdate = () => {
    const nameError = validateEmployeeName(name);
    if (nameError) return toast.error(nameError);

    const patch: any = {};

    // Only add to patch if actually changed
    if (name.trim() !== employee.name) {
      patch.name = name.trim().toUpperCase();
    }

    if (passcode.trim()) {
      const passError = validatePasscode(passcode);
      if (passError) return toast.error(passError);
      patch.passcode = Number(passcode);
    }

    if (Object.keys(patch).length === 0) {
      return setOpen(false); // No changes made
    }

    onSave(employee.id, patch);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" disabled={disabled}>
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
          <Button onClick={handleUpdate} disabled={disabled}>
            {disabled ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
