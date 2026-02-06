import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { TillBalanceDialog } from "@/components/tillBalance/TillBalanceDialog";
import { DateRangePicker } from "@/components/tillBalance/date-range-picker";

export default async function TillPage({
  searchParams,
}: {
  searchParams: Promise<{ shopId?: string; from?: string; to?: string }>;
}) {
  const { shopId: urlId, from, to } = await searchParams;
  const cookieStore = await cookies();
  const activeShopId = urlId || cookieStore.get("last_shop_id")?.value;
  const supabase = await createClient();

  if (!activeShopId) return <div>Please select a shop.</div>;

  // Default to the first day of the current month up to today
  const today = new Date();
  const firstOfDate = new Date(today.getFullYear(), today.getMonth(), 1)
    .toISOString()
    .split("T")[0];
  const endOfDate = today.toISOString().split("T")[0];

  const query = supabase
    .from("till_balance")
    .select("*")
    .eq("shop_id", activeShopId)
    .order("balance_date", { ascending: false });

  // Use provided searchParams or fall back to the default monthly range
  query.gte("balance_date", from || firstOfDate);
  query.lte("balance_date", to || endOfDate);

  const { data: balances } = await query;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto md:p-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Till History</h2>
          <p className="text-muted-foreground">
            Search and correct daily balances synced from the till.
          </p>
        </div>
        <DateRangePicker />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Balance Amount</TableHead>
              <TableHead className="hidden md:table-cell">
                Last Synced
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {balances?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No records found for this period.
                </TableCell>
              </TableRow>
            ) : (
              balances?.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">
                    {record.balance_date}
                  </TableCell>
                  <TableCell>
                    € {Number(record.balance_amount).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground hidden md:table-cell">
                    {record.last_synced_at
                      ? new Date(record.last_synced_at).toLocaleString()
                      : "Never"}
                  </TableCell>
                  <TableCell className="text-right">
                    <TillBalanceDialog record={record} />
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
