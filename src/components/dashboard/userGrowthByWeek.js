"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import dynamic from "next/dynamic";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const fetchWeeklyUserGrowthData = async ({ token, week, month, year }) => {
  if (!token) return null;

  const response = await axios.get(
    `https://api.vigoplace.com/api/admin/console/users/growth/days`,
    {
      params: { week, month, year },
      headers: { Authorization: token },
    }
  );

  return response?.data?.data;
};

const UserGrowthByWeek = () => {
  const { data: sessionData } = useSession();
  const token = sessionData?.user?.token;

  const currentDate = new Date();
  const currentWeek = Math.ceil(currentDate.getDate() / 7).toString();
  const currentMonth = currentDate.getMonth().toString(); 
  const currentYear = currentDate.getFullYear().toString();

  const [week, setWeek] = useState(currentWeek);
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);

  const [searchParams, setSearchParams] = useState({
    week: currentWeek,
    month: currentMonth,
    year: currentYear,
  });

  const {
    data: userGrowthData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["weeklyUserGrowthData", week, month, year],
    queryFn: () => fetchWeeklyUserGrowthData({ token, week, month, year }),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { categories, data, columnWidthPercentage } = useMemo(() => {
    if (!userGrowthData)
      return { categories: [], data: [], columnWidthPercentage: "40%" };

    const categories = Object.keys(userGrowthData);
    const data = Object.values(userGrowthData);

    let columnWidthPercentage = "30%";
    if (categories.length <= 3) columnWidthPercentage = "80%";
    else if (categories.length <= 5) columnWidthPercentage = "60%";
    else if (categories.length <= 7) columnWidthPercentage = "40%";

    return { categories, data, columnWidthPercentage };
  }, [userGrowthData]);

  const chartOptions = useMemo(() => {
    const maxYValue = data.length > 0 ? Math.max(...data) : 0;
    const yAxisMax = Math.ceil(maxYValue / 100) * 100;

    return {
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: columnWidthPercentage,
          borderRadius: 5,
          borderRadiusApplication: "end",
        },
      },
      colors: ["#6366f1"],
      fill: { type: "solid", opacity: 1 },
      chart: {
        toolbar: { show: false },
        fontFamily: "var(--font-sans)",
        background: "transparent",
      },
      dataLabels: { enabled: false },
      grid: {
        borderColor: "rgba(0, 0, 0, 0.1)",
        strokeDashArray: 2,
      },
      legend: { show: false },
      xaxis: {
        type: "category",
        categories: categories.map((d) => d.slice(0, 3)),
        labels: { style: { colors: "hsl(var(--foreground))" } },
        axisBorder: { color: "rgba(0, 0, 0, 0.1)" },
        axisTicks: { color: "rgba(0, 0, 0, 0.1)" },
      },
      yaxis: {
        show: true,
        min: 0,
        max: yAxisMax,
        tickAmount: 3,
        labels: { style: { colors: "hsl(var(--foreground))" } },
      },
      stroke: {
        show: true,
        width: 5,
        lineCap: "butt",
        colors: ["transparent"],
      },
      tooltip: { theme: "light" },
    };
  }, [categories, data, columnWidthPercentage]);

  const chartSeries = useMemo(() => [{ name: "User Growth", data }], [data]);

  const hasData = useMemo(() => data.some((value) => value > 0), [data]);

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">
          Weekly User Growth
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          <Select value={week} onValueChange={setWeek}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Week" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((w) => (
                <SelectItem key={w} value={w.toString()}>
                  Week {w}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((m, idx) => (
                <SelectItem key={idx} value={(idx + 1).toString()}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {[2022, 2023, 2024, 2025, 2026].map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={() => {
              setSearchParams({ week, month, year });
            }}
          >
            Search
          </Button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-72">
            <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
            <p className="text-sm text-muted-foreground">
              Loading weekly growth data...
            </p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-72">
            <p className="text-sm text-destructive">
              Failed to fetch weekly growth data
            </p>
          </div>
        ) : !hasData ? (
          <div className="flex flex-col items-center justify-center h-72">
            <p className="text-sm text-muted-foreground">
              No data available for this week
            </p>
          </div>
        ) : (
          <div className="h-72">
            <ApexChart
              options={chartOptions}
              series={chartSeries}
              type="bar"
              height="100%"
              width="100%"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserGrowthByWeek;
