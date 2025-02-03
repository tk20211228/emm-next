"use client";

import { HardwareStatusSourceType } from "@/app/types/device";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatToJapaneseDateTime } from "@/lib/date-fns/get-date";
import { isWithinInterval, parseISO, subDays } from "date-fns";
import { RefreshCcwIcon } from "lucide-react";
import { useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import SelectTimeButton from "./select-time-button";

export function HardwareSkinTemperatureChart({
  hardwareStatus,
}: {
  hardwareStatus: HardwareStatusSourceType;
}) {
  const [timeRange, setTimeRange] = useState("30d");
  const { skinTemperaturesChartItem } = hardwareStatus;
  const skinTemperaturesChartConfig = skinTemperaturesChartItem.chartConfig;
  const [selectedSkins, setSelectedSkins] = useState<string[]>(
    Object.keys(skinTemperaturesChartConfig)
  );
  const chartSource = skinTemperaturesChartItem.chart;
  const filteredChartSource = chartSource.filter((item) => {
    const date = parseISO(item.date);
    const referenceDate = parseISO(chartSource[chartSource.length - 1].date); // 最新の日付
    let daysToSubtract = 30;
    if (timeRange === "15d") {
      daysToSubtract = 15;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    } else if (timeRange === "3d") {
      daysToSubtract = 3;
    } else if (timeRange === "1d") {
      daysToSubtract = 1;
    }
    // 日付が範囲内かチェック
    return isWithinInterval(date, {
      start: subDays(referenceDate, daysToSubtract),
      end: referenceDate,
    });
  });
  // console.log("filteredChartSource", filteredChartSource);
  // console.log("filteredChartSource.length", filteredChartSource.length);

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>表面温度</CardTitle>
          <CardDescription>デバイスの表面温度を表示。</CardDescription>
        </div>
        <div className="flex flex-row gap-2 w-fit">
          {skinTemperaturesChartItem.configCount > 1 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">表示するデバイスの表面温度</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-fit px-3">
                <Button
                  variant="ghost"
                  className="w-full h-10"
                  onClick={() =>
                    setSelectedSkins(Object.keys(skinTemperaturesChartConfig))
                  }
                >
                  <RefreshCcwIcon className="size-4" />
                  リセット
                </Button>
                <DropdownMenuSeparator />
                {Object.entries(skinTemperaturesChartConfig).map(
                  ([key, config]) => (
                    <DropdownMenuCheckboxItem
                      key={key}
                      checked={selectedSkins.includes(key)}
                      onCheckedChange={(checked) => {
                        setSelectedSkins((prev) =>
                          checked
                            ? [...prev, key]
                            : prev.filter((id) => id !== key)
                        );
                      }}
                      onSelect={(e) => e.preventDefault()}
                    >
                      {config.label}
                    </DropdownMenuCheckboxItem>
                  )
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {filteredChartSource.length >= 1 && (
            <SelectTimeButton
              timeRange={timeRange}
              setTimeRange={setTimeRange}
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:p-5">
        {filteredChartSource.length === 0 ? (
          <div className="flex h-[300px] w-full items-center justify-center rounded-lg border border-dashed">
            <div className="text-center">
              <p className="text-md font-bold tracking-widest text-muted-foreground">
                表面温度のデータはありません。
              </p>
            </div>
          </div>
        ) : (
          <ChartContainer
            config={skinTemperaturesChartConfig}
            className="aspect-auto h-[300px] w-full"
          >
            <LineChart data={filteredChartSource}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tickMargin={8}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => {
                  switch (timeRange) {
                    case "1d":
                      return formatToJapaneseDateTime(value, "HH:mm");
                    default:
                      return formatToJapaneseDateTime(value, "MM/dd");
                  }
                }}
              />
              <YAxis tickLine={false} axisLine={false} unit="℃" width={32} />
              <ChartTooltip
                cursor={false} // マウスカーソルを表示しない
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return formatToJapaneseDateTime(value);
                    }}
                    indicator="dot" // ドットを表示
                  />
                }
              />
              {Object.entries(skinTemperaturesChartConfig).map(
                ([key, config]) =>
                  selectedSkins.includes(key) && (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={config.color}
                      dot={false}
                    />
                  )
              )}
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
