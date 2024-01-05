'use client'
import React, { useMemo, useState, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
import {
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  Tab,
  Tooltip,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import RefreshIcon from "@mui/icons-material/Refresh";
import axios from "axios";
import CheckIcon from "@mui/icons-material/Check";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import SearchIcon from "@mui/icons-material/Search";
import Input from "@mui/material/Input";
import { useRouter } from "next/router";
import { format } from "date-fns";
import Link from "next/link";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

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
import { TabContext, TabList } from "@mui/lab";
import TabPanel from "@mui/lab/TabPanel";

import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import PropTypes from "prop-types";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Dialog from "@mui/material/Dialog";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import { blue } from "@mui/material/colors";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Slide from "@mui/material/Slide";
import { NewUsersComponet } from "../src/components/promo/newSignedUpUsers";
import { ReferralsComponet } from "../src/components/promo/referrals";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Promo = () => {
  const router = useRouter();
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
  const [gender, setGender] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [flagged, setFlagged] = React.useState("");
  const [isVerified, setIsverified] = React.useState("");
  const [wallet, setWallet] = React.useState("null");
  const [email, setEmail] = React.useState("");
  const [contactModal, setContactModal] = React.useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [contactUsers, setContactUsers] = useState([]);
  const [notificationText, setNotificationText] = useState("");
  const [expanded, setExpanded] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [openConfirmModal, setOpenConfirmModal] = React.useState(false);
  const [openConfirmNewSignupModal, setOpenConfirmNewSignupModal] =
    React.useState(false);
  const [userId, setUserId] = React.useState("");
  const [referralErrorAlert, setReferralErrorAlert] = React.useState(false);
  const [referralSuccessAlert, setReferralSuccessAlert] = React.useState(false);
  const [newSignupErrorAlert, setNewSignupErrorAlert] = React.useState(false);
  const [newUser, setNewUser] = React.useState({});

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleStatus = (event) => {
    setStatus(event.target.value);
    setPagination({
      pageIndex: 0,
      pageSize: 10,
    });
  };

  const handleClose = (value) => {
    setContactModal(false);
  };

  const handleReferralModalOpen = () => {
    setOpen(true);
  };

  const handleReferralModalClose = () => {
    setOpen(false);
  };

  const handleConfirmModalOpen = () => {
    setOpenConfirmModal(true);
  };
  const handleConfirmModalClose = () => {
    setOpenConfirmModal(false);
  };
  const handleConfirmNewSignUpModalOpen = (row) => {
    setNewUser({ userId: row.newUserId, creditNewUserId: row.newSignupId });
    setOpenConfirmNewSignupModal(true);
  };
  const handleConfirmNewSignUpModalClose = () => {
    setOpenConfirmNewSignupModal(false);
    setNewUser({});
  };

  const handleRechargeReferral = () => {
    rechargeReferralMutation.mutate({ userId });
  };
  const handleNewSignupRecharge = () => {
    rechargeNewSignupMutation.mutate({ userId }); // not done
  };

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  const rechargeReferral = async ({ userId }) => {
    const notification = await axios.post(
      // "http://localhost:3001/api/admin/console/users/referral-recharge",
      "https://vigoplace.com/server/api/admin/console/users/referral-recharge",
      { userId },
      {
        headers: {
          Authorization: user?.token,
        },
      }
    );
    return notification;
  };

  const rechargeReferralMutation = useMutation({
    mutationKey: ["rechargeReferral"],
    mutationFn: rechargeReferral,
    onSuccess: () => {
      setOpenConfirmModal(false);
      setOpen(false);
      setReferralSuccessAlert(true);
      queryClient.invalidateQueries("fetchReferrals");
    },
    onError: async (error) => {
      // setOpenToast(true);]
      console.log(error);
      setReferralErrorAlert(true);
    },
  });

  const rechargeNewSignup = async ({ userId, creditNewUserId }) => {
    const notification = await axios.post(
      // "http://localhost:3001/api/admin/console/users/signup-recharge",
      "https://vigoplace.com/server/api/admin/console/users/signup-recharge",
      { userId, creditNewUserId },
      {
        headers: {
          Authorization: user?.token,
        },
      }
    );
    return notification;
  };

  const rechargeNewSignupMutation = useMutation({
    mutationKey: ["rechargeNewSignup"],
    mutationFn: rechargeNewSignup,
    onSuccess: () => {
      setOpenConfirmNewSignupModal(false);
      setReferralSuccessAlert(true);
      queryClient.invalidateQueries("newSignups");
    },
    onError: async (error) => {
      console.log(error);
      setNewSignupErrorAlert(true);
    },
  });

  useEffect(() => {
    setPagination({ ...pagination, pageIndex: 0 });
  }, [columnFilters]);

  // const getUserWallet = async (id) => {
  //   const wallet = await axios.post(
  //     "http://localhost:3001/api/admin/console/users/wallets",
  //     // 'https://vigoplace.com/server/api/admin/console/approvepayout'
  //     { userId: id },
  //     {
  //       headers: {
  //         Authorization: user?.token,
  //       },
  //     }
  //   );
  //   return wallet;
  // };

  // const getUserWalletMutation = useMutation({
  //   mutationKey: ["userWallet"],
  //   mutationFn: getUserWallet,
  //   // onSuccess: () => {
  //   //   queryClient.invalidateQueries("fetchUsers");
  //   // },
  //   onError: async (error) => {
  //     // setOpenToast(true);
  //   },
  // });

  // const { data: referrals, isError, isFetching, isLoading, refetch } = useQuery(
  //   [
  //     "fetchReferrals",
  //     columnFilters, //refetch when columnFilters changes
  //     globalFilter, //refetch when globalFilter changes
  //     pagination.pageIndex, //refetch when pagination.pageIndex changes
  //     pagination.pageSize, //refetch when pagination.pageSize changes
  //     sorting, //refetch when sorting changes
  //     gender,
  //     status,
  //     isVerified,
  //     flagged,
  //     wallet,
  //   ],
  //   // async () => {
  //   //   // const url = new URL(
  //   //   //   'localhost:3001/api/admin/console/users',
  //   //   //   process.env.NODE_ENV === 'production'
  //   //   //     ? 'https://www.material-react-table.com'
  //   //   //     : 'http://localhost:30001',
  //   //   // );
  //   //   const url = new URL('localhost:3001/api/admin/console/users');
  //   //   url.searchParams.set(
  //   //     'start',
  //   //     `${pagination.pageIndex * pagination.pageSize}`,
  //   //   );
  //   //   url.searchParams.set('size', `${pagination.pageSize}`);
  //   //   url.searchParams.set('filters', JSON.stringify(columnFilters ?? []));
  //   //   url.searchParams.set('globalFilter', globalFilter ?? '');
  //   //   url.searchParams.set('sorting', JSON.stringify(sorting ?? []));

  //   //   const response = await fetch(url.href);
  //   //   const json = await response.json();
  //   //   return json;

  //   // },
  //   async () => {
  //     const { data } = await axios.get(
  //       // `http://localhost:3001/api/admin/console/users/referrals?limit=${
  //       `https://vigoplace.com/server/api/admin/console/users/referrals?limit=${
  //         pagination.pageSize
  //       }&offset=${
  //         pagination.pageIndex * pagination.pageSize
  //       }&walletCurrencyId=${wallet}${
  //         gender !== "" ? `&gender=${gender}` : ""
  //       }${status !== "" ? `&status=${status}` : ""}${
  //         flagged !== "" ? `&flagged=${flagged}` : ""
  //       }${isVerified !== "" ? `&isVerified=${isVerified}` : ""}${
  //         columnFilters?.length >= 1
  //           ? `&search=${JSON.stringify(columnFilters)}`
  //           : ""
  //       }`,
  //       // `http://localhost:3001/api/admin/console/users?limit=${pagination.pageSize}&offset=${pagination.pageIndex * pagination.pageSize}&walletCurrencyId=${wallet}${gender !== '' ? `&gender=${gender}` : ''}${status !== '' ? `&status=${status}` : ''}${flagged !== '' ? `&flagged=${flagged}` : ''}${isVerified !== '' ? `&isVerified=${isVerified}` : ''}${columnFilters?.length >= 1 ? `&search=${JSON.stringify(columnFilters)}` : ''}`,
  //       {
  //         headers: {
  //           Authorization: user?.token,
  //         },
  //       }
  //     );

  //     return data;
  //   },
  //   {
  //     onError: (err) => {
  //       console.log(err, "err fetching users");
  //     },
  //     enabled: !!user?.token,
  //   },
  //   { keepPreviousData: true }
  // );

  // const { data: newSignups, isError: newSignupsError, isFetching:fetchingNewSignups, isLoading:loadingNewSignups, refetch: refetchNewSignups } = useQuery(
  //   [
  //     "newSignups",
  //     columnFilters, //refetch when columnFilters changes
  //     globalFilter, //refetch when globalFilter changes
  //     pagination.pageIndex, //refetch when pagination.pageIndex changes
  //     pagination.pageSize, //refetch when pagination.pageSize changes
  //     sorting, //refetch when sorting changes
  //     gender,
  //     status,
  //     isVerified,
  //     flagged,
  //     wallet,
  //   ],
  //   async () => {
  //     const { data } = await axios.get(
  //       `http://localhost:3001/api/admin/console/users/new-signups?limit=${
  //       // `https://vigoplace.com/server/api/admin/console/users/new-signups?limit=${
  //         pagination.pageSize
  //       }&offset=${
  //         pagination.pageIndex * pagination.pageSize
  //       }&walletCurrencyId=${wallet}${
  //         gender !== "" ? `&gender=${gender}` : ""
  //       }${status !== "" ? `&status=${status}` : ""}${
  //         flagged !== "" ? `&flagged=${flagged}` : ""
  //       }${isVerified !== "" ? `&isVerified=${isVerified}` : ""}${
  //         columnFilters?.length >= 1
  //           ? `&search=${JSON.stringify(columnFilters)}`
  //           : ""
  //       }`,

  //       {
  //         headers: {
  //           Authorization: user?.token,
  //         },
  //       }
  //     );

  //     return data;
  //   },
  //   {
  //     onError: (err) => {
  //       console.log(err, "err fetching users");
  //     },
  //     enabled: !!user?.token,
  //   },
  //   { keepPreviousData: true }
  // );

  // const { data: userReferrals, isError: userReferralsError, isFetching:fetchingUserReferrals, isLoading:loadingUserReferrals, refetch: refetchUserReferrals } = useQuery(
  //   [
  //     "userReferrals",
  //     userId
  //   ],
  //   async () => {
  //     const { data } = await axios.get(
  //       // `http://localhost:3001/api/admin/console/users/referrals/${userId}`,
  //       `https://vigoplace.com/server/api/admin/console/users/referrals/${userId}?status=${status}`,
  //       {
  //         headers: {
  //           Authorization: user?.token,
  //         },
  //       }
  //     );

  //     return data;
  //   },
  //   {
  //     onError: (err) => {
  //       console.log(err, "err fetching users");
  //     },
  //     enabled: !!user?.token,
  //   },
  //   { keepPreviousData: true }
  // );

  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => row.fullname,
        // accessorFn: (row) => `${row.fullname}`,
        id: "name", //id is still required when using accessorFn instead of accessorKey
        header: "Full Name",
        enableColumnFilter: false,
      },
      {
        accessorKey: "phone",
        enableClickToCopy: true,
        header: "Mobile",
        enableColumnFilter: false,
      },
      {
        accessorKey: "total",
        enableClickToCopy: false,
        header: "Total",
        enableColumnFilter: false,
      },
    ],
    []
  );
  const newSignupColumns = useMemo(
    () => [
      {
        accessorFn: (row) => row.fullname,
        // accessorFn: (row) => `${row.fullname}`,
        id: "name", //id is still required when using accessorFn instead of accessorKey
        header: "Full Name",
        enableColumnFilter: false,
      },
      {
        accessorKey: "phone",
        enableClickToCopy: true,
        header: "Mobile",
        enableColumnFilter: false,
      },
      {
        accessorKey: "status",
        enableClickToCopy: false,
        header: "Status",
        enableColumnFilter: false,
      },
      {
        accessorKey: "amount",
        enableClickToCopy: false,
        header: "Amount",
        enableColumnFilter: false,
      },
      {
        // accessorKey: "createdAt",
        accessorFn: (row) =>
          format(new Date(row.createdAt), "MM/dd/yyyy hh:mm a"),
        enableClickToCopy: false,
        header: "Date",
        enableColumnFilter: false,
      },
    ],
    []
  );
  const userReferralColumns = useMemo(
    () => [
      {
        accessorFn: (row) => row.referredUser,
        // accessorFn: (row) => `${row.fullname}`,
        id: "name", //id is still required when using accessorFn instead of accessorKey
        header: "Full Name",
        enableColumnFilter: false,
      },
      {
        accessorKey: "phone",
        enableClickToCopy: true,
        header: "Mobile",
        enableColumnFilter: false,
      },
      {
        accessorKey: "status",
        enableClickToCopy: false,
        header: "Status",
        enableColumnFilter: false,
      },
      {
        accessorKey: "amount",
        enableClickToCopy: false,
        header: "Amount",
        enableColumnFilter: false,
      },
      {
        // accessorKey: "createdAt",
        accessorFn: (row) => {
          if (row?.createdAt) {
            return format(new Date(row.createdAt), "MM/dd/yyyy hh:mm a");
          } else {
            return "";
          }
        },
        enableClickToCopy: false,
        header: "Date",
        enableColumnFilter: false,
      },
    ],
    []
  );

  function SimpleDialog(props) {
    const { onClose, selectedValue, open } = props;

    const handleClose = () => {
      onClose(selectedValue);
    };

    const handleListItemClick = (value) => {
      onClose(value);
    };

    return (
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Set backup account</DialogTitle>
        <List sx={{ pt: 0 }}>
          {email.map((email) => (
            <ListItem disableGutters>
              <ListItemButton 
                onClick={() => handleListItemClick(email)}
                key={email}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={email} />
              </ListItemButton>
            </ListItem>
          ))}

          <ListItem disableGutters>
            <ListItemButton
              autoFocus
              onClick={() => handleListItemClick("addAccount")}
            >
              <ListItemAvatar>
                <Avatar>
                  <AddIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Add account" />
            </ListItemButton>
          </ListItem>
        </List>
      </Dialog>
    );
  }

  SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedValue: PropTypes.string.isRequired,
  };

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
      <Snackbar
        open={referralErrorAlert}
        autoHideDuration={6000}
        onClose={() => setReferralErrorAlert(false)}
      >
        <Alert
          onClose={() => setReferralErrorAlert(false)}
          severity="warning"
          sx={{ width: "100%" }}
        >
          {rechargeReferralMutation?.error?.response?.data?.message}
        </Alert>
      </Snackbar>
      <Snackbar
        open={referralSuccessAlert}
        autoHideDuration={6000}
        onClose={() => setReferralSuccessAlert(false)}
      >
        <Alert
          onClose={() => setReferralSuccessAlert(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          "Airtime recharge Successful"
        </Alert>
      </Snackbar>

      <Snackbar
        open={newSignupErrorAlert}
        autoHideDuration={6000}
        onClose={() => setNewSignupErrorAlert(false)}
      >
        <Alert
          onClose={() => setNewSignupErrorAlert(false)}
          severity="warning"
          sx={{ width: "100%" }}
        >
          {rechargeNewSignupMutation?.error?.response?.data?.message}
        </Alert>
      </Snackbar>

      {/* table for referrals */}
      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleAccordionChange("panel1")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: "33%", flexShrink: 0 }}>
            Referrals
          </Typography>
          <Typography sx={{ color: "text.secondary" }}>
            {" "}
            Table to fetch users with valid referrals
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <ReferralsComponet user={user} />
        </AccordionDetails>
      </Accordion>

      {/* table for new signups */}
      <Accordion
        expanded={expanded === "panel2"}
        onChange={handleAccordionChange("panel2")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <Typography sx={{ width: "33%", flexShrink: 0 }}>
            Newly Signed up Users
          </Typography>
          <Typography sx={{ color: "text.secondary" }}>
            Table for new users valid for signup promo
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <NewUsersComponet user={user} />
        </AccordionDetails>
      </Accordion>
    </>
  );
};

