"use client";

import { memo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { DateRangePicker } from "./date-picker";
import { DateRange } from "react-day-picker";

type DataItem = {
  [key: string]: number;
  time: number;
};

type DataSource = {
  label: string;
  data: DataItem[];
  unit?: string;
};

type ChartAreaInteractiveProps = {
  dataSources: DataSource[];
  chartConfig: ChartConfig;
  title: string;
  description?: string;
};

const ChartAreaInteractive = (props: ChartAreaInteractiveProps) => {
  const { dataSources, chartConfig, title, description = "" } = props;
  const isMobile = useIsMobile();
  const [selectedSource, setSelectedSource] = useState<string>(
    dataSources[0]?.label || "",
  );
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  const filterByDateRange = (
    data: DataItem[],
    range: DateRange | undefined,
  ): DataItem[] => {
    if (!range || !range.from || !range.to) {
      return data;
    }

    const fromTime = range.from.getTime();
    const toTime = range.to.getTime();

    return data.filter((item) => {
      const itemTime = new Date(item.time).getTime();
      return itemTime >= fromTime && itemTime <= toTime;
    });
  };

  const handleDateChange = (date: DateRange | undefined) => {
    setDateRange(date);
  };

  const selectedDataSource = dataSources.find(
    (source) => source.label === selectedSource,
  );
  const filteredData = filterByDateRange(
    selectedDataSource?.data || [],
    dateRange,
  );
  const hasData = filteredData && filteredData.length > 0;
  const uniqueKeys = Array.from(
    new Set(
      filteredData.flatMap((item) =>
        Object.keys(item).filter((key) => key !== "time"),
      ),
    ),
  );

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">{description}</span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <CardAction>
          <div className="flex max-w-[50vw] flex-wrap items-center justify-end gap-2 sm:max-w-full">
            <DateRangePicker onDateChange={handleDateChange} />
            {dataSources.length > 1 && (
              <Select value={selectedSource} onValueChange={setSelectedSource}>
                <SelectTrigger className="w-auto">
                  <SelectValue placeholder="Select data source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Choose data source</SelectLabel>
                    {dataSources.map((source) => (
                      <SelectItem key={source.label} value={source.label}>
                        {source.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          {hasData ? (
            <AreaChart className="ml-0 pl-0" data={filteredData}>
              <defs>
                {uniqueKeys.map((key, index) => {
                  return (
                    <linearGradient
                      id={`gradient-${key}`}
                      key={`gradient-${key}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={
                          chartConfig[key]?.color || "var(--default-color)"
                        }
                        stopOpacity={0}
                      />
                      <stop
                        offset="95%"
                        stopColor={
                          chartConfig[key]?.color || "var(--default-color)"
                        }
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  );
                })}
              </defs>
              <CartesianGrid vertical={true} />
              <XAxis
                dataKey="time"
                scale="time"
                type="number"
                domain={["dataMin", "dataMax"]}
                tickMargin={8}
                minTickGap={50}
                interval="preserveStartEnd"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  const formattedDate = date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                  });

                  return formattedDate;
                }}
              />
              <YAxis
                domain={["auto", "auto"]}
                label={
                  isMobile
                    ? undefined
                    : {
                        value: selectedDataSource?.unit,
                        angle: -90,
                        position: "insideLeft",
                      }
                }
              />
              <ChartTooltip
                cursor
                defaultIndex={isMobile ? -1 : 10}
                content={
                  <ChartTooltipContent
                    labelClassName="font-mono"
                    labelFormatter={(_, payload) => {
                      if (payload && payload.length > 0) {
                        const timeValue = payload[0].payload.time;
                        const date = new Date(timeValue);
                        return date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        });
                      }
                      return "";
                    }}
                    indicator="dot"
                  />
                }
              />
              {uniqueKeys.map((key) => {
                const color = chartConfig[key]?.color || "var(--default-color)";
                return (
                  <Area
                    key={key}
                    dataKey={key}
                    type="monotone"
                    fill={`url(#gradient-${key})`}
                    fillOpacity={0.1}
                    stroke={color}
                    strokeWidth={2.5}
                    stackId="a"
                  />
                );
              })}
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          ) : (
            <div className="text-md *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card flex h-full items-center justify-center rounded-sm border-1 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">
              No data available. Choose a different date range.
            </div>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

const MemoChartAreaInteractive = memo(ChartAreaInteractive);
export default MemoChartAreaInteractive;
