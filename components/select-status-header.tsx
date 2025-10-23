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

const statusOptions = [
  { value: "all", label: "Todos os status" },
  { value: "Coletado", label: "Coletado" },
  { value: "Não encontrado", label: "Não encontrado" },
];

interface SelectStatusHeaderProps {
  value?: string;
  onValueChange?: (value: string) => void;
  loading?: boolean;
}

export function SelectStatusHeader({
  value,
  onValueChange,
  loading = false,
}: SelectStatusHeaderProps) {
  const handleValueChange = (newValue: string) => {
    if (newValue === "all") {
      onValueChange?.("");
    } else {
      onValueChange?.(newValue);
    }
  };

  return (
    <Select
      value={value || "all"}
      onValueChange={handleValueChange}
      disabled={loading}
    >
      <SelectTrigger className="w-full min-w-[180px] text-sm font-nunito font-bold cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed">
        {loading ? (
          <Spinner className="text-[#008D80]" />
        ) : (
          <SelectValue placeholder="Status" />
        )}
      </SelectTrigger>
      <SelectContent className="bg-[#262626] border-2 border-[#404040]">
        <SelectGroup>
          <SelectLabel className="text-sm font-nunito">Status</SelectLabel>
          {statusOptions.map((statusItem) => (
            <SelectItem
              className="text-sm font-nunito cursor-pointer"
              key={statusItem.value}
              value={statusItem.value}
            >
              {statusItem.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
