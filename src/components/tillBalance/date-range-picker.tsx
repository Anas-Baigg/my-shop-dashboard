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

  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const selected: DateRange | undefined =
    from && to ? { from: new Date(from), to: new Date(to) } : undefined;

  const onSelect = (range?: DateRange) => {
    if (!range?.from || !range?.to) return;

    const params = new URLSearchParams(searchParams);
    params.set("from", format(range.from, "yyyy-MM-dd"));
    params.set("to", format(range.to, "yyyy-MM-dd"));

    router.push(`?${params.toString()}`);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-9 px-2.5 flex items-center gap-2 justify-center sm:justify-end w-fit">
          <CalendarIcon className="h-4 w-4 shrink-0" />

          <span className="hidden sm:inline text-sm whitespace-nowrap">
            {selected?.from ? (
              <>
                {format(selected.from, "LLL dd, y")} –{" "}
                {format(selected.to!, "LLL dd, y")}
              </>
            ) : (
              "Pick a date range"
            )}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          mode="range"
          selected={selected}
          onSelect={onSelect}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}
