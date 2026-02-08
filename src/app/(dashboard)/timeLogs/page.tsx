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
import { DateRangePicker } from "@/components/tillBalance/date-range-picker";
import { TimeLogDialog } from "@/components/timeLogs/TimeLogDialog";

export default async function TimeLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const { from, to } = await searchParams;
  const cookieStore = await cookies();
  const activeShopId = cookieStore.get("last_shop_id")?.value;
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  const startDate = from || today;
  const endDate = to || today;

  let query = supabase
    .from("time_logs")
    .select(`*, employee(name)`)
    .eq("shop_id", activeShopId)
    .order("clock_in_time", { ascending: false });
  query = query.gte("clock_in_time", `${startDate}T00:00:00+00`);
  query = query.lte("clock_in_time", `${endDate}T23:59:59+00`);

  const { data: logs } = await query;

  return (
    <div className="p-6 space-y-6 flex flex-col gap-4 max-w-7xl mx-auto md:p-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          Attendance Logs
        </h2>
        <div className="w-full sm:w-auto">
          <DateRangePicker />
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Clock In</TableHead>
              <TableHead>Clock Out</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs?.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-medium">
                  {log.employee?.name}
                </TableCell>
                <TableCell>
                  {new Date(log.clock_in_time).toLocaleString()}
                </TableCell>
                <TableCell>
                  {log.clock_out_time
                    ? new Date(log.clock_out_time).toLocaleString()
                    : "Still Clocked In"}
                </TableCell>
                <TableCell className="text-right">
                  <TimeLogDialog record={log} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
