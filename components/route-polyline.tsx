"use client";

import { useEffect, useState } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import { routesService } from "@/services/routesService";

interface RoutePolylineProps {
  encodedPolyline: string;
  color?: string;
  strokeWeight?: number;
  strokeOpacity?: number;
}

export function RoutePolyline({
  encodedPolyline,
  color = "#ffffff",
  strokeWeight = 4,
  strokeOpacity = 0.8,
}: RoutePolylineProps) {
  const map = useMap();
  const [polyline, setPolyline] = useState<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map || !encodedPolyline) return;

    const path = routesService.decodePolyline(encodedPolyline);

    const newPolyline = new google.maps.Polyline({
      path: path.map((p) => ({ lat: p.lat, lng: p.lng })),
      geodesic: true,
      strokeColor: color,
      strokeOpacity: strokeOpacity,
      strokeWeight: strokeWeight,
    });

    newPolyline.setMap(map);
    setPolyline(newPolyline);

    return () => {
      if (newPolyline) {
        newPolyline.setMap(null);
      }
    };
  }, [map, encodedPolyline, color, strokeWeight, strokeOpacity]);

  useEffect(() => {
    return () => {
      if (polyline) {
        polyline.setMap(null);
      }
    };
  }, [polyline]);

  return null;
}
