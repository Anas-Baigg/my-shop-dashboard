import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET(req: Request) {
  const supabase = await createClient();

  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) return jsonError("Unauthorized", 401);

  const url = new URL(req.url);
  const shopId = url.searchParams.get("shopId"); // optional
  const includeInactive = url.searchParams.get("includeInactive") === "TRUE";
  let query = supabase
    .from("employee")
    .select('id, shop_id, name, passcode, created_at, last_synced_at, isActive')
    .order("created_at", { ascending: false });

  if (shopId) query = query.eq("shop_id", shopId);
  if (!includeInactive) {
    query = query.eq('isActive', true); 
  }
  const { data, error } = await query;
  if (error) return jsonError(error.message, 400);

  return NextResponse.json({ employees: data ?? [] });
}

export async function POST(req: Request) {
  const supabase = await createClient();

  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) return jsonError("Unauthorized", 401);

  const body = await req.json().catch(() => null);
  if (!body) return jsonError("Invalid JSON body", 400);

  const id = String(body.id ?? "").trim();          // REQUIRED now
  const shop_id = String(body.shop_id ?? "").trim();
  const name = String(body.name ?? "").trim();
  const passcode = Number(body.passcode);

  if (!id) return jsonError("id is required", 400);
  if (!shop_id) return jsonError("shop_id is required", 400);
  if (!name) return jsonError("name is required", 400);
  if (!Number.isInteger(passcode)) return jsonError("passcode must be an integer", 400);

  const { data, error } = await supabase
    .from("employee")
    .insert({ id, shop_id, name, passcode })
    .select('id, shop_id, name, passcode, created_at, last_synced_at, isActive')
    .single();

  if (error) return jsonError(error.message, 400);

  return NextResponse.json({ employee: data }, { status: 201 });
}
