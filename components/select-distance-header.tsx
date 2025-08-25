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

const distancias = [
  { value: "0-5", label: "0-5 km" },
  { value: "5-10", label: "5-10 km" },
  { value: "10-20", label: "10-20 km" },
  { value: "20-50", label: "20-50 km" },
  { value: "50+", label: "50+ km" },
];

export function SelectHeader() {
  return (
    <Select>
      <SelectTrigger className="w-[180px] text-sm font-nunito font-bold cursor-pointer">
        <SelectValue placeholder="Distância (Km)" />
      </SelectTrigger>
      <SelectContent className="bg-[#262626] border-2 border-[#24A769]">
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
