import { redirect } from "next/navigation";
import { FiltersHeader } from "@/components/filters-header";
import { createClient } from "@/utils/supabase/server";
import MapComponent from "./map";
import { detectionsService } from "@/services/detectionsService";

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

  const resolvedSearchParams = searchParams;
  const isPlanning = resolvedSearchParams.planning === "true";
  const isCalculating = resolvedSearchParams.calculating === "true";

  const showCheckboxes = isPlanning && !isCalculating;

  const detections = await detectionsService.getDetectionsByStatus("A coletar");

  return (
    <div className="h-screen flex flex-col">
      <FiltersHeader detections={detections} />
      <div className="bg-[#262626] flex flex-1">
        <MapComponent
          isCheckbox={showCheckboxes}
          planejar={isCalculating}
          detections={detections}
        />
      </div>
    </div>
  );
}
