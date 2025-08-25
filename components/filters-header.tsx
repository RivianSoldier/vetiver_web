"use client";

import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { HeaderButton } from "./header-button";
import { Waypoints } from "lucide-react";
import { SelectHeader } from "./select-distance-header";
import { SelectClassHeader } from "./select-class-header";
import { SelectedClasses } from "./selected-classes";

const ALL_CLASSES = [
  { value: "class1", label: "Classe 1" },
  { value: "class2", label: "Classe 2" },
  { value: "class3", label: "Classe 3" },
  { value: "class4", label: "Classe 4" },
  { value: "class5", label: "Classe 5" },
];

export function FiltersHeader() {
  const [selectedClasses, setSelectedClasses] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectKey, setSelectKey] = useState(Date.now());

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
    <div className="flex items-center justify-between h-32 px-4">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center gap-3">
          <SidebarTrigger className="text-white w-8 h-8" />
          <div className="w-[2px] h-10 bg-[#262626]" />

          <SelectHeader />
          <SelectClassHeader
            key={selectKey}
            onClassSelect={handleAddClass}
            selectedClasses={selectedClasses}
          />
        </div>

        <div className="flex flex-row items-center gap-2 flex-wrap">
          <SelectedClasses
            selectedClasses={selectedClasses}
            onRemoveClass={handleRemoveClass}
            onClearAll={handleClearAllClasses}
          />
        </div>
      </div>
      <div className="flex flex-row justify-between items-center gap-5">
        <HeaderButton
          mode="filled"
          buttonIcon={<Waypoints />}
          text="Planejar Rota"
        />
        {/* <HeaderButton
          mode="outlined"
          buttonIcon={
            <Image width={24} height={24} src="/eye.png" alt="Eye Icon" />
          }
        />
        <HeaderButton mode="maps" /> */}
      </div>
    </div>
  );
}
