import { createClient } from "@/lib/supabase/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteShopAction } from "./action";
import { DeleteShopConfirm } from "@/components/shops/DeleteShopConfirm";
import { CreateShopDialog } from "@/components/shops/CreateShopDialog";
import { EditShopDialog } from "@/components/shops/EditShopDialog";

export default async function ShopsPage() {
  const supabase = await createClient();

  const { data: shops } = await supabase
    .from("shops")
    .select("id, name, admin_password")
    .order("name");

  return (
    <div className="p-6 space-y-6 flex flex-col gap-4 max-w-7xl mx-auto md:p-24">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Shops</h2>
          <p className="text-muted-foreground">Manage your shop credentials.</p>
        </div>
        <CreateShopDialog></CreateShopDialog>
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
            {shops?.map((shop) => (
              <TableRow key={shop.id}>
                <TableCell className="font-medium">{shop.name}</TableCell>
                <TableCell>{shop.admin_password}</TableCell>
                <TableCell className="text-muted-foreground hidden md:table-cell text-xs font-mono">
                  {shop.id}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <EditShopDialog shop={shop} />
                    <DeleteShopConfirm
                      id={shop.id}
                      onDelete={deleteShopAction}
                    />
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
