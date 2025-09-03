"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const classes = [
  { value: "class1", label: "Classe 1" },
  { value: "class2", label: "Classe 2" },
  { value: "class3", label: "Classe 3" },
  { value: "class4", label: "Classe 4" },
  { value: "class5", label: "Classe 5" },
];

interface SelectClassHeaderProps {
  classes: { value: string; label: string }[];
  onClassSelect: (value: string) => void;
  selectedClasses: { value: string; label: string }[];
}

export function SelectClassHeader({
  classes,
  onClassSelect,
  selectedClasses,
}: SelectClassHeaderProps) {
  return (
    <Select onValueChange={onClassSelect}>
      <SelectTrigger className="text-sm font-nunito font-bold cursor-pointer">
        <SelectValue placeholder="Classe" />
      </SelectTrigger>
      <SelectContent className="bg-[#262626] border-2 border-[#404040]">
        <SelectGroup>
          <SelectLabel className="text-sm font-nunito">Classes</SelectLabel>
          {classes.map((classe) => (
            <SelectItem
              className="text-sm font-nunito cursor-pointer"
              key={classe.value}
              value={classe.value}
              disabled={selectedClasses.some(
                (selected) => selected.value === classe.value
              )}
            >
              {classe.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
