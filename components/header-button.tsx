import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import { useState } from "react";

export function HeaderButton({
  mode,
  buttonIcon = null,
  text,
  onClick,
  loading = false,
}: {
  mode: "filled" | "outlined" | "maps" | "outlined-red";
  buttonIcon?: React.ReactNode;
  text: string;
  onClick?: () => void | Promise<void>;
  loading?: boolean;
}) {
  const [internalLoading, setInternalLoading] = useState(false);

  const isLoading = loading || internalLoading;

  const handleClick = async () => {
    if (onClick) {
      setInternalLoading(true);
      try {
        const result = onClick() as void | Promise<void>;
        if (result && typeof result === "object" && "then" in result) {
          await result;
        } else {
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
      } finally {
        setInternalLoading(false);
      }
    }
  };
  return (
    <>
      {mode === "filled" && (
        <Button
          onClick={handleClick}
          disabled={isLoading}
          className="text-black h-10 rounded-sm font-nunito font-bold text-sm bg-gradient-to-r from-[#008D80] to-[#45BF55] cursor-pointer hover:brightness-110 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? <Spinner /> : buttonIcon} {text}
        </Button>
      )}

      {mode === "outlined" && (
        <div className="rounded-sm h-10 bg-gradient-to-r from-[#008D80] to-[#45BF55] p-[2px]">
          <Button
            onClick={handleClick}
            disabled={isLoading}
            className="w-full bg-[#0d0d0d] rounded-sm hover:bg-[#262626] hover:brightness-105 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span className="flex items-center gap-2 bg-gradient-to-r from-[#008D80] to-[#45BF55] bg-clip-text text-transparent font-nunito font-bold text-sm">
              {isLoading ? <Spinner className="text-[#008D80]" /> : buttonIcon}{" "}
              {text}
            </span>
          </Button>
        </div>
      )}

      {mode === "outlined-red" && (
        <div className="rounded-sm h-10 bg-gradient-to-r from-[#F22742] to-[#FF576D] p-[2px]">
          <Button
            onClick={handleClick}
            disabled={isLoading}
            className="w-full bg-[#262626] rounded-sm hover:bg-[#262626] hover:brightness-105 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span className="flex items-center gap-2 bg-gradient-to-r from-[#F22742] to-[#FF576D] bg-clip-text text-transparent font-nunito font-bold text-sm">
              {isLoading ? <Spinner className="text-[#F22742]" /> : buttonIcon}{" "}
              {text}
            </span>
          </Button>
        </div>
      )}

      {mode === "maps" && (
        <Button
          onClick={handleClick}
          disabled={isLoading}
          className="text-black h-10 bg-white rounded-sm font-nunito font-bold text-sm cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Spinner className="text-black" />
          ) : (
            <Image
              width={24}
              height={24}
              src="/google_maps.png"
              alt="Map Icon"
            />
          )}
          Ver rota no Maps
        </Button>
      )}
    </>
  );
}
