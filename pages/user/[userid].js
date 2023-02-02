import React, { useMemo, useState } from "react";
import MaterialReactTable from "material-react-table";
import { useRouter } from "next/router";
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
import MuiAlert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
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
import { UserBalanceCard } from "../../src/components/dashboard/userBalanceCard";
import { UserBio } from "../../src/components/dashboard/userBio";
import { LoadingButton, TabContext, TabList } from "@mui/lab";
import BaseCard from "../../src/components/baseCard/BaseCard";

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
    pageIndex: 0,
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

  const handleCreditChange = (event) => {
    console.log(event.target.value, creditDetails);
    setCreditDetails({
      ...creditDetails,
      [event.target.name]: event.target.value,
    });
  };

  const handleDebitChange = (event) => {
    setDebitDetails({
      ...debitDetails,
      [event.target.name]: event.target.value,
    });
  };

  const handleWalletIdChange = (event) => {
    setWalletId(event.target.value);
  };

  const handleStatus = (event) => {
    setStatus(event.target.value);
    setPagination({
      pageIndex: 0,
      pageSize: 10,
    });
  };

  const handleVerified = (event) => {
    console.log({ eventt: event.target.value });
    setIsverified(event.target.value);
    setPagination({
      pageIndex: 0,
      pageSize: 10,
    });
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  /* ************* Queries *************** */
  const { data: userWallet } = useQuery(
    ["fetchUserWallet"],
    async () => {
      const { data } = await axios.post(
        `https://vigoplace.com/server/api/admin/console/users/wallets`,
        // `http://localhost:3001/api/admin/console/users/wallets`,
        {
          userId: userid,
        },
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

  const {
    data: userDetails,
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useQuery(
    ["fetchSingleUser"],
    async () => {
      const { data } = await axios.get(
        `https://vigoplace.com/server/api/admin/console/user?userId=${userid}`,
        // `http://localhost:3001/api/admin/console/user?userId=${userid}`,
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

  const {
    data: userTransactions,
    isError: fetchTransError,
    isFetching: fetchingTransactions,
    isLoading: loadingTransactions,
    refetch: refetchTransactions,
  } = useQuery(
    ["fetchSingleUserTransactions"],
    async () => {
      const { data } = await axios.get(
        `https://vigoplace.com/server/api/admin/console/users/transactions?userId=${userid}`,
        // `http://localhost:3001/api/admin/console/users/transactions?userId=${userid}`,
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

  /* ********** Mutations *************** */

  const creditUser = async ({ amount, approvalPin, walletId }) => {
    const credit = await axios.post(
      // "http://localhost:3001/api/admin/console/users/wallet/credit",
      "https://vigoplace.com/server/api/admin/console/users/wallet/credit",
      { amount, approvalPin, walletId },
      {
        headers: {
          Authorization: user?.token,
        },
      }
    );
    return credit;
  };

  const creditUserMutation = useMutation({
    mutationKey: ["creditUser"],
    mutationFn: creditUser,
    onError: async (error) => {
      // setPinToast({ ...pinToast, error: true });
      setCreditErrorToast(true)
    },
    onSuccess: () => {
      setCreditSuccessToast(true)
      queryClient.invalidateQueries("fetchUserWallet");
      setCreditDetails({ amount: "", approvalPin: "" });
      setWalletId(null);
    },
  });

  const debitUser = async ({ amount, approvalPin, walletId }) => {
    const credit = await axios.post(
      // "http://localhost:3001/api/admin/console/users/wallet/debit",
      "https://vigoplace.com/server/api/admin/console/users/wallet/debit",
      { amount, approvalPin, walletId },
      {
        headers: {
          Authorization: user?.token,
        },
      }
    );
    return credit;
  };

  const debitUserMutation = useMutation({
    mutationKey: ["debitUser"],
    mutationFn: debitUser,
    onError: async (error) => {
      // setPinToast({ ...pinToast, error: true });
      setDebitErrorToast(true)
    },
    onSuccess: () => {
      setDebitSuccessToast(true)
      queryClient.invalidateQueries("fetchUserWallet");
      setCreditDetails({ amount: "", approvalPin: "" });
      setWalletId(null);
    },
  });

  const blockUser = async (id) => {
    const blockedUser = await axios.post(
      // "http://localhost:3001/api/admin/console/users/block",
      "https://vigoplace.com/server/api/admin/console/users/block",
      { userId: id },
      {
        headers: {
          Authorization: user?.token,
        },
      }
    );
    return blockedUser;
  };

  const blockMutation = useMutation({
    mutationKey: ["blockUser"],
    mutationFn: blockUser,
    onSuccess: () => {
      queryClient.invalidateQueries("fetchUsers");
    },
    onError: async (error) => {
      // setOpenToast(true);
    },
  });

  const unblockUser = async (id) => {
    const unblockedUser = await axios.post(
      // "http://localhost:3001/api/admin/console/users/unblock",
      "https://vigoplace.com/server/api/admin/console/users/unblock",
      { userId: id },
      {
        headers: {
          Authorization: user?.token,
        },
      }
    );
    return unblockedUser;
  };

  const unblockMutation = useMutation({
    mutationKey: ["unblockUser"],
    mutationFn: unblockUser,
    onSuccess: () => {
      queryClient.invalidateQueries("fetchUsers");
    },
    onError: async (error) => {
      // setOpenToast(true);
    },
  });

 

  const columns = useMemo(
    () => [
      {
        accessorKey: "transactionType",
        enableClickToCopy: false,
        header: "Type",
      },
      {
        accessorKey: "transactionReference",
        enableClickToCopy: true,
        header: "Reference",
      },
      {
        accessorKey: "transactionStatus",
        enableClickToCopy: false,
        header: "Status",
      },
      {
        accessorKey: "transactionDescription",
        enableClickToCopy: false,
        header: "Description",
      },
      {
        accessorKey: "currency",
        enableClickToCopy: false,
        header: "Currency",
      },
      {
        accessorKey: "transactionTotal",
        enableClickToCopy: false,
        header: "Amount",
      },
      {
        accessorKey: "transactionDate",
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

  const handleCreditSuccessToastClose = (event, reason) => {
    setCreditSuccessToast(false);
  };
  const handleCreditErrorToastClose = (event, reason) => {
    setCreditErrorToast(false);
  };

  const handleDebitSuccessToastClose = (event, reason) => {
    setDebitSuccessToast(false);
  };
  const handleDebitErrorToastClose = (event, reason) => {
    setDebitErrorToast(false);
  };


  return (
    <>
    <Snackbar TransitionComponent={Slide} open={creditSuccessToast} autoHideDuration={6000} onClose={handleCreditSuccessToastClose}>
        <Alert onClose={handleCreditSuccessToastClose} severity="success" sx={{ width: '100%' }}>
          {creditUserMutation?.data?.data?.message}
        </Alert>
    </Snackbar>

    <Snackbar TransitionComponent={Slide} open={creditErrorToast} autoHideDuration={6000} onClose={handleCreditErrorToastClose}>
        <Alert onClose={handleCreditErrorToastClose} severity="warning" sx={{ width: '100%' }}>
          {creditUserMutation?.error?.response?.data?.message}
        </Alert>
    </Snackbar>


    <Snackbar TransitionComponent={Slide} open={debitSuccessToast} autoHideDuration={6000} onClose={handleDebitSuccessToastClose}>
        <Alert onClose={handleDebitSuccessToastClose} severity="success" sx={{ width: '100%' }}>
          {debitUserMutation?.data?.data?.message}
        </Alert>
    </Snackbar>

    <Snackbar TransitionComponent={Slide} open={debitErrorToast} autoHideDuration={6000} onClose={handleDebitErrorToastClose}>
        <Alert onClose={handleDebitErrorToastClose} severity="warning" sx={{ width: '100%' }}>
          {debitUserMutation?.error?.response?.data?.message}
        </Alert>
    </Snackbar>

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

        <Grid item xs={12} sm={12} lg={6}
          sx={{
            display: "flex",
            background: "",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {/* <BaseCard title=""> */}
          {/* <Card> */}
            <Card sx={{ width: 400 }} xs={12} sm={12}>
            <CardHeader
              avatar={
                <Avatar
                  sx={{ bgcolor: "red" }}
                  src={userDetails?.data?.user?.photo}
                  aria-label="user image"
                />
              }
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
              title={userDetails?.data?.user?.fullname}
              subheader={userDetails?.data?.user?.email}
            />
            <CardMedia
              component="img"
              height="194"
              image={userDetails?.data?.user?.photo}
              alt="user profile picture"
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                <b>Phone:</b> {userDetails?.data?.user?.phone}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <b>User name:</b> {userDetails?.data?.user?.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <b>Address:</b> {userDetails?.data?.user?.address}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <b>BIO:</b> {userDetails?.data?.user?.bio}
              </Typography>

              <Divider variant="middle" />

              <Typography
                align="center"
                marginTop={1}
                variant="body2"
                color="text.secondary"
              >
                <b>Wallets</b>
              </Typography>

              {userWallet
                ? userWallet?.data.map((wallet) => (
                    <>
                      <Stack direction="row" spacing={2} marginBottom={2}>
                        <Chip
                          label={wallet.SCCurrency}
                          size="small"
                          variant="outlined"
                        />
                        <Typography
                          align="center"
                          marginTop={1}
                          variant="body2"
                          color="text.secondary"
                        >
                          {wallet.SCSymbol} {wallet.WBalance}
                        </Typography>
                      </Stack>
                    </>
                  ))
                : null}
            </CardContent>
          </Card>
          {/* <Divider orientation="vertical" variant="middle"  /> */}
        </Grid>

        <Grid item sm={12} xs={12} lg={6}>
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
                <Tab label="Credit User" {...a11yProps(0)} />
                <Tab label="Debit User" {...a11yProps(1)} />
              </Tabs>
            </Box>
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ pt: 3 }}>
                <form>
                  <Card>
                    <CardHeader subheader=""   sx={{color: "green"}}title="Credit User Wallet" />
                    <Divider />
                    <CardContent>

                      <InputLabel id="demo-simple-select-standard-label">
                        Currency
                      </InputLabel>
                      <Select
                      fullWidth
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={walletId}
                        defaultValue="None"
                        onChange={handleWalletIdChange}
                        label="Wallet"
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {userWallet?.data?.map((wallet, id) => (
                          <MenuItem key={id} value={wallet.WId}>
                            {wallet.SCCurrency}
                          </MenuItem>
                        ))}
                      </Select>

                      <TextField
                        fullWidth
                        label="Amount"
                        margin="normal"
                        name="amount"
                        onChange={handleCreditChange}
                        type="number"
                        value={creditDetails.amount}
                        variant="outlined"
                      />
                      <TextField
                        autoComplete={false}
                        fullWidth
                        label="Approval Pin"
                        margin="normal"
                        name="approvalPin"
                        onChange={handleCreditChange}
                        type="password"
                        value={creditDetails.approvalPin}
                        variant="outlined"
                      />
                    </CardContent>
                    <Divider />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        p: 2,
                      }}
                    >
                      <LoadingButton
                        variant="contained"
                        color="primary"
                        loading={creditUserMutation.isLoading}
                        disabled={
                          creditDetails.amount === "" ||
                          creditDetails.approvalPin === "" ||
                          creditDetails.approvalPin.length <= 5 ||
                          walletId === null
                        }
                        onClick={() => {
                          creditUserMutation.mutate({...creditDetails, walletId})
                        // setOpenModal2(true);
                        }}
                      >
                        Credit
                      </LoadingButton>
                    </Box>
                  </Card>
                </form>
              </Box>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
            <Box sx={{ pt: 3 }}>
                <form>
                  <Card>
                    <CardHeader subheader="" sx={{color: "red"}} title="Debit User Wallet" />
                    <Divider />
                    <CardContent>

                      <InputLabel id="demo-simple-select-standard-label">
                        Currency
                      </InputLabel>
                      <Select
                      fullWidth
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={walletId}
                        defaultValue="None"
                        onChange={handleWalletIdChange}
                        label="wallet"
                      >
                        <MenuItem value={null}>
                          <em>None</em>
                        </MenuItem>
                        {userWallet?.data?.map((wallet, id) => (
                          <MenuItem key={id} value={wallet.WId}>
                            {wallet.SCCurrency}
                          </MenuItem>
                        ))}
                      </Select>

                      <TextField
                        fullWidth
                        label="Amount"
                        margin="normal"
                        name="amount"
                        onChange={handleDebitChange}
                        type="number"
                        value={debitDetails.amount}
                        variant="outlined"
                      />
                      <TextField
                        fullWidth
                        label="Approval Pin"
                        margin="normal"
                        name="approvalPin"
                        onChange={handleDebitChange}
                        type="password"
                        value={debitDetails.approvalPin}
                        variant="outlined"
                      />
                    </CardContent>
                    <Divider />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        p: 2,
                      }}
                    >
                      <LoadingButton
                        variant="contained"
                        color="primary"
                        loading={debitUserMutation.isLoading}
                        disabled={
                          debitDetails.amount === "" ||
                          debitDetails.approvalPin === "" ||
                          debitDetails.approvalPin.length <= 5 ||
                          walletId === null
                        }
                        onClick={() => {
                          debitUserMutation.mutate({...debitDetails, walletId})
                        // setOpenModal2(true);
                        }}
                      >
                        Debit
                      </LoadingButton>
                    </Box>
                  </Card>
                </form>
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

      <MaterialReactTable
        columns={columns}
        data={userTransactions?.data ?? []}
        // enableColumnFilterModes
        // enableColumnOrdering
        // enableGrouping
        // enablePinning

        // enableRowActions
        enableStickyHeader
        enableStickyFooter
        // enableRowSelection
        // manualPagination

        // onPaginationChange={setPagination}
        // rowCount={data?.count?.total ?? 0}
        // onGlobalFilterChange={setGlobalFilter}
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

        state={{
          isLoading,
          showAlertBanner: isError,
          showProgressBars: isFetching,
          pagination,
        }}
        muiTableContainerProps={{ sx: { height: "75vh" } }}
      />
    </>
  );
};
Users.auth = true;
export default Users;
