"use client";

import { useState, useEffect } from "react";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";

export default function MapComponent() {
  const defaultPosition = { lat: -23.648441, lng: -46.573043 };
  const [position, setPosition] = useState(defaultPosition);

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
      <div className="w-full h-full">
        <Map
          defaultZoom={15}
          defaultCenter={position}
          mapId={process.env.NEXT_PUBLIC_DARK_MODE_MAP_ID}
        >
          <AdvancedMarker position={position} />
        </Map>
      </div>
    </APIProvider>
  );
}
