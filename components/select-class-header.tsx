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
import { Spinner } from "@/components/ui/spinner";

interface SelectClassHeaderProps {
  classes: { value: string; label: string }[];
  onClassSelect: (value: string) => void;
  selectedClasses: { value: string; label: string }[];
  loading?: boolean;
}

export function SelectClassHeader({
  classes,
  onClassSelect,
  selectedClasses,
  loading = false,
}: SelectClassHeaderProps) {
  return (
    <Select onValueChange={onClassSelect} disabled={loading}>
      <SelectTrigger className="text-sm font-nunito font-bold cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed">
        {loading ? (
          <Spinner className="text-[#008D80]" />
        ) : (
          <SelectValue placeholder="Classe" />
        )}
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
