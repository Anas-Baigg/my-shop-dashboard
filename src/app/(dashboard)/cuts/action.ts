"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { validateServiceName, validatePrice } from "@/lib/validators/cutAndprod";
import crypto from "node:crypto";

export type ActionState = {
  success?: boolean;
  message?: string;
} | null;

export async function createCutAction(
  shopId: string,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const newId = crypto.randomUUID();

  const cut = formData.get("cut") as string;
  const priceRaw = Number(formData.get("price"));

  const nameV = validateServiceName(cut);
  const priceV = validatePrice(priceRaw);

  if (!nameV.ok) return { message: nameV.message };
  if (!priceV.ok) return { message: priceV.message };

  const { error } = await supabase.from("cuts").insert({
    id: newId,
    cutname: nameV.value.toUpperCase(),
    price: priceV.value,
    shop_id: shopId,
    isActive: true,
  });

  if (error) return { success: false, message: error.message };

  revalidatePath("/cuts");
  return { success: true, message: "Cut added!" };
}

export async function updateCutAction(
  id: string,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();

  const cut = formData.get("cut") as string;
  const priceRaw = Number(formData.get("price"));

  const nameV = validateServiceName(cut);
  const priceV = validatePrice(priceRaw);

  if (!nameV.ok) return { message: nameV.message };
  if (!priceV.ok) return { message: priceV.message };

  const { error } = await supabase
    .from("cuts")
    .update({
      cutname: nameV.value.toUpperCase(),
      price: priceV.value,
    })
    .eq("id", id);

  if (error) return { success: false, message: error.message };

  revalidatePath("/cuts");
  return { success: true, message: "Cut updated!" };
}

export async function deleteCutAction(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("cuts")
    .update({ isActive: false })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/cuts");
  return { success: true, message: "Cut deleted!" };
}
