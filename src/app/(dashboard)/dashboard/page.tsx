import NoShopDiv from "@/components/no-shop-div";
import { TableControls } from "@/components/TableControl";
import { DateRangePicker } from "@/components/tillBalance/date-range-picker";
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
import { CreditCard, TrendingUp, Wallet } from "lucide-react";
import { cookies } from "next/headers";
import { TransactionTableClient } from "@/components/report/TransactionTableClient";
import { PaginationIconsOnly } from "@/components/report/Pagination";
import { formatEUR } from "@/lib/utils";
import { Transaction, TillBalance } from "@/types/reports";
import HeaderCards from "@/components/report/headerCards";

// for daily reports
function generateDailyReports(
  tillBalances: TillBalance[],
  allTransactions: Transaction[],
) {
  if (!tillBalances) return [];

  return tillBalances.map((till) => {
    const dayDate = till.balance_date;

    const daysTransactions = allTransactions.filter((t) =>
      t.created_at.startsWith(dayDate),
    );

    const cashTotal = daysTransactions
      .filter((t) => t.payment_method === "Cash")
      .reduce((acc, t) => acc + Number(t.final_total), 0);

    const cardTotal = daysTransactions
      .filter((t) => t.payment_method === "Card")
      .reduce((acc, t) => acc + Number(t.final_total), 0);

    return {
      date: dayDate,
      openingBalance: Number(till.balance_amount),
      cashSales: cashTotal,
      cardSales: cardTotal,
      expectedCashInTill: Number(till.balance_amount) + cashTotal,
    };
  });
}

