import { Button } from "@/components/ui/button";
import Image from "next/image";

export function HeaderButton({
  mode,
  buttonIcon = null,
  text,
  onClick,
}: {
  mode: "filled" | "outlined" | "maps" | "outlined-red";
  buttonIcon?: React.ReactNode;
  text: string;
  onClick?: () => void;
}) {
  return (
    <>
      {mode === "filled" && (
        <Button
          onClick={onClick}
          className="text-black h-10 rounded-sm font-nunito font-bold text-sm bg-gradient-to-r from-[#008D80] to-[#45BF55] cursor-pointer hover:brightness-110"
        >
          {buttonIcon} {text}
        </Button>
      )}

      {mode === "outlined" && (
        <div className="rounded-sm h-10 bg-gradient-to-r from-[#008D80] to-[#45BF55] p-[2px]">
          <Button
            onClick={onClick}
            className="w-full bg-[#0d0d0d] rounded-sm hover:bg-[#262626] hover:brightness-105 cursor-pointer"
          >
            <span className="flex items-center gap-2 bg-gradient-to-r from-[#008D80] to-[#45BF55] bg-clip-text text-transparent font-nunito font-bold text-sm">
              {buttonIcon} {text}
            </span>
          </Button>
        </div>
      )}

      {mode === "outlined-red" && (
        <div className="rounded-sm h-10 bg-gradient-to-r from-[#F22742] to-[#FF576D] p-[2px]">
          <Button
            onClick={onClick}
            className="w-full bg-[#262626] rounded-sm hover:bg-[#262626] hover:brightness-105 cursor-pointer"
          >
            <span className="flex items-center gap-2 bg-gradient-to-r from-[#F22742] to-[#FF576D] bg-clip-text text-transparent font-nunito font-bold text-sm">
              {buttonIcon} {text}
            </span>
          </Button>
        </div>
      )}

      {mode === "maps" && (
        <Button
          onClick={onClick}
          className="text-black h-10 bg-white rounded-sm font-nunito font-bold text-sm cursor-pointer"
        >
          <Image width={24} height={24} src="/google_maps.png" alt="Map Icon" />
          Ver rota no Maps
        </Button>
      )}
    </>
  );
}
