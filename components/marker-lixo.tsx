import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import Image from "next/image";
import { Checkbox } from "./ui/checkbox";
import { useState } from "react";

export function MarkerLixo({
  position,
  quantidade,
  planejar = false,
}: {
  position: google.maps.LatLngLiteral;
  quantidade: number;
  planejar?: boolean;
}) {
  const [showHoverCard, setShowHoverCard] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Add your click handler here
    console.log("Card clicked!");
  };

  return (
    <>
      <AdvancedMarker position={position}>
        <div
          className="relative cursor-pointer"
          onMouseEnter={() => setShowHoverCard(true)}
          onMouseLeave={() => setShowHoverCard(false)}
        >
          <div className="absolute top-[-12px] right-[-4px]">
            <div className="w-6 h-6 bg-[#0d0d0d] rounded-full flex justify-center items-center">
              <span className="bg-gradient-to-r from-[#008D80] to-[#45BF55] bg-clip-text text-transparent font-nunito font-bold text-sm">
                {quantidade}
              </span>
            </div>
          </div>
          <Image width={40} height={40} src="/marker.svg" alt="Marker Icon" />
          {planejar && (
            <div className="absolute w-5 h-5 bottom-[-8px] rounded-md right-[-4px] bg-[#0d0d0d] ">
              <Checkbox className="w-5 h-5 cursor-pointer" />
            </div>
          )}
        </div>
      </AdvancedMarker>

      {showHoverCard && (
        <AdvancedMarker position={position}>
          <div
            className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
            onMouseEnter={() => setShowHoverCard(true)}
            onMouseLeave={() => setShowHoverCard(false)}
          >
            <div className="bg-[#262626] rounded-md p-4 shadow-md min-w-48 relative cursor-pointer hover:bg-[#333333] transition-colors">
              <h3 className="font-bold text-white font-poppins mb-2">
                Informações
              </h3>
              <p className="text-white font-nunito text-sm">
                Quantidade: {quantidade}
              </p>
              {planejar && (
                <p className="text-green-400 text-xs font-nunito mt-1">
                  ✓ Planejamento ativo
                </p>
              )}
              <button
                onClick={handleCardClick}
                className="mt-2 text-[#45BF55] hover:text-[#008D80] font-nunito text-sm underline"
              >
                Ver detalhes
              </button>
              {/* Arrow pointing down */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#262626]"></div>
            </div>
          </div>
        </AdvancedMarker>
      )}
    </>
  );
}
