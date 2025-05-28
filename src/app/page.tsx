"use client";

import { useMemo } from "react";
import useSWR from "swr";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import MemoChartAreaInteractive from "@/components/chart-area-interactive-old";
import MapComponent from "@/components/building-map";
import SensorDataPoint from "@/interfaces/sensor-data-point";
import DataItem from "@/interfaces/chart-data";
import TrafficDataPoint from "@/interfaces/traffic-data-point";

import { useAllSensorData, useSensorData } from "@/hooks/use-sensor-data";
import { useTrafficData } from "@/hooks/use-traffic-data";
import useDateRangeStore from "@/hooks/use-date";
import { error } from "console";
import usePollutantStore from "../hooks/use-pollutant";

export default function DashboardPage() {
  const { dateRange } = useDateRangeStore();

  const sensorData = useAllSensorData(dateRange);
  const trafficData = useTrafficData(dateRange);
  const { pollutant } = usePollutantStore();
  const specificPollutantData = useSensorData(
    pollutant,
    "raw",
    dateRange,
    "1h",
  );

  const chartConfig = {
    mean: {
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
    "Vehicle Count": {
      label: "Vehicle Count",
      color: "var(--chart-5)",
    },
    car: {
      label: "Car",
      color: "var(--chart-1)",
    },
    bus: {
      label: "Jeep",
      color: "var(--chart-2)",
    },
    truck: {
      label: "Truck",
      color: "var(--chart-3)",
    },
    motorcycle: {
      label: "Motorcycle",
      color: "var(--chart-4)",
    },
  };

  const transformTrafficData = (data: TrafficDataPoint[]): DataItem[] => {
    return data?.map((item) => ({
      [String(item.vehicleType)]: item.value,
      time: item.time,
    })) as DataItem[];
  };

  const trafficCount = useMemo(
    () => transformTrafficData(trafficData.data ?? []),
    [trafficData.data],
  );

  const charts = [
    {
      title: "Carbon Monoxide (CO)",
      description: "Total from all nodes for the last 3 months",
      dataSources: [
        { label: "Mean", data: sensorData.CO.mean.data },
        { label: "Overlay", data: sensorData.CO.raw.data ?? [] },
      ],
      isLoading: sensorData.CO.mean.isLoading && sensorData.CO.raw.isLoading,
      error: sensorData.CO.raw.error || sensorData.CO.mean.error,
      unit: "ppm",
    },
    {
      title: "Carbon Dioxide (CO2)",
      description: "Total from all nodes for the last 3 months",
      dataSources: [
        { label: "Mean", data: sensorData.CO2.mean.data },
        { label: "Overlay", data: sensorData.CO2.raw.data },
      ],
      isLoading: sensorData.CO2.raw.isLoading && sensorData.CO2.mean.isLoading,
      error: sensorData.CO2.raw.error || sensorData.CO2.mean.error,
      unit: "ppm",
    },
    {
      title: "Nitrogen Dioxide (NO2)",
      description: "Total from all nodes for the last 3 months",
      dataSources: [
        { label: "Mean", data: sensorData.NO2.mean.data },
        { label: "Overlay", data: sensorData.NO2.raw.data },
      ],
      isLoading: sensorData.NO2.raw.isLoading && sensorData.NO2.mean.isLoading,
      error: sensorData.NO2.raw.error || sensorData.NO2.mean.error,
      unit: "ppm",
    },
    {
      title: "Sulfur Dioxide (SO2)",
      description: "Total from all nodes for the last 3 months",
      dataSources: [
        { label: "Mean", data: sensorData.SO2.mean.data },
        { label: "Overlay", data: sensorData.SO2.raw.data },
      ],
      isLoading: sensorData.SO2.raw.isLoading && sensorData.SO2.mean.isLoading,
      error: sensorData.SO2.raw.error || sensorData.SO2.mean.error,
      unit: "ppm",
    },
    {
      title: "Particulate Matter 10 (PM10)",
      description: "Total from all nodes for the last 3 months",
      dataSources: [
        { label: "Mean", data: sensorData.PM10.mean.data },
        { label: "Overlay", data: sensorData.PM10.raw.data },
      ],
      isLoading:
        sensorData.PM10.raw.isLoading && sensorData.PM10.mean.isLoading,
      error: sensorData.PM10.raw.error || sensorData.PM10.mean.error,
      unit: "µg/m³",
    },
    {
      title: "Particulate Matter 2.5 (PM2.5)",
      description: "Total from all nodes for the last 3 months",
      dataSources: [
        { label: "Mean", data: sensorData.PM25.mean.data },
        { label: "Overlay", data: sensorData.PM25.raw.data },
      ],
      isLoading:
        sensorData.PM25.raw.isLoading && sensorData.PM25.mean.isLoading,
      error: sensorData.PM25.raw.error || sensorData.PM25.mean.error,
      unit: "µg/m³",
    },
  ];

  return (
    <div className="px-4 lg:px-6">
      <Card className="mb-6">
        <CardContent className="flex w-full flex-col items-center gap-1 p-2 sm:flex-row">
          <div className="flex h-full w-full flex-col rounded-t-md rounded-b-none sm:w-full sm:rounded-l-md sm:rounded-r-none">
            <span className="p-2 pt-0 pb-0 leading-none font-semibold">
              Simulations
            </span>
            <span className="text-muted-foreground p-2 pt-0 text-sm">
              Simulated concentrations from EnviMET
            </span>
            <MapComponent />
          </div>
          <div className="flex w-full flex-col border-t-2 sm:w-1/2 sm:border-none">
            <span className="self-start p-2 pb-0 leading-none font-semibold">
              Vehicle Count
            </span>
            <span className="text-muted-foreground p-2 pt-0 text-sm">
              Mean vehicles seen by the traffic camera
            </span>
            <MemoChartAreaInteractive
              className="rounded-tr-md border-none shadow-none"
              dataSources={[
                { label: "Vehicle Count", data: trafficCount },
                // { label: "Overlay", data: CO },
              ]}
              title={"Vehicle Count over Time"}
              renderCard={false}
              chartConfig={chartConfig}
            />
            <span className="self-start p-2 pb-0 leading-none font-semibold">
              Concentrations {pollutant ? `(${pollutant})` : ""}
            </span>
            <span className="text-muted-foreground p-2 pt-0 text-sm">
              Sensor data from the AQ nodes
            </span>
            <MemoChartAreaInteractive
              className="rounded-tr-md border-none shadow-none"
              dataSources={[
                {
                  label: "",
                  data: pollutant === "" ? [] : specificPollutantData.data,
                },
              ]}
              title={"Vehicle Count over Time"}
              renderCard={false}
              chartConfig={chartConfig}
            />
          </div>
        </CardContent>
      </Card>

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
              yAxisLabel={chart.unit}
            />
          )}
        </div>
      ))}
    </div>
  );
}
