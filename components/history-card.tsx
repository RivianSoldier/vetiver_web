"use client";

import Image from "next/image";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";
import { useState, useEffect, useMemo } from "react";

// New format detection types (from backend)
interface SubClass {
  class_name: string;
  contour: number[][];
}

interface LixoDetection {
  lixo_contour: number[][];
  sub_classes?: SubClass[];
}

interface NewFormatDetectionPoints {
  lixo_detections: LixoDetection[];
  class_counts: {
    papel: number;
    plastico: number;
    vidro: number;
    metal: number;
  };
}

// Old format detection type
interface OldFormatDetection {
  class_name: string;
  contour_normalized: number[][];
}

// Union type for detection points
type DetectionPointsType =
  | NewFormatDetectionPoints
  | OldFormatDetection[]
  | Record<string, unknown>;

export function HistoryCard({
  foto,
  classes,
  lat,
  long,
  data,
  status,
  dataColetado,
  detectionPoints,
}: {
  foto: string;
  classes: { nome: string; quantidade: number }[];
  lat: number;
  long: number;
  data: Date;
  status: string;
  dataColetado: Date | null;
  detectionPoints?: DetectionPointsType;
}) {
  const [address, setAddress] = useState<string>("Carregando endereço...");
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const imageSrc = foto || "/foto_example.png";

  const handleImageClick = () => {
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setImageSize({ width: 0, height: 0 });
  };

  const fetchAddress = useMemo(() => {
    return async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}&accept-language=pt-BR`,
          {
            headers: {
              "User-Agent": "VetiverApp/1.0",
            },
          }
        );
        const data = await response.json();

        if (data && data.display_name) {
          const addressData = data.address;
          const street = addressData?.road || "";
          const houseNumber = addressData?.house_number || "";
          const suburb =
            addressData?.suburb || addressData?.neighbourhood || "";
          const city =
            addressData?.city ||
            addressData?.town ||
            addressData?.municipality ||
            "";

          let formattedAddress = "";
          if (street) {
            formattedAddress += street;
            if (houseNumber) {
              formattedAddress += `, ${houseNumber}`;
            }
          }
          if (suburb) {
            formattedAddress += formattedAddress ? ` - ${suburb}` : suburb;
          }
          if (city && city !== suburb) {
            formattedAddress += formattedAddress ? `, ${city}` : city;
          }

          return formattedAddress || data.display_name;
        } else {
          return `${lat.toFixed(4)}, ${long.toFixed(4)}`;
        }
      } catch (error) {
        console.error("Error fetching address:", error);
        return `${lat.toFixed(4)}, ${long.toFixed(4)}`;
      }
    };
  }, [lat, long]);

  useEffect(() => {
    // Only fetch on client side
    if (typeof window === "undefined") return;

    let isMounted = true;

    const getAddress = async () => {
      const result = await fetchAddress();
      if (isMounted) {
        setAddress(result);
      }
    };

    getAddress();

    return () => {
      isMounted = false;
    };
  }, [fetchAddress]);

  return (
    <>
      <div
        className={`bg-gradient-to-b ${
          status === "Coletado"
          ? "from-[#45BF55] to-[#008D80]"
          : "from-[#FF576D] to-[#F22742]"
      } w-[306px] flex justify-center items-center p-[1px] rounded-sm`}
    >
      <div className="bg-[#262626] p-4 rounded-sm shadow-md flex flex-col gap-3">
        <div className="flex flex-row justify-around items-start w-full gap-5">
          <div>
            <h3 className="font-bold text-white text-sm font-nunito mb-2">
              Foto
            </h3>
            <Image
              className="h-[110px] w-[80px] object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity"
              width={80}
              height={110}
              src={foto}
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
          <p className="text-sm text-white font-nunito font-semibold">
            Endereço
          </p>
          <p className="text-sm text-[#a6a6a6] font-nunito">{address}</p>
        </div>
        <div className="flex flex-col w-full">
          <p className="text-sm text-white font-nunito font-semibold">Data</p>
          <p className="text-sm text-[#a6a6a6] font-nunito">
            {data.toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}{" "}
            -{" "}
            {data.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
          </p>
        </div>
        <div className="flex flex-col w-full">
          <p className="text-sm text-white font-nunito font-semibold">Status</p>
          <p
            className={`text-sm ${
              status === "Coletado"
                ? "bg-gradient-to-r from-[#008D80] to-[#45BF55]"
                : "bg-gradient-to-r from-[#FF576D] to-[#F22742]"
            } bg-clip-text text-transparent font-nunito`}
          >
            {status === "Coletado"
              ? "Resíduos coletados"
              : "Resíduos não encontrados"}
          </p>
          {dataColetado && (
            <span
              className={`text-sm ${
                status === "Coletado"
                  ? "bg-gradient-to-r from-[#008D80] to-[#45BF55]"
                  : "bg-gradient-to-r from-[#FF576D] to-[#F22742]"
              } bg-clip-text text-transparent font-nunito`}
            >
              {dataColetado.toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}{" "}
              -{" "}
              {dataColetado.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </span>
          )}
        </div>
      </div>
    </div>

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
            {/* eslint-disable-next-line @next/next/no-img-element */}
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
              imageSize.height > 0 &&
              (() => {
                const isNewFormat =
                  detectionPoints &&
                  typeof detectionPoints === "object" &&
                  !Array.isArray(detectionPoints) &&
                  "lixo_detections" in detectionPoints;

                const allContours: Array<{
                  contour: number[][];
                  className: string;
                  color: string;
                }> = [];

                if (isNewFormat) {
                  const newFormatData =
                    detectionPoints as NewFormatDetectionPoints;
                  const lixoDetections = newFormatData.lixo_detections || [];

                  lixoDetections.forEach((lixoDetection: LixoDetection) => {
                    // Only add lixo contour if there are no sub_classes
                    // If sub_classes exist, only add those
                    if (
                      lixoDetection.sub_classes &&
                      lixoDetection.sub_classes.length > 0
                    ) {
                      lixoDetection.sub_classes.forEach(
                        (subClass: SubClass) => {
                          const colorMap: { [key: string]: string } = {
                            papel: "#4A90E2",
                            plastico: "#D0021B",
                            vidro: "#7ED321",
                            metal: "#f5e023ff",
                          };

                          allContours.push({
                            contour: subClass.contour,
                            className: subClass.class_name,
                            color: colorMap[subClass.class_name] || "#0078FF",
                          });
                        }
                      );
                    } else if (lixoDetection.lixo_contour) {
                      // Only add lixo contour if no sub_classes
                      allContours.push({
                        contour: lixoDetection.lixo_contour,
                        className: "lixo",
                        color: "#8a13cfff",
                      });
                    }
                  });
                } else if (Array.isArray(detectionPoints)) {
                  const oldFormatData =
                    detectionPoints as OldFormatDetection[];

                  oldFormatData.forEach((detection: OldFormatDetection) => {
                    const contour = detection.contour_normalized;
                    if (Array.isArray(contour) && contour.length > 0) {
                      allContours.push({
                        contour: contour,
                        className: detection.class_name || "lixo",
                        color:
                          detection.class_name === "lixo"
                            ? "#8a13cfff"
                            : "#0078FF",
                      });
                    }
                  });
                }

                return (
                  <svg
                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
                    viewBox={`0 0 ${imageSize.width} ${imageSize.height}`}
                    preserveAspectRatio="xMidYMid meet"
                  >
                    {allContours.map((contourData, idx) => {
                      const points = contourData.contour
                        .map(
                          (point: number[]) =>
                            `${point[0] * imageSize.width},${
                              point[1] * imageSize.height
                            }`
                        )
                        .join(" ");

                      return (
                        <polygon
                          key={`${contourData.className}-${idx}`}
                          points={points}
                          fill={`${contourData.color}33`}
                          stroke={contourData.color}
                          strokeWidth="3"
                        />
                      );
                    })}
                  </svg>
                );
              })()}
          </div>
        </div>
      </div>
    )}
    </>
  );
}
