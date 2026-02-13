"use client";

import * as React from "react";
import { format } from "date-fns";
import { ChevronDownIcon, Pencil } from "lucide-react";
import { toast } from "sonner";

import { updateTimeLogAction } from "@/app/(dashboard)/timeLogs/action";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

interface TimeLogDialogProps {
  record: any;
}

export function TimeLogDialog({ record }: TimeLogDialogProps) {
  const [open, setOpen] = React.useState(false);

  // Clock-in state
  const [openIn, setOpenIn] = React.useState(false);
  const [dateIn, setDateIn] = React.useState<Date | undefined>(
    record.clock_in_time ? new Date(record.clock_in_time) : undefined,
  );

  // Clock-out state
  const [openOut, setOpenOut] = React.useState(false);
  const [dateOut, setDateOut] = React.useState<Date | undefined>(
    record.clock_out_time ? new Date(record.clock_out_time) : undefined,
  );

  // Format time string for input
  const formatTime = (ts: string | null) => {
    if (!ts) return "09:00:00";
    return new Date(ts).toTimeString().slice(0, 8);
  };

  // Handle form submit
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

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

      <DialogContent className="w-[95vw] max-w-lg rounded-lg sm:w-full">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Attendance</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-6 py-6">
            {/* CLOCK IN */}
            <FieldGroup className="flex flex-col gap-4 sm:flex-row">
              <Field>
                <FieldLabel htmlFor="clock-in-date">Clock In Date</FieldLabel>
                <Popover open={openIn} onOpenChange={setOpenIn}>
                  <PopoverTrigger asChild>
                    <Button
                      id="clock-in-date"
                      variant="outline"
                      className="w-40 justify-between font-normal"
                    >
                      {dateIn ? format(dateIn, "PPP") : "Select date"}
                      <ChevronDownIcon className="h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateIn}
                      captionLayout="dropdown"
                      defaultMonth={dateIn}
                      onSelect={(date) => {
                        setDateIn(date);
                        setOpenIn(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <input
                  type="hidden"
                  name="clock_in_date"
                  value={dateIn ? format(dateIn, "yyyy-MM-dd") : ""}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="clock-in-time">Time</FieldLabel>
                <Input
                  type="time"
                  id="clock-in-time"
                  name="clock_in_time"
                  step="1"
                  defaultValue={formatTime(record.clock_in_time)}
                  className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
              </Field>
            </FieldGroup>

            {/* CLOCK OUT */}
            <FieldGroup className="flex flex-col gap-4 sm:flex-row">
              <Field>
                <FieldLabel htmlFor="clock-out-date">Clock Out Date</FieldLabel>
                <Popover open={openOut} onOpenChange={setOpenOut}>
                  <PopoverTrigger asChild>
                    <Button
                      id="clock-out-date"
                      variant="outline"
                      className="w-40 justify-between font-normal"
                    >
                      {dateOut ? format(dateOut, "PPP") : "Select date"}
                      <ChevronDownIcon className="h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateOut}
                      captionLayout="dropdown"
                      defaultMonth={dateOut}
                      onSelect={(date) => {
                        setDateOut(date);
                        setOpenOut(false);
                      }}
                      disabled={dateIn ? { before: dateIn } : undefined}
                    />
                  </PopoverContent>
                </Popover>
                <input
                  type="hidden"
                  name="clock_out_date"
                  value={dateOut ? format(dateOut, "yyyy-MM-dd") : ""}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="clock-out-time">Time</FieldLabel>
                <Input
                  type="time"
                  id="clock-out-time"
                  name="clock_out_time"
                  step="1"
                  defaultValue={formatTime(record.clock_out_time)}
                  className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
              </Field>
            </FieldGroup>
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
