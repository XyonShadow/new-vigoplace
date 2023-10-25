import React, { useMemo, useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import {
  Grid,
  Tab,
} from "@mui/material";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import MuiAlert from "@mui/material/Alert";
import Paystack1 from "../src/components/paystack1";
import Paystack2 from "../src/components/paystack2";

import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
  useQuery,
  useMutation,
} from "@tanstack/react-query";
import { getSession, useSession } from "next-auth/react";
//Material-UI Imports
import {
  Box,
  Button,
  ListItemIcon,
  MenuItem,
  Typography,
  TextField,
} from "@mui/material";

//Icons Imports
import { AccountCircle, Send } from "@mui/icons-material";
import { UserBalanceCard } from "../src/components/dashboard/userBalanceCard";
import { UserBio } from "../src/components/dashboard/userBio";
import { LoadingButton, TabContext, TabList } from "@mui/lab";
import BaseCard from "../src/components/baseCard/BaseCard";

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

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Users = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const getUser = useSession();
  const user = getUser?.data?.user;



  const [tabValue, setTabValue] = React.useState(0);
  const [creditDetails, setCreditDetails] = useState({
    amount: "",
    approvalPin: "",
  });
  const [debitDetails, setDebitDetails] = useState({
    amount: "",
    approvalPin: "",
  });

  /* ******* onchange functions ********** */

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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
      <Grid
        container
        spacing={0}
        // xs={12}
        // lg={12}
        sx={{
          display: "flex",
          background: "",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Grid item sm={12} xs={12} lg={12}>
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                textColor="inherit"
                centered
                scrollButtons="auto"
                aria-label=""
              >
                <Tab label="Transfers/Payouts" {...a11yProps(0)} />
                <Tab label="Transactions" {...a11yProps(1)} />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <Paystack1 />
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Paystack2 />
            </TabPanel>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

Users.auth = true;
export default Users;
