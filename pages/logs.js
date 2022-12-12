import React from 'react'
import { Box, Container, Grid } from '@mui/material';
import BlogCard from "../src/components/dashboard/BlogCard";
import SalesOverview from "../src/components/dashboard/SalesOverview";
import DailyActivity from "../src/components/dashboard/DailyActivity";
import ProductPerfomance from "../src/components/dashboard/ProductPerfomance";
import { Budget } from "../src/components/dashboard/budget";
import { LatestOrders } from "../src/components/dashboard/latest-orders";
import { TasksProgress } from "../src/components/dashboard/tasks-progress";
import { TotalCustomers } from "../src/components/dashboard/total-customers";
import { TotalProfit } from "../src/components/dashboard/total-profit";

function ActivityLogs() {
  return (
    <>
  <Grid container spacing={0}>
    <Grid item xs={12} lg={12}>
      <DailyActivity />
    </Grid>
  </Grid>
  <h1>More Activity Logs Coming soon...</h1>
  </>
  )
}
ActivityLogs.auth = true
export default ActivityLogs