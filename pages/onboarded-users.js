import { NonKycUsers } from "@/src/components/dashboard/NonKycUsers";
import { NoVirtualAccount } from "@/src/components/dashboard/NoVirtualAccount";
import { UnverifiedPhone } from "@/src/components/dashboard/UnverifiedPhone";
import { UnverifiedEmail } from "@/src/components/dashboard/UnverifiedEmail";
import { NoPostUsers } from "@/src/components/dashboard/NoPostUsers";
import { Tab, Tabs, Grid, Box, Typography } from "@mui/material";
import PropTypes from "prop-types";
import React from "react";

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

export default function OnBoardedUsers() {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div>
      <Typography
        variant="h3"
        color="text.primary"
        marginBottom={2}
        sx={{ fontWeight: "bold", textAlign: "center" }}
      >
        Onboarded Users
      </Typography>
      <Grid
        container
        spacing={0}
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
                <Tab label="no-kyc" {...a11yProps(0)} />
                <Tab label="no-virtual-account" {...a11yProps(1)} />
                <Tab label="unverified-phone" {...a11yProps(2)} />
                <Tab label="unverified-email" {...a11yProps(3)} />
                <Tab label="no-post" {...a11yProps(4)} />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <NonKycUsers />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <NoVirtualAccount />
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <UnverifiedPhone />
            </TabPanel>
            <TabPanel value={tabValue} index={3}>
              <UnverifiedEmail />
            </TabPanel>
            <TabPanel value={tabValue} index={4}>
              <NoPostUsers />
            </TabPanel>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}
