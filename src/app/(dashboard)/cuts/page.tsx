import { createClient } from "@/lib/supabase/server";
import { createCutAction, deleteCutAction, updateCutAction } from "./action";
import { cookies } from "next/headers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteServiceConfirm } from "@/components/service/DeleteServiceConfirm";
import { ServiceDialog } from "@/components/service/ServiceDialog";

export default async function CutsPage({
  searchParams,
}: {
  searchParams: Promise<{ shopId?: string }>;
}) {
  const { shopId: urlId } = await searchParams;

  const cookieStore = await cookies();
  const cookieId = cookieStore.get("last_shop_id")?.value;

  const activeShopId = urlId || cookieId;
  const supabase = await createClient();

  if (!activeShopId) {
    return (
      <div className="p-24 text-center">
        <h2 className="text-xl font-semibold">No Shop Selected</h2>
        <p className="text-muted-foreground">
          Please select a shop from the header to view cuts.
        </p>
      </div>
    );
  }

  const { data: cuts } = await supabase
    .from("cuts")
    .select("*")
    .eq("isActive", true)
    .eq("shop_id", activeShopId)
    .order("cutname", { ascending: true });

  return (
    <div className="p-6 space-y-6 flex flex-col gap-4 max-w-7xl mx-auto md:p-24">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Cuts</h2>
          <p className="text-muted-foreground">
            Manage haircut services for your shop.
          </p>
        </div>

        <ServiceDialog
          shopId={activeShopId}
          title="Cuts"
          nameLabel="Cut"
          nameField="cut"
          onSubmit={createCutAction}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cut</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="hidden md:table-cell">ID</TableHead>
              <TableHead className="text-right pr-5">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {cuts?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  No cuts found for this shop.
                </TableCell>
              </TableRow>
            ) : (
              cuts?.map((cut) => (
                <TableRow key={cut.id}>
                  <TableCell className="font-medium">{cut.cutname}</TableCell>
                  <TableCell>€ {cut.price}</TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground hidden md:table-cell">
                    {cut.id}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <ServiceDialog
                        id={cut.id}
                        title="Cut"
                        nameLabel="Cut"
                        nameField="cut"
                        initialName={cut.cutname}
                        initialPrice={cut.price}
                        onSubmit={updateCutAction}
                        mode="edit"
                      />
                      <DeleteServiceConfirm
                        id={cut.id}
                        label="Cut"
                        onDelete={deleteCutAction}
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
