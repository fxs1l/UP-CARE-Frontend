"use client";

import { SWRConfig } from "swr";
import { ReactNode } from "react";
import SensorDataPoint from "@/lib/interfaces/sensor-data-point";
import { toast } from "sonner";

async function fetcher(url: string): Promise<SensorDataPoint[]> {
  const urlObj = new URL(url, window.location.origin);
  const parameter = urlObj.searchParams.get("parameter") || "unknown";

  const fetchPromise = fetch(url).then(async (response) => {
    return response.json();
  });

  toast.promise(fetchPromise, {
    loading: `Fetching data for ${parameter}...`,
    success: (data: SensorDataPoint[]) => {
      return {
        message: `Data fetched successfully! for ${parameter}`,
        description: `Fetched ${data.length} data points`,
      };
    },
    error: (error) => {
      return {
        message: `Something went wrong while fetching ${parameter}`,
        description: error.message,
      };
    },
  });

  const data = (await fetchPromise) as SensorDataPoint[];

  return data;
}

const swrOptions = {
  // refreshInterval: 3000,
  fetcher: fetcher,
};

export const SWRProvider = ({ children }: { children: ReactNode }) => {
  return <SWRConfig value={swrOptions}>{children}</SWRConfig>;
};
