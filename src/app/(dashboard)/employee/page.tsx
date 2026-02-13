import { createClient } from "@/lib/supabase/server";
import { deleteEmployeeAction } from "./action";
import { DeleteEmployeeConfirm } from "@/components/employee/DeleteEmpConfirm";
import { EditEmployeeDialog } from "@/components/employee/EditEmpConfirm";
import { CreateEmpDialog } from "@/components/employee/CreateEmpDialog";
import { cookies } from "next/headers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import NoShopDiv from "@/components/no-shop-div";
import { redirect } from "next/navigation";

// --- MAIN PAGE COMPONENT ---

export default async function EmployeesPage({
  searchParams,
}: {
  searchParams: Promise<{ shopId?: string }>;
}) {
  // Await the searchParams from the URL
  const { shopId: urlId } = await searchParams;

  // Read the cookie from the browser's request
  const cookieStore = await cookies();
  const cookieId = cookieStore.get("last_shop_id")?.value;
  if (!urlId && cookieId) {
    redirect(`/employee?shopId=${cookieId}`);
  }
  // Final Decision: URL takes priority, then Cookie
  const activeShopId = urlId || cookieId;
  const supabase = await createClient();
  if (!activeShopId) {
    return <NoShopDiv pageName="Employee" />;
  }
  const { data: employees } = await supabase
    .from("employee")
    .select("*")
    .eq("isActive", true)
    .eq("shop_id", activeShopId || "No Shop Selected")
    .order("name");

  return (
    <div className="p-6 space-y-6 flex flex-col gap-4 max-w-7xl mx-auto md:p-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Employees
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage staff for your shops.
          </p>
        </div>

        <div className="w-full sm:w-auto">
          <CreateEmpDialog shopId={activeShopId} />
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
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
