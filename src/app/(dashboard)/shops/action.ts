"use server"

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { validateAdminPassword, validateShopName } from "@/lib/validators/shop";


export async function deleteShopAction(id:string) {
    const supabase = await createClient();
    const {error} = await supabase.from("shops").delete().eq("id", id);
    
    if(error) throw new Error(error.message);

    revalidatePath("/shops");
}

export async function CreateShopAction(formData: FormData){
    const supabase = await createClient();

    const {data : {user}} = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const rawName = formData.get("name") as string;
    const rawPassword = formData.get("password") as string;


    const trimmedName = rawName.trim();
  
    const nameV = await validateShopName(trimmedName); 
    const passV = await validateAdminPassword(rawPassword);

    if (!nameV.ok) return { message: nameV.message };
    if (!passV.ok) return { message: passV.message };

    const { error } = await supabase.from("shops").insert({
        name: nameV.value,
        admin_password: passV.value,
        owner_id: user.id,
    });

    if (error) return { message: error.message };
    revalidatePath("/shops");
    return { success: true, message: "Shop created!" };
}
export type ActionState = {
  success?: boolean;
  message?: string;
} | null;
export async function UpdateShopAction(id: string, formData: FormData): Promise<ActionState> {

    const supabase = await createClient();

    const rawName = formData.get("name") as string;
    const rawPassword = formData.get("password") as string;


    const trimmedName = rawName.trim();
  
    const nameV = await validateShopName(trimmedName); 
    const passV = await validateAdminPassword(rawPassword);
    if (!nameV.ok) return { message: nameV.message }; 
    if (!passV.ok) return { message: passV.message };

    const { error } = await supabase
        .from("shops")
        .update({
            name: nameV.value,
            admin_password: passV.value,
        })
        .eq("id", id); 

    if (error) throw new Error(error.message);
    revalidatePath("/shops");
    return { success: true, message: "Shop updated!" };
}