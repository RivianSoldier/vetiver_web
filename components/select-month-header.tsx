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

interface SelectMonthHeaderProps {
  months: { value: string; label: string }[];
  onMonthSelect: (value: string) => void;
  selectedMonth: { value: string; label: string }[];
  loading?: boolean;
}

export function SelectMonthHeader({
  months,
  onMonthSelect,
  selectedMonth,
  loading = false,
}: SelectMonthHeaderProps) {
  return (
    <Select onValueChange={onMonthSelect} disabled={loading}>
      <SelectTrigger className="w-full min-w-[180px] text-sm font-nunito font-bold cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed">
        {loading ? (
          <Spinner className="text-[#008D80]" />
        ) : (
          <SelectValue placeholder="Mês" />
        )}
      </SelectTrigger>
      <SelectContent className="bg-[#262626] border-2 border-[#404040]">
        <SelectGroup>
          <SelectLabel className="text-sm font-nunito">Mês</SelectLabel>
          {months.map((monthItem) => (
            <SelectItem
              className="text-sm font-nunito cursor-pointer"
              key={monthItem.value}
              value={monthItem.value}
              disabled={selectedMonth.some(
                (selected) => selected.value === monthItem.value
              )}
            >
              {monthItem.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
