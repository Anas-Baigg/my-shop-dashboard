import NoShopDiv from "@/components/no-shop-div";
import { TableControls } from "@/components/TableControl";
import { DateRangePicker } from "@/components/tillBalance/date-range-picker";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";
import {
  Banknote,
  CreditCard,
  Receipt,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { cookies } from "next/headers";

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const { from, to } = await searchParams;
  const supabase = await createClient();
  const cookieStore = await cookies();
  const activeShopId = cookieStore.get("last_shop_id")?.value;
  if (!activeShopId) {
    return NoShopDiv("Reports");
  }

  const today = new Date().toISOString().split("T")[0];

  const startDate = from || today;
  const endDate = to || today;

  return (
    <div className="p-6 space-y-6 flex flex-col gap-4 max-w-7xl mx-auto md:p-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Daily Reports
          </h2>
          <p className="text-sm text-muted-foreground">
            Search to See daily Sales and transactions.
          </p>
        </div>
        <div className="flex flex-row sm:flex-row gap-2 sm:items-center justify-end">
          <TableControls />
          <DateRangePicker />
        </div>
      </div>
      <Separator orientation="horizontal" className="hidden md:block" />
    </div>
  );
}
