import useSWR from 'swr';

const useTrafficData = (dateRange?: { from?: Date; to?: Date }) => {
  const url =
    dateRange?.from && dateRange?.to
      ? `/api/v1/local/traffic-data/count?startTime=${dateRange.from.toISOString()}&endTime=${dateRange.to.toISOString()}`
      : null;

  return useSWR(url);
};


export { useTrafficData };
