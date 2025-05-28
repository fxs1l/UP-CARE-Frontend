import { DateRange } from 'react-day-picker';
import useSWR from 'swr';

const useSensorData = (parameter: string, type: "raw" | "mean", dateRange?: { from?: Date; to?: Date }, bucketSize?: string) => {
  const endpoint =
    type === "mean"
      ? `/api/v1/local/sensor-data/mean?parameter=${parameter}&=bucketSize=${bucketSize}`
      : `/api/v1/local/sensor-data?parameter=${parameter}&=bucketSize=${bucketSize}`;

  const url =
    dateRange?.from && dateRange?.to
      ? `${endpoint}&startTime=${dateRange.from.toISOString()}&endTime=${dateRange.to.toISOString()}`
      : null;

  return useSWR(url);
};

const useAllSensorData = (dateRange: DateRange) => {
  return {
    CO: {
      raw: useSensorData("CO", "raw", dateRange),
      mean: useSensorData("CO", "mean", dateRange),
    },
    CO2: {
      raw: useSensorData("CO2", "raw", dateRange),
      mean: useSensorData("CO2", "mean", dateRange),
    },
    PM10: {
      raw: useSensorData("PM10", "raw", dateRange),
      mean: useSensorData("PM10", "mean", dateRange),
    },
    PM25: {
      raw: useSensorData("PM25", "raw", dateRange),
      mean: useSensorData("PM25", "mean", dateRange),
    },
    NO2: {
      raw: useSensorData("NO2", "raw", dateRange),
      mean: useSensorData("NO2", "mean", dateRange),
    },
    SO2: {
      raw: useSensorData("SO2", "raw", dateRange),
      mean: useSensorData("SO2", "mean", dateRange),
    },
  };
}

export { useAllSensorData, useSensorData }
