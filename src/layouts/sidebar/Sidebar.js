"use-client";
import React, { useEffect } from "react";
import NextLink from "next/link";
import PropTypes from "prop-types";
import {
  Box,
  Drawer,
  useMediaQuery,
  List,
  Link,
  Button,
  Typography,
  ListItem,
  Collapse,
  ListItemIcon,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useSession } from "next-auth/react";
import FeatherIcon from "feather-icons-react";
import LogoIcon from "../logo/LogoIcon";
import Menuitems from "./MenuItems";
import Buynow from "./Buynow";
import { useRouter } from "next/router";

import { useRouteRoles } from "../../../hooks/useRouteRoles";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import { BalanceCard } from "../../components/dashboard/balanceCard";
import { UserBalanceCard } from "../../components/dashboard/userBalanceCard";
import axios from "axios";

function Sidebar({ isMobileSidebarOpen, onSidebarClose, isSidebarOpen }) {
  const { status, data: userInfo } = useSession({ required: true });
  const [open, setOpen] = React.useState(true);
  const [roles, setRoles] = React.useState({});
  const [quickStat, setQuickStat] = React.useState({
    right: false,
  });
  const [storedRoutes, setStoredRoutes] = React.useState([]);
  //console.log(storedRoutes)

  //const { data: fetchedRoles, isLoading, isFetching } = useRouteRoles();
  //console.log(fetchedRoles);
  const fetchedRoles = [
    {
      id: 1,
      title: "Dashboard",
      icon: "home",
      href: "/dashboard",
      roles: ["admin", "root"],
      SCPCreatedAt: "2022-12-19T06:46:44.000Z",
      SCPUpdatedAt: null,
    },
    {
      id: 2,
      title: "Tickets",
      icon: "headphones",
      href: "/tickets",
      roles: ["admin", "root"],
      SCPCreatedAt: "2022-12-19T06:46:44.000Z",
      SCPUpdatedAt: null,
    },
    {
      id: 3,
      title: "Payouts",
      icon: "dollar-sign",
      href: "/payouts",
      roles: ["admin", "root"],
      SCPCreatedAt: "2022-12-19T06:46:44.000Z",
      SCPUpdatedAt: null,
    },
    {
      id: 4,
      title: "Users",
      icon: "users",
      href: "/users",
      roles: ["admin", "root"],
      SCPCreatedAt: "2022-12-19T06:46:44.000Z",
      SCPUpdatedAt: null,
    },
    {
      id: 5,
      title: "Settings",
      icon: "settings",
      href: "/settings",
      roles: ["admin", "root"],
      SCPCreatedAt: "2022-12-19T06:46:44.000Z",
      SCPUpdatedAt: null,
    },
    {
      id: 6,
      title: "Activity Logs",
      icon: "activity",
      href: "/logs",
      roles: ["admin", "root"],
      SCPCreatedAt: "2022-12-19T06:46:44.000Z",
      SCPUpdatedAt: null,
    },
    {
      id: 7,
      title: "Paystack",
      icon: "dollar-sign",
      href: "/paystack",
      roles: ["admin", "superAdmin", "root"],
      SCPCreatedAt: "2023-02-03T11:21:15.000Z",
      SCPUpdatedAt: null,
    },
    {
      id: 8,
      title: "Promo",
      icon: "dollar-sign",
      href: "promo",
      roles: ["admin", "superAdmin", "root"],
      SCPCreatedAt: "2023-04-12T14:19:30.000Z",
      SCPUpdatedAt: null,
    },
    {
      id: 9,
      title: "Post categorization",
      icon: "post",
      href: "/post-categorization",
      roles: ["admin", "root"],
      SCPCreatedAt: "2023-07-11T06:35:41.000Z",
      SCPUpdatedAt: null,
    },
    {
      id: 10,
      title: "Stripe",
      icon: "dollar-sign",
      href: "/stripe",
      roles: ["admin", "root"],
      SCPCreatedAt: "2023-08-24T12:35:04.000Z",
      SCPUpdatedAt: null,
    },
    {
      id: 11,
      title: "Earnings",
      icon: "wallet",
      href: "/earnings",
      roles: ["admin", "administrator"],
      SCPCreatedAt: "2023-11-28T10:16:47.000Z",
      SCPUpdatedAt: null,
    },
    {
      id: 12,
      title: "Orders",
      icon: "cart",
      href: "/orders",
      roles: ["admin", "administrator"],
      SCPCreatedAt: "2023-11-28T10:17:02.000Z",
      SCPUpdatedAt: null,
    },
  ];

  // useEffect(() => {
  //   // Load storedRoutes from localStorage
  //   const storedRoutesData = JSON.parse(localStorage.getItem("parse"));

  //   if (storedRoutesData) {
  //     setStoredRoutes(storedRoutesData);
  //   } else {
  //     setStoredRoutes(fetchedRoles);
  //   }
  // }, []);
  const getUser = useSession();
  const user = getUser?.data?.user;
  //console.log(user);

  const toggleDrawer = (anchor, open) => (event) => {
    //console.log({ anchor, open });
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setQuickStat({ ...quickStat, [anchor]: open });
  };

  const queryClient = useQueryClient();

  const dataFromAbove = queryClient.getQueryData(["routeRoles"]);

  const { data: paystackBalance, isError } = useQuery(
    ["paystackBalance"],
    async () => {
      const { data } = await axios.get(
        `https://vigoplace.com/server/api/admin/console/balance/paystack`,
        // `http://localhost:3001/api/admin/console/balance/paystack`,
        {
          headers: {
            Authorization: userInfo?.user?.token,
          },
        }
      );

      return data;
    },
    {
      onError: (err) => {
        console.log(err, "err fetching users");
      },
      enabled: !!userInfo?.user?.token,
    },
    { keepPreviousData: true }
  );
  const { data: usersBalance } = useQuery(
    ["usersBalance"],
    async () => {
      const { data } = await axios.get(
        `https://vigoplace.com/server/api/admin/console/balance/userswallet`,
        // `http://localhost:3001/api/admin/console/balance/userswallet`,
        {
          headers: {
            Authorization: userInfo?.user?.token,
          },
        }
      );

      return data;
    },
    {
      onError: (err) => {
        console.log(err, "err fetching users");
      },
      enabled: !!userInfo?.user?.token,
    },
    { keepPreviousData: true }
  );

  const { data: payoutsBalance } = useQuery(
    ["payoutsBalance"],
    async () => {
      const { data } = await axios.get(
        `https://vigoplace.com/server/api/admin/console/payouts/requests/total`,
        // `http://localhost:3001/api/admin/console/payouts/requests/total`,
        {
          headers: {
            Authorization: userInfo?.user?.token,
          },
        }
      );

      return data;
    },
    {
      onError: (err) => {
        console.log(err, "err fetching payouts balance");
      },
      enabled: !!userInfo?.user?.token,
    },
    { keepPreviousData: true }
  );

  const { data: vigoWalletBalance } = useQuery(
    ["vigoWalletBalance"],
    async () => {
      const { data } = await axios.get(
        `https://vigoplace.com/server/api/admin/console/balance/vigowallet`,
        // `http://localhost:3001/api/admin/console/balance/vigowallet`,
        {
          headers: {
            Authorization: userInfo?.user?.token,
          },
        }
      );

      return data;
    },
    {
      onError: (err) => {
        console.log(err, "err fetching vigo place balance");
      },
      enabled: !!userInfo?.user?.token,
    },
    { keepPreviousData: true }
  );
  const { data: paypalBalance } = useQuery(
    ["paypalBalance"],
    async () => {
      const { data } = await axios.get(
        `https://vigoplace.com/server/api/admin/console/balance/paypal`,
        // `http://localhost:3001/api/admin/console/balance/paypal`,
        {
          headers: {
            Authorization: userInfo?.user?.token,
          },
        }
      );

      return data;
    },
    {
      onError: (err) => {
        console.log(err, "err fetching vigo place balance");
      },
      enabled: !!userInfo?.user?.token,
    },
    { keepPreviousData: true }
  );

  const subAdminRoutes = [
    {
      title: "Tickets",
      icon: "headphones",
      href: "/tickets",
      roles: ["admin", "root"],
    },
    {
      title: "Post categorization",
      icon: "paper",
      href: "/post-categorization",
      roles: ["admin", "root"],
    },
  ];

  //const sidebarMenu = fetchedRoles
  const sidebarMenu = fetchedRoles
    ? (userInfo?.user?.adminType === "sub-admin"
        ? subAdminRoutes
        : fetchedRoles
      )?.map((menu) => {
        return {
          title: menu.title,
          icon: menu.icon,
          href: menu.href,
          roles: menu.roles,
          // roles: JSON.parse(menu?.roles)
        };
      })
    : [];

  //console.log(sidebarMenu);

  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  //console.log(lgUp);

  const handleClick = (index) => {
    //console.log(index);
    if (open === index) {
      console.log(open);
      setOpen((prevopen) => !prevopen);
    } else {
      setOpen(index);
    }
  };
  let curl = useRouter();
  const location = curl.pathname;

  const SidebarContent = (
    <Box
      p={2}
      //height="100%"
      sx={{
        backgroundColor: "rgb(28,34,47)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        //height: "100vh",
      }}
    >
      <Box
      //height="100dvh"
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <LogoIcon />
          <Typography variant="h1" fontWeight={"bold"} color={"white"}>
            igoplace
          </Typography>
        </Box>

        <Box mt={2}>
          <List>
            {sidebarMenu
              ?.filter((item) => item.roles.includes(userInfo?.user.role))
              .map((item, index) => (
                // {Menuitems.map((item, index) => (
                <List component="li" disablePadding key={item.title}>
                  <NextLink href={item.href}>
                    <ListItem
                      onClick={() => handleClick(index)}
                      button
                      selected={location === item.href}
                      sx={{
                        mb: 1,
                        color: "white",
                        textDecoration: "none",
                        ...(location === item.href && {
                          color: "white",
                          // backgroundColor: "red",
                          backgroundColor: (theme) =>
                            `${theme.palette.primary.main}!important`,
                        }),
                      }}
                    >
                      <ListItemIcon>
                        <FeatherIcon
                          style={{
                            color: `${
                              location === item.href ? "white" : "white"
                            } `,
                          }}
                          icon={item.icon}
                          width="20"
                          height="20"
                        />
                      </ListItemIcon>

                      <ListItemText onClick={onSidebarClose}>
                        {/* {userInfo.user.adminType === "sub-admin" && (item.title === "Tickets" || item.title === "Post categorization") && item.title} */}
                        {item.title}
                      </ListItemText>
                    </ListItem>
                  </NextLink>
                </List>
              ))}
          </List>
        </Box>
      </Box>

      <Box
        sx={{
          marginTop: "auto",
          display: "flex",
          alignItems: "center",
          alignSelf: "Center",
        }}
      >
        <Button
          variant="outlined"
          onClick={toggleDrawer("right", true)}

          // onClick={() => toggleDrawer("right", true)}
          // onClick={()=> {
          //   console.log("why wont you click")
          //   // toggleDrawer("right", true)
          //   toggleDrawer("left", false)
          // }}
        >
          <FlashOnIcon color="primary" />

          <Typography variant="h3" color={"primary"}>
            quick stats
          </Typography>
        </Button>
      </Box>

      {/* <Buynow /> */}
    </Box>
  );

  if (lgUp) {
    return (
      <>
        <Drawer
          anchor="left"
          open={isSidebarOpen}
          variant="persistent"
          PaperProps={{
            sx: {
              width: "265px",
              border: "0 !important",
              boxShadow: "0px 7px 30px 0px rgb(113 122 131 / 11%)",
            },
          }}
        >
          {SidebarContent}
        </Drawer>

        <Drawer
          anchor="right"
          // open={open}
          open={quickStat.right}
          onClose={toggleDrawer("right", false)}
          variant="temporary"
          // ModalProps={{
          //   keepMounted: false,
          // }}
          PaperProps={{
            sx: {
              width: "265px",
              border: "0 !important",
              boxShadow: "0px 7px 30px 0px rgb(113 122 131 / 11%)",
            },
          }}
        >
          <BalanceCard
            balance={paystackBalance?.data}
            nairaPayoutBalance={payoutsBalance?.data?.NGN?.total}
            vigoWalletBalance={vigoWalletBalance?.data?.amount ?? 0}
            paypalBalance={paypalBalance?.data?.amount ?? 0}
          />
          <UserBalanceCard usersBalance={usersBalance?.data ?? []} />
        </Drawer>
      </>
    );
  }
  return (
    <>
      {quickStat.right ? null : (
        <Drawer
          anchor="left"
          open={isMobileSidebarOpen}
          onClose={onSidebarClose}
          PaperProps={{
            sx: {
              width: "265px",
              border: "0 !important",
            },
          }}
          variant="temporary"
        >
          {SidebarContent}
        </Drawer>
      )}

      <Drawer
        anchor="right"
        // open={open}
        open={quickStat.right}
        onClose={toggleDrawer("right", false)}
        variant="temporary"
        // ModalProps={{
        //   keepMounted: false,
        // }}
        PaperProps={{
          sx: {
            width: "265px",
            border: "0 !important",
            boxShadow: "0px 7px 30px 0px rgb(113 122 131 / 11%)",
          },
        }}
      >
        <BalanceCard
          balance={paystackBalance?.data}
          nairaPayoutBalance={payoutsBalance?.data?.NGN?.total}
          vigoWalletBalance={vigoWalletBalance?.data?.amount ?? 0}
        />
        <UserBalanceCard usersBalance={usersBalance?.data ?? []} />
      </Drawer>
    </>
  );
}

Sidebar.propTypes = {
  isMobileSidebarOpen: PropTypes.bool,
  onSidebarClose: PropTypes.func,
  isSidebarOpen: PropTypes.bool,
};

export default Sidebar;
