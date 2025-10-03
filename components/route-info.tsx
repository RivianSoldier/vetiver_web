"use client";

import { RouteResponse } from "@/services/routesService";
import { useState, memo } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronDown } from "lucide-react";

interface RouteInfoProps {
  routeData: RouteResponse | null;
  isCalculating: boolean;
  error: string | null;
}

export const RouteInfo = memo(function RouteInfo({
  routeData,
  isCalculating,
  error,
}: RouteInfoProps) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  if (isCalculating) {
    return (
      <div className="absolute top-4 left-4 bg-[#262626] rounded-lg p-4 shadow-lg z-10 max-w-sm">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#008D80]"></div>
          <span className="text-white font-nunito text-sm">
            Calculando rota...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute top-4 left-4 bg-[#262626] border border-red-500 rounded-lg p-4 shadow-lg z-10 max-w-sm">
        <div className="flex items-center gap-2">
          <span className="text-red-400 font-nunito text-sm">Erro:</span>
          <span className="text-white font-nunito text-sm">{error}</span>
        </div>
      </div>
    );
  }

  if (!routeData || !routeData.routes[0]) {
    return null;
  }

  const route = routeData.routes[0];
  const totalDistanceKm = (route.distanceMeters / 1000).toFixed(1);
  const totalDuration = formatDuration(route.duration);

  const RouteInfoContent = () => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-[#a6a6a6] font-nunito text-sm">Distância:</span>
        <span className="text-white font-nunito text-sm font-bold">
          {totalDistanceKm} km
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-[#a6a6a6] font-nunito text-sm">Duração:</span>
        <span className="text-white font-nunito text-sm font-bold">
          {totalDuration}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-[#a6a6a6] font-nunito text-sm">Paradas:</span>
        <span className="text-white font-nunito text-sm font-bold">
          {route.legs.length}
        </span>
      </div>
      {route.warnings && route.warnings.length > 0 && (
        <div className="mt-3 pt-2 border-t border-[#404040]">
          <span className="text-yellow-400 font-nunito text-xs">Avisos:</span>
          {route.warnings.map((warning, index) => (
            <p key={index} className="text-yellow-200 font-nunito text-xs mt-1">
              {warning}
            </p>
          ))}
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute top-4 left-4 bg-[#262626] rounded-md p-4 z-10 w-64 text-white font-poppins text-sm hover:bg-[#333333] transition-colors flex items-center justify-between"
        >
          <span>Informações da Rota</span>
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>
        {isOpen && (
          <div className="absolute top-18 left-4 bg-[#262626] border border-[#404040] rounded-md p-4 shadow-lg z-20 w-64">
            <RouteInfoContent />
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <HoverCard>
        <HoverCardTrigger className="absolute top-4 left-4 bg-[#262626] rounded-md p-4 z-10 max-w-sm text-white font-poppins text-sm flex items-center justify-center w-64">
          <span>Informações da Rota</span>
        </HoverCardTrigger>
        <HoverCardContent className="bg-[#262626] border border-[#404040]">
          <RouteInfoContent />
        </HoverCardContent>
      </HoverCard>
    </>
  );
});

function formatDuration(duration: string): string {
  const seconds = parseInt(duration.replace("s", ""));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}
