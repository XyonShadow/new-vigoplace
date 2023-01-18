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
import { useSession } from "next-auth/react"
import FeatherIcon from "feather-icons-react";
import LogoIcon from "../logo/LogoIcon";
import Menuitems from "./MenuItems";
import Buynow from "./Buynow";
import { useRouter } from "next/router";
import { useRouteRoles } from '../../../hooks/useRouteRoles'
import { useQueryClient, useQuery } from '@tanstack/react-query'
import FlashOnIcon from '@mui/icons-material/FlashOn';
import { BalanceCard } from "../../components/dashboard/balanceCard";
import { UserBalanceCard } from "../../components/dashboard/userBalanceCard";
import axios from "axios";



function Sidebar({ isMobileSidebarOpen, onSidebarClose, isSidebarOpen }) {
  const { status, data: userInfo } = useSession({ required: true, })
  const [open, setOpen] = React.useState(true);
  const [roles, setRoles] = React.useState({});
  const [quickStat, setQuickStat] = React.useState({
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setQuickStat({ ...quickStat, [anchor]: open });
  };

  const queryClient = useQueryClient()
  const { data: fetchedRoles, isLoading, isFetching } = useRouteRoles()
  // const dataFromAbove = queryClient.getQueryData(['routeRoles'])

  console.log(userInfo, 'userInfo')

  const { data: paystackBalance, isError } = useQuery(
    [
      'paystackBalance',
    ],
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
       console.log(err, 'err fetching users')
      },
      enabled: !!userInfo?.user?.token
    },
    { keepPreviousData: true },
  );
  const { data: usersBalance } = useQuery(
    [
      'usersBalance',
    ],
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
       console.log(err, 'err fetching users')
      },
      enabled: !!userInfo?.user?.token
    },
    { keepPreviousData: true },
  );

  console.log(usersBalance, 'usersBalance')

  const sidebarMenu = fetchedRoles ? fetchedRoles?.map((menu) => {
    // console.log(typeof menu.roles, 'menu.roles')
    // console.log( JSON.parse(menu.roles), 'menu.roles parsed')
    return {
      title: menu.title,
      icon: menu.icon,
      href: menu.href,
      roles: menu.roles
      // roles: JSON.parse(menu?.roles)
    }
  }) : []


  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));

  const handleClick = (index) => {
    if (open === index) {
      setOpen((prevopen) => !prevopen);
    } else {
      setOpen(index);
    }
  };
  let curl = useRouter();
  const location = curl.pathname;
  // ackground: rgba(28,34,47);

  const SidebarContent = (
    <Box p={2} height="100%" sx={{
      backgroundColor: "rgb(28,34,47)",
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <Box>
      <Box sx={{
        display: 'flex',
        alignItems: "center"
      }}>
        <LogoIcon />
        <Typography variant="h1" fontWeight={'bold'} color={"white"}>igoplace</Typography>
      </Box>

      <Box mt={2}>
        <List>
          {sidebarMenu?.filter((item) => item.roles.includes(userInfo?.user.role)).map((item, index) => (
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
                        color: `${location === item.href ? "white" : "white"} `,
                      }}
                      icon={item.icon}
                      width="20"
                      height="20"
                    />
                  </ListItemIcon>

                  <ListItemText onClick={onSidebarClose}>
                    {item.title}
                  </ListItemText>
                </ListItem>
              </NextLink>
            </List>
          ))}
        </List>
      </Box>
      </Box>

   <Box sx={{display: "flex", alignItems:"center", alignSelf: 'Center'}}>

       <Button variant="outlined" onClick={toggleDrawer('right', true)}>
       <FlashOnIcon color="primary"/>


<Typography variant="h3" color={'primary'} >
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
          onClose={toggleDrawer('right', false)}
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
           <BalanceCard balance={paystackBalance?.data}/>
           <UserBalanceCard usersBalance={usersBalance?.data ?? []}/>
        </Drawer>
      </>
    );
  }
  return (
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
  );
};

Sidebar.propTypes = {
  isMobileSidebarOpen: PropTypes.bool,
  onSidebarClose: PropTypes.func,
  isSidebarOpen: PropTypes.bool,
};

// export async function getServerSideProps() {
//   // Fetch data from external API
//   console.log("*****************************************************");
//   const res = await fetch(`localhost:3000/api/admin/console/routeroles`)
//   const roles = await res.json()

//   // Pass data to the page via props
//   return { props: { roles, a: "ok" } }
// }

export default Sidebar;
