import { redirect } from "next/navigation";
import SignOut from "./signout";

import { createClient } from "@/utils/supabase/server";

export default async function PrivatePage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <div>
      <p className="text-white">Hello {data.user.email}</p>
      <SignOut></SignOut>
    </div>
  );
}
