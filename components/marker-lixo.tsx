import { AdvancedMarker } from "@vis.gl/react-google-maps";
import Image from "next/image";
import { Checkbox } from "./ui/checkbox";
import { useState, memo } from "react";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";
import { HeaderButton } from "./header-button";

interface DetectionPoint {
  class: string;
  coordinates: number[][];
}

interface MarkerLixoProps {
  position: google.maps.LatLngLiteral;
  quantidade: number;
  foto: string;
  classes: Array<{ nome: string; quantidade: number }>;
  planejar?: boolean;
  isCheckbox?: boolean;
  id: string;
  isSelected?: boolean;
  onSelectionChange?: (id: string, selected: boolean) => void;
  detectionPoints?: Record<string, any>;
}

export const MarkerLixo = memo(function MarkerLixo({
  position,
  quantidade,
  foto,
  classes,
  planejar = false,
  isCheckbox = false,
  id,
  isSelected = false,
  onSelectionChange,
  detectionPoints,
}: MarkerLixoProps) {
  const [showHoverCard, setShowHoverCard] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const imageSrc = foto || "/foto_example.png";

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
  };

  const handleCheckboxChange = (checked: boolean) => {
    onSelectionChange?.(id, checked);
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
          {isCheckbox && (
            <div className="absolute w-5 h-5 bottom-[-8px] rounded-md right-[-4px] bg-[#0d0d0d] ">
              <Checkbox
                className="w-5 h-5 cursor-pointer"
                checked={isSelected}
                onCheckedChange={handleCheckboxChange}
              />
            </div>
          )}
        </div>
      </AdvancedMarker>

      {showHoverCard && (
        <AdvancedMarker position={position}>
          <div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-in fade-in-50 zoom-in-50 duration-350"
            onMouseEnter={() => setShowHoverCard(true)}
            onMouseLeave={() => setShowHoverCard(false)}
          >
            <div className="flex flex-col justify-around gap-3 items-center min-w-[340px] bg-[#262626] rounded-md p-4 shadow-md relative cursor-default transition-all duration-200">
              <div className="flex flex-row justify-around items-start w-full gap-5">
                <div>
                  <h3 className="font-bold text-white text-sm font-nunito mb-2">
                    Foto
                  </h3>
                  <Image
                    className="h-[110px] w-[80px] object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                    width={80}
                    height={110}
                    src={imageSrc}
                    alt="Foto Icon"
                    onClick={handleImageClick}
                  />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm font-nunito mb-2">
                    Classes
                  </h3>
                  <div className="rounded-md border border-[#404040]">
                    <Table className="w-[182px]">
                      <TableBody>
                        {classes.map((classe, index) => (
                          <TableRow key={index}>
                            <TableCell
                              className={`text-sm font-nunito p-1 border-r ${
                                classe.quantidade === 0
                                  ? "text-[#404040]"
                                  : "text-white"
                              }`}
                            >
                              {classe.nome}
                            </TableCell>
                            <TableCell
                              className={`text-sm text-center font-nunito p-1 ${
                                classe.quantidade === 0
                                  ? "text-[#404040]"
                                  : "text-white"
                              }`}
                            >
                              {classe.quantidade}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
              <div className="flex flex-col w-full">
                <p className="text-sm text-white font-nunito">Endereço</p>
                <p className="text-sm text-[#a6a6a6] font-nunito">
                  Rua Pereira Estéfano, 2400 - Jabaquara
                </p>
              </div>
              <div className="flex flex-col w-full">
                <p className="text-sm text-white font-nunito">Data</p>
                <p className="text-sm text-[#a6a6a6] font-nunito">
                  10/03/25 - 14:30
                </p>
              </div>
              {planejar && (
                <>
                  <div className="flex flex-col w-full gap-2">
                    <HeaderButton mode="filled" text="Confirmar coleta" />
                    <HeaderButton mode="outlined-red" text="Não encontrado" />
                  </div>
                </>
              )}
            </div>
          </div>
        </AdvancedMarker>
      )}

      {showImageModal && (
        <div
          className="fixed inset-0 rounded-md bg-black/60 flex items-center justify-center z-[9999] cursor-pointer"
          onClick={closeImageModal}
        >
          <div className="relative">
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 text-white hover:text-gray-300 bg-black/50 rounded-full w-10 h-10 flex items-center justify-center z-10"
              style={{ lineHeight: 1 }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 5L5 15M5 5L15 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <div className="relative max-w-[90vw] max-h-[90vh]">
              <img
                className="max-w-full max-h-[90vh] object-contain rounded-md"
                src={imageSrc}
                alt="Foto"
                onClick={(e) => e.stopPropagation()}
                onLoad={(e) => {
                  const img = e.target as HTMLImageElement;
                  setImageSize({
                    width: img.clientWidth,
                    height: img.clientHeight,
                  });
                }}
              />
              {detectionPoints &&
                imageSize.width > 0 &&
                imageSize.height > 0 && (
                  <svg
                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
                    viewBox={`0 0 ${imageSize.width} ${imageSize.height}`}
                    preserveAspectRatio="xMidYMid meet"
                  >
                    {Array.isArray(detectionPoints) &&
                      detectionPoints
                        .filter((d: any) => d.class_name === "lixo")
                        .map((detection: any, idx: number) => {
                          const contour = detection.contour_normalized;
                          if (!Array.isArray(contour) || contour.length === 0)
                            return null;

                          const points = contour
                            .map(
                              (point: number[]) =>
                                `${point[0] * imageSize.width},${
                                  point[1] * imageSize.height
                                }`
                            )
                            .join(" ");

                          return (
                            <polygon
                              key={`lixo-${idx}`}
                              points={points}
                              fill="rgba(50, 205, 50, 0.3)"
                              stroke="#32CD32"
                              strokeWidth="3"
                            />
                          );
                        })}

                    {Array.isArray(detectionPoints) &&
                      detectionPoints
                        .filter((d: any) => d.class_name !== "lixo")
                        .map((detection: any, idx: number) => {
                          const contour = detection.contour_normalized;
                          if (!Array.isArray(contour) || contour.length === 0)
                            return null;

                          const points = contour
                            .map(
                              (point: number[]) =>
                                `${point[0] * imageSize.width},${
                                  point[1] * imageSize.height
                                }`
                            )
                            .join(" ");

                          return (
                            <polygon
                              key={`class-${idx}`}
                              points={points}
                              fill="rgba(0, 120, 255, 0.3)"
                              stroke="#0078FF"
                              strokeWidth="3"
                            />
                          );
                        })}
                  </svg>
                )}
            </div>
          </div>
        </div>
      )}
    </>
  );
});
