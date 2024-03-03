import { Card, CardContent, Typography, Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import BaseCard from "../baseCard/BaseCard";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const UserGrowthByWeek = () => {
  const [userGrowthData, setUserGrowthData] = useState(null);
  const [cumulativeData, setCumulativeData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [maxYValue, setMaxYValue] = useState(0);
  const getUser = useSession();
  const user = getUser?.data?.user;
  const router = useRouter();

  useEffect(() => {
    const fetchUserGrowthData = async () => {
      try {
        const response = await axios.get(
          "https://vigoplace.com/server/api/admin/console/users/growth/days",
          {
            headers: {
              Authorization: user?.token,
            },
          }
        );
        setUserGrowthData(response?.data?.data);
      } catch (error) {
        console.log("Error fetching daily user growth count:", error);
      }
    };

    fetchUserGrowthData();
  }, []);

  useEffect(() => {
    if (userGrowthData) {
      const { cumulativeData, dailyData } = generateChartData();
      setCumulativeData(cumulativeData);
      setDailyData(dailyData);

      const maxCumulativeValue = Math.max(...cumulativeData);
      const maxDailyValue = Math.max(...dailyData);
      const maxYValue = Math.max(maxCumulativeValue, maxDailyValue);

      const yAxisMaxx = Math.ceil(maxYValue / 100) * 100;
      setMaxYValue(yAxisMaxx);
    }
  }, [userGrowthData]);

  const generateChartData = () => {
    if (!userGrowthData)
      return {
        categories: [],
        cumulativeData: [],
        dailyData: [],
        numObjects: 0,
      };

    const categories = Object.keys(userGrowthData);
    const cumulativeData = [];
    const dailyData = [];

    for (const category of categories) {
      const dayData = userGrowthData[category];
      cumulativeData.push(dayData.cumulativeTotal);
      dailyData.push(dayData.dailyTotal);
    }

    const numObjects = categories.length * 2; // Two objects for each day
    const columnWidthPercentage = calculateColumnWidth(numObjects);

    return { categories, cumulativeData, dailyData, columnWidthPercentage };
  };

  const calculateColumnWidth = (numObjects) => {
    if (numObjects <= 14) {
      return "80%";
    } else if (numObjects <= 28) {
      return "60%";
    } else {
      return "42%";
    }
  };

  const { categories, columnWidthPercentage } = generateChartData();

  const optionsActiveUsers = {
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
      categories: categories.map((day) => day.slice(0, 3)),
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
  };

  const seriesActiveUsers = [
    {
      name: "User Cummulative Growth",
      data: cumulativeData,
    },
    {
      name: "User Growth By Day",
      data: dailyData,
    },
  ];

  if (
    !cumulativeData.some((value) => value !== 0) &&
    !dailyData.some((value) => value !== 0)
  ) {
    return (
      <BaseCard title="Daily Users Growth">
        <Typography variant="body1" style={{ height: "310px" }}>
          No data available for this week.
        </Typography>
      </BaseCard>
    );
  }

  return (
    <BaseCard title="Daily Users Growth">
      <Chart
        options={optionsActiveUsers}
        series={seriesActiveUsers}
        type="bar"
        height="295px"
      />
    </BaseCard>
  );
};

export default UserGrowthByWeek;
