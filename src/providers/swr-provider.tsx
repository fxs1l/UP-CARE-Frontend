"use client";

import { SWRConfig } from "swr";
import { ReactNode } from "react";
import SensorDataPoint from "@/lib/interfaces/sensor-data-point";
import { toast } from "sonner";

async function fetcher(url: string): Promise<SensorDataPoint[]> {
  try {
    const fetchPromise = fetch(url).then(async (response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      return response.json();
    });

    toast.promise(fetchPromise, {
      loading: "Fetching data...",
      success: (data: SensorDataPoint[]) => {
        return {
          message: "Data fetched successfully!",
          description: `Fetched ${data.length} data points`,
        };
      },
      error: (error) => {
        return {
          message: "Something went wrong",
          description: error.message,
        };
      },
    });

    const data = (await fetchPromise) as SensorDataPoint[];

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

const swrOptions = {
  // refreshInterval: 3000,
  fetcher: fetcher,
};

export const SWRProvider = ({ children }: { children: ReactNode }) => {
  return <SWRConfig value={swrOptions}>{children}</SWRConfig>;
};
