"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache";
import { validateEmployeeName, validatePasscode } from "@/lib/validators/employee";

export type ActionState = {
    success?: boolean;
  message?: string;
} | null;

export async function createEmployeeAction (shopId : string, formData: FormData):Promise<ActionState>{
    const supabase = await createClient();
    const name = formData.get("name") as string;
    const passcode = formData.get("passcode") as string;

    const nameV = validateEmployeeName(name);
    const passV = validatePasscode(passcode);

    if(!nameV.ok) return {message: nameV.message};
    if(!passV.ok) return { message: passV.message };

    const{error} = await supabase.from("employee").insert({
        name: nameV.value.toUpperCase(),
        passcode: passV.value,          
        shop_id: shopId,
    });

    if (error) return {message : error.message};
    revalidatePath("/employee");
    return { success: true, message: "Employee added!" };

}