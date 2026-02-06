"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { validateServiceName, validatePrice } from "@/lib/validators/cutAndprod";
import crypto from "node:crypto";

export type ActionState = {
  success?: boolean;
  message?: string;
} | null;

export async function createProductAction(
  shopId: string,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const id = crypto.randomUUID();

  const product = formData.get("product") as string;
  const priceRaw = Number(formData.get("price"));

  const nameV = validateServiceName(product);
  const priceV = validatePrice(priceRaw);

  if (!nameV.ok) return { message: nameV.message };
  if (!priceV.ok) return { message: priceV.message };

const { error } = await supabase.from("products").insert({
  id,
  productName: nameV.value.toUpperCase(),
  price: priceV.value,
  shop_id: shopId,
  isActive: true,
});

  if (error) return { success: false, message: error.message };

  revalidatePath("/products");
  return { success: true, message: "Product added!" };
}

export async function updateProductAction(
  id: string,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();

  const product = formData.get("product") as string;
  const priceRaw = Number(formData.get("price"));

  const nameV = validateServiceName(product);
  const priceV = validatePrice(priceRaw);

  if (!nameV.ok) return { message: nameV.message };
  if (!priceV.ok) return { message: priceV.message };

const { error } = await supabase
  .from("products")
  .update({
    productName: nameV.value.toUpperCase(),
    price: priceV.value,
  })
  .eq("id", id);

  if (error) return { success: false, message: error.message };

  revalidatePath("/products");
  return { success: true, message: "Product updated!" };
}

export async function deleteProductAction(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("products")
    .update({ isActive: false })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/products");
  return { success: true, message: "Product deleted!" };
}