const NewUsersComponets = ({ user }) => {
  const [status, setStatus] = React.useState("pending");
  const [newSignupErrorAlert, setNewSignupErrorAlert] = React.useState(false);
  const [newUser, setNewUser] = React.useState({});
  const [userId, setUserId] = React.useState("");
  const [openConfirmNewSignupModal, setOpenConfirmNewSignupModal] =
    React.useState(false);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});

  console.log({ status });

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const handleStatus = (event) => {
    setStatus(event.target.value);
    setPagination({
      pageIndex: 0,
      pageSize: 10,
    });
  };

  const handleConfirmModalClose = () => {
    setOpenConfirmModal(false);
  };
  const handleConfirmNewSignUpModalOpen = (row) => {
    setNewUser({ userId: row.newUserId, creditNewUserId: row.newSignupId });
    setOpenConfirmNewSignupModal(true);
  };
  const handleConfirmNewSignUpModalClose = () => {
    setOpenConfirmNewSignupModal(false);
    setNewUser({});
  };

  useEffect(() => {
    setPagination({ ...pagination, pageIndex: 0 });
  }, [columnFilters]);

  const newSignupColumns = useMemo(
    () => [
      {
        accessorFn: (row) => row.fullname,
        // accessorFn: (row) => `${row.fullname}`,
        id: "name", //id is still required when using accessorFn instead of accessorKey
        header: "Full Name",
        enableColumnFilter: false,
      },
      {
        accessorKey: "phone",
        enableClickToCopy: true,
        header: "Mobile",
        enableColumnFilter: false,
      },
      {
        accessorKey: "status",
        enableClickToCopy: false,
        header: "Status",
        enableColumnFilter: false,
      },
      {
        accessorKey: "amount",
        enableClickToCopy: false,
        header: "Amount",
        enableColumnFilter: false,
      },
      {
        // accessorKey: "createdAt",
        accessorFn: (row) => {
          if (row?.createdAt) {
            return format(new Date(row.createdAt), "MM/dd/yyyy hh:mm a");
          } else {
            return "";
          }
        },
        enableClickToCopy: false,
        header: "Date",
        enableColumnFilter: false,
      },
    ],
    []
  );

  const {
    data: newSignups,
    isError: newSignupsError,
    isFetching: fetchingNewSignups,
    isLoading: loadingNewSignups,
    refetch: refetchNewSignups,
  } = useQuery(
    [
      "newSignups",
      status,
      columnFilters, //refetch when columnFilters changes
      globalFilter, //refetch when globalFilter changes
      pagination.pageIndex, //refetch when pagination.pageIndex changes
      pagination.pageSize, //refetch when pagination.pageSize changes
      sorting, //refetch when sorting changes
      status,
    ],
    async () => {
      const { data } = await axios.get(
        // `http://localhost:3001/api/admin/console/users/new-signups?limit=${
        `https://vigoplace.com/server/api/admin/console/users/new-signups?limit=${
          pagination.pageSize
        }&offset=${
          pagination.pageIndex * pagination.pageSize
        }&status=${status}`,
        // }${status !== "" || status !== null ? `&status=${status}` : ""}`,

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

  return (
    <MaterialReactTable
      columns={newSignupColumns}
      data={newSignups?.data ?? []}
      getRowId={(row) => {
        return row.id;
      }}
      // enableColumnFilterModes
      // enableColumnOrdering
      // enableGrouping
      // enablePinning

      enableRowActions
      enableStickyHeader
      enableStickyFooter
      // enableRowSelection
      manualPagination
      onPaginationChange={setPagination}
      rowCount={newSignups?.totalCount ?? 0}
      // onColumnFiltersChange={()=>{
      //   setColumnFilters
      // }}
      onColumnFiltersChange={setColumnFilters}
      onGlobalFilterChange={setGlobalFilter}
      initialState={{ showColumnFilters: true }}
      positionToolbarAlertBanner="bottom"
      enableGlobalFilter={false}
      // muiTableBodyRowProps={({ row }) => ({
      //   //implement row selection click events manually
      //   onClick: () =>
      //     setRowSelection((prev) => ({
      //       ...prev,
      //       [row.id]: !prev[row.id],
      //     })),
      //   selected: rowSelection[row.id],
      //   sx: {
      //     cursor: "pointer",
      //   },
      // })}

      renderRowActions={({ row, table }) => (
        <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}>
          <Tooltip title="Recharge User">
            <IconButton
              color="primary"
              onClick={() => handleConfirmNewSignUpModalOpen(row.original)}
            >
              <Button variant="outlined">Recharge</Button>
            </IconButton>
          </Tooltip>
        </Box>
      )}
      muiToolbarAlertBannerProps={
        newSignupsError
          ? {
              color: "error",
              children:
                "Error loading data, Please use the refresh button on the table to retry",
            }
          : undefined
      }
      renderTopToolbarCustomActions={({ table, row }) => {
        // console.log(table.getIsSomeRowsSelected(), 'selebobo')
        // console.log(table.getIsAllRowsSelected(), 'selebobo2')
        // console.log(table.getRowModel().rows.length)

        return (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            <Tooltip arrow title="Refresh Data">
              <IconButton onClick={() => refetchNewSignups()}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>

            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">
                Status
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={status}
                defaultValue="None"
                onChange={handleStatus}
                label="Gender"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={"pending"}>Pending</MenuItem>
                <MenuItem value={"processing"}>Processing</MenuItem>
                <MenuItem value={"completed"}>Completed</MenuItem>
                <MenuItem value={"failed"}>Failed</MenuItem>
              </Select>
            </FormControl>
          </div>
        );
      }}
      // manualPagination
      // onPaginationChange={}
      // muiTablePaginationProps={}

      state={{
        isLoading: loadingNewSignups,
        isError: newSignupsError,
        showAlertBanner: newSignupsError,
        showProgressBars: fetchingNewSignups,
        pagination,
        rowSelection,
      }}
      // enableColumnFilterModes
      muiTableContainerProps={{ sx: { height: "75vh" } }}
    />
  );
};

Promo.auth = true;
export default Promo;
