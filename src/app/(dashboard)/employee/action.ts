"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache";
import { validateEmployeeName, validatePasscode } from "@/lib/validators/employee";

export type ActionState = {
    success?: boolean;
  message?: string;
} | null;