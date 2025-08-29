import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import Image from "next/image";
import { Checkbox } from "./ui/checkbox";

export function MarkerLixo({
  position,
  quantidade,
  planejar = false,
}: {
  position: google.maps.LatLngLiteral;
  quantidade: number;
  planejar?: boolean;
}) {
  return (
    <AdvancedMarker position={position}>
      <div className="relative">
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
  );
}
