"use client";

import * as React from "react";
import { IconCalendar as CalendarIcon } from "@tabler/icons-react";
import { format, startOfMonth, startOfYear, subDays } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePreset {
  label: string;
  range: {
    from: Date;
    to?: Date;
  };
}

interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  numberOfMonths?: 1 | 2 | 3 | 4 | 5 | 6;
  presets?: DateRangePreset[];
  onDateChange?: (date: DateRange | undefined) => void;
}

export function DateRangePicker(props: DateRangePickerProps) {
  const { numberOfMonths = 1, presets, className, onDateChange } = props;

  const [date, setDate] = React.useState<DateRange | undefined>();

  const handlePresetSelect = (preset: DateRangePreset) => {
    const newDate = {
      from: preset.range.from,
      to: preset.range.to,
    };
    setDate(newDate);
    onDateChange?.(newDate);
  };

  const handleDateSelect = (range: DateRange | undefined) => {
    setDate(range);
    onDateChange?.(range);
  };

  const normalizeDate = (date: Date) => {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  };

  const defaultPresets: DateRangePreset[] = [
    {
      label: "Today",
      range: {
        from: normalizeDate(new Date()),
        to: new Date(),
      },
    },
    {
      label: "Yesterday",
      range: {
        from: subDays(new Date(), 1),
        to: subDays(new Date(), 1),
      },
    },
    {
      label: "Last 7 Days",
      range: {
        from: subDays(new Date(), 6),
        to: new Date(),
      },
    },
    {
      label: "Last 30 Days",
      range: {
        from: subDays(new Date(), 29),
        to: new Date(),
      },
    },
    {
      label: "Month to Now",
      range: {
        from: startOfMonth(new Date()),
        to: new Date(),
      },
    },
    {
      label: "Year to Now",
      range: {
        from: startOfYear(new Date()),
        to: new Date(),
      },
    },
    {
      label: "This Year",
      range: {
        from: new Date(new Date().getFullYear(), 0, 1),
        to: new Date(),
      },
    },
  ];
  const allPresets = presets ?? defaultPresets;

  return (
    <div className={cn("inline-flex", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "max-w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y ")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="flex w-auto flex-col items-center sm:flex-row"
          align="end"
          avoidCollisions
          collisionPadding={8}
        >
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateSelect}
            disabled={(date) => date > new Date()}
            numberOfMonths={numberOfMonths}
          />
          <div className="p-4">
            <h4 className="scroll-m-20 py-2 text-lg font-semibold tracking-tight">
              Presets
            </h4>
            <div className="flex max-w-[200px] flex-wrap gap-2">
              {allPresets.map((preset) => (
                <Button
                  variant={
                    date
                      ? normalizeDate(preset.range.from).getTime() ===
                          normalizeDate(date?.from ?? new Date()).getTime() &&
                        normalizeDate(preset.range.to!).getTime() ===
                          normalizeDate(date?.to ?? new Date()).getTime()
                        ? "default"
                        : "outline"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => handlePresetSelect(preset)}
                  key={preset.label}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
