import { Button } from "./ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { HeaderButton } from "./header-button";
import { Waypoints, Eye } from "lucide-react";
import Image from "next/image";

export function FiltersHeader() {
  return (
    <div className="flex items-center justify-between h-32 px-4">
      <div>
        <div className="flex flex-row items-center gap-3">
          <SidebarTrigger className="text-white w-8 h-8" />
          <div className="w-[2px] h-10 bg-[#262626]" />
          <h2 className="text-lg font-semibold">Distance (Combobox)</h2>
          <h2 className="text-lg font-semibold">Classes (Dropdown)</h2>
        </div>
        <h2 className="text-lg font-semibold">Classes (Button with X)</h2>
      </div>

      <div className="flex flex-row justify-between items-center gap-5">
        <HeaderButton
          mode="filled"
          buttonIcon={<Waypoints />}
          text="Planejar Rota"
        />
        {/* <HeaderButton
          mode="outlined"
          buttonIcon={
            <Image width={24} height={24} src="/eye.png" alt="Eye Icon" />
          }
        />
        <HeaderButton mode="maps" /> */}
      </div>
    </div>
  );
}
