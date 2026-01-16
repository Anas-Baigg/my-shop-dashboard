"use client";

import { useEffect, useState } from "react";
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
import { validateAdminPassword, validateShopName } from "@/lib/validators/shop";

export type Shop = { id: string; name: string; admin_password: number };

export function EditShopDialog({
  shop,
  onSave,
}: {
  shop: Shop;
  onSave: (
    id: string,
    name: string,
    admin_password: number
  ) => Promise<void> | void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(shop.name);
  const [pass, setPass] = useState(String(shop.admin_password));

  // keep fields in sync if you open dialog for a different shop, etc.
  useEffect(() => {
    if (!open) return;
    setName(shop.name);
    setPass(String(shop.admin_password));
  }, [open, shop.id, shop.name, shop.admin_password]);

  function handleSave() {
    const nameV = validateShopName(name);
    if (!nameV.ok) return toast.error(nameV.message);

    const passV = validateAdminPassword(pass);
    if (!passV.ok) return toast.error(passV.message);

    onSave(shop.id, nameV.value, passV.value);
    setOpen(false);
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
          <DialogTitle>Edit Shop</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Input
            placeholder="Shop Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            placeholder="Admin Password (5 digits, not starting with 0)"
            value={pass}
            inputMode="numeric"
            maxLength={5}
            onChange={(e) => {
              // digits only + max 5
              const digits = e.target.value.replace(/\D/g, "").slice(0, 5);
              setPass(digits);
            }}
          />
        </div>

        <DialogFooter>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
