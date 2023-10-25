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
  Container,
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
import { MaterialTable } from "../../src/components/table";
import RecentOrders from "../../src/components/RecentOrders";
import {
  usePayoutRequests,
  fetchPayoutRequests,
} from "../../hooks/usePayoutRequests";

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
  const [filters, setFilters] = useState({
    status: null,
  });
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  //const [status, setStatus] = useState(null);
  const [isVerified, setIsverified] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [tabValue, setTabValue] = React.useState(0);
  const [creditDetails, setCreditDetails] = useState({
    amount: "",
    approvalPin: "",
    reasonType: "",
    reasonDescription: "",
  });
  const [debitDetails, setDebitDetails] = useState({
    amount: "",
    approvalPin: "",
    reasonType: "",
    reasonDescription: "",
  });
  const [fetchParams, setFetchParams] = useState({
    limit: 20,
    offset: 0,
    status: undefined,
  });
  const {
    data: userPayout,
    //isLoading,
    //isFetching
  } = usePayoutRequests(
    fetchParams.limit,
    fetchParams.offset,
    fetchParams.status
  );

  /* ******* onchange functions ********** */

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCreditChange = (event) => {
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
    [
      "fetchSingleUserTransactions",
      columnFilters, //refetch when columnFilters changes
      globalFilter, //refetch when globalFilter changes
      pagination.pageIndex, //refetch when pagination.pageIndex changes
      pagination.pageSize, //refetch when pagination.pageSize changes
      sorting, //refetch when sorting changes
      status,
    ],
    async () => {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/admin/console/users/transactions?userId=${userid}&limit=${
          pagination.pageSize
        }&offset=${pagination.pageIndex * pagination.pageSize}${
          status !== "" ? `&status=${status}` : ""
        }`,
        // `http://localhost:3001/api/admin/console/users/transactions?userId=${userid}&limit=${pagination.pageSize}&offset=${pagination.pageIndex * pagination.pageSize}${status !=='' ? `&status=${status}`:''}`,
        {
          headers: {
            Authorization: user?.token,
          },
        }
      );
      //console.log(data);
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
    data: userActivities,
    isError: fetchActivitiesError,
    isFetching: fetchingActivities,
    isLoading: loadingActivities,
    refetch: refetchActivities,
  } = useQuery(
    ["fetchSingleUserActivities"],
    async () => {
      const { data } = await axios.get(
        `https://vigoplace.com/server/api/admin/activityLog/${userid}&limit=${
          pagination.pageSize
        }&offset=${pagination.pageIndex * pagination.pageSize}`,
        // `http://localhost:3001/api/admin/console/users/activities?userId=${userid}&limit=${pagination.pageSize}&offset=${pagination.pageIndex * pagination.pageSize}`,
        {
          headers: {
            Authorization: user?.token,
          },
        }
      );

      //console.log(data);
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

  const creditUser = async ({
    amount,
    approvalPin,
    walletId,
    reasonType,
    reasonDescription,
  }) => {
    const credit = await axios.post(
      // "http://localhost:3001/api/admin/console/users/wallet/credit",
      "https://vigoplace.com/server/api/admin/console/users/wallet/credit",
      { amount, approvalPin, walletId, reasonType, reasonDescription },
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
      setCreditErrorToast(true);
    },
    onSuccess: () => {
      setCreditSuccessToast(true);
      queryClient.invalidateQueries("fetchUserWallet");
      setCreditDetails({ amount: "", approvalPin: "" });
      setWalletId(null);
    },
  });

  const debitUser = async ({
    amount,
    approvalPin,
    walletId,
    reasonType,
    reasonDescription,
  }) => {
    const credit = await axios.post(
      // "http://localhost:3001/api/admin/console/users/wallet/debit",
      "https://vigoplace.com/server/api/admin/console/users/wallet/debit",
      { amount, approvalPin, walletId, reasonType, reasonDescription },
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
      setDebitErrorToast(true);
    },
    onSuccess: () => {
      setDebitSuccessToast(true);
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
      queryClient.invalidateQueries("fetchSingleUser");
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
      queryClient.invalidateQueries("fetchSingleUser");
    },
    onError: async (error) => {
      // setOpenToast(true);
    },
  });

  const flagUser = async (id) => {
    const flaggedUser = await axios.post(
      // "http://localhost:3001/api/admin/console/users/flag",
      "https://vigoplace.com/server/api/admin/console/users/flag",
      { userId: id },
      {
        headers: {
          Authorization: user?.token,
        },
      }
    );
    return flaggedUser;
  };

  const flagUserMutation = useMutation({
    mutationKey: ["flagUser"],
    mutationFn: flagUser,
    onSuccess: () => {
      queryClient.invalidateQueries("fetchSingleUser");
    },
    onError: async (error) => {
      // setOpenToast(true);
    },
  });

  const unflagUser = async (id) => {
    const unflaggedUser = await axios.post(
      // "http://localhost:3001/api/admin/console/users/unflag",
      "https://vigoplace.com/server/api/admin/console/users/unflag",
      { userId: id },
      {
        headers: {
          Authorization: user?.token,
        },
      }
    );
    return unflaggedUser;
  };

  const unflagUserMutation = useMutation({
    mutationKey: ["unflagUser"],
    mutationFn: unflagUser,
    onSuccess: () => {
      queryClient.invalidateQueries("fetchSingleUser");
    },
    onError: async (error) => {
      // setOpenToast(true);
    },
  });

  const postNoDebit = async (id) => {
    const postNoDebitUser = await axios.post(
      "https://vigoplace.com/server/api/admin/console/post-no-debit",
      { userId: id.toString(), status: "suspend" },
      {
        headers: {
          Authorization: user?.token,
        },
      }
    );
    return postNoDebitUser;
  };

  const postNoDebitMutation = useMutation({
    mutationKey: ["postNoDebitUser"],
    mutationFn: postNoDebit,
    onSuccess: () => {
      console.log("successful");
      //queryClient.invalidateQueries("fetchUsers");
    },
    onError: async (error) => {
      console.log("Error:", error);
      if (error.response) {
        console.log("Response Data:", error.response.data);
      }
    },
  });

  const postYesDebit = async (id) => {
    const postYesDebitUser = await axios.post(
      "https://vigoplace.com/server/api/admin/console/post-no-debit",
      { userId: id.toString(), status: "activate" },
      {
        headers: {
          Authorization: user?.token,
        },
      }
    );
    return postYesDebitUser;
  };

  const postYesDebitMutation = useMutation({
    mutationKey: ["postYesDebitUser"],
    mutationFn: postYesDebit,
    onSuccess: () => {
      queryClient.invalidateQueries("fetchUsers");
    },
    onError: async (error) => {
      console.log("Error:", error);
      if (error.response) {
        console.log("Response Data:", error.response.data);
      }
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
        // accessorKey: "transactionTotal",
        id: "transactionTotal",
        accessorFn: (row) => row.transactionNetTotal?.toLocaleString("en-US"),
        enableClickToCopy: false,
        header: "Amount",
      },
      {
        // accessorKey: "transactionTotal",
        id: "transactionFee",
        accessorKey: "transactionFee",
        enableClickToCopy: false,
        header: "Transaction Fee",
      },
      {
        accessorFn: (row) => {
          if (row?.transactionDate) {
            return format(new Date(row.transactionDate), "Pp");
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

  const activitiesColumns = useMemo(
    () => [
      {
        accessorKey: "Action",
        enableClickToCopy: false,
        header: "Action",
      },
      {
        accessorKey: "Description",
        enableClickToCopy: true,
        header: "Description",
      },
      {
        accessorKey: "ip",
        enableClickToCopy: false,
        header: "IP Address",
      },
      {
        accessorKey: "browser",
        enableClickToCopy: false,
        header: "Browser",
      },
      {
        // accessorKey: "transactionDate",
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

  // Please change this section to fetch the reason type live from the api endpoint.
  // This was added due to the fact that the api meant for this hasn't been deployed yet on production server.
  const validReasonTypes = [
    "Transaction",
    "Reward",
    "Salary",
    "Fee",
    "Payment",
  ];

  console.log(userDetails?.data?.user);
  return (
    <>
      <Snackbar
        TransitionComponent={Slide}
        open={creditSuccessToast}
        autoHideDuration={6000}
        onClose={handleCreditSuccessToastClose}
      >
        <Alert
          onClose={handleCreditSuccessToastClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {creditUserMutation?.data?.data?.message}
        </Alert>
      </Snackbar>

      <Snackbar
        TransitionComponent={Slide}
        open={creditErrorToast}
        autoHideDuration={6000}
        onClose={handleCreditErrorToastClose}
      >
        <Alert
          onClose={handleCreditErrorToastClose}
          severity="warning"
          sx={{ width: "100%" }}
        >
          {creditUserMutation?.error?.response?.data?.message}
        </Alert>
      </Snackbar>

      <Snackbar
        TransitionComponent={Slide}
        open={debitSuccessToast}
        autoHideDuration={6000}
        onClose={handleDebitSuccessToastClose}
      >
        <Alert
          onClose={handleDebitSuccessToastClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {debitUserMutation?.data?.data?.message}
        </Alert>
      </Snackbar>

      <Snackbar
        TransitionComponent={Slide}
        open={debitErrorToast}
        autoHideDuration={6000}
        onClose={handleDebitErrorToastClose}
      >
        <Alert
          onClose={handleDebitErrorToastClose}
          severity="warning"
          sx={{ width: "100%" }}
        >
          {debitUserMutation?.error?.response?.data?.message}
        </Alert>
      </Snackbar>

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
        <Grid
          item
          xs={12}
          sm={12}
          lg={6}
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
              <Typography variant="body2" color="text.secondary">
                {/* <b>Joined:</b> {userDetails?.data?.user?.createdAt} */}
                <b>Joined:</b>{" "}
                {userDetails?.data?.user?.createdAt
                  ? format(new Date(userDetails?.data?.user?.createdAt), "Pp")
                  : ""}
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
                ? userWallet?.data.map((wallet, id) => (
                    <>
                      <Stack
                        key={id}
                        direction="row"
                        spacing={2}
                        marginBottom={2}
                      >
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

              {/* <Grid item sm={12} xs={12} lg={12} marginTop={8}> */}
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "20px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {userDetails?.data?.user?.status === "blocked" ? (
                  <Button
                    color="error"
                    variant="contained"
                    onClick={() =>
                      unblockMutation.mutate(userDetails?.data?.user?.id)
                    }
                  >
                    {unblockMutation.isLoading ? (
                      <CircularProgress size={23} color="inherit" />
                    ) : (
                      "Unblock"
                    )}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() =>
                      blockMutation.mutate(userDetails?.data?.user?.id)
                    }
                  >
                    {blockMutation.isLoading ? (
                      <CircularProgress size={23} color="inherit" />
                    ) : (
                      "Block"
                    )}
                  </Button>
                )}

                {userDetails?.data?.user?.flagged === 1 ? (
                  <Button
                    color="error"
                    variant="contained"
                    onClick={() =>
                      unflagUserMutation.mutate(userDetails?.data?.user?.id)
                    }
                  >
                    {unflagUserMutation.isLoading ? (
                      <CircularProgress size={23} color="inherit" />
                    ) : (
                      "Unflag"
                    )}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() =>
                      flagUserMutation.mutate(userDetails?.data?.user?.id)
                    }
                  >
                    {flagUserMutation.isLoading ? (
                      <CircularProgress size={23} color="inherit" />
                    ) : (
                      "Flag"
                    )}
                  </Button>
                )}

                {userDetails?.data?.user?.postNoDebit === 1 ? (
                  <Button
                    variant="contained"
                    onClick={() =>
                      postYesDebitMutation.mutate(userDetails?.data?.user?.id)
                    }
                  >
                    {postYesDebitMutation.isLoading ? (
                      <CircularProgress size={23} color="inherit" />
                    ) : (
                      "Activate Wallet"
                    )}
                  </Button>
                ) : (
                  <Button
                    color="error"
                    variant="contained"
                    onClick={() =>
                      postNoDebitMutation.mutate(userDetails?.data?.user?.id)
                    }
                  >
                    {postNoDebitMutation.isLoading ? (
                      <CircularProgress size={23} color="inherit" />
                    ) : (
                      "Lien Wallet"
                    )}
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
          {/* <Divider orientation="vertical" variant="middle"  /> */}
        </Grid>

        {user?.role === "root" ? (
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
                      <CardHeader
                        subheader=""
                        sx={{ color: "green" }}
                        title="Credit User Wallet"
                      />
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

                        {/* Credit Reason type section.. */}
                        <InputLabel
                          id="demo-simple-select-standard-label"
                          style={{ marginTop: "18px" }}
                        >
                          Reason Type
                        </InputLabel>
                        <Select
                          fullWidth
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          defaultValue="None"
                          onChange={(e) =>
                            setCreditDetails((prev) => ({
                              ...prev,
                              ["reasonType"]: e.target.value,
                            }))
                          }
                          label="Reason Type"
                        >
                          <MenuItem value="">None</MenuItem>
                          {validReasonTypes.map((name, id) => (
                            <MenuItem key={id} value={name}>
                              {name}
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
                          label="Reason Description"
                          margin="normal"
                          name="reasonDescription"
                          onChange={(e) =>
                            setCreditDetails((prev) => ({
                              ...prev,
                              ["reasonDescription"]: e.target.value,
                            }))
                          }
                          type={"text"}
                          value={creditDetails.reasonDescription}
                          variant="outlined"
                        />
                        <TextField
                          autoComplete={false}
                          fullWidth
                          label="Approval Pin"
                          margin="normal"
                          name="approvalPin"
                          onChange={handleCreditChange}
                          type={
                            creditDetails.approvalPin === ""
                              ? "text"
                              : "password"
                          }
                          value={creditDetails.approvalPin}
                          variant="outlined"
                        />
                      </CardContent>
                      {/* End of Credit reason type section */}

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
                            const mergedDetails = {
                              ...creditDetails,
                              walletId,
                            };
                            creditUserMutation.mutate(mergedDetails);
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
                      <CardHeader
                        subheader=""
                        sx={{ color: "red" }}
                        title="Debit User Wallet"
                      />
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

                        {/* Debit Reason type section */}
                        <InputLabel
                          id="demo-simple-select-standard-label"
                          style={{ marginTop: "18px" }}
                        >
                          Reason Type
                        </InputLabel>
                        <Select
                          fullWidth
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          defaultValue="None"
                          onChange={(e) =>
                            setDebitDetails((prev) => ({
                              ...prev,
                              ["reasonType"]: e.target.value,
                            }))
                          }
                          label="Reason Type"
                        >
                          <MenuItem value="">None</MenuItem>
                          {validReasonTypes.map((name, id) => (
                            <MenuItem key={id} value={name}>
                              {name}
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
                          autoComplete={false}
                          fullWidth
                          label="Reason Description"
                          margin="normal"
                          name="reasonDescription"
                          onChange={(e) =>
                            setDebitDetails((prev) => ({
                              ...prev,
                              ["reasonDescription"]: e.target.value,
                            }))
                          }
                          type={"text"}
                          value={debitDetails.reasonDescription}
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
                      {/* End of Debit Reason type section */}
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
                            debitUserMutation.mutate({
                              ...debitDetails,
                              walletId,
                            });
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
        ) : null}
      </Grid>

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
                // centered
                scrollButtons="auto"
                aria-label=""
              >
                <Tab label="Transactions" {...a11yProps(0)} />
                <Tab label="Activities" {...a11yProps(1)} />
                <Tab label="Payout" {...a11yProps(2)} />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <Box sx={{ pt: 3 }}>
                <form>
                  <Card>
                    <CardHeader subheader="" title="User Transactions" />
                    <Divider />
                    <CardContent>
                      <MaterialTable
                        columns={columns}
                        data={userTransactions?.data ?? []}
                        rowCount={userTransactions?.count?.total ?? 0}
                        isLoading={isLoading}
                        isError={isError}
                        isFetching={isFetching}
                        status={status}
                        setStatus={setStatus}
                        handleStatus={handleStatus}
                        pagination={pagination}
                        setPagination={setPagination}
                        setGlobalFilter={setGlobalFilter}
                        globalFilter={globalFilter}
                        refetch={refetchTransactions}
                      />
                    </CardContent>
                  </Card>
                </form>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Box sx={{ pt: 3 }}>
                <form>
                  <Card>
                    <CardHeader subheader="" title="User Activities" />
                    <Divider />
                    <CardContent>
                      <MaterialTable
                        columns={activitiesColumns}
                        data={userActivities?.data ?? []}
                        rowCount={userActivities?.data?.length ?? 0}
                        isLoading={loadingActivities}
                        isError={fetchActivitiesError}
                        isFetching={fetchingActivities}
                        status={status}
                        setStatus={setStatus}
                        handleStatus={handleStatus}
                        pagination={pagination}
                        setPagination={setPagination}
                        setGlobalFilter={setGlobalFilter}
                        globalFilter={globalFilter}
                        refetch={refetchActivities}
                      />
                    </CardContent>
                  </Card>
                </form>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <RecentOrders userPayouts={userPayout?.data} />
            </TabPanel>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};
Users.auth = true;
export default Users;
