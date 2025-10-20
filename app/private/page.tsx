import { redirect } from "next/navigation";
import { FiltersHeader } from "@/components/filters-header";
import { createClient } from "@/utils/supabase/server";
import MapComponent from "./map";
import { detectionsService } from "@/services/detectionsService";

export default async function PrivatePage({
  searchParams,
}: {
  searchParams: Promise<{
    planning?: string;
    calculating?: string;
    classes?: string;
    distance?: string;
  }>;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  const resolvedSearchParams = await searchParams;
  const isPlanning = resolvedSearchParams.planning === "true";
  const isCalculating = resolvedSearchParams.calculating === "true";

  const showCheckboxes = isPlanning && !isCalculating;

  const allDetections = await detectionsService.getDetectionsByStatus(
    "A coletar"
  );

  const selectedClasses =
    resolvedSearchParams.classes?.split(",").filter(Boolean) || [];

  const filteredDetections =
    selectedClasses.length > 0
      ? allDetections.filter((detection) =>
          detection.classes.some(
            (classItem) =>
              selectedClasses.includes(classItem.nome) &&
              classItem.quantidade > 0
          )
        )
      : allDetections;

  return (
    <div className="h-screen flex flex-col">
      <FiltersHeader
        detections={allDetections}
        filteredDetections={filteredDetections}
      />
      <div className="bg-[#262626] flex flex-1">
        <MapComponent
          isCheckbox={showCheckboxes}
          planejar={isCalculating}
          detections={filteredDetections}
          distanceFilter={resolvedSearchParams.distance}
        />
      </div>
    </div>
  );
}
