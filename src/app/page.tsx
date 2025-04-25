"use client";

import useSWR from "swr";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import SensorDataPoint from "@/interfaces/sensor-data-point";

function filterBySource(
  data: SensorDataPoint[],
  source: string,
): SensorDataPoint[] {
  return data.filter((d) => d.source === source);
}

export default function DashboardPage() {
  const { data, error, isLoading } = useSWR("/api/v1/local/sensor-data");

  // const uniqueSources = [
  //   ...new Set(data.map((item: SensorDataPoint) => item.source)),
  // ];
  // const uniqueParameters = [
  //   ...new Set(data.map((item: SensorDataPoint) => item.parameter)),
  // ];
  // const chartConfig = uniqueSources.map((source) => ({
  //   source: { label: source, color: "var(--chart-1)" },
  // })) as ChartConfig[
  // }));

  const chartConfig = {
    value: {
      label: "AQ NODE 1 (list)",
      color: "var(--chart-1)",
    },
    "AQ NODE 1": {
      label: "AQ NODE 1",
      color: "var(--chart-1)",
    },
    "AQ NODE 2": {
      label: "AQ NODE 2",
      color: "var(--chart-2)",
    },
    "AQ NODE 3": {
      label: "AQ NODE 3",
      color: "var(--chart-3)",
    },
    "AQ NODE 4": {
      label: "AQ NODE 4",
      color: "var(--chart-4)",
    },
  };

  const allNodes: SensorDataPoint[] = data
    ?.filter(
      (d: SensorDataPoint) =>
        d.source === "AQ NODE 1" ||
        d.source === "AQ NODE 2" ||
        d.source === "AQ NODE 3" ||
        d.source === "AQ NODE 4",
    )
    ?.filter(({ time }: SensorDataPoint) => {
      const date = new Date(time);
      return !(
        date.getFullYear() === 2025 &&
        date.getMonth() === 3 &&
        date.getDate() === 19
      );
    });

  const CO = allNodes
    ?.filter((d: SensorDataPoint) => d.parameter === "CO")
    ?.map((item: SensorDataPoint) => ({
      [item.source]: item.value,
      time: item.time,
    }));

  const CO2 = allNodes
    ?.filter((d: SensorDataPoint) => d.parameter === "CO2")
    ?.map((item: SensorDataPoint) => ({
      [item.source]: item.value,
      time: item.time,
    }));

  const NO2 = allNodes
    ?.filter((d: SensorDataPoint) => d.parameter === "NO2")
    ?.map((item: SensorDataPoint) => ({
      [item.source]: item.value,
      time: item.time,
    }));

  const SO2 = allNodes
    ?.filter((d: SensorDataPoint) => d.parameter === "SO2")
    ?.map((item: SensorDataPoint) => ({
      [item.source]: item.value,
      time: item.time,
    }));

  const PM10 = allNodes
    ?.filter((d: SensorDataPoint) => d.parameter === "PM10")
    ?.map((item: SensorDataPoint) => ({
      [item.source]: item.value,
      time: item.time,
    }));
  const PM2_5 = allNodes
    ?.filter((d: SensorDataPoint) => d.parameter === "PM25")
    ?.map((item: SensorDataPoint) => ({
      [item.source]: item.value,
      time: item.time,
    }));

  return (
    <>
      {/* <SectionCards /> */}
      {/* <div className="px-4 lg:px-6">
        <ChartAreaInteractive data={data} />
      </div>
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive data={data} />
      </div> */}
      {/* <div className="px-4 lg:px-6">
        <h2 className="mb-2 text-lg font-semibold">Sensor Data</h2>
        <pre className="rounded-md bg-gray-100 p-4 text-sm">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div> */}

      <div className="px-4 lg:px-6">
        {isLoading ? (
          <Skeleton className="h-[350px] w-full rounded-xl" />
        ) : (
          <ChartAreaInteractive
            title="Carbon Monoxide (CO)"
            description="Total from all nodes for the last 3 months"
            data={CO}
            chartConfig={chartConfig}
          />
        )}
      </div>
      <div className="px-4 lg:px-6">
        {isLoading ? (
          <Skeleton className="h-[350px] w-full rounded-xl" />
        ) : (
          <ChartAreaInteractive
            title="Carbon Dioxide (CO2)"
            description="Total from all nodes for the last 3 months"
            data={CO2}
            chartConfig={chartConfig}
          />
        )}
      </div>
      <div className="px-4 lg:px-6">
        {isLoading ? (
          <Skeleton className="h-[350px] w-full rounded-xl" />
        ) : (
          <ChartAreaInteractive
            title="Nitrogen Dioxide (NO2)"
            description="Total from all nodes for the last 3 months"
            data={NO2}
            chartConfig={chartConfig}
          />
        )}
      </div>
      <div className="px-4 lg:px-6">
        {isLoading ? (
          <Skeleton className="h-[350px] w-full rounded-xl" />
        ) : (
          <ChartAreaInteractive
            title="Sulfur Dioxide (SO2)"
            description="Total from all nodes for the last 3 months"
            data={SO2}
            chartConfig={chartConfig}
          />
        )}
      </div>
      <div className="px-4 lg:px-6">
        {isLoading ? (
          <Skeleton className="h-[350px] w-full rounded-xl" />
        ) : (
          <ChartAreaInteractive
            title="Particulate Matter (PM 10)"
            description="Total from all nodes for the last 3 months"
            data={PM10}
            chartConfig={chartConfig}
          />
        )}
      </div>
      <div className="px-4 lg:px-6">
        {isLoading ? (
          <Skeleton className="h-[350px] w-full rounded-xl" />
        ) : (
          <ChartAreaInteractive
            title="Particulate Matter (PM 2.5)"
            description="Total from all nodes for the last 3 months"
            data={PM2_5}
            chartConfig={chartConfig}
          />
        )}
      </div>

      {/* <DataTable data={data} /> */}
    </>
  );
}
