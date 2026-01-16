import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(req: Request, { params }: RouteContext) {
  const supabase = await createClient();

  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) return jsonError("Unauthorized", 401);

  
  const { id } = await params;
  if (!id) return jsonError("Missing employee id", 400);

  const body = await req.json().catch(() => null);
  if (!body) return jsonError("Invalid JSON body", 400);

  const update: any = {};

  if (body.name !== undefined) {
    const name = String(body.name).trim().toUpperCase();
    // Validation: Alphabets and spaces only
    if (!name || !/^[A-Z\s]+$/.test(name)) {
      return jsonError("Name must contain only alphabets", 400);
    }
    update.name = name;
  }

  if (body.passcode !== undefined) {
    const passcodeStr = String(body.passcode);
    // Validation: Exactly 5 digits, no leading zero
    if (!/^[1-9][0-9]{4}$/.test(passcodeStr)) {
      return jsonError("Passcode must be 5 digits and cannot start with zero", 400);
    }
    update.passcode = Number(passcodeStr);
  }

  if (body.isActive !== undefined) {
    update["isActive"] = Boolean(body.isActive);
  }

  if (body.last_synced_at !== undefined) {
    update.last_synced_at = body.last_synced_at === null ? null : String(body.last_synced_at);
  }

  if (body.shop_id !== undefined) {
    update.shop_id = body.shop_id === null ? null : String(body.shop_id).trim();
  }

  if (Object.keys(update).length === 0) {
    return jsonError("No valid fields to update", 400);
  }

  const { data, error } = await supabase
    .from("employee")
    .update(update)
    .eq("id", id)
    .select('id, shop_id, name, passcode, created_at, last_synced_at, isActive')
    .single();

  if (error) return jsonError(error.message, 400);

  return NextResponse.json({ employee: data });
}

export async function DELETE(_: Request, { params }: RouteContext) {
  const supabase = await createClient();

  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) return jsonError("Unauthorized", 401);

  const { id } = await params;
  if (!id) return jsonError("Missing employee id", 400);


  const { error } = await supabase
    .from("employee")
    .update({ "isActive" : false }) 
    .eq("id", id);

  if (error) return jsonError(error.message, 400);

  return NextResponse.json({ ok: true, message: "Employee deactivated" });
}