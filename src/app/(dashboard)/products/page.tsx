import { createClient } from "@/lib/supabase/server";
import {
  createProductAction,
  deleteProductAction,
  updateProductAction,
} from "./action";
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
import NoShopDiv from "@/components/no-shop-div";

export default async function ProductsPage({
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
    return NoShopDiv("products");
  }

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("isActive", true)
    .eq("shop_id", activeShopId)
    .order("productName", { ascending: true });

  return (
    <div className="p-6 space-y-6 flex flex-col gap-4 max-w-7xl mx-auto md:p-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Products
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage products for your shop.
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <ServiceDialog
            shopId={activeShopId}
            title="Product"
            nameLabel="Product"
            nameField="product"
            onSubmit={createProductAction}
          />
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="hidden md:table-cell">ID</TableHead>
              <TableHead className="text-right pr-5">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  No products found for this shop.
                </TableCell>
              </TableRow>
            ) : (
              products?.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    {product.productName}
                  </TableCell>
                  <TableCell>€ {product.price}</TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground hidden md:table-cell">
                    {product.id}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <ServiceDialog
                        id={product.id}
                        title="Product"
                        nameLabel="Product"
                        nameField="product"
                        initialName={product.productName}
                        initialPrice={product.price}
                        onSubmit={updateProductAction}
                        mode="edit"
                      />
                      <DeleteServiceConfirm
                        id={product.id}
                        label="Product"
                        onDelete={deleteProductAction}
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
