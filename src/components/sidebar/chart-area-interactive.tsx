"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
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
  type ChartConfig,
} from "@/components/ui/chart";

export const description = "An interactive area chart";

const chartConfig = {
  enrollments: {
    label: "Enrollments",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive({
  data,
}: {
  data: { date: string; enrollments: number }[];
}) {
  const enrollmentsCount = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.enrollments, 0);
  }, [data]);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Enrollments</CardTitle>
        <CardDescription>
          <span className="text-muted-foreground hidden @[540px]/card:block">
            Total enrollments for the last 30 days: {enrollmentsCount}
          </span>
          <span className="@[540px]/card:hidden">Last 30 days: 1200</span>
        </CardDescription>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px]"
          >
            <BarChart
              data={data}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                tickLine={false}
                dataKey="date"
                axisLine={false}
                tickMargin={8}
                interval={"preserveStartEnd"}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                  });
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    labelFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                      });
                    }}
                  />
                }
              />
              <Bar dataKey="enrollments" fill={chartConfig.enrollments.color} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </CardHeader>
    </Card>
  );
}
