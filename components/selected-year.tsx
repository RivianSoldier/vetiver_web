"use client";

import { X } from "lucide-react";

interface SelectedYearProps {
  year: { value: string; label: string };
  onRemove: () => void;
}

export function SelectedYear({ year, onRemove }: SelectedYearProps) {
  return (
    <div className="flex items-center justify-between gap-2 bg-transparent text-white text-sm font-nunito font-semibold rounded-sm px-2 py-1 border-2 border-[#262626] cursor-default">
      <span>{year.label}</span>
      <button
        onClick={onRemove}
        className="text-white"
        aria-label={`Remover ${year.label}`}
      >
        <X className="text-white size-4 transition-colors duration-200 cursor-pointer hover:text-[#F22742]" />
      </button>
    </div>
  );
}
