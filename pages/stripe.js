import React, { useMemo, useState, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
import Table from "material-react-table";
import { useRouter } from "next/router";
import { Link } from "next/link";
import { format } from "date-fns";
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Tab,
  Tooltip,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import axios from "axios";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import MuiAlert from "@mui/material/Alert";
import {
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
import { getSession, useSession } from "next-auth/react";
//Material-UI Imports
import {
  Box,
  MenuItem,
  Typography,
} from "@mui/material";

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

const API_BASE_URL = "https://vigoplace.com/server";
//const API_BASE_URL = "http://localhost:4000";
const Users = () => {
  const router = useRouter();
  const { userid } = router.query;
  const queryClient = useQueryClient();
  const getUser = useSession();
  const user = getUser?.data?.user;
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [lastId, setLastId] = useState(0);
  const [totalResult, setTotalResult] = useState(0);
  const [status, setStatus] = React.useState("");
  const [currency, setCurrency] = React.useState("");
  const [tabValue, setTabValue] = React.useState(0);
  const [result, setResult] = useState([]);
  const [tableData, setTableData] = useState(result);

  /* ******* onchange functions ********** */

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const { data, isError, isFetching, isLoading, refetch } = useQuery(
    [
      "fetchStripeTransfers",
      columnFilters, //refetch when columnFilters changes
      globalFilter, //refetch when globalFilter changes
      pagination.pageIndex, //refetch when pagination.pageIndex changes
      pagination.pageSize, //refetch when pagination.pageSize changes
      sorting, //refetch when sorting changes
      status,
      lastId,
      currency,
    ],
    async () => {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/stripe/payment_intents?page=${
          pagination.pageIndex + 1
        }&pageSize=${pagination.pageSize}`,
        // `http://localhost:3001/api/admin/console/transfers/paystack?perPage=${pagination.pageSize}&page=${pagination.pageIndex}`,
        {
          headers: {
            Authorization: user?.token,
          },
        }
      );
      //console.log(data);
      setResult(data?.data?.transactions ?? []);
      setTableData(data?.data?.transactions ?? []);
      setTotalResult(data?.data?.totalTransactions);
      //console.log((data?.data?.paymentIntents[9].id))
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

  useEffect(() => {
    // Define a function to fetch and filter data based on the searchValue
    const fetchAndFilterData = async () => {
      try {
        // Make a request to your backend with the searchValue
        const response = await fetch(
          `${API_BASE_URL}/api/stripe/payment_intentById?search=${globalFilter}&page=${
            pagination.pageIndex + 1
          }&pageSize=${pagination.pageSize}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        //console.log(data?.data?.totalTransactions);

        // Check if the search input is empty or there are no results
        if (globalFilter === "" || data?.data?.transactions.length === 0) {
          setTableData(result);
        } else {
          setTableData(data?.data?.transactions ?? []);
          setTotalResult(data?.data?.totalTransactions);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAndFilterData();
  }, [globalFilter, result]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "reference",
        enableClickToCopy: false,
        header: "Reference",
      },
      {
        accessorKey: "fullName",
        header: "Name",
        muiTableBodyCellProps: ({ cell }) => ({
          style: {
            cursor: "pointer",
          },
          onClick: () => {
            //console.log(cell.getValue());
            const userId = cell.row.original.userId;
            const url = `/user/${userId}`;
            window.open(url, "_blank");
          },
          onMouseEnter: (e) => {
            e.target.style.textDecoration = "underline";
          },
          onMouseLeave: (e) => {
            e.target.style.textDecoration = "none";
          },
        }),
        enableClickToCopy: false,
        id: "fullName",
      },
      {
        accessorKey: "description",
        enableClickToCopy: false,
        header: "Description",
      },
      {
        accessorKey: "currency",
        enableClickToCopy: false,
        header: "Currency",
      },
      {
        accessorFn: (row) => row.totalAmount?.toLocaleString("en-US"),
        enableClickToCopy: false,
        id: "totalAmount",
        header: "Total Amount",
      },
      {
        accessorFn: (row) => (row.fees / 100)?.toLocaleString("en-US"),
        enableClickToCopy: false,
        id: "fees",
        header: "Fee",
      },
      {
        accessorFn: (row) => (row.net / 100)?.toLocaleString("en-US"),
        enableClickToCopy: false,
        id: "net",
        header: "Net Amount",
      },
      {
        accessorKey: "receiver",
        enableClickToCopy: false,
        header: "Receiver",
      },
      {
        accessorKey: "userId",
        enableClickToCopy: false,
        header: "User Id",
      },
      {
        accessorFn: (row) => {
          if (row?.createdAt) {
            return format(new Date(row.createdAt), "MM/dd/yyyy hh:mm a");
          } else {
            return "";
          }
        },
        enableClickToCopy: false,
        header: "Date",
      },
    ],
    []
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
                <Tab label="Transactions" {...a11yProps(0)} />
                {/* <Tab label="Transactions" {...a11yProps(1)} /> */}
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <Box sx={{ pt: 3 }}>
                <MaterialReactTable
                  enableColumnFilterModes
                  enableColumnOrdering
                  enablePinning
                  columns={columns}
                  //data={data?.data?.transactions ?? []}
                  data={tableData}
                  enableStickyHeader
                  //enableStickyFooter
                  enablePagination
                  manualPagination
                  manualFiltering
                  onPaginationChange={setPagination}
                  rowCount={totalResult}
                  onGlobalFilterChange={setGlobalFilter}
                  initialState={{ showColumnFilters: false }}
                  positionToolbarAlertBanner="bottom"
                  muiToolbarAlertBannerProps={
                    isError
                      ? {
                          color: "error",
                          children:
                            "Error loading data, Please use the refresh button on the table to retry",
                        }
                      : undefined
                  }
                  renderTopToolbarCustomActions={({ table }) => {
                    return (
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <Tooltip arrow title="Refresh Data">
                          <IconButton>
                            <RefreshIcon />
                          </IconButton>
                        </Tooltip>

                        <FormControl
                          variant="standard"
                          sx={{ m: 1, minWidth: 120 }}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Currency
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={currency}
                            defaultValue="None"
                            //onChange={setCurrency}
                            label="Gender"
                          >
                            <MenuItem value="None">
                              <em>None</em>
                            </MenuItem>
                            <MenuItem value={"USD"}>USD</MenuItem>
                            <MenuItem value={"NGN"}>NGN</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                    );
                  }}
                  state={{
                    isLoading,
                    showAlertBanner: isError,
                    showProgressBars: isFetching,
                    pagination,
                    globalFilter,
                  }}
                  muiTableContainerProps={{ sx: { height: "75vh" } }}
                />
              </Box>
            </TabPanel>
          </Box>
        </Grid>
      </Grid>

      <Typography
        align="center"
        marginTop={1}
        variant="h3"
        color="text.secondary"
      >
        <b>Transactions</b>
      </Typography>
    </>
  );
};
Users.auth = true;
export default Users;
