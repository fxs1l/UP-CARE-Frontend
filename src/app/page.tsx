"use client";

import { useMemo } from "react";
import useSWR from "swr";
import { Skeleton } from "@/components/ui/skeleton";
import MemoChartAreaInteractive from "@/components/chart-area-interactive";
import SensorDataPoint from "@/interfaces/sensor-data-point";
import DataItem from "@/interfaces/chart-data";

function filterBySource(
  data: SensorDataPoint[],
  source: string,
): SensorDataPoint[] {
  return data.filter((d) => d.source === source);
}

export default function DashboardPage() {
  const {
    data: dataCO,
    error: errorCO,
    isLoading: isLoadingCO,
  } = useSWR("/api/v1/local/sensor-data?parameter=CO");
  const {
    data: dataCO2,
    error: errorCO2,
    isLoading: isLoadingCO2,
  } = useSWR("/api/v1/local/sensor-data?parameter=CO2");
  const {
    data: dataNO2,
    error: errorNO2,
    isLoading: isLoadingNO2,
  } = useSWR("/api/v1/local/sensor-data?parameter=NO2");
  const {
    data: dataSO2,
    error: errorSO2,
    isLoading: isLoadingSO2,
  } = useSWR("/api/v1/local/sensor-data?parameter=SO2");
  const {
    data: dataPM10,
    error: errorPM10,
    isLoading: isLoadingPM10,
  } = useSWR("/api/v1/local/sensor-data?parameter=PM10");
  const {
    data: dataPM25,
    error: errorPM25,
    isLoading: isLoadingPM25,
  } = useSWR("/api/v1/local/sensor-data?parameter=PM25");

  const { data: meanCO, isLoading: isLoadingMeanCO } = useSWR(
    "/api/v1/local/sensor-data/mean?parameter=CO",
  );
  const { data: meanCO2, isLoading: isLoadingMeanCO2 } = useSWR(
    "/api/v1/local/sensor-data/mean?parameter=CO2",
  );
  const { data: meanNO2, isLoading: isLoadingMeanNO2 } = useSWR(
    "/api/v1/local/sensor-data/mean?parameter=NO2",
  );
  const { data: meanSO2, isLoading: isLoadingMeanSO2 } = useSWR(
    "/api/v1/local/sensor-data/mean?parameter=SO2",
  );
  const { data: meanPM10, isLoading: isLoadingMeanPM10 } = useSWR(
    "/api/v1/local/sensor-data/mean?parameter=PM10",
  );
  const { data: meanPM25, isLoading: isLoadingMeanPM25 } = useSWR(
    "/api/v1/local/sensor-data/mean?parameter=PM25",
  );

  const chartConfig = {
    value: {
      label: "Mean",
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

  const transformSensorData = (data: SensorDataPoint[]): DataItem[] => {
    return data?.map((item) => ({
      [item.source]: item.value,
      time: item.time,
    })) as DataItem[];
  };

  const CO = useMemo(() => transformSensorData(dataCO ?? []), [dataCO]);
  const CO2 = useMemo(() => transformSensorData(dataCO2 ?? []), [dataCO2]);
  const NO2 = useMemo(() => transformSensorData(dataNO2 ?? []), [dataNO2]);
  const SO2 = useMemo(() => transformSensorData(dataSO2 ?? []), [dataSO2]);
  const PM10 = useMemo(() => transformSensorData(dataPM10 ?? []), [dataPM10]);
  const PM25 = useMemo(() => transformSensorData(dataPM25 ?? []), [dataPM25]);

  const charts = [
    {
      title: "Carbon Monoxide (CO)",
      description: "Total from all nodes for the last 3 months",
      dataSources: [
        { label: "Mean", data: meanCO },
        { label: "Overlay", data: CO },
      ],
      isLoading: isLoadingCO || isLoadingMeanCO,
      error: errorCO,
      unit: "ppm",
    },
    {
      title: "Carbon Dioxide (CO2)",
      description: "Total from all nodes for the last 3 months",
      dataSources: [
        { label: "Mean", data: meanCO2 },
        { label: "Overlay", data: CO2 },
      ],
      isLoading: isLoadingCO2 || isLoadingMeanCO2,
      error: errorCO2,
    },
    {
      title: "Nitrogen Dioxide (NO2)",
      description: "Total from all nodes for the last 3 months",
      dataSources: [
        { label: "Mean", data: meanNO2 },
        { label: "Overlay", data: NO2 },
      ],
      isLoading: isLoadingNO2 || isLoadingMeanNO2,
      error: errorNO2,
    },
    {
      title: "Sulfur Dioxide (SO2)",
      description: "Total from all nodes for the last 3 months",
      dataSources: [
        { label: "Mean", data: meanSO2 },
        { label: "Overlay", data: SO2 },
      ],
      isLoading: isLoadingSO2 || isLoadingMeanSO2,
      error: errorSO2,
    },
    {
      title: "Particulate Matter 10 (PM10)",
      description: "Total from all nodes for the last 3 months",
      dataSources: [
        { label: "Mean", data: meanPM10 },
        { label: "Overlay", data: PM10 },
      ],
      isLoading: isLoadingPM10 || isLoadingMeanPM10,
      error: errorPM10,
    },
    {
      title: "Particulate Matter 2.5 (PM25)",
      description: "Total from all nodes for the last 3 months",
      dataSources: [
        { label: "Mean", data: meanPM25 },
        { label: "Overlay", data: PM25 },
      ],
      isLoading: isLoadingPM25 || isLoadingMeanPM25,
      error: errorPM25,
    },
  ];

  return (
    <div className="px-4 lg:px-6">
      {charts.map((chart, index) => (
        <div key={index} className="mb-6">
          {chart.isLoading || chart.error ? (
            <Skeleton className="h-[350px] w-full rounded-xl" />
          ) : (
            <MemoChartAreaInteractive
              dataSources={chart.dataSources}
              title={chart.title}
              description={chart.description}
              chartConfig={chartConfig}
            />
          )}
        </div>
      ))}
    </div>
  );
}
