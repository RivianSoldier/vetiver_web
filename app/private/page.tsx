import { redirect } from "next/navigation";
import SignOut from "./signout";
import { FiltersHeader } from "@/components/filters-header";
import { createClient } from "@/utils/supabase/server";
import MapComponent from "./map";

export default async function PrivatePage({
  searchParams,
}: {
  searchParams: { planning?: string; calculating?: string };
}) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  const isPlanning = searchParams.planning === "true";
  const isCalculating = searchParams.calculating === "true";

  // Only show checkboxes when in planning mode (not calculating)
  const showCheckboxes = isPlanning && !isCalculating;

  return (
    <div className="h-screen flex flex-col">
      <FiltersHeader />
      <div className="bg-[#262626] flex flex-1">
        <MapComponent planejar={showCheckboxes} />
      </div>
    </div>
  );
}
