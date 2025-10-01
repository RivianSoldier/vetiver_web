"use client";

import { useState, useCallback } from "react";
import {
  routesService,
  RouteRequest,
  RouteResponse,
  RouteWaypoint,
} from "@/services/routesService";

export interface UseRoutesReturn {
  routeData: RouteResponse | null;
  isCalculating: boolean;
  error: string | null;
  calculateRoute: (
    origin: RouteWaypoint,
    waypoints: RouteWaypoint[]
  ) => Promise<void>;
  clearRoute: () => void;
  getGoogleMapsUrl: (
    origin: RouteWaypoint,
    waypoints: RouteWaypoint[]
  ) => string;
}

export const useRoutes = (): UseRoutesReturn => {
  const [routeData, setRouteData] = useState<RouteResponse | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateRoute = useCallback(
    async (origin: RouteWaypoint, waypoints: RouteWaypoint[]) => {
      if (waypoints.length === 0) {
        setError("No waypoints selected");
        return;
      }

      setIsCalculating(true);
      setError(null);

      try {
        // For a circular route, we'll set the destination to be the last waypoint
        // and use all others as intermediate waypoints
        const destination = waypoints[waypoints.length - 1];
        const intermediateWaypoints = waypoints.slice(0, -1);

        const request: RouteRequest = {
          origin,
          destination,
          waypoints: intermediateWaypoints,
          travelMode: "DRIVE",
          optimizeWaypointOrder: true, // Let Google optimize the order
          routeModifiers: {
            avoidTolls: false,
            avoidHighways: false,
            avoidFerries: true,
          },
        };

        const response = await routesService.calculateRoute(request);
        setRouteData(response);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to calculate route";
        setError(errorMessage);
        console.error("Route calculation error:", err);
      } finally {
        setIsCalculating(false);
      }
    },
    []
  );

  const clearRoute = useCallback(() => {
    setRouteData(null);
    setError(null);
  }, []);

  const getGoogleMapsUrl = useCallback(
    (origin: RouteWaypoint, waypoints: RouteWaypoint[]) => {
      if (waypoints.length === 0) return "";

      const destination = waypoints[waypoints.length - 1];
      const intermediateWaypoints = waypoints.slice(0, -1);

      const request: RouteRequest = {
        origin,
        destination,
        waypoints: intermediateWaypoints,
      };

      return routesService.createGoogleMapsUrl(request);
    },
    []
  );

  return {
    routeData,
    isCalculating,
    error,
    calculateRoute,
    clearRoute,
    getGoogleMapsUrl,
  };
};
