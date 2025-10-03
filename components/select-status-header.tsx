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

export function SelectStatusHeader({ status }: { status: string[] }) {
  return (
    <Select>
      <SelectTrigger className="w-fit text-sm font-nunito font-bold cursor-pointer flex items-start h-full">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent className="bg-[#262626] border-2 border-[#404040]">
        <SelectGroup>
          <SelectLabel className="text-sm font-nunito">Status</SelectLabel>
          {status.map((status) => (
            <SelectItem
              className="text-sm font-nunito cursor-pointer"
              key={status}
              value={status}
            >
              {status}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
