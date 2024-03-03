import { Card, CardContent, Typography, Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import BaseCard from "../baseCard/BaseCard";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
//import Chart from 'react-apexcharts'

const userGrowth = () => {
  const [userGrowthData, setUserGrowthData] = useState(null);
  const [cumulativeData, setCumulativeData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [maxYValue, setMaxYValue] = useState(0);
  const getUser = useSession();
  const user = getUser?.data?.user;
  const router = useRouter();

  useEffect(() => {
    const fetchUserGrowthData = async () => {
      try {
        const response = await axios.get(
          "https://vigoplace.com/server/api/admin/console/users/growth",
          //"http://localhost:4000/api/admin/console/users/activitycount",
          {
            headers: {
              Authorization: user?.token,
            },
          }
        );
        //console.log(response);
        setUserGrowthData(response?.data?.data);
      } catch (error) {
        console.log("Error fetching user growth count:", error);
      }
    };

    fetchUserGrowthData();
  }, []);

  useEffect(() => {
    if (userGrowthData) {
      const { cumulativeData, monthlyData } = generateChartData();
      setCumulativeData(cumulativeData);
      setMonthlyData(monthlyData);

      // Find the maximum value among cumulativeData and monthlyData
      const maxCumulativeValue = Math.max(...cumulativeData);
      const maxMonthlyValue = Math.max(...monthlyData);
      const maxYValue = Math.max(maxCumulativeValue, maxMonthlyValue);

      // Round up maxYValue to the nearest hundred
      const yAxisMaxx = Math.ceil(maxYValue / 100) * 100;
      setMaxYValue(yAxisMaxx);
    }
  }, [userGrowthData]);

  const generateChartData = () => {
    if (!userGrowthData)
      return {
        categories: [],
        cumulativeData: [],
        monthlyData: [],
        numObjects: 0,
      };

    const categories = Object.keys(userGrowthData);
    const cumulativeData = [];
    const monthlyData = [];

    for (const category of categories) {
      const monthData = userGrowthData[category];
      cumulativeData.push(monthData.cumulativeTotal);
      monthlyData.push(monthData.monthlyTotal);
    }

    const numObjects = categories.length * 2; // Two objects for each month
    const columnWidthPercentage = calculateColumnWidth(numObjects);

    return { categories, cumulativeData, monthlyData, columnWidthPercentage };
  };

  const calculateColumnWidth = (numObjects) => {
    // Adjust the column width dynamically based on the number of objects
    if (numObjects <= 6) {
      return "80%";
    } else if (numObjects <= 12) {
      return "60%";
    } else {
      return "42%";
    }
  };

  const { categories, columnWidthPercentage } = generateChartData();

  const optionsactiveusers = {
    // grid: {
    //   show: true,
    //   borderColor: "transparent",
    //   strokeDashArray: 2,
    //   padding: {
    //     left: 0,
    //     right: 0,
    //     bottom: 0,
    //   },
    // },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: columnWidthPercentage,
        // endingShape: "rounded",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },

    colors: ["#fb9678", "#03c9d7"],
    fill: {
      type: "solid",
      opacity: 1,
    },
    chart: {
      offsetX: -15,
      toolbar: {
        show: false,
      },
      foreColor: "#adb0bb",
      fontFamily: "'DM Sans',sans-serif",
      sparkline: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
    },
    legend: {
      show: false,
    },
    xaxis: {
      type: "category",
      categories: categories.map((month) => month.slice(0, 3)),
      labels: {
        style: {
          cssClass: "grey--text lighten-2--text fill-color",
        },
      },
    },
    yaxis: {
      show: true,
      min: 0,
      max: maxYValue,
      tickAmount: 3,
      labels: {
        style: {
          cssClass: "grey--text lighten-2--text fill-color",
        },
      },
    },
    stroke: {
      show: true,
      width: 5,
      lineCap: "butt",
      colors: ["transparent"],
    },
    // tooltip: {
    //   theme: "dark",
    // },
  };

  const seriesactiveusers = [
    {
      name: "User Cummulative Growth",
      data: cumulativeData,
    },
    {
      name: "User Growth By Month",
      data: monthlyData,
    },
  ];

  if (!cumulativeData.some((value) => value !== 0) && !monthlyData.some((value) => value !== 0)) {
    return (
      <BaseCard title="Daily Users Growth">
        <Typography variant="body1" style={{ height: "310px" }}>No data available for this year.</Typography>
      </BaseCard>
    );
  }

  return (
    <BaseCard title="Monthly Users Growth">
      <Chart
        options={optionsactiveusers}
        series={seriesactiveusers}
        type="bar"
        height="295px"
      />
    </BaseCard>
  );
};

export default userGrowth;
