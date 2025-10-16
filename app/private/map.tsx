"use client";

import { useState, useEffect, useCallback } from "react";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import { MarkerLixo } from "@/components/marker-lixo";
import { useSearchParams, useRouter } from "next/navigation";
import { useRoutes } from "@/hooks/useRoutes";
import { RoutePolyline } from "../../components/route-polyline";
import { RouteInfo } from "@/components/route-info";
import { Detection } from "@/services/detectionsService";

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function MapComponent({
  planejar,
  isCheckbox,
  detections,
  distanceFilter,
}: {
  planejar: boolean;
  isCheckbox: boolean;
  detections: Detection[];
  distanceFilter?: string;
}) {
  const defaultPosition = { lat: -23.648441, lng: -46.573043 };
  const [position, setPosition] = useState(defaultPosition);
  const [selectedMarkers, setSelectedMarkers] = useState<Set<string>>(
    new Set()
  );
  const searchParams = useSearchParams();
  const router = useRouter();
  const { routeData, isCalculating, error, calculateRoute, clearRoute } =
    useRoutes();

  useEffect(() => {
    const markersParam = searchParams.get("markers");
    if (markersParam) {
      const markerIds = markersParam.split(",");
      setSelectedMarkers(new Set(markerIds));
    }
  }, [searchParams]);

  const handleMarkerSelection = useCallback(
    (markerId: string, selected: boolean) => {
      const newSelectedMarkers = new Set(selectedMarkers);
      if (selected) {
        newSelectedMarkers.add(markerId);
      } else {
        newSelectedMarkers.delete(markerId);
      }
      setSelectedMarkers(newSelectedMarkers);

      // Use history.replaceState for faster URL updates
      const current = new URLSearchParams(window.location.search);
      if (newSelectedMarkers.size > 0) {
        const markersString = Array.from(newSelectedMarkers).join(",");
        current.set("markers", markersString);
      } else {
        current.delete("markers");
      }

      const search = current.toString();
      const query = search ? `?${search}` : "";
      const newUrl = `/private${query}`;

      // Use native history API for instant update without Next.js overhead
      window.history.replaceState(null, "", newUrl);
    },
    [selectedMarkers]
  );

  useEffect(() => {
    if (planejar && selectedMarkers.size > 0) {
      const selectedWaypoints = Array.from(selectedMarkers)
        .map((id) => {
          const item = detections.find((d) => d.id === id);
          return item ? { lat: item.lat, lng: item.lng } : null;
        })
        .filter(Boolean) as Array<{ lat: number; lng: number }>;

      if (selectedWaypoints.length > 0) {
        calculateRoute(position, selectedWaypoints);
      }
    } else if (!planejar) {
      clearRoute();
    }
  }, [
    planejar,
    selectedMarkers,
    position,
    calculateRoute,
    clearRoute,
    detections,
  ]);

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

  const filteredByDistance = detections.filter((detection) => {
    if (!distanceFilter) return true;

    const distance = calculateDistance(
      position.lat,
      position.lng,
      detection.lat,
      detection.lng
    );

    const [min, max] = distanceFilter.split("-");
    if (max === "+") {
      return distance >= parseInt(min);
    }
    return distance >= parseInt(min) && distance <= parseInt(max);
  });

  // When showing route (planejar=true/calculating), only show selected markers
  // Otherwise show all filtered markers
  const markersToDisplay = planejar
    ? filteredByDistance.filter((detection) =>
        selectedMarkers.has(detection.id)
      )
    : filteredByDistance;

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    throw new Error("Google Maps API key is missing.");
  }

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <div className="w-full h-full relative">
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
          disableDefaultUI={true}
          zoomControl={true}
        >
          <AdvancedMarker position={position}>
            <div className="p-1 bg-[#45bf5547] rounded-full">
              <div className="w-5 h-5 bg-gradient-to-r from-[#45BF55] to-[#008D80] rounded-full border-2 border-white shadow-lg"></div>
            </div>
          </AdvancedMarker>
          {markersToDisplay.map((item) => (
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
              detectionPoints={item.detection_points}
            />
          ))}

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
