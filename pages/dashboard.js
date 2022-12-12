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
import {useSession} from 'next-auth/react'

export default function Index() {
  const { data, status } = useSession()
  console.log({data, status})

  return (
    <>
      <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth={false}>
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <Budget />
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <TotalCustomers />
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <TasksProgress />
          </Grid>
          <Grid
            item
            xl={3}
            lg={3}
            sm={6}
            xs={12}
          >
            <TotalProfit />
          </Grid>
          <Grid
            item
            lg={12}
            md={12}
            xl={12}
            xs={12}
          >
            <LatestOrders />
          </Grid>
        </Grid>
      </Container>
    </Box>
    <Grid container spacing={0}>

      <Grid item xs={12} lg={12}>
        <SalesOverview/>
      </Grid>
      {/* ------------------------- row 1 ------------------------- */}
      <Grid item xs={12} lg={4}>
        <DailyActivity />
      </Grid>
      <Grid item xs={12} lg={8}>
        <ProductPerfomance />
      </Grid>
      {/* <Grid item xs={12} lg={12}>
        <BlogCard />
      </Grid> */}
    </Grid>
    </>
  );
}

Index.auth = true

