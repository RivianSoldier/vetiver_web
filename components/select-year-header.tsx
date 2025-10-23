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
import { Spinner } from "./ui/spinner";

interface SelectYearHeaderProps {
  years: { value: string; label: string }[];
  onYearSelect: (value: string) => void;
  selectedYear: { value: string; label: string }[];
  loading?: boolean;
}

export function SelectYearHeader({
  years,
  onYearSelect,
  selectedYear,
  loading = false,
}: SelectYearHeaderProps) {
  return (
    <Select onValueChange={onYearSelect} disabled={loading}>
      <SelectTrigger className="w-full min-w-[180px] text-sm font-nunito font-bold cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed">
        {loading ? (
          <Spinner className="text-[#008D80]" />
        ) : (
          <SelectValue placeholder="Ano" />
        )}
      </SelectTrigger>
      <SelectContent className="bg-[#262626] border-2 border-[#404040]">
        <SelectGroup>
          <SelectLabel className="text-sm font-nunito">Ano</SelectLabel>
          {years.map((yearItem) => (
            <SelectItem
              className="text-sm font-nunito cursor-pointer"
              key={yearItem.value}
              value={yearItem.value}
              disabled={selectedYear.some(
                (selected) => selected.value === yearItem.value
              )}
            >
              {yearItem.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
