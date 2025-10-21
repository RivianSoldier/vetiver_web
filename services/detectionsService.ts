// Detections API Service

export interface ClassCount {
  nome: string;
  quantidade: number;
}

export interface Detection {
  id: string;
  lat: number;
  lng: number;
  foto: string;
  classes: ClassCount[];
  detection_points?: Record<string, any>;
  date?: string;
}

export interface DetectionsResponse {
  detections: Detection[];
}

class DetectionsService {
  private baseUrl: string;

  constructor() {
    this.baseUrl =
      process.env.SERVER_URL_DATABASE ||
      process.env.NEXT_PUBLIC_SERVER_URL_DATABASE ||
      "";

    if (!this.baseUrl) {
      console.warn("SERVER_URL_DATABASE environment variable is not set");
    }
  }

  async getDetectionsByStatus(status: string): Promise<Detection[]> {
    try {
      const encodedStatus = encodeURIComponent(status);
      const url = `${this.baseUrl}/detections/map/status/${encodedStatus}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        console.error(
          `Failed to fetch detections: ${response.status} ${response.statusText}`
        );
        return [];
      }

      const data: Detection[] = await response.json();

      const validDetections = data
        .filter((detection) => {
          return (
            detection.id &&
            typeof detection.lat === "number" &&
            typeof detection.lng === "number" &&
            Array.isArray(detection.classes)
          );
        })
        .map((detection, index) => {
          const originalFoto = detection.foto;
          const formattedFoto = this.formatBase64Image(detection.foto);

          return {
            ...detection,
            foto: formattedFoto,
          };
        });

      return validDetections;
    } catch (error) {
      console.error("Error fetching detections:", error);
      return [];
    }
  }

  private formatBase64Image(foto: string): string {
    if (!foto) {
      return "/foto_example.png";
    }

    if (foto.startsWith("data:")) {
      return foto;
    }

    if (foto.startsWith("http://") || foto.startsWith("https://")) {
      return foto;
    }

    if (foto.startsWith("/") && foto.includes(".")) {
      return foto;
    }

    return `data:image/jpeg;base64,${foto}`;
  }

  getTotalWasteCount(detection: Detection): number {
    return detection.classes.reduce(
      (total, classItem) => total + classItem.quantidade,
      0
    );
  }

  // Helper method to format detection data for map markers
  formatForMap(detections: Detection[]) {
    return detections.map((detection) => ({
      id: detection.id,
      lat: detection.lat,
      lng: detection.lng,
      foto: detection.foto,
      classes: detection.classes,
      quantidade: this.getTotalWasteCount(detection),
    }));
  }
}

// Export singleton instance
export const detectionsService = new DetectionsService();
