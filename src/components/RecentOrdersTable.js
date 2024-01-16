import React, { useState } from "react";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { getSession, useSession } from "next-auth/react";
import Snackbar from "@mui/material/Snackbar";
import axios from "axios";
import MuiAlert from "@mui/material/Alert";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Collapse from "@mui/material/Collapse";
import CircularProgress from "@mui/material/CircularProgress";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import { green, yellow, red } from "@mui/material/colors";
import { format } from "date-fns";
import Slide from "@mui/material/Slide";
import PropTypes from "prop-types";
import LinearProgress from "@mui/material/LinearProgress";
import Link from "next/link";
import { useRouter } from "next/router";
// import ColoredLinearProgress from './LinearLoader';
import {
  Tooltip,
  Divider,
  Box,
  FormControl,
  InputLabel,
  Card,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Select,
  Menu,
  MenuItem,
  Typography,
  useTheme,
  CardHeader,
  Button,
} from "@mui/material";

import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import LoadingButton from "@mui/lab/LoadingButton";

import Label from "./Label/index";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import {
  fetchSinglePayoutRequest,
  useSinglePayoutRequest,
} from "../../hooks/useSinglePayoutRequest";
import { toast } from "react-toast";
// import BulkActions from './BulkActions';

// const CryptoOrderStatus = {completed' | 'pending' | 'failed}
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const getStatusLabel = (cryptoOrderStatus) => {
  const map = {
    failed: {
      text: "Failed",
      color: "error",
    },
    completed: {
      text: "Completed",
      color: green[500],
    },
    pending: {
      text: "Pending",
      color: yellow[800],
    },
    declined: {
      text: "Declined",
      color: yellow[800],
    },
    cancelled: {
      text: "Cancelled",
      color: red[500],
    },
    processing: {
      text: "Processing",
      color: yellow[700],
    },
    onHold: {
      text: "On Hold",
      color: yellow[800],
    },
  };

  if (map[cryptoOrderStatus]) {
    const { text, color } = map[cryptoOrderStatus];
    //console.log(text, color);
    return <Label sx={{ color }}>{text}</Label>;
  } else {
    // Handle the case where cryptoOrderStatus is not found in the map.
    return <Label sx={{ color: "defaultColor" }}>{""}</Label>;
  }
};

const applyFilters = (cryptoOrders, filters) => {
  return cryptoOrders?.filter((cryptoOrder) => {
    let matches = true;

    if (filters.status && cryptoOrder.payoutRequestStatus !== filters.status) {
      matches = false;
    }

    return matches;
  });
};

const applyPagination = (cryptoOrders, page, limit) => {
  return cryptoOrders?.slice(page * limit, page * limit + limit);
};

