"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ChevronDownIcon, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { updateTimeLogAction } from "@/app/(dashboard)/timeLogs/action";

export function TimeLogDialog({ record }: { record: any }) {
  const [open, setOpen] = useState(false);
  const [openIn, setOpenIn] = useState(false);
  const [openOut, setOpenOut] = useState(false);

  // Initialize dates from record
  const [dateIn, setDateIn] = useState<Date | undefined>(
    record.clock_in_time ? new Date(record.clock_in_time) : undefined,
  );
  const [dateOut, setDateOut] = useState<Date | undefined>(
    record.clock_out_time ? new Date(record.clock_out_time) : undefined,
  );

  // Extract time string (HH:mm:ss)
  const formatTime = (ts: string | null) => {
    if (!ts) return "09:00:00";
    return new Date(ts).toTimeString().slice(0, 8);
  };

  async function handleSubmit(formData: FormData) {
    const result = await updateTimeLogAction(record.id, formData);
    if (result.success) {
      toast.success(result.message);
      setOpen(false);
    } else {
      toast.error(result.message);
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      {/* Changed: Use w-[95vw] for mobile and sm:max-w-[450px] for desktop */}
      <DialogContent className="w-[95vw] max-w-lg rounded-lg sm:w-full">
        <form action={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Attendance</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-6 py-6">
            {/* CLOCK IN*/}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex flex-1 flex-col gap-3">
                <Label className="px-1 text-muted-foreground">
                  Clock In Date
                </Label>
                <Popover open={openIn} onOpenChange={setOpenIn}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between text-left font-normal"
                    >
                      {dateIn ? format(dateIn, "dd MMM yyyy") : "Pick a date"}
                      <ChevronDownIcon className="h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateIn}
                      onSelect={(date) => {
                        setDateIn(date);
                        setOpenIn(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex flex-col gap-3 sm:w-30">
                <input
                  type="hidden"
                  name="clock_in_date"
                  value={dateIn ? format(dateIn, "yyyy-MM-dd") : ""}
                />
                <Label className="px-1 text-muted-foreground">Time</Label>
                <Input
                  name="clock_in_time"
                  type="time"
                  step="1"
                  defaultValue={formatTime(record.clock_in_time)}
                  className="bg-background"
                />
              </div>
            </div>

            {/* CLOCK OUT */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex flex-1 flex-col gap-3">
                <Label className="px-1 text-muted-foreground">
                  Clock Out Date
                </Label>
                <Popover open={openOut} onOpenChange={setOpenOut}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between text-left font-normal"
                    >
                      {dateOut ? format(dateOut, "dd MMM yyyy") : "Pick a date"}
                      <ChevronDownIcon className="h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateOut}
                      onSelect={(date) => {
                        setDateOut(date);
                        setOpenOut(false);
                      }}
                      disabled={dateIn && { before: dateIn }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex flex-col gap-3 sm:w-30">
                <input
                  type="hidden"
                  name="clock_out_date"
                  value={dateOut ? format(dateOut, "yyyy-MM-dd") : ""}
                />
                <Label className="px-1 text-muted-foreground">Time</Label>
                <Input
                  name="clock_out_time"
                  type="time"
                  step="1"
                  defaultValue={formatTime(record.clock_out_time)}
                  className="bg-background"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
