import { createClient } from "@/lib/supabase/server";

export default async function ReportsPage() {
  const supabase = await createClient();

  return (
    <div>
      <h1>welcome</h1>
    </div>
  );
}
