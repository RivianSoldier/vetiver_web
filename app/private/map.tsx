"use client";

import { useState, useEffect } from "react";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import { MarkerLixo } from "@/components/marker-lixo";
import { useSearchParams, useRouter } from "next/navigation";
import { useRoutes } from "@/hooks/useRoutes";
import { RoutePolyline } from "../../components/route-polyline";
import { RouteInfo } from "@/components/route-info";

const data = [
  {
    id: 1,
    lat: -23.647336,
    lng: -46.575399,
    foto: "/foto_example.png",
    classes: [
      { nome: "Papelão", quantidade: 2 },
      { nome: "Plástico", quantidade: 1 },
      { nome: "Vidro", quantidade: 1 },
      { nome: "Metal", quantidade: 0 },
      { nome: "Entulho", quantidade: 0 },
    ],
  },
  {
    id: 2,
    lat: -23.645876,
    lng: -46.570875,
    foto: "/foto_example.png",
    classes: [
      { nome: "Papelão", quantidade: 0 },
      { nome: "Plástico", quantidade: 1 },
      { nome: "Vidro", quantidade: 1 },
      { nome: "Metal", quantidade: 0 },
      { nome: "Entulho", quantidade: 2 },
    ],
  },
];

export default function MapComponent({
  planejar,
  isCheckbox,
}: {
  planejar: boolean;
  isCheckbox: boolean;
}) {
  const defaultPosition = { lat: -23.648441, lng: -46.573043 };
  const testePosition = { lat: -23.647336, lng: -46.575399 };
  const [position, setPosition] = useState(defaultPosition);
  const [selectedMarkers, setSelectedMarkers] = useState<Set<number>>(
    new Set()
  );
  const searchParams = useSearchParams();
  const router = useRouter();
  const { routeData, isCalculating, error, calculateRoute, clearRoute } =
    useRoutes();

  // Load selected markers from URL on mount
  useEffect(() => {
    const markersParam = searchParams.get("markers");
    if (markersParam) {
      const markerIds = markersParam
        .split(",")
        .map((id) => parseInt(id))
        .filter((id) => !isNaN(id));
      setSelectedMarkers(new Set(markerIds));
    }
  }, [searchParams]);

  // Handle marker selection
  const handleMarkerSelection = (markerId: number, selected: boolean) => {
    const newSelectedMarkers = new Set(selectedMarkers);
    if (selected) {
      newSelectedMarkers.add(markerId);
    } else {
      newSelectedMarkers.delete(markerId);
    }
    setSelectedMarkers(newSelectedMarkers);

    // Update URL with selected markers
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (newSelectedMarkers.size > 0) {
      current.set("markers", Array.from(newSelectedMarkers).join(","));
    } else {
      current.delete("markers");
    }

    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.replace(`/private${query}`);
  };

  // Calculate route when in planejar mode and markers are selected
  useEffect(() => {
    if (planejar && selectedMarkers.size > 0) {
      const selectedWaypoints = Array.from(selectedMarkers)
        .map((id) => {
          if (id === 0)
            return { lat: testePosition.lat, lng: testePosition.lng };
          const item = data.find((d) => d.id === id);
          return item ? { lat: item.lat, lng: item.lng } : null;
        })
        .filter(Boolean) as Array<{ lat: number; lng: number }>;

      if (selectedWaypoints.length > 0) {
        calculateRoute(position, selectedWaypoints);
      }
    } else if (!planejar) {
      clearRoute();
    }
  }, [planejar, selectedMarkers, position, calculateRoute, clearRoute]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (location) => {
          setPosition({
            lat: location.coords.latitude,
            lng: location.coords.longitude,
          });
        },
        (error) => {
          console.warn("Geolocation error:", error);
        }
      );
    }
  }, []);

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    throw new Error("Google Maps API key is missing.");
  }

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <div className="w-full h-full relative">
        {/* Route Information Display */}
        {planejar && (
          <RouteInfo
            routeData={routeData}
            isCalculating={isCalculating}
            error={error}
          />
        )}

        <Map
          defaultZoom={15}
          defaultCenter={position}
          mapId={process.env.NEXT_PUBLIC_DARK_MODE_MAP_ID}
        >
          <AdvancedMarker position={position}>
            <div className="p-1 bg-[#45bf5547] rounded-full">
              <div className="w-5 h-5 bg-gradient-to-r from-[#45BF55] to-[#008D80] rounded-full border-2 border-white shadow-lg"></div>
            </div>
          </AdvancedMarker>
          <MarkerLixo
            id={0}
            position={testePosition}
            quantidade={7}
            planejar={planejar}
            isCheckbox={isCheckbox}
            foto={""}
            classes={[]}
            isSelected={selectedMarkers.has(0)}
            onSelectionChange={handleMarkerSelection}
          />
          {data.map((item) => (
            <MarkerLixo
              key={item.id}
              id={item.id}
              position={{ lat: item.lat, lng: item.lng }}
              quantidade={item.classes.reduce(
                (acc, curr) => acc + curr.quantidade,
                0
              )}
              foto={item.foto}
              classes={item.classes}
              planejar={planejar}
              isCheckbox={isCheckbox}
              isSelected={selectedMarkers.has(item.id)}
              onSelectionChange={handleMarkerSelection}
            />
          ))}

          {/* Display route polyline when route data is available */}
          {routeData && routeData.routes[0] && (
            <RoutePolyline
              encodedPolyline={routeData.routes[0].polyline.encodedPolyline}
              color="#23A66A"
              strokeWeight={4}
              strokeOpacity={0.8}
            />
          )}
        </Map>
      </div>
    </APIProvider>
  );
}
