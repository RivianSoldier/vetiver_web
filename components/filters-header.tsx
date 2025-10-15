"use client";

import {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useTransition,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { HeaderButton } from "./header-button";
import { Waypoints, MoveRight, Filter } from "lucide-react";
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
import { Detection } from "@/services/detectionsService";

interface FiltersHeaderProps {
  detections?: Detection[];
}

export function FiltersHeader({ detections = [] }: FiltersHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();
  const isPlanning = searchParams.get("planning") === "true";
  const isCalculating = searchParams.get("calculating") === "true";

  const [isPlanningPending, startPlanningTransition] = useTransition();
  const [isCalculatingPending, startCalculatingTransition] = useTransition();
  const [isFilterPending, startFilterTransition] = useTransition();

  const mappedClasses = useMemo(() => {
    const classesSet = new Set<string>();
    detections.forEach((detection) => {
      detection.classes.forEach((classItem) => {
        if (classItem.quantidade > 0) {
          classesSet.add(classItem.nome);
        }
      });
    });
    return Array.from(classesSet).map((className) => ({
      value: className,
      label: className.charAt(0).toUpperCase() + className.slice(1),
    }));
  }, [detections]);

  const [selectKey, setSelectKey] = useState(Date.now());
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const initialSelectedClasses = useMemo(() => {
    const classesParam = searchParams.get("classes");
    if (!classesParam) return [];
    const classValues = classesParam.split(",");
    return mappedClasses.filter((c) => classValues.includes(c.value));
  }, [searchParams, mappedClasses]);

  const [selectedClasses, setSelectedClasses] = useState<
    { value: string; label: string }[]
  >(initialSelectedClasses);

  const selectedDistance = searchParams.get("distance") || undefined;

  useEffect(() => {
    setSelectedClasses(initialSelectedClasses);
  }, [initialSelectedClasses]);

  const handleDistanceChange = useCallback(
    (distance: string) => {
      startFilterTransition(() => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        if (distance) {
          current.set("distance", distance);
        } else {
          current.delete("distance");
        }
        const search = current.toString();
        const query = search ? `?${search}` : "";
        router.replace(`/private${query}`);
      });
    },
    [searchParams, router, startFilterTransition]
  );

  const handlePlanningToggle = useCallback(() => {
    startPlanningTransition(() => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      if (isPlanning || isCalculating) {
        current.delete("planning");
        current.delete("calculating");
      } else {
        current.set("planning", "true");
        router.refresh();
      }

      const search = current.toString();
      const query = search ? `?${search}` : "";
      router.push(`/private${query}`);
    });
  }, [
    searchParams,
    isPlanning,
    isCalculating,
    router,
    startPlanningTransition,
  ]);

  const handleCalculateRoute = useCallback(() => {
    startCalculatingTransition(() => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.set("calculating", "true");
      current.delete("planning");

      const search = current.toString();
      const query = search ? `?${search}` : "";
      router.push(`/private${query}`);
    });
  }, [searchParams, router, startCalculatingTransition]);

  const handleOpenGoogleMaps = useCallback(() => {
    const markersParam = searchParams.get("markers");
    if (!markersParam) {
      return;
    }

    const markerIds = markersParam.split(",");

    if (markerIds.length === 0) {
      return;
    }

    const selectedWaypoints = markerIds
      .map((id) => {
        const marker = detections.find((m) => m.id === id);
        return marker ? { lat: marker.lat, lng: marker.lng } : null;
      })
      .filter(Boolean) as Array<{ lat: number; lng: number }>;

    if (selectedWaypoints.length === 0) {
      return;
    }

    const destination = selectedWaypoints[selectedWaypoints.length - 1];
    const intermediateWaypoints = selectedWaypoints.slice(0, -1);

    const mapsUrl = routesService.createGoogleMapsUrl({
      origin: { lat: 0, lng: 0 },
      destination,
      waypoints: intermediateWaypoints,
    });

    const finalUrl = mapsUrl.replace("0,0", "Your+Location");

    window.open(finalUrl, "_blank");
  }, [searchParams, detections]);

  const handleAddClass = useCallback(
    (classValue: string) => {
      if (selectedClasses.some((c) => c.value === classValue)) {
        return;
      }
      const classToAdd = mappedClasses.find((c) => c.value === classValue);
      if (classToAdd) {
        const newSelectedClasses = [...selectedClasses, classToAdd];
        setSelectedClasses(newSelectedClasses);
        setSelectKey(Date.now());

        startFilterTransition(() => {
          const current = new URLSearchParams(
            Array.from(searchParams.entries())
          );
          current.set(
            "classes",
            newSelectedClasses.map((c) => c.value).join(",")
          );
          const search = current.toString();
          const query = search ? `?${search}` : "";
          router.replace(`/private${query}`);
        });
      }
    },
    [
      selectedClasses,
      mappedClasses,
      searchParams,
      router,
      startFilterTransition,
    ]
  );

  const handleRemoveClass = useCallback(
    (classValue: string) => {
      if (selectedClasses.length === 1) {
        setSelectKey(Date.now());
      }
      const newSelectedClasses = selectedClasses.filter(
        (c) => c.value !== classValue
      );
      setSelectedClasses(newSelectedClasses);

      startFilterTransition(() => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        if (newSelectedClasses.length > 0) {
          current.set(
            "classes",
            newSelectedClasses.map((c) => c.value).join(",")
          );
        } else {
          current.delete("classes");
        }
        const search = current.toString();
        const query = search ? `?${search}` : "";
        router.replace(`/private${query}`);
      });
    },
    [selectedClasses, searchParams, router, startFilterTransition]
  );

  const handleClearAllClasses = useCallback(() => {
    setSelectedClasses([]);
    setSelectKey(Date.now());

    startFilterTransition(() => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.delete("classes");
      const search = current.toString();
      const query = search ? `?${search}` : "";
      router.replace(`/private${query}`);
    });
  }, [searchParams, router, startFilterTransition]);

  // Mobile Filter Content Component
  const MobileFiltersContent = useMemo(
    () => (
      <div className="flex flex-col gap-4 p-6 pt-0">
        <div>
          <h3 className="text-white font-poppins font-semibold text-md mb-4">
            Distância
          </h3>
          <SelectDistanceHeader
            value={selectedDistance}
            onValueChange={handleDistanceChange}
            loading={isFilterPending}
          />
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
            loading={isFilterPending}
          />
          {selectedClasses.length > 0 && (
            <div className="mt-4">
              <SelectedClasses
                selectedClasses={selectedClasses}
                onRemoveClass={handleRemoveClass}
                onClearAll={handleClearAllClasses}
                loading={isFilterPending}
              />
            </div>
          )}
        </div>
      </div>
    ),
    [
      selectedDistance,
      handleDistanceChange,
      mappedClasses,
      selectKey,
      handleAddClass,
      selectedClasses,
      handleRemoveClass,
      handleClearAllClasses,
      isFilterPending,
    ]
  );

  return (
    <div className="flex flex-row items-center justify-between min-h-24 px-2 sm:px-4 py-3 bg-[#0d0d0d]">
      <div className="flex flex-row items-center gap-3">
        <SidebarTrigger className="text-white w-5 h-5 sm:w-8 sm:h-8" />
        <div className="w-[2px] h-6 sm:h-10 bg-[#262626]" />

        {isMobile ? (
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
          <div className="flex flex-row items-start gap-3 flex-1">
            <div className="flex flex-col md:items-start gap-3 flex-1">
              <SelectClassHeader
                classes={mappedClasses}
                key={selectKey}
                onClassSelect={handleAddClass}
                selectedClasses={selectedClasses}
                loading={isFilterPending}
              />
              {selectedClasses.length > 0 && (
                <div className="flex flex-row items-center flex-wrap">
                  <SelectedClasses
                    selectedClasses={selectedClasses}
                    onRemoveClass={handleRemoveClass}
                    onClearAll={handleClearAllClasses}
                    loading={isFilterPending}
                  />
                </div>
              )}
            </div>
            <div className="flex flex-col items-start">
              <SelectDistanceHeader
                value={selectedDistance}
                onValueChange={handleDistanceChange}
                loading={isFilterPending}
              />
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
                loading={isPlanningPending}
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
                loading={isPlanningPending}
              />
              <HeaderButton
                mode="filled"
                buttonIcon={<MoveRight />}
                text="Calcular Rota"
                onClick={handleCalculateRoute}
                loading={isCalculatingPending}
              />
            </div>
          ) : (
            <HeaderButton
              mode="filled"
              buttonIcon={<Waypoints />}
              text="Planejar Rota"
              onClick={handlePlanningToggle}
              loading={isPlanningPending}
            />
          )}
        </div>
      </div>
    </div>
  );
}
