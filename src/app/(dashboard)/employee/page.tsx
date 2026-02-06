import { createClient } from "@/lib/supabase/server";
import { deleteEmployeeAction } from "./action";
import { DeleteEmployeeConfirm } from "@/components/employee/DeleteEmpConfirm";
import { EditEmployeeDialog } from "@/components/employee/EditEmpConfirm";
import { CreateEmpDialog } from "@/components/employee/CreateEmpDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// --- MAIN PAGE COMPONENT ---

export default async function EmployeesPage({
  searchParams,
}: {
  searchParams: Promise<{ shopId?: string }>;
}) {
  const { shopId } = await searchParams;
  const supabase = await createClient();
  const { data: employees } = await supabase
    .from("employee")
    .select("*")
    .eq("isActive", true)
    .eq("shop_id", shopId || "No Shop Selected")
    .order("name");

  return (
    <div className="p-6 space-y-6 flex flex-col gap-4 max-w-7xl mx-auto md:p-24">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Employees</h2>
          <p className="text-muted-foreground">Manage staff for your shops.</p>
        </div>

        <div className="flex gap-2">
          {shopId && <CreateEmpDialog shopId={shopId} />}
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
            {employees?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  No employees found for this shop.
                </TableCell>
              </TableRow>
            ) : (
              employees?.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell className="font-medium">{emp.name}</TableCell>
                  <TableCell className="font-medium">{emp.passcode}</TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground hidden md:table-cell">
                    {emp.id}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <EditEmployeeDialog employee={emp} />
                      <DeleteEmployeeConfirm
                        id={emp.id}
                        onDelete={deleteEmployeeAction}
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
