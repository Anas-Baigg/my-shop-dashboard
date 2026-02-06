"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateTimeLogAction(id: string, formData: FormData) {
  const supabase = await createClient();
 
  const clockInDate = formData.get("clock_in_date") as string;
  const clockInTime = formData.get("clock_in_time") as string;
  const clockOutDate = formData.get("clock_out_date") as string;
  const clockOutTime = formData.get("clock_out_time") as string;

  const clock_in_time = clockInDate && clockInTime ? `${clockInDate}T${clockInTime}` : null;
  const clock_out_time = clockOutDate && clockOutTime ? `${clockOutDate}T${clockOutTime}` : null;

  if (!clock_in_time) {
    return { success: false, message: "Clock-in time is required." };
  }

  const { error } = await supabase
    .from("time_logs")
    .update({
      clock_in_time,
      clock_out_time,
      last_synced_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { success: false, message: error.message };

  revalidatePath("/time-logs");
  return { success: true, message: "Time log updated successfully!" };
}