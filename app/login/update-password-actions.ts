"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    redirect("/login/reset-password?error=All fields are required");
  }

  if (password !== confirmPassword) {
    redirect("/login/reset-password?error=Passwords do not match");
  }

  if (password.length < 6) {
    redirect(
      "/login/reset-password?error=Password must be at least 6 characters"
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    redirect(
      `/login/reset-password?error=${encodeURIComponent(error.message)}`
    );
  }

  redirect("/login?success=password-updated");
}
