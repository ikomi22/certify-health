"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signIn(
  email: string,
  password: string
): Promise<{ error: string }> {
  const supabase = createClient();

  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({ email, password });

  if (authError || !authData.user) {
    return { error: "Invalid email or password" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", authData.user.id)
    .single();

  if (profile?.role === "admin") {
    redirect("/facility");
  }

  redirect("/dashboard");
}
