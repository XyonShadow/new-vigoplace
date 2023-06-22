import { useState } from "react";
import { format } from "date-fns";
import { v4 as uuid } from "uuid";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  Box,
  Typography,
  Button,
  Card,
  Checkbox,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  Grid,
  Paper,
  styled,
} from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import axios from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { SeverityPill } from "../severity-pill";

const KPI = (props) => {
  const [checkedValues, setCheckedValues] = useState([]);

  const getUser = useSession();
  const user = getUser?.data?.user;

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  const { data: kpis } = useQuery(
    ["fetchkpi"],
    async () => {
      const { data } = await axios.get(
        `https://vigoplace.com/server/api/admin/statistics/dashboard`,
        {
          headers: {
            Authorization: user?.token,
          },
        }
      );
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

  const firstCheckboxData = [
    { id: "users", value: "totalUsers", label: "Users" },
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
    { id: "product_post", value: "productPostCount", label: "Product post" },
    { id: "service_post", value: "servicePostCount", label: "Service post" },
    { id: "gift_post", value: "giftPostCount", label: "Gift post" },
    { id: "news_post", value: "newsPostCount", label: "News post" },
    { id: "paid_post", value: "paidPostCount", label: "Paid post" },
  ];

  const fourthCheckboxData = [
    { id: "channel_place_revenue", value: "channelPlaceRevenue", label: "Channel place revenue" },
    { id: "market_place_revenue", value: "marketPlaceRevenue", label: "Market place revenue" },
    { id: "contest_place_revenue", value: "contestPlaceRevenue", label: "Contest place revenue" },
  ];

  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    const label = event.target.id;
    const isChecked = event.target.checked;
    console.log(value);

    const myObject = {}; // Step 2: Create an object

    if (isChecked) {
      // Add the checked value to the array

      // setCheckedLabel([...checkedLabel, label]);
      myObject.value = value;
      myObject.label = label;
      setCheckedValues([...checkedValues, myObject]);
    } else {
      // Remove the unchecked value from the array
      setCheckedValues(checkedValues.filter((v) => v.value !== value));
      // setCheckedLabel(checkedLabel.filter((v) => v !== label));
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
        }}
      >
        <Box sx={{ width: "60%" }}>
          <Box sx={{ display: "flex", gap: 3 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label htmlFor="birthday">
                {" "}
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: "14px",
                  }}
                >
                  Start date
                </Typography>
              </label>
              <input type="date" id="start_date" name="start_date" />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label htmlFor="birthday">
                {" "}
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: "14px",
                  }}
                >
                  End date
                </Typography>
              </label>
              <input type="date" id="end_date" name="end_date" />
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
            }}
          >
            {checkedValues.length === 0 && <>No data to display</>}
            {checkedValues.map((checkedValue) => (
              <Grid key={checkedValue.value} item xs={6}>
                <>{checkedValue.label}</>
                <Item>{kpis?.data?.[checkedValue.value]}</Item>
              </Grid>
            ))}
          </Grid>
          <Box
            sx={{
              mt: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{
                color: "#282424",
                fontWeight: 500,
                fontSize: "14px",
              }}
            >
              Click the submit button to get your results
            </Typography>
            <Button variant="contained" sx={{ background: "#8135F9" }}>
              Submit
            </Button>
          </Box>
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
              overflowY: "scroll",
              border: "1px solid #E6E6E6",
              borderRadius: 1,
              p: 3,
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
                    checked={checkedValues.some(
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
                    checked={checkedValues.some(
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
                    checked={checkedValues.some(
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
                    checked={checkedValues.some(
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
