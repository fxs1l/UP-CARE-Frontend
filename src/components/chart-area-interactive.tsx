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

import { DateRange } from "react-day-picker";
import { cn } from "../lib/utils";
import useDateRangeStore from "@/hooks/use-date";
import { ResponsiveLineCanvas } from "@nivo/line";

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
  className?: string;
  renderCard?: boolean;
};

const ChartAreaInteractive = (props: ChartAreaInteractiveProps) => {
  const {
    dataSources,
    chartConfig,
    title,
    description = "",
    className,
    renderCard = true,
  } = props;
  const isMobile = useIsMobile();
  const [selectedSource, setSelectedSource] = useState<string>(
    dataSources[1]?.label || "",
  );
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  // const { dateRange, setDateRange } = useDateRangeStore();

  // const filterByDateRange = (
  //   data: DataItem[],
  //   range: DateRange | undefined,
  // ): DataItem[] => {
  //   if (!range || !range.from || !range.to) {
  //     return data;
  //   }

  //   const fromTime = range.from.getTime();
  //   const toTime = range.to.getTime();

  //   return data.filter((item) => {
  //     const itemTime = new Date(item.time).getTime();
  //     return itemTime >= fromTime && itemTime <= toTime;
  //   });
  // };

  // const handleDateChange = (date: DateRange | undefined) => {
  //   setDateRange(date);
  // };

  const selectedDataSource = dataSources.find(
    (source) => source.label === selectedSource,
  );
  // const filteredData = filterByDateRange(
  //   selectedDataSource?.data || [],
  //   dateRange,
  // );
  // const selectedData = selectedDataSource
  //   ? selectedDataSource?.data.map((item) => ({
  //       time: new Date(item.time).getTime(), // Ensure time is in milliseconds
  //     }))
  //   : [];
  // const hasData = selectedData && selectedData.length > 0;
  // const uniqueKeys = Array.from(
  //   new Set(
  //     selectedData.flatMap((item) =>
  //       Object.keys(item).filter((key) => key !== "time"),
  //     ),
  //   ),
  // );

  // const nivoData = uniqueKeys.map((key) => ({
  //   id: key,
  //   data: selectedData.map((data) => ({
  //     x: new Date(data.time).toISOString(),
  //     y: data[key],
  //   })),
  // }));

  const Chart = (
    <ResponsiveLineCanvas
      data={nivoData}
      // margin={{ top: 10, right: 30, bottom: 40, left: isMobile ? 30 : 60 }}
      xScale={{
        type: "time",
        format: "%Y-%m-%dT%H:%M:%S.%LZ",
        precision: "minute",
      }}
      xFormat="time:%b %d, %H:%M"
      yScale={{ type: "linear", min: "auto", max: "auto", stacked: false }}
      axisBottom={{
        format: "%b %d",
        tickRotation: -25,
        legend: "",
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={
        isMobile
          ? null
          : {
              legend: selectedDataSource?.unit || "",
              legendOffset: -40,
              legendPosition: "middle",
            }
      }
      enablePoints={false}
      enableArea={true}
      areaBaselineValue={0}
      areaOpacity={0.1}
      colors={({ id }) => chartConfig[id as string]?.color ?? "#ccc"}
      // pixelRatio={window.devicePixelRatio || 1}
    />
  );

  // const Chart = (
  //   <ChartContainer
  //     config={chartConfig}
  //     className="aspect-auto h-[250px] w-full rounded-none"
  //   >
  //     {hasData ? (
  //       <AreaChart      {/* {JSON.stringify(nivoData[0]?.data)} */}
  //         data={selectedData}
  //         margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
  //       >
  //         <defs>
  //           {uniqueKeys.map((key, index) => {
  //             return (
  //               <linearGradient
  //                 id={`gradient-${key}`}
  //                 key={`gradient-${key}`}
  //                 x1="0"
  //                 y1="0"
  //                 x2="0"
  //                 y2="1"
  //               >
  //                 <stop
  //                   offset="5%"
  //                   stopColor={
  //                     chartConfig[key]?.color || "var(--default-color)"
  //                   }
  //                   stopOpacity={0}
  //                 />
  //                 <stop
  //                   offset="95%"
  //                   stopColor={
  //                     chartConfig[key]?.color || "var(--default-color)"
  //                   }
  //                   stopOpacity={0.1}
  //                 />
  //               </linearGradient>
  //             );
  //           })}
  //         </defs>
  //         <CartesianGrid vertical={true} strokeDasharray="3 3" />
  //         <XAxis
  //           dataKey="time"
  //           scale="time"
  //           type="number"
  //           domain={["dataMin", "dataMax"]}
  //           tickMargin={8}
  //           minTickGap={50}
  //           interval="preserveStartEnd"
  //           tickFormatter={(value) => {
  //             const date = new Date(value);
  //             const formattedDate = date.toLocaleDateString("en-US", {
  //               month: "short",
  //               day: "numeric",
  //               hour: "2-digit",
  //             });

  //             return formattedDate;
  //           }}
  //         />
  //         <YAxis
  //           domain={["auto", "auto"]}
  //           label={
  //             isMobile
  //               ? undefined
  //               : {
  //                   value: selectedDataSource?.unit,
  //                   angle: -90,
  //                   position: "insideLeft",
  //                 }
  //           }
  //         />
  //         <ChartTooltip
  //           cursor
  //           content={
  //             <ChartTooltipContent
  //               labelClassName="font-mono"
  //               labelFormatter={(_, payload) => {
  //                 if (payload && payload.length > 0) {
  //                   const timeValue = payload[0].payload.time;
  //                   const date = new Date(timeValue);
  //                   return date.toLocaleDateString("en-US", {
  //                     month: "short",
  //                     day: "numeric",
  //                     hour: "2-digit",
  //                     minute: "2-digit",
  //                     second: "2-digit",
  //                   });
  //                 }
  //                 return "";
  //               }}
  //               indicator="dot"
  //             />
  //           }
  //         />
  //         {uniqueKeys.map((key) => {
  //           const color = chartConfig[key]?.color || "var(--default-color)";
  //           return (
  //             <Area
  //               key={key}
  //               dataKey={key}
  //               type="monotone"
  //               fill={`url(#gradient-${key})`}
  //               fillOpacity={0.1}
  //               stroke={color}
  //               strokeWidth={2.5}
  //               // stackId="a"
  //             />
  //           );
  //         })}
  //         <ChartLegend content={<ChartLegendContent />} />
  //       </AreaChart>
  //     ) : (
  //       <div className="text-md bg-accent flex h-full items-center justify-center rounded-sm border-1 text-center">
  //         No data available. Choose a different date range.
  //       </div>
  //     )}
  //   </ChartContainer>
  // );

  const CardWithChart = (
    <Card className={cn("@container/card", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          <span> First object in selected data </span>
          <pre>{JSON.stringify(selectedData[0])}</pre>
          <span> First object in nivodData</span>
          <pre>{JSON.stringify(nivoData[0]?.data)}</pre>
          <span> Unique keys in selected data</span>
          <pre>{JSON.stringify(uniqueKeys)}</pre>
          <span className="hidden @[540px]/card:block">{description}</span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <CardAction>
          <div className="flex flex-wrap items-center justify-end gap-2">
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
        {/* <pre>{JSON.stringify(nivoData[0])}</pre> */}
        {Chart}
      </CardContent>
    </Card>
  );

  if (renderCard) {
    return CardWithChart;
  }
  return Chart;
};

const MemoChartAreaInteractive = memo(ChartAreaInteractive);
export default MemoChartAreaInteractive;
