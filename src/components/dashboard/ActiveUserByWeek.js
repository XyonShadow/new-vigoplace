import { Card, CardContent, Typography, Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import BaseCard from "../baseCard/BaseCard";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
//import Chart from 'react-apexcharts'

const ActiveUserByWeek = () => {
  const [userActivityData, setUserActivityData] = useState(null);
  const getUser = useSession();
  const user = getUser?.data?.user;
  const router = useRouter();

  useEffect(() => {
    const fetchActiveUsersData = async () => {
      try {
        const response = await axios.get(
          "https://vigoplace.com/server/api/admin/console/users/activitycountdays",
          //"http://localhost:4000/api/admin/console/users/activitycount",
          {
            headers: {
              Authorization: user?.token,
            },
          }
        );
        //console.log(response);
        setUserActivityData(response?.data?.data);
      } catch (error) {
        console.log("Error fetching user activity count:", error);
      }
    };

    fetchActiveUsersData();
  }, []);

  const generateChartData = () => {
    if (!userActivityData) return { categories: [], data: [] };

    const categories = Object.keys(userActivityData);
    const data = Object.values(userActivityData);
    const columnWidthPercentage = calculateColumnWidth(categories.length);

    return { categories, data, columnWidthPercentage };
  };

  const calculateColumnWidth = (numDays) => {
    // Adjust the column width dynamically based on the number of days
    if (numDays <= 3) {
      return "80%"; // Adjust as needed
    } else if (numDays <= 5) {
      return "60%"; // Adjust as needed
    } else if (numDays <= 7) {
      return "40%"; // Adjust as needed
    } else {
      return "30%"; // Default width for more than 7 days
    }
  };

  const { categories, data, columnWidthPercentage } = generateChartData();

  const maxYValue = data.reduce((max, value) => Math.max(max, value), 0);
  const yAxisMax = Math.ceil(maxYValue / 100) * 100; // Round up to the nearest hundred

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
        //endingShape: "rounded",
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
      max: yAxisMax,
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
      name: "Active Users",
      data: data,
    },
  ];

  // Render a message if there is no data available for the current week
  if (!data.some((value) => value !== 0)) {
    return (
      <BaseCard title="Daily Active Users">
        <Typography variant="body1" style={{ height: "310px" }}>
          No data available for this week.
        </Typography>
      </BaseCard>
    );
  }

  return (
    <BaseCard title="Daily Active Users">
      <Chart
        options={optionsactiveusers}
        series={seriesactiveusers}
        type="bar"
        height="295px"
      />
    </BaseCard>
  );
};

export default ActiveUserByWeek;
