import React from 'react'
import { Box, Container, Grid } from '@mui/material';
import BlogCard from "../src/components/dashboard/BlogCard";
import SalesOverview from "../src/components/dashboard/SalesOverview";
import DailyActivity from "../src/components/dashboard/DailyActivity";
import TicketsTable from "../src/components/dashboard/ticketsTable";
import { Budget } from "../src/components/dashboard/budget";
import { LatestOrders } from "../src/components/dashboard/latest-orders";
import { TasksProgress } from "../src/components/dashboard/tasks-progress";
import { TotalCustomers } from "../src/components/dashboard/total-customers";
import { TotalProfit } from "../src/components/dashboard/total-profit";
import { TotalTickets } from "../src/components/dashboard/total-tickets";
import { ResolvedTickets } from "../src/components/dashboard/resolved-tickets";
import { SettledTickets } from "../src/components/dashboard/settled-tickets";
import { PendingTickets } from "../src/components/dashboard/pending-tickets";

function Tickets() {
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
          <Grid container spacing={3}>

            <Grid item xl={3} lg={3} sm={6} xs={12}>
              <TotalTickets />
            </Grid>

            <Grid item xl={3} lg={3} sm={6} xs={12}>
              <SettledTickets />
            </Grid>

            <Grid item xl={3} lg={3} sm={6} xs={12}>
              <PendingTickets sx={{ }} />
            </Grid>

            <Grid item xl={3} lg={3} sm={6} xs={12}>
              <ResolvedTickets />
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Grid container spacing={0}>

        {/* ------------------------- row 1 ------------------------- */}
        <Grid item xs={12} lg={12}>
          <TicketsTable />
        </Grid>
      </Grid>
      <h1>More Tickets Features coming soon...</h1>
    </>
  )
}

Tickets.auth = true
Tickets.role = ['admin', 'subadmin', 'administrator']

export default Tickets