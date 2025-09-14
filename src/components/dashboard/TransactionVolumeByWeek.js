"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import dynamic from "next/dynamic";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Dynamically import ApexCharts
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

const YEARS = [2022, 2023, 2024, 2025, 2026];

const fetchFilteredtransactionUsers = async (token, week, month, year) => {
  const response = await axios.get(
    "https://api.vigoplace.com/api/admin/console/users/payouts/days",
    {
      headers: { Authorization: token },
      params: { week, month, year },
    }
  );

  return response.data?.data;
};

const TransactionVolumeByWeek = () => {
  const { data: sessionData } = useSession();
  const token = sessionData?.user?.token;

  const currentDate = new Date();
  const currentWeek = Math.ceil(currentDate.getDate() / 7).toString();
  const currentMonth = currentDate.getMonth().toString();
  const currentYear = currentDate.getFullYear().toString();

  const [week, setWeek] = useState(currentWeek);
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);

  //  console.log('transaction month', month)

  const {
    data: userVolumeTransactionData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["dailyTransactionVolumeUsers", week, month, year],
    queryFn: () =>
      fetchFilteredtransactionUsers(
        token,
        Number(week),
        Number(month),
        Number(year)
      ),
    enabled: !!token,
  });

  const { categories, data, columnWidthPercentage } = useMemo(() => {
    if (!userVolumeTransactionData)
      return { categories: [], data: [], columnWidthPercentage: "40%" };

    const categories = Object.keys(userVolumeTransactionData);
    const data = Object.values(userVolumeTransactionData);

    let columnWidthPercentage;
    if (categories.length <= 3) columnWidthPercentage = "80%";
    else if (categories.length <= 5) columnWidthPercentage = "60%";
    else if (categories.length <= 7) columnWidthPercentage = "40%";
    else columnWidthPercentage = "30%";

    return { categories, data, columnWidthPercentage };
  }, [userVolumeTransactionData]);

  const chartOptions = useMemo(() => {
    const maxY = data.length > 0 ? Math.max(...data) : 0;
    const yAxisMax = Math.ceil(maxY / 100) * 100;

    return {
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: columnWidthPercentage,
          borderRadius: 5,
          borderRadiusApplication: "end",
        },
      },
      chart: {
        toolbar: { show: false },
        fontFamily: "var(--font-sans)",
        background: "transparent",
      },
      xaxis: {
        categories: categories.map((d) => d.slice(0, 3)),
        labels: { style: { colors: "hsl(var(--foreground))" } },
        axisBorder: { color: "rgba(0,0,0,0.1)" },
        axisTicks: { color: "rgba(0,0,0,0.1)" },
      },
      yaxis: {
        min: 0,
        max: yAxisMax,
        tickAmount: 3,
        labels: {
          style: { colors: "hsl(var(--foreground))" },
          formatter: (val) => {
            // Use Intl.NumberFormat if you need locale control
            return val != null ? Number(val).toLocaleString() : "0";
          },
        },
      },
      colors: ["#6366f1"],
      dataLabels: {
        // enable if you want numbers on each bar
        enabled: false,
        formatter: (val) => {
          return val != null ? Number(val).toLocaleString() : "0";
        },
      },
      grid: { borderColor: "rgba(0,0,0,0.1)", strokeDashArray: 2 },
      tooltip: {
        theme: "light",
        y: {
          formatter: (val) => {
            return val != null ? Number(val).toLocaleString() : "0";
          },
        },
      },
    };
  }, [categories, data, columnWidthPercentage]);

  const chartSeries = [{ name: "Daily transaction Volume", data }];

  const hasData = data.some((v) => v > 0);

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">
          Daily transaction volume
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <Select value={week} onValueChange={setWeek}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select Week" />
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
                <SelectItem key={idx} value={idx.toString()}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {YEARS.map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={() => refetch()}>Search</Button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-72">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">
              Loading transaction data...
            </p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-72">
            <p className="text-sm text-destructive">Failed to fetch data</p>
          </div>
        ) : !hasData ? (
          <div className="flex items-center justify-center h-72">
            <p className="text-sm text-muted-foreground">
              No data for selected week
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

export default TransactionVolumeByWeek;
