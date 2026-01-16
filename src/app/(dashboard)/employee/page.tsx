"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useShop } from "@/context/shop-context";
import { Plus, RefreshCcw } from "lucide-react";
import { DeleteEmployeeConfirm } from "@/components/employee/DeleteEmpConfirm";
import { EditEmployeeDialog } from "@/components/employee/EditEmpConfirm";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
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

// --- MAIN PAGE COMPONENT ---

export default function EmployeesPage() {
  const { currentShopId, shops, loading: shopLoading } = useShop();
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Create Form State

  const [newName, setNewName] = useState("");
  const [newPasscode, setNewPasscode] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const currentShopName = useMemo(() => {
    if (!currentShopId) return null;
    return shops.find((s) => s.id === currentShopId)?.name ?? null;
  }, [currentShopId, shops]);

  async function load() {
    if (!currentShopId) {
      setEmployees([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `/api/employee?shopId=${encodeURIComponent(currentShopId)}&includeInactive=true`,
      );

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Failed to load employees");
      setEmployees((json.employees ?? []) as Employee[]);
    } catch (e: any) {
      toast.error(e?.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [currentShopId]);

  async function createEmployee() {
    const nameError = validateEmployeeName(newName);
    if (nameError) return toast.error(nameError);

    const passError = validatePasscode(newPasscode);
    if (passError) return toast.error(passError);

    setLoading(true);
    try {
      const syncId = crypto.randomUUID();
      const res = await fetch("/api/employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: syncId,
          shop_id: currentShopId,
          name: newName.trim().toUpperCase(),
          passcode: Number(newPasscode),
        }),
      });
      if (!res.ok) throw new Error("Creation failed");

      toast.success("Employee created successfully");
      setNewName("");
      setNewPasscode("");
      setIsAddOpen(false);
      load();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateEmployee(id: string, patch: any) {
    setLoading(true);
    try {
      const res = await fetch(`/api/employee/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error("Update failed");
      toast.success("Employee updated");
      load();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteEmployee(id: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/employee/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Employee removed");
      load();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (shopLoading)
    return <div className="p-8 text-center">Loading context...</div>;
  if (!currentShopId)
    return (
      <div className="p-8 text-center text-muted-foreground">
        Please select a shop first.
      </div>
    );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto md:p-12">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Employees</h2>
          <p className="text-muted-foreground">
            Shop:{" "}
            <span className="text-foreground font-semibold">
              {currentShopName}
            </span>
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={load}
            disabled={loading}
          >
            <RefreshCcw
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
          </Button>

          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Employee</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Input
                  placeholder="Name (Alphabets only)"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <Input
                  placeholder="Passcode (5 digits, no 0 at start)"
                  value={newPasscode}
                  maxLength={5}
                  onChange={(e) => setNewPasscode(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button onClick={createEmployee} disabled={loading}>
                  Save Employee
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Passcode</TableHead>
              <TableHead className="hidden md:table-cell">ID</TableHead>
              <TableHead className="text-right pr-5">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  No employees found for this shop.
                </TableCell>
              </TableRow>
            ) : (
              employees.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell className="font-medium">{emp.name}</TableCell>
                  <TableCell className="font-medium">{emp.passcode}</TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground hidden md:table-cell">
                    {emp.id}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <EditEmployeeDialog
                        employee={emp}
                        onSave={updateEmployee}
                        disabled={loading}
                      />
                      <DeleteEmployeeConfirm
                        id={emp.id}
                        onDelete={deleteEmployee}
                        disabled={loading}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
