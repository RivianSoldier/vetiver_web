// Collector Activity API Service

export interface ClassCount {
  nome: string;
  quantidade: number;
}

export interface CollectorActivity {
  id: string;
  foto: string;
  classes: ClassCount[];
  lat: number;
  lng: number;
  date: string;
  status: string;
  dataColetado: string | null;
}

class CollectorService {
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

  async getCollectorActivity(
    collectorId: string
  ): Promise<CollectorActivity[]> {
    try {
      const url = `${this.baseUrl}/collector/activity/${collectorId}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        console.error(
          `Failed to fetch collector activity: ${response.status} ${response.statusText}`
        );
        return [];
      }

      const data: CollectorActivity[] = await response.json();

      // Format base64 images
      const formattedData = data.map((activity) => ({
        ...activity,
        foto: this.formatBase64Image(activity.foto),
      }));

      return formattedData;
    } catch (error) {
      console.error("Error fetching collector activity:", error);
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
}

// Export singleton instance
export const collectorService = new CollectorService();
