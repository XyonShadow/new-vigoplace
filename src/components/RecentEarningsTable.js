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
import {
  fetchSingleEarningRequest,
  useSingleEarningRequest,
} from "../../hooks/useSingleEarningRequest";
import { toast } from "react-toast";
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
    approved: {
      text: "Approved",
      color: green[500],
    },
    pending: {
      text: "Pending",
      color: yellow[800],
    },
    denied: {
      text: "Declined",
      color: red[800],
    },
    processing: {
      text: "Processing",
      color: yellow[700],
    },
    onhold: {
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

    if (filters.status && cryptoOrder.status !== filters.status) {
      matches = false;
    }

    return matches;
  });
};

const applyPagination = (cryptoOrders, page, limit) => {
  return cryptoOrders?.slice(page * limit, page * limit + limit);
};

//const API_BASE_URL = "https://vigoplace.com/server";
const API_BASE_URL = "http://localhost:4000";
export default function RecentEarningsTable() {
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
      id: "approved",
      name: "Approved",
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
      id: "denied",
      name: "Declined",
    },
    {
      id: "onhold",
      name: "On Hold",
    },
  ];

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
      "earningsRequests",
      pagination.pageIndex, 
      pagination.pageSize, 
      status,
      page,
      limit,
    ],
    async () => {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/admin/console/earnings?perPage=${pagination.pageSize}&page=${
          pagination.pageIndex * pagination.pageSize
        }${status !== undefined && status !== null ? `&status=${status}` : ""}`,
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
        console.log(err, "err fetching earnings");
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
      "earningUserRequest",
      // columnFilters, //refetch when columnFilters changes
      // globalFilter, //refetch when globalFilter changes
      // sorting, //refetch when sorting changes
      status,
      page,
      limit,
    ],
    async () => {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/admin/console/earning/user/${userid}`,
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
    ? userPayouts?.data?.earningsRequests
    : payouts?.data?.usersEarnings;

  const filteredCryptoOrders = applyFilters(dataToUse, filters);

  const theme = useTheme();

  return (
    <Card>
      {selectedBulkActions && <Box flex={1} p={2}></Box>}
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
          title="Earnings Requests"
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
  const { isLoading } = useSingleEarningRequest(payoutRId);
  const [openToast, setOpenToast] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [declineModal, setDeclineModal] = React.useState(false);
  const [holdModal, setHoldModal] = React.useState(false);
  const [pin, setPin] = React.useState(null);
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

  const approveEarning = async ({ reference, pin }) => {
    const token = await getToken();
    const parsed = await axios.patch(
      "https://vigoplace.com/server/api/admin/console/earnings/approve",
      //"http://localhost:4000/api/admin/console/earnings/approve",
      { reference: reference, approvalPin: pin },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return parsed;
  };

  const approveEarningMutation = useMutation({
    mutationKey: ["approveEarning"],
    mutationFn: approveEarning,
    onSuccess: () => {
      queryClient.invalidateQueries("earningsRequests");
      setPin(null);
      setOpenModal(false);
    },
    onError: async (error) => {
      setOpenToast(true);
      setPin(null);
    },
  });

  const declineEarning = async ({ reference, pin }) => {
    const token = await getToken();
    const parsed = await axios.patch(
      "https://vigoplace.com/server/api/admin/console/earnings/reject",
      //"http://localhost:4000/api/admin/console/earnings/reject",
      { reference: reference, approvalPin: pin },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return parsed;
  };

  const declineEarningMutation = useMutation({
    mutationKey: ["declineEarning"],
    mutationFn: declineEarning,
    onSuccess: () => {
      queryClient.invalidateQueries("earningsRequests");
      setPin(null);
      setOpenModal(false);
    },
    onError: async (error) => {
      setOpenToast(true);
      setPin(null);
    },
  });

  const holdEarning = async ({ reference, pin, reason }) => {
    const token = await getToken();
    const parsed = await axios.patch(
      //"http://localhost:4000/api/admin/console/earnings/hold",
      "https://vigoplace.com/server/api/admin/console/earnings/hold",
      { reference: reference, approvalPin: pin, reason },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return parsed;
  };

  const holdEarningMutation = useMutation({
    mutationKey: ["holdPayOut"],
    mutationFn: holdEarning,
    onSuccess: (data) => {
      queryClient.invalidateQueries("earningsRequests");
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
          {approveEarningMutation.error?.response?.data?.message ||
            declineEarningMutation.error?.response?.data?.message ||
            holdEarningMutation.error?.response?.data?.message}
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
              setPayoutRId(() => payout.Id);
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
            {payout.Id}{" "}
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
            {payout.reference}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <a
            href={`/user/${payout.userId}`}
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
            {payout.amount.toLocaleString("en-US")}
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
            {getStatusLabel(payout.status)}
          </Typography>
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
                    {/* <TableCell sx={{ fontWeight: "bold" }} align="left">
                      Fee
                    </TableCell> */}
                    {/* <TableCell sx={{ fontWeight: "bold" }} align="center">
                      payment Method
                    </TableCell> */}
                    <TableCell sx={{ fontWeight: "bold" }} align="center">
                      currency
                    </TableCell>
                    {/* <TableCell sx={{ fontWeight: "bold" }} align="center">
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
                    </TableCell> */}
                    <TableCell align="right">
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
                      {payout.status === "pending" ||
                      payout.status === "onhold" ? (
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
                              {approveEarningMutation.isLoading ? (
                                <CircularProgress size={23} color="inherit" />
                              ) : approveEarningMutation.isSuccess ? (
                                <CheckIcon />
                              ) : (
                                "Approve"
                              )}
                            </Button>
                          </MenuItem>
                          {payout.status !== "onhold" && (
                            <>
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
                                  {holdEarningMutation.isLoading ? (
                                    <CircularProgress
                                      size={23}
                                      color="inherit"
                                    />
                                  ) : holdEarningMutation.isSuccess ? (
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
                              {declineEarningMutation.isLoading ? (
                                <CircularProgress size={23} color="inherit" />
                              ) : approveEarningMutation.isSuccess ? (
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
                            <DialogTitle>Approve User Earnings</DialogTitle>
                            <DialogContent>
                              <DialogContentText>
                                Please enter your admin approval pin to Approve
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
                                loading={approveEarningMutation.isLoading}
                                disabled={pin === null || pin?.length <= 5}
                                onClick={() => {
                                  approveEarningMutation.mutate({
                                    reference: payout.reference,
                                    pin,
                                  });
                                  setPin(null);
                                }}
                              >
                                Approve
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
                            <DialogTitle>Hold User Earnings</DialogTitle>
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
                              {/* <TextField
                                autoFocus
                                margin="dense"
                                id="reason"
                                label="Reason"
                                type="text"
                                fullWidth
                                value={reason}
                                variant="standard"
                                onChange={handleReason}
                              /> */}
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
                                  setHoldModal(false);
                                  setPin(null);
                                  //setReason("");
                                }}
                              >
                                Cancel
                              </Button>
                              <LoadingButton
                                variant="contained"
                                loading={holdEarningMutation.isLoading}
                                disabled={
                                  pin === null ||
                                  pin?.length <= 5 ||
                                  reason === ""
                                }
                                onClick={() => {
                                  holdEarningMutation.mutate({
                                    reference: payout.reference,
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
                            <DialogTitle>Decline User Earnings</DialogTitle>
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
                              {/* <TextField
                                autoFocus
                                margin="dense"
                                id="reason"
                                label="Reason"
                                type="text"
                                fullWidth
                                value={reason}
                                variant="standard"
                                onChange={handleReason}
                              /> */}
                            </DialogContent>
                            <DialogActions>
                              <Button
                                onClick={() => {
                                  setDeclineModal(false);
                                  setPin(null);
                                  //setReason("");
                                }}
                              >
                                Cancel
                              </Button>
                              <LoadingButton
                                variant="contained"
                                loading={approveEarningMutation.isLoading}
                                disabled={pin === null || pin?.length <= 5}
                                onClick={() => {
                                  declineEarningMutation.mutate({
                                    reference: payout.reference,
                                    pin,
                                    //reason,
                                  });
                                  setPin(null);
                                }}
                              >
                                Decline
                              </LoadingButton>
                            </DialogActions>
                          </Dialog>
                        </div>
                      ) : payout.status === "processing" ? (
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
                      ) : payout.status === "denied" ? (
                        <div>
                          <MenuItem>
                            <Button
                              size="small"
                              disabled
                              variant="contained"
                              color="error"
                              style={{backgroundColor: red[800], color: "white"}}
                              //sx={{ backgroundColor: green[500] }}
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
                        queryClient.getQueryData(["earningRequest", payout.Id])
                          ?.data?.earningRequestStatus
                      }
                    >
                      <TableCell align="left" component="th" scope="row">
                        {new Date(
                          queryClient.getQueryData([
                            "earningRequest",
                            payout.Id,
                          ])?.data?.earningRequestDate
                        ).toLocaleDateString()}
                      </TableCell>
                      {/* <TableCell align="center">
                        {queryClient
                          .getQueryData(["earningRequest", payout.Id])
                          ?.data?.payoutRequestFee?.toLocaleString("en-US")}
                      </TableCell> */}
                      {/* <TableCell align="center">
                        {
                          queryClient.getQueryData([
                            "earningRequest",
                            payout.Id,
                          ])?.data?.paymentMethodName
                        }
                      </TableCell> */}
                      <TableCell align="center">
                        {
                          queryClient.getQueryData([
                            "earningRequest",
                            payout.Id,
                          ])?.data?.earningRequestCurrency
                        }
                      </TableCell>
                      {/* <TableCell align="center">
                        {
                          queryClient.getQueryData([
                            "earningRequest",
                            payout.Id,
                          ])?.data?.accountName
                        }
                      </TableCell> */}
                      {/* <TableCell align="center">
                        {
                          queryClient.getQueryData([
                            "earningRequest",
                            payout.Id,
                          ])?.data?.acountBankName
                        }
                      </TableCell> */}
                      {/* <TableCell align="center">
                        {
                          queryClient.getQueryData([
                            "earningRequest",
                            payout.Id,
                          ])?.data?.accountNumber
                        }
                      </TableCell> */}
                      {/* <TableCell align="center">
                        {
                          queryClient.getQueryData([
                            "earningRequest",
                            payout.Id,
                          ])?.data?.accountRoutingNumber
                        }
                      </TableCell> */}
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

RecentEarningsTable.propTypes = {
  cryptoOrders: PropTypes.array.isRequired,
};

RecentEarningsTable.defaultProps = {
  cryptoOrders: [],
};
