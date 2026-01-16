import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("shops")
    .select("id, name, admin_password")
    .order("name");

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ shops: data });
}

export async function POST(req: Request) {
  const supabase = await createClient();

  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const name = String(body.name ?? "").trim();
  const admin_password = Number(body.admin_password);

  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
  if (!Number.isInteger(admin_password)) return NextResponse.json({ error: "Admin password must be an integer" }, { status: 400 });

  const { data, error } = await supabase
    .from("shops")
    .insert({
      name,
      admin_password,
      owner_id: userData.user.id,
    })
    .select("id, name, admin_password")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ shop: data }, { status: 201 });
}
