"use client";

import * as React from "react";
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import SensorDataPoint from "@/lib/interfaces/sensor-data-point";
import { randomUUID } from "crypto";

// export const description = "An interactive area chart";

type ChartAreaInteractiveProps = {
  data: any[];
  chartConfig: ChartConfig;
  title: string;
  description?: string;
};

export function ChartAreaInteractive(props: ChartAreaInteractiveProps) {
  const { data, chartConfig, title, description } = props;
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("1d");
    }
  }, [isMobile]);

  const filteredData = data.filter((item) => {
    const date = new Date(item.time);
    const referenceDate = new Date();
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    } else if (timeRange === "1d") {
      daysToSubtract = 1;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  const uniqueKeys = Array.from(
    new Set(
      data.flatMap((item) => Object.keys(item).filter((key) => key !== "time")),
    ),
  );
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            {description}
            Total from all nodes for the last 3 months
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
            <ToggleGroupItem value="1d">Last 24 hours</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
              <SelectItem value="1d" className="rounded-lg">
                Last 24 hours
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          {filteredData && filteredData.length > 0 ? (
            <AreaChart data={filteredData}>
              <defs>
                {uniqueKeys.map((key, index) => {
                  console.log("key", key);
                  console.log("chartConfig", chartConfig);
                  console.log("chartConfig[key]", chartConfig[key]);
                  console.log(
                    "chartConfig[key]?.color",
                    chartConfig[key]?.color,
                  );
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
              <YAxis domain={["auto", "auto"]} />
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
                          // year: "numeric",
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

              {uniqueKeys.map((key, index) => {
                const color = chartConfig[key]?.color || "var(--default-color)";
                return (
                  <Area
                    key={crypto.randomUUID()}
                    dataKey={key}
                    type="natural"
                    fill={`url(#gradient-${key})`}
                    // fill="white"
                    fillOpacity={0.2}
                    stroke={color}
                    strokeWidth={2.5}
                    stackId="a"
                  />
                );
              })}
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          ) : (
            <div className="bg-muted/50 text-md flex h-full items-center justify-center rounded-sm border-1">
              No data available
            </div>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
