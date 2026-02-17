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
    .select("id, name, admin_password_hash")
    .order("name");

  return (
    <div className="p-6 space-y-6 flex flex-col gap-4 max-w-7xl mx-auto md:p-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Shops
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage your shop credentials.
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <CreateShopDialog></CreateShopDialog>
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Shop Name</TableHead>
              <TableHead className="hidden md:table-cell">ID</TableHead>
              <TableHead className="text-right pr-5">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {shops?.map((shop) => (
              <TableRow key={shop.id}>
                <TableCell className="font-medium">{shop.name}</TableCell>
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
