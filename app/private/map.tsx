// app/private/map.tsx
"use client";

import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";

export default function MapComponent() {
  const position = { lat: -23.6225, lng: -46.5398 };
  const DARK_MODE_MAP_ID = "93fab46ea0e9b871edd897b3";

  // --- ADD THIS LINE FOR DEBUGGING ---
  console.log("API Key Loaded:", process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    throw new Error("Google Maps API key is missing.");
  }

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <div style={{ height: "100%", width: "100%" }}>
        <Map defaultZoom={13} defaultCenter={position} mapId={DARK_MODE_MAP_ID}>
          <AdvancedMarker position={position} />
        </Map>
      </div>
    </APIProvider>
  );
}
