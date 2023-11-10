import { useState, useEffect } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  Box,
  Typography,
  Button,
  Card,
  Checkbox,
  Grid,
  Paper,
  styled,
  useTheme
} from "@mui/material";
import axios from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";


const KPI = (props) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [checkedCheckboxes, setCheckedCheckboxes] = useState([]);


  const theme = useTheme();

  const getUser = useSession();
  const user = getUser?.data?.user;

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  const { data: kpis, refetch } = useQuery(
    ["fetchkpi"],
    async () => {
      let url = "https://vigoplace.com/server/api/admin/statistics/dashboard";
      //let url = "http://localhost:4000/api/admin/statistics/dashboard";

      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }
      const { data } = await axios.get(url, {
        params: {
          totalOrders: checkedCheckboxes.includes("totalOrders"),
          users: checkedCheckboxes.includes("users"),
          deletedUsers: checkedCheckboxes.includes("totalDeletedUsers"),
          payout: checkedCheckboxes.includes("payout"),
          totalUserActivities: checkedCheckboxes.includes("totalUserActivities"),
          virtualAccount: checkedCheckboxes.includes("virtualAccount"),
          marketPlaceCount: checkedCheckboxes.includes("marketPlaceCount"),
          channelPlaceCount: checkedCheckboxes.includes("channelPlaceCount"),
          contestPlaceCount: checkedCheckboxes.includes("contestPlaceCount"),
          basicPlaceCount: checkedCheckboxes.includes("basicPlaceCount"),
          newsPostCount: checkedCheckboxes.includes("newsPostCount"),
          giftPostCount: checkedCheckboxes.includes("giftPostCount"),
          walletCount: checkedCheckboxes.includes("walletCount"),
          verifiedEmailCount: checkedCheckboxes.includes("verifiedEmailCount"),
          verifiedPhoneCount: checkedCheckboxes.includes("verifiedPhoneCount"),
        },
        headers: {
          Authorization: user?.token,
        },
      });
      console.log(data);
      return data;
    },
    {
      onError: (err) => {
        console.log(err, "err fetching kpi");
      },
      enabled: !!user?.token,
    }
  );

  useEffect(() => {
    // When any of the query parameters change, trigger a refetch
    refetch();
  }, [startDate, endDate, checkedCheckboxes]);

  const firstCheckboxData = [
    { id: "users", value: "totalUsers", label: "Users" },
    { id: "user_activities", value: "totalUserActivities", label: "User Activities" },
    { id: "deleted_users", value: "totalDeletedUsers", label: "Deleted Users" },
    { id: "wallet", value: "totalWalletCount", label: "Wallet count" },
    { id: "emails", value: "totalVerifiedEmails", label: "Verified emails" },
    {
      id: "virtual_accounts",
      value: "totalVirtualAccounts",
      label: "Virtual accounts",
    },
    {
      id: "phone_numbers",
      value: "totalVerifiedPhoneNumbers",
      label: "Verified phone numbers",
    },
  ];

  const secondCheckboxData = [
    { id: "basic_place", value: "basicPlaceCount", label: "Basic place" },
    { id: "channel_place", value: "channelPlaceCount", label: "Channel place" },
    { id: "contest_place", value: "contestPlaceCount", label: "Contest place" },
    { id: "market_place", value: "marketPlaceCount", label: "Market place" },
  ];

  const thirdCheckboxData = [
    // { id: "product_post", value: "productPostCount", label: "Product post" },
    // { id: "service_post", value: "servicePostCount", label: "Service post" },
    { id: "gift_post", value: "giftPostCount", label: "Gift post" },
    { id: "news_post", value: "newsPostCount", label: "News post" },
    // { id: "paid_post", value: "paidPostCount", label: "Paid post" },
  ];

  const fourthCheckboxData = [
    {
      id: "channel_place_revenue",
      value: "channelPlaceRevenue",
      label: "Channel place revenue",
    },
    {
      id: "market_place_revenue",
      value: "marketPlaceRevenue",
      label: "Market place revenue",
    },
    {
      id: "contest_place_revenue",
      value: "contestPlaceRevenue",
      label: "Contest place revenue",
    },
    {
      id: "payout_revenue",
      value: "payoutRevenue",
      label: "Payout revenue",
    },
    {
      id: "wallet_loading_revenue",
      value: "walletLoadingRevenue",
      label: "Wallet Loading revenue",
    },
    {
      id: "total_revenue",
      value: "totalRevenue",
      label: "Total revenue",
    },
  ];

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleCheckboxChange = (event) => {
    console.log(event.target);
    const { value, checked, id } = event.target;
    const myObject = {}; // Step 2: Create an object

    if (checked) {
      myObject.value = value;
      myObject.label = id;
      // setCheckedValues([...checkedValues, myObject]);
      setCheckedCheckboxes((prevState) => [...prevState, myObject]);
    } else {
      //console.log("Unche  kedddddddd")
      // setCheckedValues(checkedValues.filter((v) => v.value !== value));
      setCheckedCheckboxes((prevState) =>
        prevState.filter((item) => item.value !== value)
      );
    }
  };

  return (
    <Card {...props}>
      <Box
        sx={{
          p: 2,
          background: "#8135F9",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            color: "white",
            [theme.breakpoints.down('sm')]: {
              fontSize: "12px"
             },
          }}
        >
          To begin enter your start and end date then click on the checkbox to
          select a KPI.
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: "6rem",
          p: 5,
          [theme.breakpoints.down('sm')]: {
           flexDirection: 'column',
           p:2
          },
        }}
      >
        <Box sx={{ width: "60%", [theme.breakpoints.down('sm')]: {
           width: "100%"
          }, }}>
          <Box sx={{ display: "flex", gap: 3 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label htmlFor="startDate">
                {" "}
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: "14px",
                    [theme.breakpoints.down('sm')]: {
                      fontSize: "12px"
                     },
                  }}
                >
                  Start date
                </Typography>
              </label>
              <input className="text-xs" type="date" id="startDate" value={startDate} onChange={handleStartDateChange} />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label htmlFor="endDate">
                {" "}
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: "14px",
                    [theme.breakpoints.down('sm')]: {
                      fontSize: "12px"
                     },
                  }}
                >
                  End date
                </Typography>
              </label>
              <input className="text-xs" type="date" id="endDate" value={endDate} onChange={handleEndDateChange} />
            </Box>
          </Box>
          <Grid
            container
            spacing={2}
            sx={{
              mt: "52px",
              width: "100%",
              height: "433px",
              background: "#F4F4F4",
              borderRadius: 1,
              px: 4,
              py: "37px",
              overflowY: "auto",
              [theme.breakpoints.down('sm')]: {
                ml: 0,
                fontSize: "14px",
                px: 1,
               },
            }}
          >
            {checkedCheckboxes.length === 0 && <>No data to display</>}
            {checkedCheckboxes.map((checkedValue) => (
              <Grid key={checkedValue.label} item xs={6}>
                <>{checkedValue.label}</>
                <Item>{kpis?.data?.[checkedValue.value]}</Item>
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography
            sx={{
              color: "#282424",
              fontSize: "14px",
            }}
          >
            Key performance indicators (KPI)
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              maxHeight: "600px",
              gap: 4,
              background: "#F4F4F4",
              overflowY: "auto",
              border: "1px solid #E6E6E6",
              borderRadius: 1,
              p: 3,
              [theme.breakpoints.down('sm')]: {
                p:1,
                maxHeight: "400px",
                fontSize: "14px",
               },
            }}
          >
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, p: 3 }}
            >
              {firstCheckboxData.map((checkbox) => (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  key={checkbox.id}
                >
                  <label>{checkbox.label}</label>
                  <Checkbox
                    value={checkbox.value}
                    id={checkbox.label}
                    checked={checkedCheckboxes.some(
                      (checkedValue) => checkedValue.value === checkbox.value
                    )}
                    onChange={handleCheckboxChange}
                  />
                </Box>
              ))}
            </Box>
            <Box sx={{ border: "1px solid #E6E6E6", width: "100%" }}></Box>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, p: 3 }}
            >
              {secondCheckboxData.map((checkbox) => (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  key={checkbox.id}
                >
                  <label>{checkbox.label}</label>
                  <Checkbox
                    value={checkbox.value}
                    id={checkbox.label}
                    checked={checkedCheckboxes.some(
                      (checkedValue) => checkedValue.value === checkbox.value
                    )}
                    onChange={handleCheckboxChange}
                  />
                </Box>
              ))}
            </Box>
            <Box sx={{ border: "1px solid #E6E6E6", width: "100%" }}></Box>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, p: 3 }}
            >
              {thirdCheckboxData.map((checkbox) => (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  key={checkbox.id}
                >
                  <label>{checkbox.label}</label>
                  <Checkbox
                    value={checkbox.value}
                    id={checkbox.label}
                    checked={checkedCheckboxes.some(
                      (checkedValue) => checkedValue.value === checkbox.value
                    )}
                    onChange={handleCheckboxChange}
                  />
                </Box>
              ))}
            </Box>
            <Box sx={{ border: "1px solid #E6E6E6", width: "100%" }}></Box>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, p: 3 }}
            >
              {fourthCheckboxData.map((checkbox) => (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  key={checkbox.id}
                >
                  <label>{checkbox.label}</label>
                  <Checkbox
                    value={checkbox.value}
                    id={checkbox.label}
                    checked={checkedCheckboxes.some(
                      (checkedValue) => checkedValue.value === checkbox.value
                    )}
                    onChange={handleCheckboxChange}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default KPI;
