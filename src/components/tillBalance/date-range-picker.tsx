"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DateRangePicker() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL or default to undefined
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: searchParams.get("from")
      ? new Date(searchParams.get("from")!)
      : undefined,
    to: searchParams.get("to") ? new Date(searchParams.get("to")!) : undefined,
  });

  // date-range-picker.tsx

  React.useEffect(() => {
    const currentFrom = searchParams.get("from");
    const currentTo = searchParams.get("to");

    if (date?.from && date?.to) {
      const newFrom = format(date.from, "yyyy-MM-dd");
      const newTo = format(date.to, "yyyy-MM-dd");

      // ONLY push if the date has actually changed compared to the URL
      if (newFrom !== currentFrom || newTo !== currentTo) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("from", newFrom);
        params.set("to", newTo);
        router.push(`?${params.toString()}`);
      }
    }
  }, [date, router, searchParams]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant={"default"}
          className="justify-start px-2.5 font-normal"
        >
          <CalendarIcon />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, "LLL dd, y")} -{" "}
                {format(date.to, "LLL dd, y")}
              </>
            ) : (
              format(date.from, "LLL dd, y")
            )
          ) : (
            <span>Pick a date range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={setDate}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}
