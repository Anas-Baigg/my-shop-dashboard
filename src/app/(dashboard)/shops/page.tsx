"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { DeleteShopConfirm } from "@/components/shops/DeleteShopConfirm";
import { EditShopDialog, type Shop } from "@/components/shops/EditShopDialog";
import { validateAdminPassword, validateShopName } from "@/lib/validators/shop";

export default function ShopsPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  // create dialog fields
  const [newName, setNewName] = useState("");
  const [newPass, setNewPass] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/shops");
    const json = await res.json();
    setShops(json.shops ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function createShop() {
    const nameV = validateShopName(newName);
    if (!nameV.ok) return toast.error(nameV.message);

    const passV = validateAdminPassword(newPass);
    if (!passV.ok) return toast.error(passV.message);

    const res = await fetch("/api/shops", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nameV.value, admin_password: passV.value }),
    });

    if (!res.ok) {
      toast.error("Failed to create shop. Please try again.");
      return;
    }

    toast.success(`Shop "${nameV.value}" created successfully!`);
    setNewName("");
    setNewPass("");
    load();
  }

  async function updateShop(
    id: string,
    name: string,
    admin_password: number
  ): Promise<void> {
    const nameV = validateShopName(name);
    if (!nameV.ok) {
      toast.error(nameV.message);
      return;
    }

    const passV = validateAdminPassword(String(admin_password));
    if (!passV.ok) {
      toast.error(passV.message);
      return;
    }

    const res = await fetch(`/api/shops/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nameV.value, admin_password: passV.value }),
    });

    if (!res.ok) {
      toast.error("Update failed");
      return;
    }

    toast.success("Shop updated successfully");
    await load();
  }

  async function deleteShop(id: string) {
    const res = await fetch(`/api/shops/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Could not delete shop");
      return;
    }
    toast.success("Shop deleted permanently");
    load();
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading shops...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 flex flex-col gap-4 max-w-7xl mx-auto md:p-24">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Shops</h2>
          <p className="text-muted-foreground">Manage your shop credentials.</p>
        </div>

        {/* Create Shop Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Shop
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Shop</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <Input
                placeholder="Shop Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />

              <Input
                placeholder="Admin Password (5 digits, not starting with 0)"
                value={newPass}
                inputMode="numeric"
                maxLength={5}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "").slice(0, 5);
                  setNewPass(digits);
                }}
              />
            </div>

            <DialogFooter>
              <Button onClick={createShop}>Save Shop</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Shop Name</TableHead>
              <TableHead>Admin Password</TableHead>
              <TableHead className="hidden md:table-cell">ID</TableHead>
              <TableHead className="text-right pr-5">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {shops.map((shop) => (
              <TableRow key={shop.id}>
                <TableCell className="font-medium">{shop.name}</TableCell>
                <TableCell>{shop.admin_password}</TableCell>
                <TableCell className="text-muted-foreground hidden md:table-cell text-xs font-mono">
                  {shop.id}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <EditShopDialog shop={shop} onSave={updateShop} />
                    <DeleteShopConfirm id={shop.id} onDelete={deleteShop} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
