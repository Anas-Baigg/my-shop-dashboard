"use server"
import bcrypt from 'bcrypt';

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
    const saltRounds = 10;
    const hashedAdminPassword = await bcrypt.hash(passV.value.toString(),saltRounds);
    const { error } = await supabase.from("shops").insert({
        name: nameV.value,
        admin_password: hashedAdminPassword,
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
    if (!nameV.ok) return { message: nameV.message }; 

    const updateData: any = {
        name: nameV.value,
    };

    if (rawPassword && rawPassword.length > 0) {
        const passV = await validateAdminPassword(rawPassword);
        if (!passV.ok) return { message: passV.message };

        const saltRounds = 10;
        const hashedAdminPassword = await bcrypt.hash(passV.value.toString(), saltRounds);
 
        updateData.admin_password_hash = hashedAdminPassword;
    }

    const { error } = await supabase
        .from("shops")
        .update(updateData)
        .eq("id", id);

    if (error) return { message: error.message };
    
    revalidatePath("/shops");
    return { success: true, message: "Shop updated successfully!" };
}