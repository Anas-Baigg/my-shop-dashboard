import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const body = await req.json();

  const update: { name?: string; admin_password?: number } = {};
  if (body.name !== undefined) update.name = String(body.name).trim();
  if (body.admin_password !== undefined) update.admin_password = Number(body.admin_password);

  if (update.name !== undefined && !update.name) {
    return NextResponse.json({ error: "Name cannot be empty" }, { status: 400 });
  }
  if (update.admin_password !== undefined && !Number.isInteger(update.admin_password)) {
    return NextResponse.json({ error: "Admin password must be an integer" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("shops")
    .update(update)
    .eq("id", id)
    .select("id, name, admin_password")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ shop: data });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;


  const { error } = await supabase.from("shops").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
