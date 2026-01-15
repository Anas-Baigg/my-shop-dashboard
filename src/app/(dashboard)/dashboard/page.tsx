import { createClient } from "@/lib/supabase/server";
import React from "react";

// app/dashboard/page.tsx
export default async function Dashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // This is the "Metadata" the server sends back automatically
  const shopName = user?.user_metadata?.shop_name || "Barber Shop";

  return (
    <h1>
      Welcome to {shopName}, {user?.id}
    </h1>
  );
}
