import { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const months = [
  { label: "January", value: "1" },
  { label: "February", value: "2" },
  { label: "March", value: "3" },
  { label: "April", value: "4" },
  { label: "May", value: "5" },
  { label: "June", value: "6" },
  { label: "July", value: "7" },
  { label: "August", value: "8" },
  { label: "September", value: "9" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" },
];

const currentYear = new Date().getFullYear();

const fetchUserGrowthData = async ({ token, startMonth, endMonth, year }) => {
  if (!token) return null;

  const response = await axios.get(
    `https://api.vigoplace.com/api/admin/console/users/growth`,
    {
      headers: { Authorization: token },
      params: { startMonth, endMonth, year },
    }
  );

  return response?.data?.data;
};

const UserGrowth = () => {
  const { data: sessionData } = useSession();
  const token = sessionData?.user?.token;

  const [startMonth, setStartMonth] = useState("1");
  const [endMonth, setEndMonth] = useState(
    (new Date().getMonth() + 1).toString()
  );
  const [year, setYear] = useState(currentYear.toString());
  const [filterApplied, setFilterApplied] = useState(false);

  const {
    data: userGrowthData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      "userGrowthData",
      token,
      startMonth,
      endMonth,
      year,
      filterApplied,
    ],
    queryFn: () =>
      fetchUserGrowthData({
        token,
        startMonth: Number(startMonth),
        endMonth: Number(endMonth),
        year: Number(year),
      }),
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
    cacheTime: 30 * 60 * 1000, // Cache kept for 30 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });

  const handleSearch = () => setFilterApplied(true);

  const { categories, data, columnWidthPercentage } = useMemo(() => {
    if (!userGrowthData)
      return { categories: [], data: [], columnWidthPercentage: "40%" };
    const categories = Object.keys(userGrowthData);
    const data = Object.values(userGrowthData);
    const columnWidth =
      categories.length <= 3 ? "80%" : categories.length <= 6 ? "60%" : "42%";
    return { categories, data, columnWidthPercentage: columnWidth };
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
        categories: categories.map((month) => month.slice(0, 3)),
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

  const chartSeries = useMemo(
    () => [{ name: "User Growth By Months", data }],
    [data]
  );

  const hasData = useMemo(() => data.some((value) => value > 0), [data]);

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">
          Monthly User Growth
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filter Controls */}
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <Select value={startMonth} onValueChange={setStartMonth}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Start Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="text-muted-foreground">to</span>

          <Select value={endMonth} onValueChange={setEndMonth}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="End Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {[
                currentYear,
                currentYear - 1,
                currentYear - 2,
                currentYear - 3,
              ].map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={handleSearch}>Search</Button>
        </div>

        {/* Chart Area */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-72">
            <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
            <p className="text-sm text-muted-foreground">
              Loading growth data...
            </p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-72">
            <p className="text-sm text-destructive">
              Failed to fetch user growth data
            </p>
          </div>
        ) : !hasData ? (
          <div className="flex flex-col items-center justify-center h-72">
            <Loader2 className="h-8 w-8 text-muted-foreground animate-spin mb-2" />
            <p className="text-sm text-muted-foreground">No data available</p>
          </div>
        ) : (
          <div className="h-72">
            <ApexChart
              options={chartOptions}
              series={chartSeries}
              type="bar"
              height="100%"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserGrowth;