// for tip summaries
function generateTipSummary(transactions: Transaction[]) {
  const summary = transactions.reduce(
    (acc, t) => {
      const empId = t.employee_id;
      const empName = t.employee?.name || "Unknown";
      const tipAmount = Number(t.tip || 0);

      if (!acc[empId]) {
        acc[empId] = { name: empName, cashTips: 0, cardTips: 0, totalTips: 0 };
      }

      if (t.payment_method === "Cash") {
        acc[empId].cashTips += tipAmount;
      } else {
        acc[empId].cardTips += tipAmount;
      }
      acc[empId].totalTips += tipAmount;
      return acc;
    },
    {} as Record<string, any>,
  );

  return Object.values(summary);
}
export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{
    from?: string;
    to?: string;
    tx_page?: string;
    daily_page?: string;
  }>;
}) {
  const { from, to, tx_page, daily_page } = await searchParams;
  const supabase = await createClient();
  const cookieStore = await cookies();

  const activeShopId = cookieStore.get("last_shop_id")?.value;

  if (!activeShopId) {
    return <NoShopDiv pageName="Reports" />;
  }

  // Defaults
  const today = new Date().toISOString().split("T")[0];
  const startDate = from || today;
  const endDate = to || today;
  const TX_PAGE_SIZE = 10;
  const DAILY_PAGE_SIZE = 7;
  const currentTxPage = Number(tx_page) || 1;
  const currentDailyPage = Number(daily_page) || 1;

  // 1. Fetch All Transactions for Range (Needed for Totals & Tips)
  const { data: rawAllTransactions } = await supabase
    .from("transactions")
    .select("*, employee:employee_id(name)") // Select * to satisfy type
    .eq("shop_id", activeShopId)
    .gte("created_at", `${startDate}T00:00:00`)
    .lte("created_at", `${endDate}T23:59:59`);

  const allTransactions = (rawAllTransactions || []) as Transaction[];

  // 2. Fetch Paginated Transactions (For the Table)
  const txStart = (currentTxPage - 1) * TX_PAGE_SIZE;
  const { data: paginatedTransactions, count: totalTxCount } = await supabase
    .from("transactions")
    .select("*, employee:employee_id(name)", { count: "exact" })
    .eq("shop_id", activeShopId)
    .gte("created_at", `${startDate}T00:00:00`)
    .lte("created_at", `${endDate}T23:59:59`)
    .order("created_at", { ascending: false })
    .range(txStart, txStart + TX_PAGE_SIZE - 1);

  // 3. Fetch Paginated Till Balances (For Daily Report)
  const dailyStart = (currentDailyPage - 1) * DAILY_PAGE_SIZE;
  const { data: tillBalances, count: totalDailyCount } = await supabase
    .from("till_balance")
    .select("*", { count: "exact" })
    .eq("shop_id", activeShopId)
    .gte("balance_date", startDate)
    .lte("balance_date", endDate)
    .order("balance_date", { ascending: false })
    .range(dailyStart, dailyStart + DAILY_PAGE_SIZE - 1);

  // Calculate totals safely
  const totalRevenue =
    allTransactions.reduce((acc, t) => acc + Number(t.final_total || 0), 0) ||
    0;

  const totalCash =
    allTransactions
      .filter((t) => t.payment_method === "Cash")
      .reduce((acc, t) => acc + Number(t.final_total || 0), 0) || 0;

  const totalCard =
    allTransactions
      .filter((t) => t.payment_method === "Card")
      .reduce((acc, t) => acc + Number(t.final_total || 0), 0) || 0;

  const dailyReports = generateDailyReports(
    (tillBalances as TillBalance[]) || [],
    allTransactions,
  );
  const tipRows = generateTipSummary(allTransactions);

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
      <div className="grid gap-4 md:grid-cols-3">
        <HeaderCards
          title="Total Revenue"
          value={totalRevenue}
          icon={TrendingUp}
          sub="Gross sales after discounts"
          colorClass="border-t-green-400"
        />
        <HeaderCards
          title="Cash in Hand"
          value={totalCash}
          icon={Wallet}
          sub={`${allTransactions.filter((t) => t.payment_method === "Cash").length} transactions`}
          valueColor="text-blue-600"
        />
        <HeaderCards
          title="Card Payments"
          value={totalCard}
          icon={CreditCard}
          sub="Processed via terminal"
          valueColor="text-purple-600"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Cash Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Cash Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Opening Balance</TableHead>
                  <TableHead>Cash Sales</TableHead>
                  <TableHead>Card Sales</TableHead>
                  <TableHead className="text-right">Expected Cash</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dailyReports?.map((day) => (
                  <TableRow key={day.date}>
                    <TableCell className="font-medium">{day.date}</TableCell>
                    <TableCell>{formatEUR(day.openingBalance)}</TableCell>
                    <TableCell>{formatEUR(day.cashSales)}</TableCell>
                    <TableCell>{formatEUR(day.cardSales)}</TableCell>
                    <TableCell className="text-right font-bold">
                      {formatEUR(day.expectedCashInTill)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <PaginationIconsOnly
              totalCount={totalDailyCount || 0}
              pageSize={DAILY_PAGE_SIZE}
              paramName="daily_page"
            />
          </CardContent>
        </Card>
        {/* Employee Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Employee Tips Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Cash Tips</TableHead>
                  <TableHead>Card Tips</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tipRows.map((emp: any) => (
                  <TableRow key={emp.name}>
                    <TableCell className="font-medium">{emp.name}</TableCell>
                    <TableCell>{formatEUR(emp.cashTips)}</TableCell>
                    <TableCell>{formatEUR(emp.cardTips)}</TableCell>
                    <TableCell className="text-right font-bold">
                      {formatEUR(emp.totalTips)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      {/* Transaction History Section */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <p className="text-sm text-muted-foreground">
            Click on a row to see details.
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Tip</TableHead>

                <TableHead className="text-right">Total Price</TableHead>
              </TableRow>
            </TableHeader>
            <TransactionTableClient
              transactions={paginatedTransactions as Transaction[]}
            />
          </Table>
          <PaginationIconsOnly
            totalCount={totalTxCount || 0}
            pageSize={TX_PAGE_SIZE}
            paramName="tx_page"
          />
        </CardContent>
      </Card>
    </div>
  );
}
