import { AdvancedMarker } from "@vis.gl/react-google-maps";
import Image from "next/image";
import { Checkbox } from "./ui/checkbox";
import { useState, memo } from "react";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";
import { HeaderButton } from "./header-button";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
  detectionPoints?: DetectionPointsType;
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
  const [address, setAddress] = useState<string>("Carregando endereço...");
  const router = useRouter();

  const imageSrc = foto || "/foto_example.png";

  const fetchAddress = async (lat: number, lng: number) => {
    try {
      const geocoder = new google.maps.Geocoder();
      const result = await geocoder.geocode({
        location: { lat, lng },
      });

      if (result.results && result.results.length > 0) {
        const formattedAddress = result.results[0].formatted_address;
        const cleanAddress = formattedAddress
          .replace(/, Brasil$/, "")
          .replace(/\d{5}-\d{3},?\s?/, "");
        setAddress(cleanAddress);
      } else {
        setAddress("Endereço não encontrado");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setAddress("Erro ao buscar endereço");
    }
  };

  const handleMouseEnter = () => {
    setShowHoverCard(true);
    if (address === "Carregando endereço...") {
      fetchAddress(position.lat, position.lng);
    }
  };

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

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const handleConfirmCollection = async () => {
    try {
      // Check authentication first
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Autenticação necessária", {
          description:
            "Você precisa estar autenticado para confirmar a coleta.",
        });
        return;
      }

      // Get user's current location
      const getCurrentPosition = (): Promise<GeolocationPosition> => {
        return new Promise((resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error("Geolocalização não suportada"));
          }
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          });
        });
      };

      toast.loading("Verificando sua localização...", { id: "location-check" });

      let userPosition;
      try {
        userPosition = await getCurrentPosition();
      } catch (geoError) {
        toast.dismiss("location-check");
        toast.error("Erro ao obter localização", {
          description:
            "Permita o acesso à sua localização para confirmar a coleta.",
        });
        return;
      }

      const userLat = userPosition.coords.latitude;
      const userLon = userPosition.coords.longitude;

      // Calculate distance between user and marker
      const distance = calculateDistance(
        userLat,
        userLon,
        position.lat,
        position.lng
      );

      console.log(`Distance to marker: ${distance * 1000}m`);

      // Check if user is within acceptable radius (50 meters = 0.05 km)
      const MAX_DISTANCE_KM = 5; // 50 meters

      if (distance > MAX_DISTANCE_KM) {
        toast.dismiss("location-check");
        toast.error("Você não está no local", {
          description:
            "Aproxime-se do ponto de coleta para confirmar a remoção do lixo.",
        });
        return;
      }

      toast.dismiss("location-check");
      toast.loading("Confirmando coleta...", { id: "confirm-collection" });

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

      const url = `${backendUrl}/detections/${id}/collect`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          collector_user_id: user.id,
        }),
        mode: "cors",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || `Erro ${response.status}: ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log("Collection result:", result);

      toast.dismiss("confirm-collection");
      toast.success("Coleta confirmada!", {
        description: "O lixo foi marcado como coletado com sucesso.",
      });

      // Refresh the page to update the markers
      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch (error) {
      console.error("Error confirming collection:", error);
      toast.dismiss("confirm-collection");

      if (
        error instanceof TypeError &&
        error.message.includes("Failed to fetch")
      ) {
        toast.error("Erro de conexão", {
          description:
            "Não foi possível conectar ao servidor. Tente novamente.",
        });
      } else {
        toast.error("Erro ao confirmar coleta", {
          description:
            error instanceof Error
              ? error.message
              : "Ocorreu um erro inesperado.",
        });
      }
    }
  };

  const handleNotFound = async () => {
    try {
      // Check authentication first
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Autenticação necessária", {
          description:
            "Você precisa estar autenticado para marcar como não encontrado.",
        });
        return;
      }

      // Get user's current location
      const getCurrentPosition = (): Promise<GeolocationPosition> => {
        return new Promise((resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error("Geolocalização não suportada"));
          }
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          });
        });
      };

      toast.loading("Verificando sua localização...", { id: "location-check" });

      let userPosition;
      try {
        userPosition = await getCurrentPosition();
      } catch (geoError) {
        toast.dismiss("location-check");
        toast.error("Erro ao obter localização", {
          description:
            "Permita o acesso à sua localização para marcar como não encontrado.",
        });
        return;
      }

      const userLat = userPosition.coords.latitude;
      const userLon = userPosition.coords.longitude;

      // Calculate distance between user and marker
      const distance = calculateDistance(
        userLat,
        userLon,
        position.lat,
        position.lng
      );

      console.log(`Distance to marker: ${distance * 1000}m`);

      // Check if user is within acceptable radius (50 meters = 0.05 km)
      const MAX_DISTANCE_KM = 5; // 5 km

      if (distance > MAX_DISTANCE_KM) {
        toast.dismiss("location-check");
        toast.error("Você não está no local", {
          description:
            "Aproxime-se do ponto para confirmar que o lixo não foi encontrado.",
        });
        return;
      }

      toast.dismiss("location-check");
      toast.loading("Marcando como não encontrado...", { id: "not-found" });

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      const url = `${backendUrl}/detections/${id}/not_found`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          collector_user_id: user.id,
        }),
        mode: "cors",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || `Erro ${response.status}: ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log("Not found result:", result);

      toast.dismiss("not-found");
      toast.success("Marcado como não encontrado!", {
        description: "O ponto foi registrado como não encontrado.",
      });

      // Refresh the page to update the markers
      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch (error) {
      console.error("Error marking as not found:", error);
      toast.dismiss("not-found");

      if (
        error instanceof TypeError &&
        error.message.includes("Failed to fetch")
      ) {
        toast.error("Erro de conexão", {
          description:
            "Não foi possível conectar ao servidor. Tente novamente.",
        });
      } else {
        toast.error("Erro ao marcar como não encontrado", {
          description:
            error instanceof Error
              ? error.message
              : "Ocorreu um erro inesperado.",
        });
      }
    }
  };

  return (
    <>
      <AdvancedMarker position={position}>
        <div
          className="relative cursor-pointer"
          onMouseEnter={handleMouseEnter}
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
                <p className="text-sm text-[#a6a6a6] font-nunito">{address}</p>
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
                    <HeaderButton
                      mode="filled"
                      text="Confirmar coleta"
                      onClick={handleConfirmCollection}
                    />
                    <HeaderButton
                      mode="outlined-red"
                      text="Não encontrado"
                      onClick={handleNotFound}
                    />
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
                              plastico: "#F5A623",
                              vidro: "#7ED321",
                              metal: "#D0021B",
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
                          color: "#32CD32",
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
                              ? "#32CD32"
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
});
