import React, { useEffect } from 'react'
import PropTypes from 'prop-types';
import { useSession } from "next-auth/react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AdminSecurity from '../src/components/AdminSecurity';
import Charges from '../src/components/Charge';

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
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
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
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


export default function Settings() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getUser = useSession();
  const user = getUser?.data?.user;

  // console.log(user)

  useEffect(() => {
    if (user) {
      //console.log(user)
    }
  }, [user])

  if (user?.adminType === "sub-admin") {
    return (
      <section className="flex items-center justify-center">
        <p className="font-bold text-black">Sorry, you do not have permission to view this page</p>
      </section>
    )
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange}   textColor="inherit" centered scrollButtons="auto" aria-label="admin settings">
          <Tab label="General" {...a11yProps(0)} />
          <Tab label="Security" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
       coming soon ...
       {/* <Charges /> */}
      </TabPanel>
      <TabPanel value={value} index={1}>
        <AdminSecurity/>
      </TabPanel>
    </Box>
  )
}

Settings.auth = true
