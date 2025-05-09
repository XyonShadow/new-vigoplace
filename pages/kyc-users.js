import { VerifiedKyc } from "@/src/components/dashboard/VerifiedKyc";
import { PendingKyc } from "@/src/components/dashboard/PendingKyc";
import { IncompleteKyc } from "@/src/components/dashboard/IncompleteKyc";
import { UnverifiedKyc } from "@/src/components/dashboard/UnverifiedKyc";
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

export default function KycUsers() {
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
        KYC Users
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
                <Tab label="verified" {...a11yProps(0)} />
                <Tab label="pending" {...a11yProps(1)} />
                <Tab label="Incomplete" {...a11yProps(2)} />
                <Tab label="unverified" {...a11yProps(3)} />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <VerifiedKyc />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <PendingKyc />
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <IncompleteKyc />
            </TabPanel>
            <TabPanel value={tabValue} index={3}>
              <UnverifiedKyc />
            </TabPanel>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}
