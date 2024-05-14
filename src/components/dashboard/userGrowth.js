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
  const getUser = useSession();
  const user = getUser?.data?.user;
  const router = useRouter();

  useEffect(() => {
    const fetchUserGrowthData = async () => {
      try {
        const response = await axios.get(
          "https://api.vigoplace.com/api/admin/console/users/growth",
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

  const generateChartData = () => {
    if (!userGrowthData) return { categories: [], data: [] };

    const categories = Object.keys(userGrowthData);
    const data = Object.values(userGrowthData);
    const columnWidthPercentage = calculateColumnWidth(categories.length);

    return { categories, data, columnWidthPercentage };
  };

  const calculateColumnWidth = (numMonths) => {
    // Adjust the column width dynamically based on the number of months
    if (numMonths <= 3) {
      return "80%"; // Adjust as needed
    } else if (numMonths <= 6) {
      return "60%"; // Adjust as needed
    } else {
      return "42%"; // Default width for 12 months
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
    // dataLabels: {
    //   enabled: false,
    // },
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
      name: "User Growth By Months",
      data: data,
    },
  ];

  // Render a message if there is no data available for the current week
  if (!data.some((value) => value !== 0)) {
    return (
      <BaseCard title="Monthly User Growth">
        <Typography variant="body1" style={{ height: "310px" }}>
          No data available for this year.
        </Typography>
      </BaseCard>
    );
  }

  return (
    <BaseCard title="Monthly User Growth">
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
