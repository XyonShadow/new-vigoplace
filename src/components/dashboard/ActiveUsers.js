"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const fetchMonthlyActiveUsers = async ({
  token,
  startMonth,
  endMonth,
  year,
}) => {
  if (!token) return null;

  const response = await axios.get(
    `https://api.vigoplace.com/api/admin/console/users/activitycount`,
    {
      headers: { Authorization: token },
      params: { startMonth, endMonth, year },
    }
  );

  return response?.data?.data;
};

const ActiveUsers = () => {
  const { data: sessionData } = useSession();
  const token = sessionData?.user?.token;

  const currentYear = new Date().getFullYear();

  const [startMonth, setStartMonth] = useState(1);
  const [endMonth, setEndMonth] = useState(
    (new Date().getMonth() + 1).toString()
  );
  const [year, setYear] = useState(currentYear);

  const [searchParams, setSearchParams] = useState(null);

  const {
    data: userActivityData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["monthlyActiveUsers", searchParams, startMonth, endMonth, year],
    queryFn: () =>
      fetchMonthlyActiveUsers({
        token: token ?? "",
        startMonth: searchParams?.startMonth ?? 1,
        endMonth: searchParams?.endMonth ?? 12,
        year: searchParams?.year ?? new Date().getFullYear(),
      }),
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
    cacheTime: 30 * 60 * 1000, // Cache kept for 30 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });

  const handleSearch = () => {
    if (startMonth > endMonth)
      return alert("Start month must be before end month.");
    setSearchParams({ startMonth, endMonth, year });
  };

  const monthOptions = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const { categories, data, columnWidthPercentage } = useMemo(() => {
    if (!userActivityData)
      return { categories: [], data: [], columnWidthPercentage: "40%" };

    const categories = Object.keys(userActivityData);
    const data = Object.values(userActivityData);

    let columnWidthPercentage;
    if (categories.length <= 3) {
      columnWidthPercentage = "80%";
    } else if (categories.length <= 6) {
      columnWidthPercentage = "60%";
    } else {
      columnWidthPercentage = "42%";
    }

    return { categories, data, columnWidthPercentage };
  }, [userActivityData]);

  const chartOptions = useMemo(() => {
    const maxYValue = data.length > 0 ? Math.max(...data) : 0;
    const yAxisMax = Math.ceil(maxYValue / 100) * 100;

    return {
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: columnWidthPercentage,
          borderRadius: 5,
        },
      },
      colors: ["#6366f1"],
      chart: {
        toolbar: { show: false },
        fontFamily: "var(--font-sans)",
        background: "transparent",
      },
      dataLabels: { enabled: false },
      grid: {
        borderColor: "rgba(0,0,0,0.1)",
        strokeDashArray: 2,
      },
      xaxis: {
        categories: categories.map((month) => month.slice(0, 3)),
        labels: {
          style: { colors: "hsl(var(--foreground))" },
        },
      },
      yaxis: {
        min: 0,
        max: yAxisMax,
        tickAmount: 3,
        labels: {
          style: { colors: "hsl(var(--foreground))" },
        },
      },
      tooltip: { theme: "light" },
    };
  }, [categories, data, columnWidthPercentage]);

  const chartSeries = [{ name: "Monthly Active Users", data }];

  const hasData = useMemo(() => data.some((value) => value > 0), [data]);

  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-medium mb-2">
          Monthly Active Users
        </CardTitle>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={startMonth.toString()}
            onValueChange={(val) => setStartMonth(Number(val))}
          >
            <SelectTrigger className="w-[120px] h-9 text-sm">
              <SelectValue placeholder="Start" />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map(({ value, label }) => (
                <SelectItem key={value} value={value.toString()}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="text-sm">to</span>

          <Select
            value={endMonth.toString()}
            onValueChange={(val) => setEndMonth(Number(val))}
          >
            <SelectTrigger className="w-[120px] h-9 text-sm">
              <SelectValue placeholder="End" />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map(({ value, label }) => (
                <SelectItem key={value} value={value.toString()}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={year.toString()}
            onValueChange={(val) => setYear(Number(val))}
          >
            <SelectTrigger className="w-[100px] h-9 text-sm">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {[...Array(4)].map((_, i) => {
                const y = currentYear - i;
                return (
                  <SelectItem key={y} value={y.toString()}>
                    {y}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          <Button onClick={handleSearch} className="h-9">
            Search
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-72">
            <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
            <p className="text-sm text-muted-foreground">
              Loading user data...
            </p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-72">
            <p className="text-sm text-destructive">
              Failed to fetch user activity data
            </p>
          </div>
        ) : !hasData ? (
          <div className="flex items-center justify-center h-72">
            <p className="text-sm text-muted-foreground">
              No data available for this period
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

export default ActiveUsers;
