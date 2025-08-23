import { redirect } from "next/navigation";
import SignOut from "./signout";

import { createClient } from "@/utils/supabase/server";

export default async function PrivatePage() {
  const supabase = await createClient();

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log("Error signing out:", error.message);
    } else {
      redirect("/login");
    }
  }

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <div>
      <p>Hello {data.user.email}</p>
      <SignOut></SignOut>
    </div>
  );
}
