"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateTillBalanceAction(
  id: string,
  formData: FormData
) {
  const supabase = await createClient();
  const amount = Number(formData.get("balance_amount"));

  if (isNaN(amount)) {
    return { success: false, message: "Please enter a valid numeric amount." };
  }
  if (isNaN(amount) || amount < 0) {
  return { success: false, message: "Balance cannot be negative." };
}

  const { error } = await supabase
    .from("till_balance")
    .update({ 
      balance_amount: amount,
      last_synced_at: new Date().toISOString() 
    })
    .eq("id", id);

  if (error) return { success: false, message: error.message };

  revalidatePath("/till");
  return { success: true, message: "Till balance updated!" };
}