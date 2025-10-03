"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { HeaderButton } from "./header-button";
import { Waypoints, MoveRight, X, Filter } from "lucide-react";
import { SelectDistanceHeader } from "./select-distance-header";
import { SelectClassHeader } from "./select-class-header";
import { SelectedClasses } from "./selected-classes";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import Image from "next/image";
import { routesService } from "@/services/routesService";

const ALL_CLASSES = [
  { value: "class1", label: "Classe 1" },
  { value: "class2", label: "Classe 2" },
  { value: "class3", label: "Classe 3" },
  { value: "class4", label: "Classe 4" },
  { value: "class5", label: "Classe 5" },
];

// Marker data - should match the data in map.tsx
const MARKER_DATA = [
  {
    id: 0,
    lat: -23.647336,
    lng: -46.575399,
    name: "Test Marker",
  },
  {
    id: 1,
    lat: -23.647336,
    lng: -46.575399,
    name: "Marker 1",
  },
  {
    id: 2,
    lat: -23.645876,
    lng: -46.570875,
    name: "Marker 2",
  },
];

export function FiltersHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();
  const isPlanning = searchParams.get("planning") === "true";
  const isCalculating = searchParams.get("calculating") === "true";

  // Memoize mapped classes to prevent recreation on every render
  const mappedClasses = useMemo(
    () =>
      (ALL_CLASSES ?? []).map((c) => ({
        value: c.value,
        label: c.label,
      })),
    []
  );

  const [selectedClasses, setSelectedClasses] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectKey, setSelectKey] = useState(Date.now());
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const handlePlanningToggle = useCallback(() => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    if (isPlanning || isCalculating) {
      current.delete("planning");
      current.delete("calculating");
    } else {
      current.set("planning", "true");
    }

    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`/private${query}`);
  }, [searchParams, isPlanning, isCalculating, router]);

  const handleCalculateRoute = useCallback(() => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("calculating", "true");
    current.delete("planning");

    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`/private${query}`);

    console.log("Calculating route...");
  }, [searchParams, router]);

  const handleOpenGoogleMaps = useCallback(() => {
    const markersParam = searchParams.get("markers");
    if (!markersParam) {
      console.warn("No markers selected for route");
      return;
    }

    // Get selected marker IDs
    const markerIds = markersParam
      .split(",")
      .map((id) => parseInt(id))
      .filter((id) => !isNaN(id));

    if (markerIds.length === 0) {
      console.warn("No valid markers selected");
      return;
    }

    // Get coordinates for selected markers
    const selectedWaypoints = markerIds
      .map((id) => {
        const marker = MARKER_DATA.find((m) => m.id === id);
        return marker ? { lat: marker.lat, lng: marker.lng } : null;
      })
      .filter(Boolean) as Array<{ lat: number; lng: number }>;

    if (selectedWaypoints.length === 0) {
      console.warn("No valid waypoint coordinates found");
      return;
    }

    // For Google Maps URL, we'll use current location as origin
    // and create a route through all selected waypoints
    const destination = selectedWaypoints[selectedWaypoints.length - 1];
    const intermediateWaypoints = selectedWaypoints.slice(0, -1);

    // Create Google Maps URL using the routesService method
    const mapsUrl = routesService.createGoogleMapsUrl({
      origin: { lat: 0, lng: 0 }, // Will be replaced with "Your+Location" in the URL
      destination,
      waypoints: intermediateWaypoints,
    });

    // Replace the origin coordinates with current location placeholder
    const finalUrl = mapsUrl.replace("0,0", "Your+Location");

    window.open(finalUrl, "_blank");
  }, [searchParams]);

  const handleAddClass = useCallback(
    (classValue: string) => {
      if (selectedClasses.some((c) => c.value === classValue)) {
        return;
      }
      const classToAdd = ALL_CLASSES.find((c) => c.value === classValue);
      if (classToAdd) {
        setSelectedClasses([...selectedClasses, classToAdd]);
        setSelectKey(Date.now());
      }
    },
    [selectedClasses]
  );

  const handleRemoveClass = useCallback(
    (classValue: string) => {
      if (selectedClasses.length === 1) {
        setSelectKey(Date.now());
      }
      setSelectedClasses(selectedClasses.filter((c) => c.value !== classValue));
    },
    [selectedClasses]
  );

  const handleClearAllClasses = useCallback(() => {
    setSelectedClasses([]);
    setSelectKey(Date.now());
  }, []);

  // Mobile Filter Content Component
  const MobileFiltersContent = useMemo(
    () => (
      <div className="flex flex-col gap-4 p-6 pt-0">
        <div>
          <h3 className="text-white font-poppins font-semibold text-md mb-4">
            Distância
          </h3>
          <SelectDistanceHeader />
        </div>
        <div>
          <h3 className="text-white font-poppins font-semibold text-md mb-4">
            Classes
          </h3>
          <SelectClassHeader
            classes={mappedClasses}
            key={selectKey}
            onClassSelect={handleAddClass}
            selectedClasses={selectedClasses}
          />
          {selectedClasses.length > 0 && (
            <div className="mt-4">
              <SelectedClasses
                selectedClasses={selectedClasses}
                onRemoveClass={handleRemoveClass}
                onClearAll={handleClearAllClasses}
              />
            </div>
          )}
        </div>
      </div>
    ),
    [
      selectKey,
      handleAddClass,
      selectedClasses,
      handleRemoveClass,
      handleClearAllClasses,
    ]
  );

  return (
    <div className="flex flex-row items-center justify-between min-h-24 px-2 sm:px-4 py-3 bg-[#0d0d0d]">
      <div className="flex flex-row items-center gap-3">
        <SidebarTrigger className="text-white w-5 h-5 sm:w-8 sm:h-8" />
        <div className="w-[2px] h-6 sm:h-10 bg-[#262626]" />

        {isMobile ? (
          // Mobile: Sheet with filter button
          <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <SheetTrigger asChild>
              <button className="flex items-center gap-2 text-white font-nunito text-sm bg-[#262626] px-3 py-2 rounded-md hover:bg-[#333333] transition-colors">
                <Filter size={16} />
                Filtros
                {selectedClasses.length > 0 && (
                  <span className="bg-[#008D80] text-white text-xs px-2 py-1 rounded-full">
                    {selectedClasses.length}
                  </span>
                )}
              </button>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="bg-[#0d0d0d] border-t border-[#262626]"
            >
              <SheetHeader className="pl-6 pb-4">
                <SheetTitle className="text-white font-poppins text-md">
                  Filtros
                </SheetTitle>
                <SheetDescription className="text-[#a6a6a6]">
                  Configure os filtros de busca
                </SheetDescription>
              </SheetHeader>
              {MobileFiltersContent}
            </SheetContent>
          </Sheet>
        ) : (
          // Desktop: Current layout
          <div className="flex flex-row items-start gap-3 flex-1">
            <div className="flex flex-col md:items-start gap-3 flex-1">
              <SelectClassHeader
                classes={mappedClasses}
                key={selectKey}
                onClassSelect={handleAddClass}
                selectedClasses={selectedClasses}
              />
              {selectedClasses.length > 0 && (
                <div className="flex flex-row items-center flex-wrap">
                  <SelectedClasses
                    selectedClasses={selectedClasses}
                    onRemoveClass={handleRemoveClass}
                    onClearAll={handleClearAllClasses}
                  />
                </div>
              )}
            </div>
            <div className="flex flex-col items-start">
              <SelectDistanceHeader />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col justify-start items-end gap-2 mt-0 sm:gap-3">
        <div className="flex gap-2 max-w-full">
          {isCalculating ? (
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <HeaderButton
                mode="outlined"
                buttonIcon={
                  <Image
                    width={24}
                    height={24}
                    src="/X.png"
                    alt="Cancel Icon"
                  />
                }
                text="Cancelar"
                onClick={handlePlanningToggle}
              />
              <HeaderButton
                mode="maps"
                text="Ver rota no Maps"
                onClick={handleOpenGoogleMaps}
              />
            </div>
          ) : isPlanning ? (
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <HeaderButton
                mode="outlined"
                buttonIcon={
                  <Image width={24} height={24} src="/eye.png" alt="Eye Icon" />
                }
                text="Mapa"
                onClick={handlePlanningToggle}
              />
              <HeaderButton
                mode="filled"
                buttonIcon={<MoveRight />}
                text="Calcular Rota"
                onClick={handleCalculateRoute}
              />
            </div>
          ) : (
            <HeaderButton
              mode="filled"
              buttonIcon={<Waypoints />}
              text="Planejar Rota"
              onClick={handlePlanningToggle}
            />
          )}
        </div>
      </div>
    </div>
  );
}
