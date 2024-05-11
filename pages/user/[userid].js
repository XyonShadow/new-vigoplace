import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { format } from "date-fns";
import axios from "axios";
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
  OutlinedInput,
  Chip,
  Select,
  Stack,
  InputLabel,
  FormControl,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";
import CheckIcon from "@mui/icons-material/Check";
import MoreVertIcon from "@mui/icons-material/MoreVert";
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
  Menu,
  MenuItem,
  Typography,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme,
} from "@mui/material";
import Link from "next/link";

//Icons Imports
import { LoadingButton, TabContext, TabList } from "@mui/lab";
import { MaterialTable } from "../../src/components/table";
import RecentOrders from "../../src/components/RecentOrders";
import {
  usePayoutRequests,
  fetchPayoutRequests,
} from "../../hooks/usePayoutRequests";
import { useReceiptGeneration } from "../../hooks/useReceiptGeneration";
import Orders from "./orders";
import Activities from "./activities";
import Places from "./places";
import Followers from "./followers";
import Notification from "./notification";
import Kyc from "./kyc";
import Transaction from "./transaction";
import Tickets from "./ticket";

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
  const theme = useTheme();
  const [value, setValue] = React.useState("1");
  const [walletId, setWalletId] = React.useState(null);
  const [openToast, setOpenToast] = React.useState(false);
  const [ticketErrorToast, setTicketErrorToast] = React.useState(false);
  const [ticketSuccessToast, setTicketSuccessToast] = React.useState(false);
  const [creditSuccessToast, setCreditSuccessToast] = React.useState(false);
  const [creditErrorToast, setCreditErrorToast] = React.useState(false);
  const [debitSuccessToast, setDebitSuccessToast] = React.useState(false);
  const [debitErrorToast, setDebitErrorToast] = React.useState(false);
  const [notifySuccessToast, setNotifySuccessToast] = React.useState(false);
  const [notifyErrorToast, setNotifyErrorToast] = React.useState(false);
  const [kycSuccessToast, setKycSuccessToast] = React.useState(false);
  const [kycErrorToast, setKycErrorToast] = React.useState(false);
  const [emailSuccessToast, setEmailSuccessToast] = React.useState(false);
  const [emailErrorToast, setEmailErrorToast] = React.useState(false);
  const [lienModal, setLienModal] = React.useState(false);
  const [ticketModal, setTicketModal] = React.useState(false);
  const [notifyModal, setNotifyModal] = React.useState(false);
  const [kycModal, setKycModal] = React.useState(false);
  const [emailModal, setEmailModal] = React.useState(false);
  const [status, setStatus] = React.useState("");
  const [pin, setPin] = React.useState(null);
  const [reason, setReason] = React.useState("");
  const [duration, setDuration] = React.useState("");
  const [categoryId, setCategoryId] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [notificationText, setNotificationText] = useState("");
  const [isVerified, setIsverified] = React.useState("");
  const [tabValue, setTabValue] = React.useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
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

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handlePin = (e) => {
    setPin(e.target.value);
  };

  const handleReason = (e) => {
    setReason(e.target.value);
  };

  const handleDuration = (e) => {
    setDuration(e.target.value);
  };

  const handleCategoryId = (e) => {
    setCategoryId(Number(e.target.value) || "");
  };

  const handleSubject = (e) => {
    setSubject(e.target.value);
  };

  const handleDescription = (e) => {
    setDescription(e.target.value);
  };

  const handleNotificationText = (event) => {
    setNotificationText(event.target.value);
  };

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleGenerateReceipt = async () => {
    try {
      const pdfBytes = await generateReceipt();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating receipt:", error);
    }
  };

  //onClick={handleGenerateReceipt}

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
  const walletid = userDetails?.data?.wallet[0]?.WId;
  const walletids = parseInt(walletid);

  const { generateReceipt } = useReceiptGeneration(
    userid,
    walletids,
    startDate,
    endDate,
    user
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
      //"http://localhost:4000/api/admin/console/users/wallet/credit",
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
      setOpenToast(true);
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

  const postNoDebit = async ({ id, pin, reason, duration }) => {
    //console.log(duration);
    const postNoDebitUser = await axios.post(
      "https://vigoplace.com/server/api/admin/console/post-no-debit",
      {
        userId: id.toString(),
        status: "suspend",
        reason: reason,
        duration: duration.toLowerCase(),
        approvalPin: pin,
      },
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
      queryClient.invalidateQueries("fetchSingleUser");
      setTimeout(() => {
        postNoDebitMutation.reset(); // Reset the mutation
      }, 2000);
    },
    onError: async (error) => {
      console.log("Error:", error);
      setOpenToast(true);
      if (error.response) {
        console.log("Response Data:", error.response.data);
      }
    },
  });

  const postYesDebit = async ({ id, pin, reason }) => {
    const postYesDebitUser = await axios.post(
      "https://vigoplace.com/server/api/admin/console/post-no-debit",
      {
        userId: id.toString(),
        status: "activate",
        reason: reason,
        duration: "null",
        approvalPin: pin,
      },
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
      queryClient.invalidateQueries("fetchSingleUser");
      setTimeout(() => {
        postYesDebitMutation.reset();
      }, 2000);
    },
    onError: async (error) => {
      setOpenToast(true);
      console.log("Error:", error);
      if (error.response) {
        console.log("Response Data:", error.response.data);
      }
    },
  });

  const createTicket = async ({ id, description, subject, categoryId }) => {
    const createTicketUser = await axios.post(
      "https://vigoplace.com/server/api/admin/ticket/user",
      //"http://localhost:4000/api/admin/ticket/user",
      {
        userId: id.toString(),
        description,
        subject,
        categoryId,
      },
      {
        headers: {
          Authorization: user?.token,
        },
      }
    );
    return createTicketUser;
  };

  const createTicketMutation = useMutation({
    mutationKey: ["postYesDebitUser"],
    mutationFn: createTicket,
    onSuccess: () => {
      queryClient.invalidateQueries("fetchSingleUser");
      setTicketSuccessToast(true);
      setTimeout(() => {
        createTicketMutation.reset();
      }, 7000);
    },
    onError: async (error) => {
      setTicketErrorToast(true);
      console.log("Error:", error);
      if (error.response) {
        console.log("Response Data:", error.response.data);
      }
    },
  });

  const notifyUser = async ({ id, notificationText }) => {
    const notification = await axios.post(
      //"http://localhost:4000/api/admin/notifications/notify",
      "https://vigoplace.com/server/api/admin/notifications/notify",
      { users: id, message: notificationText },
      {
        headers: {
          Authorization: user?.token,
        },
      }
    );

    // if (notification.status === 200) {
    //   toast.success(notification.data.message);
    // }

    return notification;
  };

  const notifyUserMutation = useMutation({
    mutationKey: ["notifyUser"],
    mutationFn: notifyUser,
    onSuccess: () => {
      setNotificationText("");
      //handleClose();
      setNotifySuccessToast(true);
      queryClient.invalidateQueries("fetchSingleUser");
      setTimeout(() => {
        notifyUserMutation.reset();
      }, 7000);
    },
    onError: async (error) => {
      console.log(error);
      setNotifyErrorToast(true);
    },
  });

  const verifyKyc = async ({ id, pin }) => {
    const verifyKycUser = await axios.post(
      //"http://localhost:4000/api/admin/console/users/kycverify",
      "https://vigoplace.com/server/api/admin/console/users/kycverify",
      { userId: id, approvalPin: pin },
      {
        headers: {
          Authorization: user?.token,
        },
      }
    );

    return verifyKycUser;
  };

  const verifyKycMutation = useMutation({
    mutationKey: ["verifyKyc"],
    mutationFn: verifyKyc,
    onSuccess: () => {
      setPin(null);
      setKycSuccessToast(true);
      queryClient.invalidateQueries("fetchSingleUser");
      setTimeout(() => {
        verifyKycMutation.reset();
      }, 7000);
    },
    onError: async (error) => {
      console.log(error);
      setKycErrorToast(true);
    },
  });

  const verifyEmail = async ({ id, pin }) => {
    const verifyEmailUser = await axios.post(
      //"http://localhost:4000/api/admin/console/users/kycverify",
      "https://vigoplace.com/server/api/admin/console/users/emailverify",
      { userId: id, approvalPin: pin },
      {
        headers: {
          Authorization: user?.token,
        },
      }
    );

    return verifyEmailUser;
  };

  const verifyEmailMutation = useMutation({
    mutationKey: ["verifyEmail"],
    mutationFn: verifyEmail,
    onSuccess: () => {
      setPin(null);
      setEmailSuccessToast(true);
      queryClient.invalidateQueries("fetchSingleUser");
      setTimeout(() => {
        verifyEmailMutation.reset();
      }, 7000);
    },
    onError: async (error) => {
      console.log(error);
      setEmailErrorToast(true);
    },
  });

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

  const handleNotifySuccessToastClose = (event, reason) => {
    setNotifySuccessToast(false);
  };
  const handleNotifyErrorToastClose = (event, reason) => {
    setNotifyErrorToast(false);
  };

  const handleKycSuccessToastClose = (event, reason) => {
    setKycSuccessToast(false);
  };
  const handleKycErrorToastClose = (event, reason) => {
    setKycErrorToast(false);
  };

  const handleEmailSuccessToastClose = (event, reason) => {
    setEmailSuccessToast(false);
  };
  const handleEmailErrorToastClose = (event, reason) => {
    setEmailErrorToast(false);
  };

  const handleClose = (event, reason) => {
    setOpenToast(false);
  };

  const handleTicketClose = (event, reason) => {
    setTicketErrorToast(false);
  };

  const handleSuccessTicketToastClose = (event, reason) => {
    setTicketSuccessToast(false);
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

      <Snackbar
        TransitionComponent={Slide}
        open={openToast}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="warning" sx={{ width: "100%" }}>
          {postNoDebitMutation.error?.response?.data?.message ||
            postYesDebitMutation.error?.response?.data?.message}
        </Alert>
      </Snackbar>

      <Snackbar
        TransitionComponent={Slide}
        open={ticketSuccessToast}
        autoHideDuration={6000}
        onClose={handleSuccessTicketToastClose}
      >
        <Alert
          onClose={handleSuccessTicketToastClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {createTicketMutation?.data?.data?.message}
        </Alert>
      </Snackbar>

      <Snackbar
        TransitionComponent={Slide}
        open={ticketErrorToast}
        autoHideDuration={6000}
        onClose={handleTicketClose}
      >
        <Alert
          onClose={handleTicketClose}
          severity="warning"
          sx={{ width: "100%" }}
        >
          {createTicketMutation.error?.response?.data?.message}
        </Alert>
      </Snackbar>

      <Snackbar
        TransitionComponent={Slide}
        open={notifySuccessToast}
        autoHideDuration={6000}
        onClose={handleNotifySuccessToastClose}
      >
        <Alert
          onClose={handleNotifySuccessToastClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {notifyUserMutation?.data?.data?.message}
        </Alert>
      </Snackbar>

      <Snackbar
        TransitionComponent={Slide}
        open={notifyErrorToast}
        autoHideDuration={6000}
        onClose={handleNotifyErrorToastClose}
      >
        <Alert
          onClose={handleNotifyErrorToastClose}
          severity="warning"
          sx={{ width: "100%" }}
        >
          {notifyUserMutation?.error?.response?.data?.message}
        </Alert>
      </Snackbar>

      <Snackbar
        TransitionComponent={Slide}
        open={kycSuccessToast}
        autoHideDuration={6000}
        onClose={handleKycSuccessToastClose}
      >
        <Alert
          onClose={handleKycSuccessToastClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {verifyKycMutation?.data?.data?.message}
        </Alert>
      </Snackbar>

      <Snackbar
        TransitionComponent={Slide}
        open={kycErrorToast}
        autoHideDuration={6000}
        onClose={handleKycErrorToastClose}
      >
        <Alert
          onClose={handleKycErrorToastClose}
          severity="warning"
          sx={{ width: "100%" }}
        >
          {verifyKycMutation?.error?.response?.data?.message}
        </Alert>
      </Snackbar>

      <Snackbar
        TransitionComponent={Slide}
        open={emailSuccessToast}
        autoHideDuration={6000}
        onClose={handleEmailSuccessToastClose}
      >
        <Alert
          onClose={handleEmailSuccessToastClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {verifyEmailMutation?.data?.data?.message}
        </Alert>
      </Snackbar>

      <Snackbar
        TransitionComponent={Slide}
        open={emailErrorToast}
        autoHideDuration={6000}
        onClose={handleEmailErrorToastClose}
      >
        <Alert
          onClose={handleEmailErrorToastClose}
          severity="warning"
          sx={{ width: "100%" }}
        >
          {verifyEmailMutation?.error?.response?.data?.message}
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
                // <IconButton aria-label="settings">

                // </IconButton>
                <IconButton
                  onClick={handleMenuOpen}
                  id="long-button"
                  aria-controls={
                    Boolean(menuAnchorEl) ? "menu-buttons" : undefined
                  }
                  aria-expanded={Boolean(menuAnchorEl) ? "true" : undefined}
                  aria-haspopup="true"
                  size="small"
                  sx={{ fontWeight: "bold" }}
                >
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
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ marginBottom: "5px" }}
              >
                <b>Phone:</b> {userDetails?.data?.user?.phone}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ marginBottom: "5px" }}
              >
                <b>User name:</b> {userDetails?.data?.user?.username}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ marginBottom: "5px" }}
              >
                <b>Address:</b> {userDetails?.data?.user?.address}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ marginBottom: "5px" }}
              >
                <b>BIO:</b> {userDetails?.data?.user?.bio}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ marginBottom: "5px" }}
              >
                <b>Joined:</b>{" "}
                {userDetails?.data?.user?.createdAt
                  ? format(new Date(userDetails?.data?.user?.createdAt), "Pp")
                  : ""}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ marginBottom: "5px" }}
              >
                <b>Email:</b>{" "}
                {userDetails?.data?.user?.emailVerified
                  ? "Verified"
                  : "Not verified"}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ marginBottom: "5px" }}
              >
                <b>KYC:</b>{" "}
                {userDetails?.data?.user?.kycVerified === "verified"
                  ? "Verified"
                  : "Not Verified"}
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

              <Divider variant="middle" />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: "20px",
                  marginTop: "20px",
                }}
              >
                <Box>
                  <label
                    htmlFor="startDate"
                    variant="body2"
                    color="text.secondary"
                    sx={{ marginBottom: "5px" }}
                  >
                    {" "}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        marginBottom: "5px",
                        fontWeight: 500,
                        fontSize: "14px",
                        [theme.breakpoints.down("sm")]: {
                          fontSize: "12px",
                        },
                      }}
                    >
                      Start date
                    </Typography>
                  </label>
                  <input
                    className="text-xs"
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={handleStartDateChange}
                  />
                </Box>
                <Box>
                  <label
                    htmlFor="endDate"
                    variant="body2"
                    color="text.secondary"
                    sx={{ marginBottom: "5px" }}
                  >
                    {" "}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        marginBottom: "5px",
                        fontWeight: 500,
                        fontSize: "14px",
                        [theme.breakpoints.down("sm")]: {
                          fontSize: "12px",
                        },
                      }}
                    >
                      End date
                    </Typography>
                  </label>
                  <input
                    className="text-xs"
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={handleEndDateChange}
                  />
                </Box>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Button
                  sx={{ justifyContent: "center" }}
                  variant="contained"
                  onClick={handleGenerateReceipt}
                >
                  {/* {createTicketMutation.isLoading ? (
                    <CircularProgress size={23} color="inherit" />
                  ) : createTicketMutation.isSuccess ? (
                    <CheckIcon />
                  ) : ( */}
                  {"Generate Transaction Receipt"}
                  {/* )} */}
                </Button>
              </Box>

              <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&:before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    flexWrap: "wrap",
                    gap: "15px",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {userDetails?.data?.user?.status === "blocked" ? (
                    <MenuItem
                      sx={{
                        width: "100%",
                        marginRight: "auto",
                        marginTop: "10px",
                      }}
                    >
                      <Typography
                        sx={{ marginTop: "15px" }}
                        variant="body2"
                        color="text.secondary"
                        onClick={() =>
                          unblockMutation.mutate(userDetails?.data?.user?.id)
                        }
                      >
                        {unblockMutation.isLoading ? (
                          <CircularProgress size={23} color="inherit" />
                        ) : (
                          "Unblock"
                        )}
                      </Typography>
                    </MenuItem>
                  ) : (
                    <MenuItem
                      sx={{
                        width: "100%",
                        marginRight: "auto",
                        marginTop: "10px",
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        onClick={() =>
                          blockMutation.mutate(userDetails?.data?.user?.id)
                        }
                      >
                        {blockMutation.isLoading ? (
                          <CircularProgress size={23} color="inherit" />
                        ) : (
                          "Block"
                        )}
                      </Typography>
                    </MenuItem>
                  )}

                  {userDetails?.data?.user?.flagged === 1 ? (
                    <MenuItem sx={{ width: "100%", marginRight: "auto" }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        onClick={() =>
                          unflagUserMutation.mutate(userDetails?.data?.user?.id)
                        }
                      >
                        {unflagUserMutation.isLoading ? (
                          <CircularProgress size={23} color="inherit" />
                        ) : (
                          "Unflag"
                        )}
                      </Typography>
                    </MenuItem>
                  ) : (
                    <MenuItem sx={{ width: "100%", marginRight: "auto" }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        onClick={() =>
                          flagUserMutation.mutate(userDetails?.data?.user?.id)
                        }
                      >
                        {flagUserMutation.isLoading ? (
                          <CircularProgress size={23} color="inherit" />
                        ) : (
                          "Flag"
                        )}
                      </Typography>
                    </MenuItem>
                  )}

                  {userDetails?.data?.user?.postNoDebit === 1 ? (
                    <>
                      <MenuItem sx={{ width: "100%", marginRight: "auto" }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          onClick={
                            () => setLienModal(true)
                            //postYesDebitMutation.mutate(userDetails?.data?.user?.id)
                          }
                        >
                          {/* {postYesDebitMutation.isLoading ? (
                          <CircularProgress size={23} color="inherit" />
                        ) : (
                          "Activate Wallet"
                        )} */}
                          {postYesDebitMutation.isLoading ? (
                            <CircularProgress size={23} color="inherit" />
                          ) : postYesDebitMutation.isSuccess ? (
                            <CheckIcon />
                          ) : (
                            "Activate Wallet"
                          )}
                        </Typography>
                      </MenuItem>

                      <Dialog
                        open={lienModal}
                        onClose={() => {
                          setLienModal(false);
                          setPin(null);
                        }}
                      >
                        <DialogTitle>Activate Wallet</DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            Please enter your admin approval pin to Activate
                            this user's liened wallet, if you dont have one yet,
                            head to{" "}
                            {
                              <Link style={{ color: "blue" }} href="/settings">
                                Settings
                              </Link>
                            }{" "}
                            to create one now
                          </DialogContentText>
                          <TextField
                            autoFocus
                            margin="dense"
                            id="reason"
                            label="Reason"
                            multiline
                            fullWidth
                            value={reason}
                            variant="standard"
                            onChange={handleReason}
                          />
                          <TextField
                            margin="dense"
                            id="name"
                            label="Approval Pin"
                            type="number"
                            fullWidth
                            value={pin}
                            variant="standard"
                            onChange={handlePin}
                          />
                        </DialogContent>
                        <DialogActions>
                          <Button
                            onClick={() => {
                              setLienModal(false);
                              setPin(null);
                              setReason("");
                            }}
                          >
                            Cancel
                          </Button>
                          <LoadingButton
                            variant="contained"
                            loading={postYesDebitMutation.isLoading}
                            disabled={
                              pin === null || pin?.length <= 5 || reason === ""
                            }
                            onClick={() => {
                              postYesDebitMutation.mutate({
                                id: userDetails?.data?.user?.id,
                                pin,
                                reason,
                              });
                              setReason("");
                              setLienModal(false);
                              setPin(null);
                            }}
                          >
                            Activate
                          </LoadingButton>
                        </DialogActions>
                      </Dialog>
                    </>
                  ) : (
                    <>
                      <MenuItem sx={{ width: "100%", marginRight: "auto" }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          onClick={
                            () => setLienModal(true)
                            //postNoDebitMutation.mutate(userDetails?.data?.user?.id)
                          }
                        >
                          {postNoDebitMutation.isLoading ? (
                            <CircularProgress size={23} color="inherit" />
                          ) : postNoDebitMutation.isSuccess ? (
                            <CheckIcon />
                          ) : (
                            "Lien Wallet"
                          )}
                        </Typography>
                      </MenuItem>

                      <Dialog
                        open={lienModal}
                        onClose={() => {
                          setLienModal(false);
                          setPin(null);
                        }}
                      >
                        <DialogTitle>Lien Wallet</DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            Please enter your admin approval pin to Lien this
                            user's wallet, if you dont have one yet, head to{" "}
                            {
                              <Link style={{ color: "blue" }} href="/settings">
                                Settings
                              </Link>
                            }{" "}
                            to create one now. Specify "Indefinite" in the
                            duration field if you want the user's wallet to be
                            indefinitely suspended.
                          </DialogContentText>
                          <TextField
                            autoFocus
                            margin="dense"
                            id="reason"
                            label="Reason"
                            multiline
                            fullWidth
                            value={reason}
                            variant="standard"
                            onChange={handleReason}
                          />
                          <TextField
                            margin="dense"
                            id="duration"
                            label="Duration"
                            type="text"
                            fullWidth
                            value={duration}
                            variant="standard"
                            onChange={handleDuration}
                          />
                          <TextField
                            margin="dense"
                            id="name"
                            label="Approval Pin"
                            type="number"
                            fullWidth
                            value={pin}
                            variant="standard"
                            onChange={handlePin}
                          />
                        </DialogContent>
                        <DialogActions>
                          <Button
                            onClick={() => {
                              setLienModal(false);
                              setPin(null);
                              setReason("");
                              setDuration("");
                            }}
                          >
                            Cancel
                          </Button>
                          <LoadingButton
                            variant="contained"
                            loading={postNoDebitMutation.isLoading}
                            disabled={
                              pin === null ||
                              pin?.length <= 5 ||
                              reason === "" ||
                              duration === ""
                            }
                            onClick={() => {
                              postNoDebitMutation.mutate({
                                id: userDetails?.data?.user?.id,
                                pin: pin,
                                reason: reason,
                                duration: duration,
                              });
                              setPin(null);
                              setReason("");
                              setDuration("");
                              setLienModal(false);
                            }}
                          >
                            Lien
                          </LoadingButton>
                        </DialogActions>
                      </Dialog>
                    </>
                  )}

                  <>
                    <MenuItem sx={{ width: "100%", marginRight: "auto" }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        onClick={() => setTicketModal(true)}
                      >
                        {createTicketMutation.isLoading ? (
                          <CircularProgress size={23} color="inherit" />
                        ) : createTicketMutation.isSuccess ? (
                          <CheckIcon />
                        ) : (
                          "Create Ticket"
                        )}
                      </Typography>
                    </MenuItem>

                    <Dialog
                      open={ticketModal}
                      onClose={() => {
                        setTicketModal(false);
                      }}
                    >
                      <DialogTitle>Create User Ticket</DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          Please enter all the necessary details to create a
                          ticket on this user's account,
                        </DialogContentText>
                        <FormControl fullWidth>
                          <InputLabel
                            id="demo-dialog-select-label"
                            style={{ marginTop: "18px" }}
                          >
                            Select an issue
                          </InputLabel>
                          <Select
                            labelId="demo-dialog-select-label"
                            id="demo-dialog-select"
                            value={categoryId}
                            onChange={handleCategoryId}
                            input={<OutlinedInput label="Category" />}
                            fullWidth
                            style={{ marginTop: "20px" }}
                          >
                            <MenuItem value={1}>Authentication</MenuItem>
                            <MenuItem value={2}>Transaction</MenuItem>
                            <MenuItem value={3}>Wallet</MenuItem>
                            <MenuItem value={4}>Voting</MenuItem>
                          </Select>
                        </FormControl>
                        <TextField
                          margin="dense"
                          id="subject"
                          label="Subject"
                          multiline
                          fullWidth
                          value={subject}
                          variant="standard"
                          onChange={handleSubject}
                        />
                        <TextField
                          margin="dense"
                          id="description"
                          label="Message"
                          multiline
                          fullWidth
                          value={description}
                          variant="standard"
                          onChange={handleDescription}
                        />
                      </DialogContent>
                      <DialogActions>
                        <Button
                          onClick={() => {
                            setDescription("");
                            setSubject("");
                            setCategoryId("");
                            setTicketModal(false);
                          }}
                        >
                          Cancel
                        </Button>
                        <LoadingButton
                          variant="contained"
                          loading={createTicketMutation.isLoading}
                          disabled={
                            subject === "" ||
                            description === "" ||
                            categoryId === "Category" ||
                            categoryId === ""
                          }
                          onClick={() => {
                            createTicketMutation.mutate({
                              id: userDetails?.data?.user?.id,
                              description,
                              subject,
                              categoryId,
                            });
                            setDescription("");
                            setSubject("");
                            setCategoryId("");
                            setTicketModal(false);
                          }}
                        >
                          Create
                        </LoadingButton>
                      </DialogActions>
                    </Dialog>
                  </>

                  <>
                    <MenuItem sx={{ width: "100%", marginRight: "auto" }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        onClick={() => setNotifyModal(true)}
                      >
                        {notifyUserMutation.isLoading ? (
                          <CircularProgress size={23} color="inherit" />
                        ) : notifyUserMutation.isSuccess ? (
                          <CheckIcon />
                        ) : (
                          "Send Notification"
                        )}
                      </Typography>
                    </MenuItem>

                    <Dialog
                      open={notifyModal}
                      onClose={() => {
                        setNotifyModal(false);
                      }}
                    >
                      <DialogTitle>Send Notification</DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          Enter Notification Text You Wish To Send To This User
                        </DialogContentText>

                        <TextField
                          autoFocus
                          margin="normal"
                          id="name"
                          label="Enter Notification Text"
                          multiline
                          fullWidth
                          variant="standard"
                          onChange={handleNotificationText}
                        />
                      </DialogContent>
                      <DialogActions>
                        <Button
                          onClick={() => {
                            setNotificationText("");
                            setNotifyModal(false);
                          }}
                        >
                          Cancel
                        </Button>
                        <LoadingButton
                          variant="contained"
                          loading={notifyUserMutation.isLoading}
                          disabled={notificationText === ""}
                          onClick={() => {
                            notifyUserMutation.mutate({
                              id: userDetails?.data?.user?.id,
                              notificationText,
                            });
                            setNotificationText("");
                            setNotifyModal(false);
                          }}
                        >
                          Notify
                        </LoadingButton>
                      </DialogActions>
                    </Dialog>
                  </>

                  {userDetails?.data?.user?.kycVerified === "unverified" && (
                    <>
                      <MenuItem sx={{ width: "100%", marginRight: "auto" }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          onClick={() => setKycModal(true)}
                        >
                          {verifyKycMutation.isLoading ? (
                            <CircularProgress size={23} color="inherit" />
                          ) : verifyKycMutation.isSuccess ? (
                            <CheckIcon />
                          ) : (
                            "Verify Kyc"
                          )}
                        </Typography>
                      </MenuItem>

                      <Dialog
                        open={kycModal}
                        onClose={() => {
                          setKycModal(false);
                        }}
                      >
                        <DialogTitle> Verify User's KYC</DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            Please enter your admin approval pin to Verify this
                            user's KYC, if you dont have one yet, head to{" "}
                            {
                              <Link style={{ color: "blue" }} href="/settings">
                                Settings
                              </Link>
                            }{" "}
                            to create one now.
                          </DialogContentText>

                          <TextField
                            margin="dense"
                            id="name"
                            label="Approval Pin"
                            type="number"
                            fullWidth
                            value={pin}
                            variant="standard"
                            onChange={handlePin}
                          />
                        </DialogContent>
                        <DialogActions>
                          <Button
                            onClick={() => {
                              setPin(null);
                              setKycModal(false);
                            }}
                          >
                            Cancel
                          </Button>
                          <LoadingButton
                            variant="contained"
                            loading={verifyKycMutation.isLoading}
                            disabled={pin === null || pin?.length <= 5}
                            onClick={() => {
                              verifyKycMutation.mutate({
                                id: userDetails?.data?.user?.id,
                                pin,
                              });
                              setKycModal(false);
                            }}
                          >
                            Verify
                          </LoadingButton>
                        </DialogActions>
                      </Dialog>
                    </>
                  )}

                  {userDetails?.data?.user?.emailVerified === 0 && (
                    <>
                      <MenuItem sx={{ width: "100%", marginRight: "auto" }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          onClick={() => setEmailModal(true)}
                        >
                          {verifyEmailMutation.isLoading ? (
                            <CircularProgress size={23} color="inherit" />
                          ) : verifyEmailMutation.isSuccess ? (
                            <CheckIcon />
                          ) : (
                            "Verify Email"
                          )}
                        </Typography>
                      </MenuItem>

                      <Dialog
                        open={emailModal}
                        onClose={() => {
                          setEmailModal(false);
                        }}
                      >
                        <DialogTitle> Verify User's Email</DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            Please enter your admin approval pin to Verify this
                            user's Email, if you dont have one yet, head to{" "}
                            {
                              <Link style={{ color: "blue" }} href="/settings">
                                Settings
                              </Link>
                            }{" "}
                            to create one now.
                          </DialogContentText>

                          <TextField
                            margin="dense"
                            id="name"
                            label="Approval Pin"
                            type="number"
                            fullWidth
                            value={pin}
                            variant="standard"
                            onChange={handlePin}
                          />
                        </DialogContent>
                        <DialogActions>
                          <Button
                            onClick={() => {
                              setPin(null);
                              setEmailModal(false);
                            }}
                          >
                            Cancel
                          </Button>
                          <LoadingButton
                            variant="contained"
                            loading={verifyEmailMutation.isLoading}
                            disabled={pin === null || pin?.length <= 5}
                            onClick={() => {
                              verifyEmailMutation.mutate({
                                id: userDetails?.data?.user?.id,
                                pin,
                              });
                              setEmailModal(false);
                            }}
                          >
                            Verify
                          </LoadingButton>
                        </DialogActions>
                      </Dialog>
                    </>
                  )}
                </Box>
              </Menu>
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
                variant="scrollable"
                scrollButtons={false}
                aria-label="scrollable prevent tabs example"
              >
                <Tab label="Transactions" {...a11yProps(0)} />
                <Tab label="Activities" {...a11yProps(1)} />
                <Tab label="Places" {...a11yProps(2)} />
                <Tab label="Payout" {...a11yProps(3)} />
                <Tab label="Orders" {...a11yProps(4)} />
                <Tab label="Followers" {...a11yProps(5)} />
                <Tab label="Notifications" {...a11yProps(6)} />
                <Tab label="Kyc" {...a11yProps(7)} />
                <Tab label="Tickets" {...a11yProps(8)} />
              </Tabs>
            </Box>

            {/* // You can also download the PDF file instead of opening in a new tab
                            // const a = document.createElement("a");
                            // a.href = url;
                            // a.download = "transaction_details.pdf";
                            // a.click(); */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ pt: 3 }}>
                <form>
                  <Card>
                    <CardHeader subheader="" title="User Transactions" />
                    <Divider />
                    <CardContent>
                      <Transaction />
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
                      <Activities />
                    </CardContent>
                  </Card>
                </form>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Box sx={{ pt: 3 }}>
                <form>
                  <Card>
                    <CardHeader subheader="" title="User Places" />
                    <Divider />
                    <CardContent>
                      <Places />
                    </CardContent>
                  </Card>
                </form>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
              <RecentOrders userPayouts={userPayout?.data} />
            </TabPanel>

            <TabPanel value={tabValue} index={4}>
              <Box sx={{ pt: 3 }}>
                <form>
                  <Card>
                    <CardHeader subheader="" title="User Orders" />
                    <Divider />
                    <CardContent>
                      <Orders />
                    </CardContent>
                  </Card>
                </form>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={5}>
              <Box sx={{ pt: 3 }}>
                <form>
                  <Card>
                    <CardHeader subheader="" title="User Followers" />
                    <Divider />
                    <CardContent>
                      <Followers />
                    </CardContent>
                  </Card>
                </form>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={6}>
              <Box sx={{ pt: 3 }}>
                <form>
                  <Card>
                    <CardHeader subheader="" title="User Notifications" />
                    <Divider />
                    <CardContent>
                      <Notification />
                    </CardContent>
                  </Card>
                </form>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={7}>
              <Box sx={{ pt: 3 }}>
                <form>
                  <Card>
                    <CardHeader subheader="" title="User Kyc Details" />
                    <Divider />
                    <CardContent>
                      <Kyc />
                    </CardContent>
                  </Card>
                </form>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={8}>
              <Box sx={{ pt: 3 }}>
                <form>
                  <Card>
                    <CardHeader subheader="" title="User Tickets" />
                    <Divider />
                    <CardContent>
                      <Tickets />
                    </CardContent>
                  </Card>
                </form>
              </Box>
            </TabPanel>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

Users.auth = true;
export default Users;
