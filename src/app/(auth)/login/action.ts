'use server'
import { createClient } from "@/lib/supabase/server";
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'


// app/login/actions.ts
async function login(prevState: any, formData: FormData) {

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password){
    return {ok : false, message : "Email and password are required."}
  }
  const supabase = await createClient()

  const {  error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    // Return the error message instead of redirecting
    return { ok: false, message: error.message }
  }

  // Success!
  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
export default login;