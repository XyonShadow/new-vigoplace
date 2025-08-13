"use-client";
import React, { useEffect, useState } from "react";
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
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Menuitems from "./MenuItems";
import Buynow from "./Buynow";
import { useRouter } from "next/router";
import { useUnreadTickets } from "../../../hooks/useUnreadTickets";
import { useRouteRoles } from "../../../hooks/useRouteRoles";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import { BalanceCard } from "../../components/dashboard/balanceCard";
import { UserBalanceCard } from "../../components/dashboard/userBalanceCard";
import axios from "axios";

function Sidebar({ isMobileSidebarOpen, onSidebarClose, isSidebarOpen }) {
  const { status, data: userInfo } = useSession({ required: true });
  const getUser = useSession();
  const user = getUser?.data?.user;
  const [open, setOpen] = React.useState(true);
  const [roles, setRoles] = React.useState({});
  const [quickStat, setQuickStat] = React.useState({
    right: false,
  });
  const { unreadTicketsCount } = useUnreadTickets();
  const [storedRoutes, setStoredRoutes] = React.useState([]);
  const [openDropdown, setOpenDropdown] = React.useState(null);
  //const { data: fetchedRoles, isLoading, isFetching } = useRouteRoles();
  //console.log(fetchedRoles);
  const [screenHeight, setScreenHeight] = useState(0);

  const queryClient = useQueryClient();

  const dataFromAbove = queryClient.getQueryData(["routeRoles"]);

  //console.log(unreadTicketsCount);

  // useEffect(() => {
  //   // Load storedRoutes from localStorage
  //   const storedRoutesData = JSON.parse(localStorage.getItem("parse"));

  //   if (storedRoutesData) {
  //     setStoredRoutes(storedRoutesData);
  //   } else {
  //     setStoredRoutes(fetchedRoles);
  //   }
  // }, []);

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

  const { data: paystackBalance, isError } = useQuery(
    ["paystackBalance"],
    async () => {
      const { data } = await axios.get(
        `https://api.vigoplace.com/api/admin/console/balance/paystack`,
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
        `https://api.vigoplace.com/api/admin/console/balance/userswallet`,
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
        `https://api.vigoplace.com/api/admin/console/payouts/requests/total`,
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
        `https://api.vigoplace.com/api/admin/console/balance/vigowallet`,
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
        `https://api.vigoplace.com/api/admin/console/balance/paypal`,
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
      title: "Transactions",
      icon: "dollar-sign",
      href: "",
      roles: ["admin", "root"],
      SCPCreatedAt: "2024-04-29T00:00:00.000Z",
      SCPUpdatedAt: null,
      subLinks: [
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
          title: "Earnings",
          icon: "credit-card",
          href: "/earnings",
          roles: ["admin", "root"],
          SCPCreatedAt: "2023-11-28T10:16:47.000Z",
          SCPUpdatedAt: null,
        },
        {
          id: 5,
          title: "Promo",
          icon: "dollar-sign",
          href: "promo",
          roles: ["admin", "superAdmin", "root"],
          SCPCreatedAt: "2023-04-12T14:19:30.000Z",
          SCPUpdatedAt: null,
        },
      ],
    },
    {
      id: 12,
      title: "Users",
      icon: "users",
      href: "",
      roles: ["admin", "root"],
      SCPCreatedAt: "2024-04-29T00:00:00.000Z",
      SCPUpdatedAt: null,
      subLinks: [
        {
          id: 13,
          title: "Users",
          icon: "users",
          href: "/users",
          roles: ["admin", "root"],
          SCPCreatedAt: "2022-12-19T06:46:44.000Z",
          SCPUpdatedAt: null,
        },
        {
          id: 14,
          title: "Admin-Users",
          icon: "users",
          href: "/admin-users",
          roles: ["admin", "root"],
          SCPCreatedAt: "2024-04-17T10:17:02.000Z",
          SCPUpdatedAt: null,
        },
        {
          id: 15,
          title: "Users-Statistics",
          icon: "activity",
          href: "/user-statistics",
          roles: ["admin", "root"],
          SCPCreatedAt: "2024-01-27T10:17:02.000Z",
          SCPUpdatedAt: null,
        },
        {
          id: 25,
          title: "Onboarded-Users",
          icon: "user",
          href: "/onboarded-users",
          roles: ["admin", "root"],
          SCPCreatedAt: "2023-08-24T12:35:04.000Z",
          SCPUpdatedAt: null,
        },
      ],
    },
    {
      id: 6,
      title: "Customer Reps",
      icon: "users",
      href: "",
      roles: ["admin", "root"],
      SCPCreatedAt: "2024-04-29T00:00:00.000Z",
      SCPUpdatedAt: null,
      subLinks: [
        {
          id: 7,
          title: "Tickets",
          icon: "headphones",
          href: "/tickets",
          roles: ["admin", "root"],
          SCPCreatedAt: "2022-12-19T06:46:44.000Z",
          SCPUpdatedAt: null,
        },
        {
          id: 8,
          title: "Orders",
          icon: "shopping-cart",
          href: "/orders",
          roles: ["admin", "root"],
          SCPCreatedAt: "2023-11-28T10:17:02.000Z",
          SCPUpdatedAt: null,
        },
        {
          id: 9,
          title: "Post categorization",
          icon: "file-plus",
          href: "/post-categorization",
          roles: ["admin", "root"],
          SCPCreatedAt: "2023-07-11T06:35:41.000Z",
          SCPUpdatedAt: null,
        },
        {
          id: 10,
          title: "Reports",
          icon: "file-plus",
          href: "/report",
          roles: ["admin", "root"],
          SCPCreatedAt: "2024-05-18T10:17:02.000Z",
          SCPUpdatedAt: null,
        },
        {
          id: 11,
          title: "Daily Readings",
          icon: "file-plus",
          href: "/daily-readings",
          roles: ["admin", "root"],
          SCPCreatedAt: "2024-05-24T10:17:02.000Z",
          SCPUpdatedAt: null,
        },
      ],
    },
    {
      id: 21,
      title: "Sales",
      icon: "user-plus",
      href: "",
      roles: ["admin", "root"],
      SCPCreatedAt: "2024-04-29T00:00:00.000Z",
      SCPUpdatedAt: null,
      subLinks: [
        {
          id: 22,
          title: "Sales Rep",
          icon: "user-plus",
          href: "/sales-rep",
          roles: ["admin", "root"],
          SCPCreatedAt: "2022-12-19T06:46:44.000Z",
          SCPUpdatedAt: null,
        },
        
      ],
    },
    {
      id: 16,
      title: "Administration",
      icon: "user",
      href: "",
      roles: ["admin", "root"],
      SCPCreatedAt: "2024-04-29T00:00:00.000Z",
      SCPUpdatedAt: null,
      subLinks: [
        {
          id: 17,
          title: "Settings",
          icon: "settings",
          href: "/settings",
          roles: ["admin", "root"],
          SCPCreatedAt: "2022-12-19T06:46:44.000Z",
          SCPUpdatedAt: null,
        },
        {
          id: 24,
          title: "Notification Operations",
          icon: "bell",
          href: "/notification-operation",
          roles: ["admin", "root"],
          SCPCreatedAt: "2025-03-28T06:46:44.000Z",
          SCPUpdatedAt: null,
        },
        {
          id: 18,
          title: "Activity Logs",
          icon: "activity",
          href: "/logs",
          roles: ["admin", "root"],
          SCPCreatedAt: "2022-12-19T06:46:44.000Z",
          SCPUpdatedAt: null,
        },
        {
          id: 19,
          title: "Bills payment",
          icon: "dollar-sign",
          href: "/bills-payment",
          roles: ["admin", "root"],
          SCPCreatedAt: "2025-08-12T06:46:44.000Z",
          SCPUpdatedAt: null,
        },
        // {
        //   id: 31,
        //   title: "Error Logs",
        //   icon: "activity",
        //   href: "/error-logs",
        //   roles: ["admin", "root"],
        //   SCPCreatedAt: "2022-12-19T06:46:44.000Z",
        //   SCPUpdatedAt: null,
        // },
      ],
    },
    {
      id: 20,
      title: "Payments",
      icon: "dollar-sign",
      href: "",
      roles: ["admin", "root"],
      SCPCreatedAt: "2024-04-29T00:00:00.000Z",
      SCPUpdatedAt: null,
      subLinks: [
        {
          id: 21,
          title: "Paystack",
          icon: "dollar-sign",
          href: "/paystack",
          roles: ["admin", "superAdmin", "root"],
          SCPCreatedAt: "2023-02-03T11:21:15.000Z",
          SCPUpdatedAt: null,
        },
        {
          id: 22,
          title: "Stripe",
          icon: "dollar-sign",
          href: "/stripe",
          roles: ["admin", "root"],
          SCPCreatedAt: "2023-08-24T12:35:04.000Z",
          SCPUpdatedAt: null,
        },
        {
          id: 23,
          title: "Flutterwave",
          icon: "dollar-sign",
          href: "/flutterwave",
          roles: ["admin", "root"],
          SCPCreatedAt: "2023-08-24T12:35:04.000Z",
          SCPUpdatedAt: null,
        },
      ],
    },
    {
      id: 30,
      title: "Wallets",
      icon: "credit-card",
      href: "",
      roles: ["admin", "root"],
      SCPCreatedAt: "2024-04-29T00:00:00.000Z",
      SCPUpdatedAt: null,
      subLinks: [
        {
          id: 19,
          title: "Wallet-Statistics",
          icon: "activity",
          href: "/wallet-statistics",
          roles: ["admin", "superAdmin", "root"],
          SCPCreatedAt: "2024-05-03T11:21:15.000Z",
          SCPUpdatedAt: null,
        },
        {
          id: 23,
          title: "Virtual-Accounts",
          icon: "credit-card",
          href: "/virtual-accounts",
          roles: ["admin", "root"],
          SCPCreatedAt: "2024-11-27T06:46:44.000Z",
          SCPUpdatedAt: null,
        },
        {
          id: 26,
          title: "Kyc-Users",
          icon: "users",
          href: "/kyc-users",
          roles: ["admin", "root"],
          SCPCreatedAt: "2023-08-24T12:35:04.000Z",
          SCPUpdatedAt: null,
        },
        {
          id: 24,
          title: "Auto-Payout-Users",
          icon: "users",
          href: "/autopayout-users",
          roles: ["admin", "root"],
          SCPCreatedAt: "2023-08-24T12:35:04.000Z",
          SCPUpdatedAt: null,
        },
        {
          id: 24,
          title: "USD Wallets",
          icon: "credit-card",
          href: "/usd-wallets",
          roles: ["admin", "root"],
          SCPCreatedAt: "2023-08-24T12:35:04.000Z",
          SCPUpdatedAt: null,
        },
      ],
    },
    // {
    //   id: 23,
    //   title: "Virtual-Accounts",
    //   icon: "credit-card",
    //   href: "/virtual-accounts",
    //   roles: ["admin", "root"],
    //   SCPCreatedAt: "2024-11-27T06:46:44.000Z",
    //   SCPUpdatedAt: null,
    // },
  ];

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

  useEffect(() => {
    // Function to update screen height
    const updateScreenHeight = () => {
      setScreenHeight(window.innerHeight);
    };

    // Set initial screen height
    updateScreenHeight();

    // Add event listener to update height on window resize
    window.addEventListener("resize", updateScreenHeight);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("resize", updateScreenHeight);
    };
  }, []);

  //console.log(openDropdown);
  const handleClicks = (itemId) => {
    setOpenDropdown((prevOpen) => (prevOpen === itemId ? null : itemId));
  };

  const countSubLinksById = (roles, id) => {
    for (const role of roles) {
      if (role.id === id) {
        return role.subLinks ? role.subLinks.length : 0;
      }
      if (role.subLinks) {
        const subLinkCount = countSubLinksById(role.subLinks, id);
        if (subLinkCount !== null) {
          return subLinkCount;
        }
      }
    }
    return null;
  };

  const roleIdToFind = openDropdown;
  const subLinksCount = countSubLinksById(fetchedRoles, roleIdToFind);

  const dynamicHeight =
    openDropdown !== null ? subLinksCount * 64 + screenHeight : screenHeight;

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
      //console.log(open);
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
      //height="598px"
      sx={{
        backgroundColor: "rgb(28,34,47)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: dynamicHeight,
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
          {/* <List>
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
                        {item.href === "/tickets" ? (
                          <>
                            {item.title}
                            {unreadTicketsCount > 0 && (
                              <span
                                style={{
                                  marginLeft: "5px", // Adjust the margin as needed
                                  //display: "inline-block",
                                  position: "absolute",
                                  top: "2px",
                                  width: "15px",
                                  height: "15px",
                                  borderRadius: "50%",
                                  backgroundColor: "red",
                                  color: "white",
                                  textAlign: "center",
                                  fontSize: "x-small",
                                  //lineHeight: "20px", // Center the text vertically
                                }}
                              >
                                {unreadTicketsCount}
                              </span>
                            )}
                          </>
                        ) : (
                          item.title
                        )}
                      </ListItemText>
                    </ListItem>
                  </NextLink>
                </List>
              ))}
          </List> */}
          <List>
            {fetchedRoles.map((item, index) => (
              <React.Fragment key={item.id}>
                {item.subLinks ? (
                  <React.Fragment>
                    <ListItem
                      button
                      onClick={() => handleClicks(item.id)}
                      selected={location === item.href}
                      sx={{
                        mb: 1,
                        color: "white",
                        textDecoration: "none",
                        ...(location === item.href && {
                          color: "white",
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
                      <ListItemText>{item.title}</ListItemText>
                      {openDropdown === item.id ? (
                        <ExpandLessIcon />
                      ) : (
                        <ExpandMoreIcon />
                      )}
                    </ListItem>
                    <Collapse
                      in={openDropdown === item.id}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List component="div" disablePadding>
                        {item.subLinks.map((subItem) => (
                          <NextLink href={subItem.href} key={subItem.id}>
                            <ListItem
                              button
                              onClick={onSidebarClose}
                              selected={location === subItem.href}
                              sx={{
                                mb: 1,
                                marginLeft: "35px",
                                width: "80%",
                                color: "white",
                                textDecoration: "none",
                                ...(location === subItem.href && {
                                  color: "white",
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
                                  icon={subItem.icon}
                                  width="20"
                                  height="20"
                                />
                              </ListItemIcon>

                              <ListItemText>
                                {subItem.href === "/tickets" ? (
                                  <>
                                    {subItem.title}
                                    {unreadTicketsCount > 0 && (
                                      <span
                                        style={{
                                          marginLeft: "5px", // Adjust the margin as needed
                                          //display: "inline-block",
                                          position: "absolute",
                                          top: "2px",
                                          width: "15px",
                                          height: "15px",
                                          borderRadius: "50%",
                                          backgroundColor: "red",
                                          color: "white",
                                          textAlign: "center",
                                          fontSize: "x-small",
                                          //lineHeight: "20px", // Center the text vertically
                                        }}
                                      >
                                        {unreadTicketsCount}
                                      </span>
                                    )}
                                  </>
                                ) : (
                                  subItem.title
                                )}
                              </ListItemText>
                            </ListItem>
                          </NextLink>
                        ))}
                      </List>
                    </Collapse>
                  </React.Fragment>
                ) : (
                  <NextLink href={item.href} key={item.id}>
                    <ListItem
                      button
                      onClick={onSidebarClose}
                      selected={location === item.href}
                      sx={{
                        mb: 1,
                        color: "white",
                        textDecoration: "none",
                        ...(location === item.href && {
                          color: "white",
                          backgroundColor: (theme) =>
                            `${theme.palette.primary.main}!important`,
                        }),
                      }}
                    >
                      <ListItemIcon>
                        <FeatherIcon
                          icon={item.icon}
                          width="20"
                          height="20"
                          style={{
                            color: `${
                              location === item.href ? "white" : "white"
                            } `,
                          }}
                        />
                      </ListItemIcon>

                      <ListItemText>
                        {item.href === "/tickets" ? (
                          <>
                            {item.title}
                            {unreadTicketsCount > 0 && (
                              <span
                                style={{
                                  marginLeft: "5px", // Adjust the margin as needed
                                  //display: "inline-block",
                                  position: "absolute",
                                  top: "2px",
                                  width: "15px",
                                  height: "15px",
                                  borderRadius: "50%",
                                  backgroundColor: "red",
                                  color: "white",
                                  textAlign: "center",
                                  fontSize: "x-small",
                                  //lineHeight: "20px", // Center the text vertically
                                }}
                              >
                                {unreadTicketsCount}
                              </span>
                            )}
                          </>
                        ) : (
                          item.title
                        )}
                      </ListItemText>
                    </ListItem>
                  </NextLink>
                )}
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Box>

      {/* {unreadTicketsCount > 0 && <span>{unreadTicketsCount}</span>} */}
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
        open={quickStat.right}
        onClose={toggleDrawer("right", false)}
        variant="temporary"
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
