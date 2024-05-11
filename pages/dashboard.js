import React, { useEffect, useState } from "react";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { Box, Container, Grid, Tab, Tabs } from "@mui/material";
import BlogCard from "../src/components/dashboard/BlogCard";
import SalesOverview from "../src/components/dashboard/SalesOverview";
import ActiveUsers from "../src/components/dashboard/activeUsers";
import ActiveUserByWeek from "../src/components/dashboard/ActiveUserByWeek";
import UserGrowth from "../src/components/dashboard/userGrowth";
import UserGrowthByWeek from "../src/components/dashboard/userGrowthByWeek";
import DailyActivity from "../src/components/dashboard/DailyActivity";
import ProductPerfomance from "../src/components/dashboard/ProductPerfomance";
import { Budget } from "../src/components/dashboard/budget";
import { LatestOrders } from "../src/components/dashboard/latest-orders";
import KPI from "../src/components/dashboard/kpi";
import { TasksProgress } from "../src/components/dashboard/tasks-progress";
import { TotalCustomers } from "../src/components/dashboard/total-customers";
import { TotalProfit } from "../src/components/dashboard/total-profit";
import { fetchRouteRoles } from "../hooks/useRouteRoles";
import axios from "axios";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Index() {
  const queryClient = useQueryClient();
  const getUser = useSession();
  const user = getUser?.data?.user;
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (user?.adminType === "sub-admin") {
      router.push("/tickets");
    }
  }, [user]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  //console.log(user)

  const { data: users } = useQuery(
    ["fetchUsersCount"],
    async () => {
      const { data } = await axios.get(
        `https://vigoplace.com/server/api/admin/console/users/count`,
        // `http://localhost:3001/api/admin/console/users/count`,
        {
          headers: {
            Authorization: user?.token,
          },
        }
      );
      return data;
    },
    {
      onError: (err) => {
        console.log(err, "err fetching users");
      },
      enabled: !!user?.token,
    }
  );

  // const { data: activeUsers } = useQuery(
  //   ["fetchActiveUsersCount"],
  //   async () => {
  //     const { data } = await axios.get(
  //       `https://vigoplace.com/server/api/admin/console/users/active/count`,
  //       //`https://vigoplace.com/server/api/admin/console/users/active/count`,
  //       // `http://localhost:3001/api/admin/console/users/count?status=active`,
  //       {
  //         headers: {
  //           Authorization: user?.token,
  //         },
  //       }
  //     );
  //     return data;
  //   },
  //   {
  //     onError: (err) => {
  //       console.log(err, "err fetching users");
  //     },
  //     enabled: !!user?.token,
  //   }
  // );

  const { data: paystackBalance, isLoading } = useQuery(
    ["paystackBalanceOnDashboard"],
    async () => {
      const { data } = await axios.get(
        `https://vigoplace.com/server/api/admin/console/balance/paystack`,
        // `http://localhost:3001/api/admin/console/balance/paystack`,
        {
          headers: {
            Authorization: user?.token,
          },
        }
      );

      return data;
    },
    {
      onError: (err) => {
        console.log(err, "err fetching users");
      },
      enabled: !!user?.token,
    },
    { keepPreviousData: true }
  );

  const { data: vigoWalletBalance, isLoading: vigoWalletLoading } = useQuery(
    ["vigoWalletBalance"],
    async () => {
      const { data } = await axios.get(
        `https://vigoplace.com/server/api/admin/console/balance/vigowallet`,
        // `http://localhost:3001/api/admin/console/balance/vigowallet`,
        {
          headers: {
            Authorization: user?.token,
          },
        }
      );

      return data;
    },
    {
      onError: (err) => {
        console.log(err, "err fetching vigo place balance");
      },
      enabled: !!user?.token,
    },
    { keepPreviousData: true }
  );

  const { data: paypalBalance, isLoading: paypalLoading } = useQuery(
    ["paypalBalance"],
    async () => {
      const { data } = await axios.get(
        `https://vigoplace.com/server/api/admin/console/balance/paypal`,
        // `http://localhost:3001/api/admin/console/balance/paypal`,
        {
          headers: {
            Authorization: user?.token,
          },
        }
      );

      return data;
    },
    {
      onError: (err) => {
        console.log(err, "err fetching vigo place balance");
      },
      enabled: !!user?.token,
    },
    { keepPreviousData: true }
  );

  if (user?.adminType === "sub-admin") {
    return (
      <section className="flex items-center justify-center">
        <p className="font-bold text-black">
          Sorry, you do not have permission to view this page
        </p>
      </section>
    );
  }

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <Grid container spacing={3}>
            {/* <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <Budget />
          </Grid> */}

            <Grid item lg={6} sm={6} xl={6} xs={12}>
              <TotalCustomers
                title={"Total Users"}
                count={users?.data?.count ?? 0}
              />
            </Grid>

            {/* <Grid item lg={3} sm={6} xl={3} xs={12}>
              <TotalCustomers
                title={"Active Users"}
                count={activeUsers?.data?.count ?? 0}
              />
            </Grid> */}
            {/* <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <TasksProgress />
          </Grid> */}
            <Grid item xl={6} lg={6} sm={6} xs={12}>
              <TotalProfit
                header={"Paystack"}
                isLoading={isLoading}
                balance={paystackBalance?.data?.balance ?? 0}
              />
            </Grid>
            {/* <Grid item xl={3} lg={3} sm={6} xs={12}>
              <TotalProfit
                header={"Vigo Wallet"}
                isLoading={vigoWalletLoading}
                balance={vigoWalletBalance?.data?.amount ?? 0}
              />
            </Grid> */}
            {/* <Grid item xl={12} lg={12} sm={12} xs={12}>
              <TotalProfit
                header={"Paypal"}
                currency="usd"
                isLoading={paypalLoading}
                balance={paypalBalance?.data?.amount ?? 0}
              />
            </Grid> */}

            <Box
              display="flex"
              justifyContent="center"
              mt={5}
              sx={{ marginLeft: "auto", marginRight: "auto" }}
            >
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                textColor="inherit"
                centered
                scrollButtons="auto"
                aria-label=""
              >
                <Tab label="Active Users" {...a11yProps(0)} />
                <Tab label="User Growth" {...a11yProps(1)} />
              </Tabs>
            </Box>

            {/* <Grid item lg={3} sm={6} xl={3} xs={12}>
              <DashBalance
                header={"Vigo Wallet"}
                vigoLoading={vigoWalletLoading}
                paystackLoading={isLoading}
                vigo={vigoWalletBalance?.data?.amount ?? 0}
                paystack={paystackBalance?.data?.balance ?? 0}

              />
            </Grid> */}

            <Grid container spacing={3}>
              <Grid item lg={12} md={12} xl={12} xs={12}>
                <TabPanel value={tabValue} index={0}>
                  <Grid container spacing={3}>
                    <Grid item lg={6} md={6} xl={6} xs={12}>
                      <ActiveUserByWeek />
                    </Grid>
                    <Grid item lg={6} md={6} xl={6} xs={12}>
                      <ActiveUsers />
                    </Grid>
                  </Grid>
                </TabPanel>
              </Grid>
              <Grid item lg={12} md={12} xl={12} xs={12}>
                <TabPanel value={tabValue} index={1}>
                  <Grid container spacing={3}>
                    <Grid item lg={6} md={6} xl={6} xs={12}>
                      <UserGrowthByWeek />
                    </Grid>
                    <Grid item lg={6} md={6} xl={6} xs={12}>
                      <UserGrowth />
                    </Grid>
                  </Grid>
                </TabPanel>
              </Grid>
            </Grid>

            <Grid item lg={12} md={12} xl={12} xs={12}>
              {/* <LatestOrders /> */}
              <KPI />
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Grid container spacing={0}>
        {/* <Grid item xs={12} lg={12}>
          <SalesOverview />
        </Grid> */}
        {/* ------------------------- row 1 ------------------------- */}
        {/* <Grid item xs={12} lg={4}>
          <DailyActivity />
        </Grid>
        <Grid item xs={12} lg={8}>
          <ProductPerfomance />
        </Grid> */}
        {/* <Grid item xs={12} lg={12}>
        <BlogCard />
      </Grid> */}
      </Grid>
    </>
  );
}
export async function getStaticProps() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["routeRoles"],
    queryFn: () => fetchRouteRoles(),
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

Index.auth = true;
