import React, { useMemo, useState, useEffect, useRef } from "react";
import { MaterialReactTable } from "material-react-table";
import { useRouter } from "next/router";
import { format } from "date-fns";
import { Grid, IconButton, Tab, Tooltip } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import axios from "axios";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import MuiAlert from "@mui/material/Alert";

import { useQueryClient, useQuery } from "@tanstack/react-query";
import { getSession, useSession } from "next-auth/react";
//Material-UI Imports
import { Box, MenuItem, Typography } from "@mui/material";

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
  const { userid } = router.query;
  const queryClient = useQueryClient();
  const getUser = useSession();
  const user = getUser?.data?.user;

  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });
  const [transactionPagination, setTransactionPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });

  const [isLoadingT, setIsLoadingT] = useState(false);
  const [isErrorT, setIsErrorT] = useState(false);
  const [isFetchingT, setIsFetchingT] = useState(false);
  const [transaction, setTransaction] = useState([]);
  const [transactionCount, setTransactionCount] = useState(0);
  const [transferCount, setTransferCount] = useState(0);
  const [status, setStatus] = React.useState("");
  const [tabValue, setTabValue] = React.useState(0);

  /* ******* onchange functions ********** */
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const { data, isError, isFetching, isLoading, refetch } = useQuery(
    [
      "fetchpaystackTransfers",
      columnFilters, //refetch when columnFilters changes
      globalFilter, //refetch when globalFilter changes
      pagination.pageIndex, //refetch when pagination.pageIndex changes
      pagination.pageSize, //refetch when pagination.pageSize changes
      sorting, //refetch when sorting changes
      status,
    ],
    async () => {
      const { data } = await axios.get(
        `https://vigoplace.com/server/api/admin/console/transfers/paystack?perPage=${
          pagination.pageSize
        }&page=${pagination.pageIndex + 1}`,
        // `http://localhost:3001/api/admin/console/transfers/paystack?perPage=${pagination.pageSize}&page=${pagination.pageIndex}`,
        {
          headers: {
            Authorization: user?.token,
          },
        }
      );

      //console.log(data);
      setTransferCount(data?.meta?.total ?? 0);
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

  const fetchTransactions = async () => {
    setIsFetchingT(true);
    setIsLoadingT(true);
    try {
      const { data } = await axios.get(
        `https://vigoplace.com/server/api/admin/console/transactions/paystack?perPage=${
          transactionPagination.pageSize
        }&page=${transactionPagination.pageIndex + 1}`,
        {
          headers: {
            Authorization: user?.token,
          },
        }
      );

      //console.log(data);
      setTransaction(data?.data ?? []);
      setTransactionCount(data?.meta?.total ?? 0);
    } catch (err) {
      setIsErrorT(true);
      console.log(err, "err fetching transactions");
    } finally {
      setIsLoadingT(false);
      setIsFetchingT(false);
    }
  };

  useEffect(() => {
    if (tabValue === 1) {
      fetchTransactions();
    }
  }, [tabValue, userid, status, transactionPagination, globalFilter]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "transfer_code",
        enableClickToCopy: true,
        header: "transfer_code",
      },
      {
        accessorKey: "recipient.name",
        header: "Name",
        muiTableBodyCellProps: ({ cell }) => ({
          style: {
            cursor: "pointer",
          },
          onClick: () => {
            console.log(cell.getValue());
            console.log(cell.row);
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
      },
      {
        accessorKey: "currency",
        enableClickToCopy: false,
        header: "Currency",
      },
      {
        // accessorKey: "amount",
        accessorFn: (row) => (row.amount / 100)?.toLocaleString("en-US"),
        enableClickToCopy: false,
        id: "amount",
        header: "Amount",
      },
      {
        accessorFn: (row) => (row.fees)?.toLocaleString("en-US"),
        enableClickToCopy: false,
        id: "fees",
        header: "FC",
      },
      {
        accessorFn: (row) => (row.gatewayCharge)?.toLocaleString("en-US"),
        enableClickToCopy: false,
        id: "gateWayCharge",
        header: "CPF",
      },
      {
        accessorFn: (row) => (row.gatewayCharge + row.fees)?.toLocaleString("en-US"),
        enableClickToCopy: false,
        id: "total Charge",
        header: "Total Fee",
      },
      {
        accessorKey: "recipient.details.bank_name",
        enableClickToCopy: false,
        header: "Bank Name",
      },
      {
        accessorKey: "status",
        enableClickToCopy: false,
        header: "Status",
      },
      {
        // accessorKey: "transactionDate",
        accessorFn: (row) => {
          if (row?.createdAt) {
            return format(new Date(row.createdAt), "Pp");
          } else {
            return "";
          }
        },
        id: "createdAt",
        enableClickToCopy: false,
        header: "Date",
      },
    ],
    []
  );

  const transactionColumns = useMemo(
    () => [
      {
        accessorFn: (row) =>
          `${row?.customer?.first_name} ${row?.customer?.last_name}`,
        enableClickToCopy: false,
        muiTableBodyCellProps: ({ cell }) => {
          const fullName = `${cell.row?.original?.customer?.first_name} ${cell.row?.original?.customer?.last_name}`;
          const userId = cell.row.original.userId;
          const url = `/user/${userId}`;
        
          if (fullName.trim() !== "null null") {
            return {
              style: {
                cursor: "pointer",
              },
              onClick: () => {
                window.open(url, "_blank");
              },
              onMouseEnter: (e) => {
                e.target.style.textDecoration = "underline";
              },
              onMouseLeave: (e) => {
                e.target.style.textDecoration = "none";
              },
            };
          } else {
            // Return default props for users with null names
            return {
              style: {
                cursor: "default",
              },
              onMouseEnter: (e) => {
                e.target.style.textDecoration = "none";
              },
              onMouseLeave: (e) => {
                e.target.style.textDecoration = "none";
              },
            };
          }
        },
        header: "Name",        
      },
      {
        accessorKey: "currency",
        enableClickToCopy: false,
        header: "Currency",
      },
      {
        accessorFn: (row) => (row.amount / 100).toLocaleString("en-US"),
        // accessorKey: "amount",
        enableClickToCopy: false,
        header: "Amount",
      },
      {
        accessorKey: "authorization.bank",
        enableClickToCopy: false,
        header: "Bank Name",
      },
      {
        accessorKey: "status",
        enableClickToCopy: false,
        header: "Status",
      },
      {
        accessorFn: (row) => {
          if (row?.createdAt) {
            return format(new Date(row.createdAt), "Pp");
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
              <Box sx={{ pt: 3 }}>
                <MaterialReactTable
                  // enableColumnFilterModes
                  // enableColumnOrdering
                  // enableGrouping
                  // enablePinning
                  // enableRowActions
                  // enableRowSelection
                  enableColumnFilterModes
                  enableColumnOrdering
                  enablePinning
                  columns={columns}
                  data={data?.data ?? []}
                  enableStickyHeader
                  enableStickyFooter
                  enablePagination
                  manualPagination
                  manualFiltering
                  onPaginationChange={setPagination}
                  rowCount={transferCount}
                  onGlobalFilterChange={setGlobalFilter}
                  initialState={{ showColumnFilters: false }}
                  positionToolbarAlertBanner="bottom"
                  //enableGlobalFilter={false}
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
                          <IconButton onClick={() => refetch()}>
                            <RefreshIcon />
                          </IconButton>
                        </Tooltip>

                        <FormControl
                          variant="standard"
                          sx={{ m: 1, minWidth: 120 }}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Status
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={status}
                            defaultValue="None"
                            //  onChange={handleStatus}
                            label="Gender"
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            <MenuItem value={"completed"}>Completed</MenuItem>
                            <MenuItem value={"pending"}>Pending</MenuItem>
                            <MenuItem value={"processing"}>Processing</MenuItem>
                            <MenuItem value={"declined"}>Declined</MenuItem>
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

            <TabPanel value={tabValue} index={1}>
              <Box sx={{ pt: 3 }}>
                <MaterialReactTable
                  // enableColumnFilterModes
                  // enableColumnOrdering
                  // enableGrouping
                  // enablePinning
                  // enableRowActions
                  // enableRowSelection
                  enableColumnFilterModes
                  enableColumnOrdering
                  enablePinning
                  columns={transactionColumns}
                  data={transaction}
                  enableStickyHeader
                  //enableStickyFooter
                  enablePagination
                  manualPagination
                  manualFiltering
                  onPaginationChange={setTransactionPagination}
                  //rowCount={transactionData?.meta?.total ?? 0}
                  rowCount={transactionCount}
                  onGlobalFilterChange={setGlobalFilter}
                  initialState={{ showColumnFilters: false }}
                  positionToolbarAlertBanner="bottom"
                  //enableGlobalFilter={false}
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
                          <IconButton onClick={() => fetchTransactions()}>
                            <RefreshIcon />
                          </IconButton>
                        </Tooltip>

                        <FormControl
                          variant="standard"
                          sx={{ m: 1, minWidth: 120 }}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Status
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={status}
                            defaultValue="None"
                            //  onChange={handleStatus}
                            label="Gender"
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            <MenuItem value={"completed"}>Completed</MenuItem>
                            <MenuItem value={"pending"}>Pending</MenuItem>
                            <MenuItem value={"processing"}>Processing</MenuItem>
                            <MenuItem value={"declined"}>Declined</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                    );
                  }}
                  state={{
                    isLoadingT,
                    showAlertBanner: isErrorT,
                    showProgressBars: isFetchingT,
                    pagination: transactionPagination,
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
