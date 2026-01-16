import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) return jsonError("Unauthorized", 401);

  const id = String(params.id ?? "").trim();
  if (!id) return jsonError("Missing employee id", 400);

  const body = await req.json().catch(() => null);
  if (!body) return jsonError("Invalid JSON body", 400);

  // Only allow fields you actually want editable
  const update: {
    name?: string;
    passcode?: number;
    shop_id?: string | null;
    last_synced_at?: string | null;
    "isActive"?: boolean;
  } = {};

  if (body.name !== undefined) {
    const name = String(body.name).trim();
    if (!name) return jsonError("name cannot be empty", 400);
    update.name = name;
  }

  if (body.passcode !== undefined) {
    const passcode = Number(body.passcode);
    if (!Number.isInteger(passcode)) return jsonError("passcode must be an integer", 400);
    update.passcode = passcode;
  }

  if (body.isActive !== undefined) {
    update["isActive"] = Boolean(body.isActive);
  }

  // Optional: allow updating last_synced_at
  if (body.last_synced_at !== undefined) {
    // expect ISO string or null
    update.last_synced_at = body.last_synced_at === null ? null : String(body.last_synced_at);
  }

  // Optional: allow moving employee to another shop you own
  if (body.shop_id !== undefined) {
    const shop_id = body.shop_id === null ? null : String(body.shop_id).trim();
    update.shop_id = shop_id;
  }

  if (Object.keys(update).length === 0) {
    return jsonError("No valid fields to update", 400);
  }

  const { data, error } = await supabase
    .from("employee")
    .update(update)
    .eq("id", id)
    .select('id, shop_id, name, passcode, created_at, last_synced_at, "isActive"')
    .single();

  if (error) return jsonError(error.message, 400);

  return NextResponse.json({ employee: data });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) return jsonError("Unauthorized", 401);

  const id = String(params.id ?? "").trim();
  if (!id) return jsonError("Missing employee id", 400);

  const { error } = await supabase.from("employee").delete().eq("id", id);
  if (error) return jsonError(error.message, 400);

  return NextResponse.json({ ok: true });
}
