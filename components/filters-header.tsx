"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { HeaderButton } from "./header-button";
import { Waypoints, MoveRight, X } from "lucide-react";
import { SelectDistanceHeader } from "./select-distance-header";
import { SelectClassHeader } from "./select-class-header";
import { SelectedClasses } from "./selected-classes";
import Image from "next/image";

const ALL_CLASSES = [
  { value: "class1", label: "Classe 1" },
  { value: "class2", label: "Classe 2" },
  { value: "class3", label: "Classe 3" },
  { value: "class4", label: "Classe 4" },
  { value: "class5", label: "Classe 5" },
];

export function FiltersHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPlanning = searchParams.get("planning") === "true";
  const isCalculating = searchParams.get("calculating") === "true";

  const [selectedClasses, setSelectedClasses] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectKey, setSelectKey] = useState(Date.now());

  const handlePlanningToggle = () => {
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
  };

  const handleCalculateRoute = () => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("calculating", "true");
    current.delete("planning");

    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`/private${query}`);

    console.log("Calculating route...");
  };
  const handleAddClass = (classValue: string) => {
    if (selectedClasses.some((c) => c.value === classValue)) {
      return;
    }
    const classToAdd = ALL_CLASSES.find((c) => c.value === classValue);
    if (classToAdd) {
      setSelectedClasses([...selectedClasses, classToAdd]);
      setSelectKey(Date.now());
    }
  };

  const handleRemoveClass = (classValue: string) => {
    if (selectedClasses.length === 1) {
      setSelectKey(Date.now());
    }
    setSelectedClasses(selectedClasses.filter((c) => c.value !== classValue));
  };

  const handleClearAllClasses = () => {
    setSelectedClasses([]);
    setSelectKey(Date.now());
  };

  return (
    <div className="flex flex-row sm:flex-row sm:items-center justify-between min-h-28 sm:min-h-24 px-2 sm:px-4 py-3">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-start sm:items-center gap-3 mb-0">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="text-white w-5 h-5 sm:w-8 sm:h-8" />
            <div className="w-[2px] h-6 sm:h-10 bg-[#262626]" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-start gap-3 flex-1 mb-0 [&>*]:mb-0">
            <div className="flex flex-col md:items-start gap-3 flex-1">
              <SelectClassHeader
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
            <SelectDistanceHeader />
          </div>
        </div>
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
                onClick={() => console.log("Opening Google Maps...")}
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
