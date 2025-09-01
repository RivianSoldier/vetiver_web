"use client";

import { useState, useEffect } from "react";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import { MarkerLixo } from "@/components/marker-lixo";

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
          <AdvancedMarker position={position}>
            <div className="p-1 bg-[#45bf5547] rounded-full">
              <div className="w-5 h-5 bg-gradient-to-r from-[#45BF55] to-[#008D80] rounded-full border-2 border-white shadow-lg"></div>
            </div>
          </AdvancedMarker>
          <MarkerLixo
            position={testePosition}
            quantidade={7}
            planejar={planejar}
            isCheckbox={isCheckbox}
            foto={""}
            classes={[]}
          />
          {data.map((item) => (
            <MarkerLixo
              key={item.id}
              position={{ lat: item.lat, lng: item.lng }}
              quantidade={item.classes.reduce(
                (acc, curr) => acc + curr.quantidade,
                0
              )}
              foto={item.foto}
              classes={item.classes}
              planejar={planejar}
              isCheckbox={isCheckbox}
            />
          ))}
        </Map>
      </div>
    </APIProvider>
  );
}
