import { redirect } from "next/navigation";
import SignOut from "./signout";
import { FiltersHeader } from "@/components/filters-header";
import { createClient } from "@/utils/supabase/server";

export default async function PrivatePage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <>
      <FiltersHeader />
      <div className="bg-[#262626] flex h-screen"></div>
    </>
  );
}
