export interface RouteWaypoint {
  lat: number;
  lng: number;
}

export interface RouteRequest {
  origin: RouteWaypoint;
  destination: RouteWaypoint;
  waypoints?: RouteWaypoint[];
  travelMode?: "DRIVE" | "WALK" | "BICYCLE" | "TRANSIT";
  routeModifiers?: {
    avoidTolls?: boolean;
    avoidHighways?: boolean;
    avoidFerries?: boolean;
  };
  optimizeWaypointOrder?: boolean;
}

export interface RouteLeg {
  distanceMeters: number;
  duration: string;
  startLocation: {
    latLng: {
      latitude: number;
      longitude: number;
    };
  };
  endLocation: {
    latLng: {
      latitude: number;
      longitude: number;
    };
  };
}

export interface RouteResponse {
  routes: Array<{
    legs: RouteLeg[];
    distanceMeters: number;
    duration: string;
    polyline: {
      encodedPolyline: string;
    };
    description: string;
    warnings: string[];
    optimizedIntermediateWaypointIndex: number[];
  }>;
}

export class RoutesService {
  private apiKey: string;
  private baseUrl = "https://routes.googleapis.com/directions/v2:computeRoutes";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async calculateRoute(request: RouteRequest): Promise<RouteResponse> {
    const useOptimization =
      request.optimizeWaypointOrder &&
      request.waypoints &&
      request.waypoints.length > 0;

    const requestBody = {
      origin: {
        location: {
          latLng: {
            latitude: request.origin.lat,
            longitude: request.origin.lng,
          },
        },
      },
      destination: {
        location: {
          latLng: {
            latitude: request.destination.lat,
            longitude: request.destination.lng,
          },
        },
      },
      travelMode: request.travelMode || "DRIVE",
      routingPreference: useOptimization
        ? "TRAFFIC_UNAWARE"
        : "TRAFFIC_AWARE_OPTIMAL",
      computeAlternativeRoutes: false,
      routeModifiers: request.routeModifiers || {},
      languageCode: "pt-BR",
      units: "METRIC",
    };

    if (request.waypoints && request.waypoints.length > 0) {
      (requestBody as any).intermediates = request.waypoints.map(
        (waypoint) => ({
          location: {
            latLng: {
              latitude: waypoint.lat,
              longitude: waypoint.lng,
            },
          },
        })
      );

      if (request.optimizeWaypointOrder) {
        (requestBody as any).optimizeWaypointOrder = true;
      }
    }

    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": this.apiKey,
        "X-Goog-FieldMask":
          "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline,routes.legs.duration,routes.legs.distanceMeters,routes.legs.startLocation,routes.legs.endLocation,routes.description,routes.warnings,routes.optimizedIntermediateWaypointIndex",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Routes API error: ${response.status} ${
          response.statusText
        }. ${JSON.stringify(errorData)}`
      );
    }

    return response.json();
  }

  decodePolyline(encodedPolyline: string): Array<{ lat: number; lng: number }> {
    let index = 0;
    const len = encodedPolyline.length;
    const path: Array<{ lat: number; lng: number }> = [];
    let lat = 0;
    let lng = 0;

    while (index < len) {
      let b: number;
      let shift = 0;
      let result = 0;
      do {
        b = encodedPolyline.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encodedPolyline.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      path.push({
        lat: lat / 1e5,
        lng: lng / 1e5,
      });
    }

    return path;
  }

  createGoogleMapsUrl(request: RouteRequest): string {
    const origin = `${request.origin.lat},${request.origin.lng}`;
    const destination = `${request.destination.lat},${request.destination.lng}`;

    let url = `https://www.google.com/maps/dir/${origin}`;

    if (request.waypoints && request.waypoints.length > 0) {
      const waypoints = request.waypoints
        .map((wp) => `${wp.lat},${wp.lng}`)
        .join("/");
      url += `/${waypoints}`;
    }

    url += `/${destination}`;

    return url;
  }
}

export const routesService = new RoutesService(
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
);
