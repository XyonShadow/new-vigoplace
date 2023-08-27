import React, { useMemo, useState } from "react";
import MaterialReactTable from "material-react-table";
import { useRouter } from "next/router";
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
import CheckIcon from "@mui/icons-material/Check";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import SearchIcon from "@mui/icons-material/Search";
import Input from "@mui/material/Input";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import MuiAlert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";
import Snackbar from "@mui/material/Snackbar";

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
  const { userid } = router.query;
  const queryClient = useQueryClient();
  const getUser = useSession();
  const user = getUser?.data?.user;
  const [value, setValue] = React.useState("1");
  const [walletId, setWalletId] = React.useState(null);

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
  const [creditSuccessToast, setCreditSuccessToast] = React.useState(false);
  const [creditErrorToast, setCreditErrorToast] = React.useState(false);
  const [debitSuccessToast, setDebitSuccessToast] = React.useState(false);
  const [debitErrorToast, setDebitErrorToast] = React.useState(false);

  const [status, setStatus] = React.useState("");
  const [isVerified, setIsverified] = React.useState("");
  const [email, setEmail] = React.useState("");
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
        `https://vigoplace.com/server/api/stripe/payment_intents?perPage=${pagination.pageSize}&page=${pagination.pageIndex}`,
        // `http://localhost:3001/api/admin/console/transfers/paystack?perPage=${pagination.pageSize}&page=${pagination.pageIndex}`,
        {
          headers: {
            Authorization: user?.token,
          },
        }
      );
      console.log(data)

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

  const {
    data: transactionData,
    isError: transactionError,
    isFetching: transactionFetching,
    isLoading: transactionLoading,
    refetch: transactionRefetch,
  } = useQuery(
    [
      "fetchpaystackTransactions",
      columnFilters, //refetch when columnFilters changes
      globalFilter, //refetch when globalFilter changes
      transactionPagination.pageIndex, //refetch when pagination.pageIndex changes
      transactionPagination.pageSize, //refetch when pagination.pageSize changes
      sorting, //refetch when sorting changes
      status,
    ],
    async () => {
      const { data } = await axios.get(
        `https://vigoplace.com/server/api/admin/console/transactions/paystack?perPage=${transactionPagination.pageSize}&page=${transactionPagination.pageIndex}`,
        // `http://localhost:3001/api/admin/console/transactions/paystack?perPage=${transactionPagination.pageSize}&page=${transactionPagination.pageIndex}`,
        {
          headers: {
            Authorization: user?.token,
          },
        }
      );

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

  const columns = useMemo(
    () => [
      {
        accessorKey: "recipient.name",
        enableClickToCopy: false,
        header: "Name",
      },
      {
        accessorKey: "currency",
        enableClickToCopy: false,
        header: "Currency",
      },
      {
        // accessorKey: "amount",
        accessorFn: (row) => (row.amount / 100).toLocaleString("en-US"),
        enableClickToCopy: false,
        id: "amount",
        header: "Amount",
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
        accessorKey: "transfer_code",
        enableClickToCopy: true,
        header: "transfer_code",
      },
      {
        // accessorKey: "transactionDate",
        accessorFn: (row) => format(new Date(row.createdAt), "Pp"),
        id: "createdAt",
        enableClickToCopy: false,
        header: "Date",
      },
      // {
      //   accessorFn: (row) => new Date(row.startDate), //convert to Date for sorting and filtering
      //   id: "startDate",
      //   header: "Start Date",
      //   filterFn: "lessThanOrEqualTo",
      //   sortingFn: "datetime",
      //   Cell: ({ cell }) => cell.getValue()?.toLocaleDateString(), //render Date as a string
      //   Header: ({ column }) => <em>{column.columnDef.header}</em>, //custom header markup
      //   //Custom Date Picker Filter from @mui/x-date-pickers
      //   Filter: ({ column }) => (
      //     <LocalizationProvider dateAdapter={AdapterDayjs}>
      //       <DatePicker
      //         onChange={(newValue) => {
      //           column.setFilterValue(newValue);
      //         }}
      //         renderInput={(params) => (
      //           <TextField
      //             {...params}
      //             helperText={"Filter Mode: Lesss Than"}
      //             sx={{ minWidth: "120px" }}
      //             variant="standard"
      //           />
      //         )}
      //         value={column.getFilterValue()}
      //       />
      //     </LocalizationProvider>
      //   )
      // }
    ],
    []
  );

  const transactionColumns = useMemo(
    () => [
      {
        accessorFn: (row) =>
          `${row.customer.first_name} ${row.customer.last_name}`,
        enableClickToCopy: false,
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
        // accessorKey: "transactionDate",
        accessorFn: (row) => format(new Date(row.createdAt), "Pp"),
        enableClickToCopy: false,
        header: "Date",
      },
    ],
    []
  );

  if (user?.adminType === "sub-admin") {
    return (
      <section className="flex items-center justify-center">
        <p className="font-bold text-black">Sorry, you do not have permission to view this page</p>
      </section>
    )
  }

  return (
    <>
      <Grid
        container
        spacing={0}
        xs={12}
        lg={12}
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

                  columns={columns}
                  data={data?.data ?? []}
                  enableStickyHeader
                  enableStickyFooter
                  enablePagination
                  manualPagination
                  onPaginationChange={setPagination}
                  // onPaginationChange={(e, f)=> console.log({e, f}, "oginidixx")}
                  rowCount={data?.meta?.total ?? 0}
                  onGlobalFilterChange={setGlobalFilter}
                  initialState={{ showColumnFilters: false }}
                  positionToolbarAlertBanner="bottom"
                  enableGlobalFilter={false}
                  muiToolbarAlertBannerProps={
                    isError
                      ? {
                          color: "error",
                          children:
                            "Error loading data, Please use the refresh button on the table to retry",
                        }
                      : undefined
                  }
                  // getPaginationRowModel={(props)=> console.log(props, "propppp")}
                  // manualPagination
                  // onPaginationChange={}
                  // muiTablePaginationProps={}

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

                        {/* <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
   <InputLabel htmlFor="standard-adornment-password">Email</InputLabel>
   <Input
     id="standard-adornment-password"
     type={'text'}
     endAdornment={
       <InputAdornment position="end">
         <IconButton

           aria-label="search"
           // onClick={handleClickShowPassword}
           // onMouseDown={handleMouseDownPassword}
         >
          <SearchIcon />
         </IconButton>
       </InputAdornment>
     }
   />
   </FormControl> */}
                      </div>
                    );
                  }}
                  state={{
                    isLoading,
                    showAlertBanner: isError,
                    showProgressBars: isFetching,
                    pagination,
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

                  columns={transactionColumns}
                  data={transactionData?.data ?? []}
                  enableStickyHeader
                  enableStickyFooter
                  enablePagination
                  manualPagination
                  onPaginationChange={setTransactionPagination}
                  rowCount={transactionData?.meta?.total ?? 0}
                  onGlobalFilterChange={setGlobalFilter}
                  initialState={{ showColumnFilters: false }}
                  positionToolbarAlertBanner="bottom"
                  enableGlobalFilter={false}
                  muiToolbarAlertBannerProps={
                    isError
                      ? {
                          color: "error",
                          children:
                            "Error loading data, Please use the refresh button on the table to retry",
                        }
                      : undefined
                  }
                  // getPaginationRowModel={(props)=> console.log(props, "propppp")}
                  // manualPagination
                  // onPaginationChange={}
                  // muiTablePaginationProps={}

                  renderTopToolbarCustomActions={({ table }) => {
                    return (
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <Tooltip arrow title="Refresh Data">
                          <IconButton onClick={() => transactionRefetch()}>
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

                        {/* <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
   <InputLabel htmlFor="standard-adornment-password">Email</InputLabel>
   <Input
     id="standard-adornment-password"
     type={'text'}
     endAdornment={
       <InputAdornment position="end">
         <IconButton

           aria-label="search"
           // onClick={handleClickShowPassword}
           // onMouseDown={handleMouseDownPassword}
         >
          <SearchIcon />
         </IconButton>
       </InputAdornment>
     }
   />
   </FormControl> */}
                      </div>
                    );
                  }}
                  state={{
                    isLoading: transactionLoading,
                    showAlertBanner: transactionError,
                    showProgressBars: transactionFetching,
                    pagination: transactionPagination,
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

// function DisplayMaterialTable({ userid, user }) {
//   const [globalFilter, setGlobalFilter] = useState("");
//   const [columnFilters, setColumnFilters] = useState([]);
//   const [sorting, setSorting] = useState([]);
//   const [status, setStatus] = React.useState("");





//   const [pagination, setPagination] = useState({
//     pageIndex: 1,
//     pageSize: 10,
//   });



//   const {
//     data,
//     isError,
//     isFetching,
//     isLoading,
//     refetch,
//   } = useQuery(
//     [
//       "fetchpaystackTransactions",
//       columnFilters, //refetch when columnFilters changes
//       globalFilter, //refetch when globalFilter changes
//       pagination.pageIndex, //refetch when pagination.pageIndex changes
//       pagination.pageSize, //refetch when pagination.pageSize changes
//       sorting, //refetch when sorting changes
//       status,
//     ],
//     async () => {
//       const { data } = await axios.get(
//         `https://vigoplace.com/server/api/admin/console/transactions/paystack?perPage=${pagination.pageSize}&page=${pagination.pageIndex}`,
//         // `http://localhost:3001/api/admin/console/transactions/paystack?perPage=${pagination.pageSize}&page=${pagination.pageIndex}`,
//         {
//           headers: {
//             Authorization: user?.token,
//           },
//         }
//       );

//       return data;
//     },
//     {
//       onError: (err) => {
//         console.log(err, "err fetching users");
//       },
//       enabled: !!user?.token,
//     },
//     { keepPreviousData: true }
//   );

//   const transactionColumns = useMemo(
//     () => [
//       {
//         accessorFn: (row) =>
//           `${row.customer.first_name} ${row.customer.last_name}`,
//         enableClickToCopy: false,
//         header: "Name",
//       },
//       {
//         accessorKey: "currency",
//         enableClickToCopy: false,
//         header: "Currency",
//       },
//       {
//         accessorFn: (row) => (row.amount / 100).toLocaleString("en-US"),
//         // accessorKey: "amount",
//         enableClickToCopy: false,
//         header: "Amount",
//       },
//       {
//         accessorKey: "authorization.bank",
//         enableClickToCopy: false,
//         header: "Bank Name",
//       },
//       {
//         accessorKey: "status",
//         enableClickToCopy: false,
//         header: "Status",
//       },
//       {
//         // accessorKey: "transactionDate",
//         accessorFn: (row) => format(new Date(row.createdAt), "Pp"),
//         enableClickToCopy: false,
//         header: "Date",
//       },
//     ],
//     []
//   );

//   return (
//     <>
//       <MaterialReactTable
//         // enableColumnFilterModes
//         // enableColumnOrdering
//         // enableGrouping
//         // enablePinning
//         // enableRowActions
//         // enableRowSelection

//         columns={transactionColumns}
//         data={transactionData?.data ?? []}
//         enableStickyHeader
//         enableStickyFooter
//         enablePagination
//         manualPagination
//         // onPaginationChange={setTransactionPagination}
//         onPaginationChange={setPagination}
//         rowCount={transactionData?.meta?.total ?? 0}
//         onGlobalFilterChange={setGlobalFilter}
//         initialState={{ showColumnFilters: false }}
//         positionToolbarAlertBanner="bottom"
//         enableGlobalFilter={false}
//         muiToolbarAlertBannerProps={
//           isError
//             ? {
//                 color: "error",
//                 children:
//                   "Error loading data, Please use the refresh button on the table to retry",
//               }
//             : undefined
//         }
//         // getPaginationRowModel={(props)=> console.log(props, "propppp")}
//         // manualPagination
//         // onPaginationChange={}
//         // muiTablePaginationProps={}

//         renderTopToolbarCustomActions={({ table }) => {
//           return (
//             <div style={{ display: "flex", gap: "0.5rem" }}>
//               <Tooltip arrow title="Refresh Data">
//                 <IconButton onClick={() => refetch()}>
//                   <RefreshIcon />
//                 </IconButton>
//               </Tooltip>

//               <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
//                 <InputLabel id="demo-simple-select-standard-label">
//                   Status
//                 </InputLabel>
//                 <Select
//                   labelId="demo-simple-select-standard-label"
//                   id="demo-simple-select-standard"
//                   value={status}
//                   defaultValue="None"
//                   //  onChange={handleStatus}
//                   label="Gender"
//                 >
//                   <MenuItem value="">
//                     <em>None</em>
//                   </MenuItem>
//                   <MenuItem value={"completed"}>Completed</MenuItem>
//                   <MenuItem value={"pending"}>Pending</MenuItem>
//                   <MenuItem value={"processing"}>Processing</MenuItem>
//                   <MenuItem value={"declined"}>Declined</MenuItem>
//                 </Select>
//               </FormControl>

//               {/* <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
//    <InputLabel htmlFor="standard-adornment-password">Email</InputLabel>
//    <Input
//      id="standard-adornment-password"
//      type={'text'}
//      endAdornment={
//        <InputAdornment position="end">
//          <IconButton

//            aria-label="search"
//            // onClick={handleClickShowPassword}
//            // onMouseDown={handleMouseDownPassword}
//          >
//           <SearchIcon />
//          </IconButton>
//        </InputAdornment>
//      }
//    />
//    </FormControl> */}
//             </div>
//           );
//         }}
//         state={{
//           isLoading,
//           showAlertBanner,
//           showProgressBars,
//           pagination,
//         }}
//         muiTableContainerProps={{ sx: { height: "75vh" } }}
//       />
//     </>
//   );
// }
Users.auth = true;
export default Users;
