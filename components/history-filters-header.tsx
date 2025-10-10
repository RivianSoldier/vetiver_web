"use client";

import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { HeaderButton } from "./header-button";
import { ArrowDownToLine } from "lucide-react";
import { SelectStatusHeader } from "./select-status-header";
import { SelectClassHeader } from "./select-class-header";
import { SelectedClasses } from "./selected-classes";

export function HistoryFiltersHeader({
  classes,
  status,
}: {
  classes?: string[];
  status?: string[];
}) {
  const [selectedClasses, setSelectedClasses] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectKey, setSelectKey] = useState(Date.now());

  const handleAddClass = (classValue: string) => {
    if (selectedClasses.some((c) => c.value === classValue)) {
      return;
    }
    const classToAdd = classes?.find((c) => c === classValue);
    if (classToAdd) {
      setSelectedClasses([
        ...selectedClasses,
        { value: classToAdd, label: classToAdd },
      ]);
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
    <div className="flex flex-row sm:flex-row sm:items-center justify-between min-h-28 sm:min-h-24 px-2 sm:px-4 py-3 bg-[#0d0d0d]">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-start sm:items-center gap-3 mb-0">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="text-white w-5 h-5 sm:w-8 sm:h-8" />
            <div className="w-[2px] h-6 sm:h-10 bg-[#262626]" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-start gap-3 flex-1 mb-0 [&>*]:mb-0">
            <div className="flex flex-col md:items-start gap-3 flex-1">
              <SelectClassHeader
                classes={(classes ?? []).map((c) => ({ value: c, label: c }))}
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
            <SelectStatusHeader status={status ?? []} />
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-start items-end gap-2 mt-0 sm:gap-3">
        <div className="flex gap-2 max-w-full">
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <HeaderButton
              mode="outlined"
              buttonIcon={
                <ArrowDownToLine className="w-6 h-6 text-[#008D80] " />
              }
              text="Meu histórico"
            />
            <HeaderButton
              mode="outlined"
              buttonIcon={
                <ArrowDownToLine className="w-6 h-6 text-[#008D80]" />
              }
              text="Histórico completo"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
