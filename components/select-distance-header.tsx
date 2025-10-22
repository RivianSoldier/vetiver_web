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

const distancias = [
  { value: "all", label: "Todas as distâncias" },
  { value: "5", label: "Até 5 km" },
  { value: "10", label: "Até 10 km" },
  { value: "20", label: "Até 20 km" },
  { value: "50", label: "Até 50 km" },
  { value: "100", label: "Até 100 km" },
];

interface SelectDistanceHeaderProps {
  value?: string;
  onValueChange?: (value: string) => void;
  loading?: boolean;
}

export function SelectDistanceHeader({
  value,
  onValueChange,
  loading = false,
}: SelectDistanceHeaderProps) {
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
      <SelectTrigger className="w-fit text-sm font-nunito font-bold cursor-pointer flex items-start h-full disabled:opacity-70 disabled:cursor-not-allowed">
        {loading ? (
          <Spinner className="text-[#008D80]" />
        ) : (
          <SelectValue placeholder="Distância" />
        )}
      </SelectTrigger>
      <SelectContent className="bg-[#262626] border-2 border-[#404040]">
        <SelectGroup>
          <SelectLabel className="text-sm font-nunito">Distâncias</SelectLabel>
          {distancias.map((distancia) => (
            <SelectItem
              className="text-sm font-nunito cursor-pointer"
              key={distancia.value}
              value={distancia.value}
            >
              {distancia.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