const API_BASE_URL = "https://vigoplace.com/server";
//const API_BASE_URL = "http://localhost:4000";
export default function RecentOrdersTable() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { userid } = router.query;
  const getUser = useSession();
  const user = getUser?.data?.user;
  const [selectedCryptoOrders, setSelectedCryptoOrders] = useState([]);
  const selectedBulkActions = selectedCryptoOrders.length > 0;
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [filters, setFilters] = useState({
    status: null,
  });
  const [status, setStatus] = React.useState(null);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // const mutation = useApprovePayOut().
  // const [payoutRId, setPayoutRId] = React.useState(null);
  // console.log(payoutRId, 'payoutRId');

  // const { isLoading } = useSinglePayoutRequest(payoutRId)
  // const ab = queryClient.getQueryData(["payoutRequest", 10])
  // console.log(queryClient.getQueryData(["payoutRequest", 10]).data);

  const fetchSingle = () => {
    const { data, error, isFetching, isLoading } =
      useSinglePayoutRequest(payoutRId);
    // console.log(data, "abc");
    return data;
  };

  // console.log(fetchSingle(), "abc")

  // console.log( {data, error, isFetching, isLoading});
  // const [open, setOpen] = React.useState(false);

  const statusOptions = [
    {
      id: "all",
      name: "All",
    },
    {
      id: "completed",
      name: "Completed",
    },
    {
      id: "pending",
      name: "Pending",
    },
    {
      id: "processing",
      name: "Processing",
    },
    {
      id: "declined",
      name: "Declined",
    },
    {
      id: "cancelled",
      name: "Cancelled",
    },
    {
      id: "onHold",
      name: "On Hold",
    },
  ];

  const handleStatusChange = (e) => {
    let value = null;

    if (e.target.value !== "all") {
      value = e.target.value;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      status: value,
    }));
  };

  const handleStatus = (event) => {
    let value = null;

    if (event.target.value !== "all") {
      value = event.target.value;
    }
    setStatus(value);

    setPagination({
      pageIndex: 0,
      pageSize: 10,
    });
  };

  const handleSelectAllCryptoOrders = (event) => {
    // setSelectedCryptoOrders(
    //   event.target.checked
    //     ? cryptoOrders.map((cryptoOrder) => cryptoOrder.id)
    //     : []
    // );
  };

  const handleSelectOneCryptoOrder = (event, cryptoOrderId) => {
    if (!selectedCryptoOrders.includes(cryptoOrderId)) {
      setSelectedCryptoOrders((prevSelected) => [
        ...prevSelected,
        cryptoOrderId,
      ]);
    } else {
      setSelectedCryptoOrders((prevSelected) =>
        prevSelected.filter((id) => id !== cryptoOrderId)
      );
    }
  };

  const handlePageChange = (event, newPage) => {
    // setPage(newPage);
    setPagination({ ...pagination, pageIndex: newPage });
  };

  const handleLimitChange = (event) => {
    // setLimit(parseInt(event.target.value));
    setPagination({ ...pagination, pageSize: event.target.value });
  };

  const {
    data: payouts,
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useQuery(
    [
      "payoutRequests",
      // columnFilters, //refetch when columnFilters changes
      // globalFilter, //refetch when globalFilter changes
      pagination.pageIndex, //refetch when pagination.pageIndex changes
      pagination.pageSize, //refetch when pagination.pageSize changes
      // sorting, //refetch when sorting changes
      status,
      page,
      limit,
    ],
    async () => {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/admin/console/payouts?limit=${
          pagination.pageSize
        }&offset=${pagination.pageIndex * pagination.pageSize}${
          status !== undefined && status !== null ? `&status=${status}` : ""
        }`,
        // `http://localhost:3001/api/admin/console/payouts?limit=${pagination.pageSize}&offset=${pagination.pageIndex * pagination.pageSize}${status !== undefined && status !== null ? `&status=${status}` : '' }`,
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
        console.log(err, "err fetching payouts");
      },
      enabled: !!user?.token,
    },
    { keepPreviousData: true }
  );

  const {
    data: userPayouts,
    isError: userPayoutError,
    isFetching: userPayoutFetching,
    isLoading: userPayoutLoading,
    refetch: userRefetch,
  } = useQuery(
    [
      "payoutUserRequest",
      // columnFilters, //refetch when columnFilters changes
      // globalFilter, //refetch when globalFilter changes
      // sorting, //refetch when sorting changes
      status,
      page,
      limit,
    ],
    async () => {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/admin/console/payouts/user/${userid}`,
        // `http://localhost:3001/api/admin/console/payouts?limit=${pagination.pageSize}&offset=${pagination.pageIndex * pagination.pageSize}${status !== undefined && status !== null ? `&status=${status}` : '' }`,
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
        console.log(err, "err fetching this user's payout details");
      },
      enabled: !!user?.token,
    },
    { keepPreviousData: true }
  );

  const isUserRoute = router.pathname.startsWith("/user/"); // Check if it's a user route

  const dataToUse = isUserRoute
    ? userPayouts?.data?.payoutRequests
    : payouts?.data?.payoutRequests;

  const filteredCryptoOrders = applyFilters(dataToUse, filters);

  // const filteredCryptoOrders = applyFilters(
  //   payouts?.data?.payoutRequests,
  //   filters
  // );
  const paginatedCryptoOrders = applyPagination(
    filteredCryptoOrders,
    pagination.pageIndex,
    pagination.pageSize
  );

  const selectedSomeCryptoOrders =
    selectedCryptoOrders.length > 0 &&
    selectedCryptoOrders.length < cryptoOrders.length;
  const selectedAllCryptoOrders =
    selectedCryptoOrders?.length === payouts?.length;
  const theme = useTheme();

  return (
    <Card>
      {selectedBulkActions && (
        <Box flex={1} p={2}>
          {/* <BulkActions /> */}
        </Box>
      )}
      {!selectedBulkActions && (
        <CardHeader
          action={
            <Box width={150}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Status</InputLabel>
                <Select
                  // value={filters.status || "all"}
                  value={status || "all"}
                  onChange={handleStatus}
                  label="Status"
                  autoWidth
                >
                  {statusOptions.map((statusOption) => (
                    <MenuItem key={statusOption.id} value={statusOption.id}>
                      {statusOption.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          }
          title="Payout Requests"
        />
      )}
      <Divider />
      <TableContainer sx={{ maxHeight: 650 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox"></TableCell>

              <TableCell>Request ID</TableCell>
              <TableCell>Reference</TableCell>
              <TableCell align="center">Full Name</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCryptoOrders && filteredCryptoOrders.length > 0 ? (
              filteredCryptoOrders.map((payout, index) => {
                const isPayoutSelected = selectedCryptoOrders.includes(
                  payout.payoutRequestId
                );
                return (
                  <Row
                    key={index}
                    payout={payout}
                    isPayoutSelected={isPayoutSelected}
                  />
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5}>No records to display</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box p={2}>
        <TablePagination
          component="div"
          count={
            isUserRoute
              ? userPayouts?.data?.count ?? 0
              : payouts?.data?.count ?? 0
          }
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={pagination.pageIndex}
          rowsPerPage={pagination.pageSize}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>
    </Card>
  );
}

function Row({ payout, isPayoutSelected }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const [payoutRId, setPayoutRId] = React.useState(null);
  const { isLoading } = useSinglePayoutRequest(payoutRId);
  const [openToast, setOpenToast] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [declineModal, setDeclineModal] = React.useState(false);
  const [splitModal, setSplitModal] = React.useState(false);
  const [holdModal, setHoldModal] = React.useState(false);
  const [pin, setPin] = React.useState(null);
  const [amount, setAmount] = React.useState({
    amount1: null,
    amount2: null,
  });
  const [deliveryETA, setDeliveryETA] = React.useState("");
  const [reason, setReason] = React.useState("");
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handlePin = (e) => {
    setPin(e.target.value);
  };

  const handleReason = (e) => {
    setReason(e.target.value);
  };

  const handleClose = (event, reason) => {
    setOpenToast(false);
  };

  const getToken = async () => {
    const session = await getSession();
    return session?.user?.token;
  };

  const approvePayOut = async ({ id, pin }) => {
    const token = await getToken();
    const parsed = await axios.post(
      // "http://localhost:3001/api/admin/console/approvepayout",
      "https://vigoplace.com/server/api/admin/console/approvepayout",
      { payoutRequestId: id, approvalPin: pin },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return parsed;
  };

  const approvePayOutMutation = useMutation({
    mutationKey: ["approvePayOut"],
    mutationFn: approvePayOut,
    onSuccess: () => {
      queryClient.invalidateQueries("payoutRequests");
      setPin(null);
      setOpenModal(false);
    },
    onError: async (error) => {
      setOpenToast(true);
      setPin(null);
    },
  });

  const approveUSDPayOut = async ({ id, pin, deliveryETA }) => {
    if (deliveryETA === "") {
      toast.error("Please pick a date");
      return;
    }
    const token = await getToken();
    const parsed = await axios.post(
      // "http://localhost:3001/api/admin/console/approvepayout",
      "https://vigoplace.com/server/api/admin/console/approvepayout",
      { payoutRequestId: id, approvalPin: pin, deliveryETA },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return parsed;
  };

  const approveUSDPayOutMutation = useMutation({
    mutationKey: ["approveUSDPayOut"],
    mutationFn: approveUSDPayOut,
    onSuccess: () => {
      queryClient.invalidateQueries("payoutRequests");
      setPin(null);
      setOpenModal(false);
    },
    onError: async (error) => {
      setOpenToast(true);
      setPin(null);
    },
  });

  const declinePayOut = async ({ id, pin, reason }) => {
    const token = await getToken();
    const parsed = await axios.post(
      // "http://localhost:3001/api/admin/console/declinepayout",
      "https://vigoplace.com/server/api/admin/console/declinepayout",
      { payoutRequestId: id, approvalPin: pin, reason },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return parsed;
  };

  const declinePayOutMutation = useMutation({
    mutationKey: ["declinePayOut"],
    mutationFn: declinePayOut,
    onSuccess: (data) => {
      queryClient.invalidateQueries("payoutRequests");
      setPin(null);
      setReason("");
      setOpenModal(false);
    },
    onError: async (error) => {
      setOpenToast(true);
      setPin(null);
    },
  });

  const splitPayOut = async ({ reference, amount1, amount2, pin, reason }) => {
    const token = await getToken();
    const parsed = await axios.post(
      //"http://localhost:4000/api/admin/console/split/payment",
      "https://vigoplace.com/server/api/admin/console/split/payment",
      {
        reference: reference,
        split: [
          {
            amount: Math.floor(amount1),
            status: "onHold",
          },
          {
            amount: Math.floor(amount2),
            status: "processing",
          },
        ],
        approvalPin: pin,
        reason,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return parsed;
  };

  const splitPayOutMutation = useMutation({
    mutationKey: ["splitPayoutRequest"],
    mutationFn: splitPayOut,
    onSuccess: (data) => {
      queryClient.invalidateQueries("payoutRequests");
      setPin(null);
      setReason("");
      setAmount({
        amount1: null,
        amount2: null,
      });
      setOpenModal(false);
    },
    onError: async (error) => {
      console.log(error.message);
      setOpenToast(true);
      setPin(null);
    },
  });

  const holdPayOut = async ({ reference, pin, reason }) => {
    const token = await getToken();
    const parsed = await axios.put(
      //"http://localhost:4000/api/admin/console/transaction",
      "https://vigoplace.com/server/api/admin/console/transaction",
      { reference: reference, status: "onHold", approvalPin: pin, reason },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return parsed;
  };

  const holdPayOutMutation = useMutation({
    mutationKey: ["holdPayOut"],
    mutationFn: holdPayOut,
    onSuccess: (data) => {
      queryClient.invalidateQueries("payoutRequests");
      setPin(null);
      setReason("");
      setOpenModal(false);
    },
    onError: async (error) => {
      setOpenToast(true);
      setPin(null);
    },
  });

  return (
    <>
      <Snackbar
        TransitionComponent={Slide}
        open={openToast}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="warning" sx={{ width: "100%" }}>
          {approvePayOutMutation.error?.response?.data?.message ||
            declinePayOutMutation.error?.response?.data?.message ||
            approveUSDPayOutMutation.error?.response?.data?.message ||
            splitPayOutMutation.error?.response?.data?.message}
        </Alert>
      </Snackbar>

      <TableRow hover selected={isPayoutSelected}>
        {/* <MenuItem>
          
        </MenuItem> */}
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => {
              setOpen((open) => !open);
              setPayoutRId(() => payout.payoutRequestId);
              // const {data, error, isFetching, isLoading} = useSinglePayoutRequest(10)
              // console.log( {data, error, isFetching, isLoading}, "pop");
              // fetchSingle()
            }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Typography
            variant="body1"
            fontWeight=""
            color="text.primary"
            gutterBottom
            noWrap
          >
            {payout.payoutRequestId}{" "}
            {payout.etaType !== "regular" && (
              <span className="text-red-500 font-bold">EXP</span>
            )}
          </Typography>
          {/* <Typography variant="body2" color="text.secondary" noWrap>
            {format(payout.payoutRequestDate, 'MMMM dd yyyy')}
          </Typography> */}
        </TableCell>
        <TableCell>
          <Typography
            variant="body1"
            fontWeight=""
            color="text.primary"
            gutterBottom
            noWrap
          >
            {payout.payoutRequestReference}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <a
            href={`/user/${payout.payoutRequestUId}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: "none",
              color: "inherit",
              transition: "text-decoration 0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.textDecoration = "underline";
            }}
            onMouseLeave={(e) => {
              e.target.style.textDecoration = "none";
            }}
          >
            <Typography
              variant="body1"
              fontWeight=""
              color="text.primary"
              gutterBottom
              noWrap
              style={{
                textDecoration: "none",
                ":hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {payout.userFullName}
            </Typography>
          </a>
        </TableCell>

        <TableCell align="right">
          <Typography
            variant="body1"
            fontWeight=""
            color="text.primary"
            gutterBottom
            noWrap
          >
            {payout.payoutRequestAmount.toLocaleString("en-US")}
          </Typography>
        </TableCell>
        <TableCell align="right">
          <Typography
            // sx={{ color: green[500]}}
            variant="body1"
            fontWeight="bold"
            // color="text.primary"
            gutterBottom
            noWrap
          >
            {getStatusLabel(payout.payoutRequestStatus)}
          </Typography>
          {/* {getStatusLabel(payout.payoutRequestStatus)} */}
        </TableCell>
      </TableRow>
      <TableCell
        style={{
          paddingBottom: 0,
          paddingTop: 0,
          background: "rgb(230 230 230)",
        }}
        colSpan={7}
      >
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box sx={{ margin: 1 }}>
            <Typography
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Typography
                variant="h6"
                fontWeight={"bold"}
                gutterBottom
                component="div"
              >
                More Details
              </Typography>
              <Typography
                variant="h6"
                fontWeight={"bold"}
                gutterBottom
                component="div"
              >
                Actions
              </Typography>
            </Typography>

            {isLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </Box>
            ) : (
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="center">
                      Fee
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="center">
                      payment Method
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="center">
                      currency
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="center">
                      account Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="center">
                      acountBankName
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="center">
                      accountNumber
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="center">
                      routingNumber
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={handleMenuOpen}
                        id="long-button"
                        aria-controls={
                          Boolean(menuAnchorEl) ? "menu-buttons" : undefined
                        }
                        aria-expanded={
                          Boolean(menuAnchorEl) ? "true" : undefined
                        }
                        aria-haspopup="true"
                        size="small"
                        sx={{ fontWeight: "bold" }}
                      >
                        <MoreHorizIcon />
                      </IconButton>
                    </TableCell>

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
                      {payout.payoutRequestStatus === "pending" ||
                      payout.payoutRequestStatus === "onHold" ? (
                        <div>
                          <MenuItem>
                            <Button
                              sx={{ margin: 1, bgcolor: green[500] }}
                              size="small"
                              variant="contained"
                              color="success"
                              onClick={() => {
                                setOpenModal(true);
                              }}
                            >
                              {approvePayOutMutation.isLoading ? (
                                <CircularProgress size={23} color="inherit" />
                              ) : approvePayOutMutation.isSuccess ? (
                                <CheckIcon />
                              ) : (
                                "Approve"
                              )}
                            </Button>
                          </MenuItem>
                          {payout.payoutRequestStatus !== "onHold" && (
                            <>
                              <MenuItem>
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="success"
                                  sx={{ margin: 1, bgcolor: green[500] }}
                                  onClick={() => {
                                    setSplitModal(true);
                                  }}
                                >
                                  {splitPayOutMutation.isLoading ? (
                                    <CircularProgress
                                      size={23}
                                      color="inherit"
                                    />
                                  ) : splitPayOutMutation.isSuccess ? (
                                    <CheckIcon />
                                  ) : (
                                    "Split"
                                  )}
                                </Button>
                              </MenuItem>

                              <MenuItem>
                                <Button
                                  sx={{ margin: 1, bgcolor: yellow[800] }}
                                  size="small"
                                  variant="contained"
                                  color="warning"
                                  onClick={() => {
                                    setHoldModal(true);
                                  }}
                                >
                                  {holdPayOutMutation.isLoading ? (
                                    <CircularProgress
                                      size={23}
                                      color="inherit"
                                    />
                                  ) : holdPayOutMutation.isSuccess ? (
                                    <CheckIcon />
                                  ) : (
                                    "Hold"
                                  )}
                                </Button>
                              </MenuItem>
                            </>
                          )}
                          <MenuItem>
                            <Button
                              size="small"
                              variant="contained"
                              color="error"
                              sx={{ margin: 1 }}
                              onClick={() => {
                                setDeclineModal(true);
                              }}
                            >
                              {declinePayOutMutation.isLoading ? (
                                <CircularProgress size={23} color="inherit" />
                              ) : approvePayOutMutation.isSuccess ? (
                                <CheckIcon />
                              ) : (
                                "Decline"
                              )}
                            </Button>
                          </MenuItem>

                          <Dialog
                            open={openModal}
                            onClose={() => {
                              setOpenModal(false);
                              setPin(null);
                            }}
                          >
                            <DialogTitle>Approve Payout</DialogTitle>
                            <DialogContent>
                              <DialogContentText>
                                You are about to approve the amount of{" "}
                                <span style={{ fontWeight: "bold" }}>
                                  {
                                    queryClient.getQueryData([
                                      "payoutRequest",
                                      payout.payoutRequestId,
                                    ])?.data?.currencySymbol
                                  }{""}
                                  {
                                    queryClient.getQueryData([
                                      "payoutRequest",
                                      payout.payoutRequestId,
                                    ])?.data?.payoutRequestAmount.toLocaleString()
                                  }
                                </span>{" "}
                                to <br />
                                <span style={{ fontWeight: "bold" }}>
                                  Account name
                                </span>{" "}
                                -{" "}
                                {
                                  queryClient.getQueryData([
                                    "payoutRequest",
                                    payout.payoutRequestId,
                                  ])?.data?.accountName
                                }{" "}
                                <br />
                                <span style={{ fontWeight: "bold" }}>
                                  Account number
                                </span>{" "}
                                -{" "}
                                {
                                  queryClient.getQueryData([
                                    "payoutRequest",
                                    payout.payoutRequestId,
                                  ])?.data?.accountNumber
                                }{" "}
                                <br />
                                <span style={{ fontWeight: "bold" }}>
                                  Bank Name
                                </span>{" "}
                                -{" "}
                                {
                                  queryClient.getQueryData([
                                    "payoutRequest",
                                    payout.payoutRequestId,
                                  ])?.data?.acountBankName
                                }
                                .
                                <br />
                                <br />
                                Please enter{" "}
                                {queryClient.getQueryData([
                                  "payoutRequest",
                                  payout.payoutRequestId,
                                ])?.data?.currency === "US Dollar" && (
                                  <span>the date and</span>
                                )}{" "}
                                your admin approval pin to approve this request,
                                if you dont have one yet, head to{" "}
                                {
                                  <Link
                                    style={{ color: "blue" }}
                                    href="/settings"
                                  >
                                    Settings
                                  </Link>
                                }{" "}
                                to create one now.
                              </DialogContentText>
                              {queryClient.getQueryData([
                                "payoutRequest",
                                payout.payoutRequestId,
                              ])?.data?.currency === "US Dollar" && (
                                <div className="flex items-center gap-5">
                                  <h3>Expected Delivery Date:</h3>
                                  <input
                                    type="date"
                                    className="my-5"
                                    value={deliveryETA}
                                    onChange={(e) =>
                                      setDeliveryETA(e.target.value)
                                    }
                                  />
                                </div>
                              )}

                              <TextField
                                autoFocus
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
                                  setOpenModal(false);
                                  setPin(null);
                                }}
                              >
                                Cancel
                              </Button>
                              <LoadingButton
                                variant="contained"
                                loading={
                                  approvePayOutMutation.isLoading ||
                                  approveUSDPayOutMutation.isLoading
                                }
                                disabled={
                                  pin === null ||
                                  pin?.length <= 5 ||
                                  (queryClient.getQueryData([
                                    "payoutRequest",
                                    payout.payoutRequestId,
                                  ])?.data?.currency !== "Naira" &&
                                    deliveryETA === "")
                                }
                                onClick={() => {
                                  (queryClient.getQueryData([
                                    "payoutRequest",
                                    payout.payoutRequestId,
                                  ])?.data?.currency === "Naira"
                                    ? approvePayOutMutation
                                    : approveUSDPayOutMutation
                                  ).mutate(
                                    queryClient.getQueryData([
                                      "payoutRequest",
                                      payout.payoutRequestId,
                                    ])?.data?.currency === "Naira"
                                      ? {
                                          id: payout.payoutRequestId,
                                          pin,
                                        }
                                      : {
                                          id: payout.payoutRequestId,
                                          pin,
                                          deliveryETA,
                                        }
                                  );
                                  setPin(null);
                                  setDeliveryETA("");
                                }}
                              >
                                Approve
                              </LoadingButton>
                            </DialogActions>
                          </Dialog>

                          <Dialog
                            open={splitModal}
                            onClose={() => {
                              setSplitModal(false);
                              setPin(null);
                              setAmount({
                                amount1: null,
                                amount2: null,
                              });
                              setReason("");
                            }}
                          >
                            <DialogTitle>Split Payout</DialogTitle>
                            <DialogContent>
                              <DialogContentText>
                                Please enter the amount you want to put on hold
                                and the amount you want to send to the user in
                                the inputs below. Also, enter your admin
                                approval pin to Split this payment request. If
                                you don't have one yet, head to{" "}
                                <Link
                                  style={{ color: "blue" }}
                                  href="/settings"
                                >
                                  Settings
                                </Link>{" "}
                                to create one now.
                              </DialogContentText>
                              <TextField
                                autoFocus
                                margin="dense"
                                id="amount1"
                                label="Amount to be on Hold"
                                type="number"
                                fullWidth
                                value={amount.amount1}
                                variant="standard"
                                onChange={(e) =>
                                  setAmount({
                                    ...amount,
                                    amount1: e.target.value,
                                  })
                                }
                              />
                              <TextField
                                margin="dense"
                                id="amount2"
                                label="Amount to be pending"
                                type="number"
                                fullWidth
                                value={amount.amount2}
                                variant="standard"
                                onChange={(e) =>
                                  setAmount({
                                    ...amount,
                                    amount2: e.target.value,
                                  })
                                }
                              />
                              <TextField
                                margin="dense"
                                id="reason"
                                label="Reason"
                                type="text"
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
                                  setSplitModal(false);
                                  setPin(null);
                                  setAmount({
                                    amount1: null,
                                    amount2: null,
                                  });
                                  setReason("");
                                }}
                              >
                                Cancel
                              </Button>
                              <LoadingButton
                                variant="contained"
                                loading={splitPayOutMutation.isLoading}
                                disabled={
                                  amount.amount1 === null ||
                                  amount.amount2 === null ||
                                  pin === null ||
                                  pin?.length <= 5 ||
                                  reason === ""
                                }
                                onClick={() => {
                                  splitPayOutMutation.mutate({
                                    reference: payout.payoutRequestReference,
                                    amount1: amount.amount1,
                                    amount2: amount.amount2,
                                    pin,
                                    reason,
                                  });
                                  setPin(null);
                                  setAmount({
                                    amount1: null,
                                    amount2: null,
                                  });
                                  setReason("");
                                }}
                              >
                                Split
                              </LoadingButton>
                            </DialogActions>
                          </Dialog>

                          <Dialog
                            open={holdModal}
                            onClose={() => {
                              setHoldModal(false);
                              setPin(null);
                            }}
                          >
                            <DialogTitle>Hold Payout</DialogTitle>
                            <DialogContent>
                              <DialogContentText>
                                Please enter your admin approval pin to Hold
                                this request, if you dont have one yet, head to{" "}
                                {
                                  <Link
                                    style={{ color: "blue" }}
                                    href="/settings"
                                  >
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
                                type="text"
                                fullWidth
                                value={reason}
                                variant="standard"
                                onChange={handleReason}
                              />
                              <TextField
                                //autoFocus
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
                                  setHoldModal(false);
                                  setPin(null);
                                  setReason("");
                                }}
                              >
                                Cancel
                              </Button>
                              <LoadingButton
                                variant="contained"
                                loading={holdPayOutMutation.isLoading}
                                disabled={
                                  pin === null ||
                                  pin?.length <= 5 ||
                                  reason === ""
                                }
                                onClick={() => {
                                  holdPayOutMutation.mutate({
                                    reference: payout.payoutRequestReference,
                                    pin,
                                    reason,
                                  });
                                  setPin(null);
                                }}
                              >
                                Hold
                              </LoadingButton>
                            </DialogActions>
                          </Dialog>

                          <Dialog
                            open={declineModal}
                            onClose={() => {
                              setDeclineModal(false);
                              setPin(null);
                            }}
                          >
                            <DialogTitle>Decline Payout</DialogTitle>
                            <DialogContent>
                              <DialogContentText>
                                Please enter your admin approval pin to Decline
                                this request, if you dont have one yet, head to{" "}
                                {
                                  <Link
                                    style={{ color: "blue" }}
                                    href="/settings"
                                  >
                                    Settings
                                  </Link>
                                }{" "}
                                to create one now
                              </DialogContentText>
                              <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Approval Pin"
                                type="number"
                                fullWidth
                                value={pin}
                                variant="standard"
                                onChange={handlePin}
                              />
                              <TextField
                                autoFocus
                                margin="dense"
                                id="reason"
                                label="Reason"
                                type="text"
                                fullWidth
                                value={reason}
                                variant="standard"
                                onChange={handleReason}
                              />
                            </DialogContent>
                            <DialogActions>
                              <Button
                                onClick={() => {
                                  setDeclineModal(false);
                                  setPin(null);
                                  setReason("");
                                }}
                              >
                                Cancel
                              </Button>
                              <LoadingButton
                                variant="contained"
                                loading={approvePayOutMutation.isLoading}
                                disabled={pin === null || pin?.length <= 5}
                                onClick={() => {
                                  declinePayOutMutation.mutate({
                                    id: payout.payoutRequestId,
                                    pin,
                                    reason,
                                  });
                                  setPin(null);
                                }}
                              >
                                Decline
                              </LoadingButton>
                            </DialogActions>
                          </Dialog>
                        </div>
                      ) : payout.payoutRequestStatus === "processing" ? (
                        <div>
                          <Box
                            sx={{
                              display: "flex",
                              width: "100%",
                              justifyContent: "flex-end",
                            }}
                          >
                            <Box sx={{ width: "100px" }}>
                              <LinearProgress />
                            </Box>
                          </Box>
                        </div>
                      ) : payout.payoutRequestStatus === "cancelled" ? (
                        <div>
                          <MenuItem>
                            <Button
                              size="small"
                              disabled
                              variant="contained"
                              color="error"
                              //sx={{ backgroundColor: green[500] }}
                              style={{
                                backgroundColor: red[600],
                                color: "black",
                              }}
                            >
                              Cancelled <CancelIcon />
                            </Button>
                          </MenuItem>
                        </div>
                      ) : payout.payoutRequestStatus === "declined" ? (
                        <div>
                          <MenuItem>
                            <Button
                              size="small"
                              disabled
                              variant="contained"
                              color="error"
                              style={{
                                backgroundColor: yellow[800],
                                color: "black",
                              }}
                            >
                              Declined <CancelIcon />
                            </Button>
                          </MenuItem>
                        </div>
                      ) : (
                        <div>
                          <MenuItem>
                            <Button
                              size="small"
                              variant="contained"
                              color="error"
                              sx={{ margin: 1, bgcolor: green[500] }}
                            >
                              Approved <CheckIcon />
                            </Button>
                          </MenuItem>
                          {/* <MenuItem>
                            <Button
                              sx={{ margin: 1, bgcolor: green["A700"] }}
                              size="small"
                              variant="contained"
                              color="success"
                              onClick={() => {
                                // setOpenModal(true);
                                router.push(`/user/${payout.payoutRequestUId}`);
                              }}
                            >
                              Profile
                            </Button>
                          </MenuItem> */}
                        </div>
                      )}
                    </Menu>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    <TableRow
                      key={
                        queryClient.getQueryData([
                          "payoutRequest",
                          payout.payoutRequestId,
                        ])?.data?.payoutRequestStatus
                      }
                    >
                      <TableCell align="center" component="th" scope="row">
                        {new Date(
                          queryClient.getQueryData([
                            "payoutRequest",
                            payout.payoutRequestId,
                          ])?.data?.payoutRequestDate
                        ).toLocaleDateString()}
                      </TableCell>
                      {/* <TableCell align="center">
                        {
                          queryClient.getQueryData([
                            "payoutRequest",
                            payout.payoutRequestId,
                          ])?.data?.userFullname
                        }
                      </TableCell> */}
                      <TableCell align="center">
                        {queryClient
                          .getQueryData([
                            "payoutRequest",
                            payout.payoutRequestId,
                          ])
                          ?.data?.payoutRequestFee?.toLocaleString("en-US")}
                      </TableCell>
                      <TableCell align="center">
                        {
                          queryClient.getQueryData([
                            "payoutRequest",
                            payout.payoutRequestId,
                          ])?.data?.paymentMethodName
                        }
                      </TableCell>
                      <TableCell align="center">
                        {
                          queryClient.getQueryData([
                            "payoutRequest",
                            payout.payoutRequestId,
                          ])?.data?.currency
                        }
                      </TableCell>
                      <TableCell align="center">
                        {
                          queryClient.getQueryData([
                            "payoutRequest",
                            payout.payoutRequestId,
                          ])?.data?.accountName
                        }
                      </TableCell>
                      <TableCell align="center">
                        {
                          queryClient.getQueryData([
                            "payoutRequest",
                            payout.payoutRequestId,
                          ])?.data?.acountBankName
                        }
                      </TableCell>
                      <TableCell align="center">
                        {
                          queryClient.getQueryData([
                            "payoutRequest",
                            payout.payoutRequestId,
                          ])?.data?.accountNumber
                        }
                      </TableCell>
                      <TableCell align="center">
                        {
                          queryClient.getQueryData([
                            "payoutRequest",
                            payout.payoutRequestId,
                          ])?.data?.accountRoutingNumber
                        }
                      </TableCell>
                    </TableRow>
                  }
                </TableBody>
              </Table>
            )}
          </Box>
        </Collapse>
      </TableCell>
    </>
  );
}

RecentOrdersTable.propTypes = {
  cryptoOrders: PropTypes.array.isRequired,
};

RecentOrdersTable.defaultProps = {
  cryptoOrders: [],
};
