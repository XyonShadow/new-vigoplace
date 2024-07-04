import React, { useState } from "react";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { getSession, useSession } from "next-auth/react";
import Snackbar from "@mui/material/Snackbar";
import axios from "axios";
import { Gift, DollarSign, Hash, BarChart2 } from "react-feather";
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
import { Search as SearchIcon } from "@mui/icons-material";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import LastPageIcon from "@mui/icons-material/LastPage";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import LoadingButton from "@mui/lab/LoadingButton";
import Modal from "@mui/material/Modal";
import Label from "./Label/index";
import {
  fetchSingleEarningRequest,
  useSingleEarningRequest,
} from "../../hooks/useSingleEarningRequest";

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

const API_BASE_URL = "https://api.vigoplace.com";
//const API_BASE_URL = "http://localhost:4000";
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
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

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

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, pageIndex: newPage });
  };

  const handleLimitChange = (event) => {
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
      searchQuery,
    ],
    async () => {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/admin/console/earnings?perPage=${
          pagination.pageSize
        }&page=${pagination.pageIndex + 1}&search=${searchQuery}${
          status !== undefined && status !== null ? `&status=${status}` : ""
        }`,
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
    ["earningUserRequest", status, page, limit, searchQuery],
    async () => {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/admin/console/earning/user/${userid}?perPage=${
          pagination.pageSize
        }&page=${pagination.pageIndex}&search=${searchQuery}${
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
        //console.log(err, "err fetching this user's earning details");
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

  const handleFirstPage = () => {
    setPagination({ ...pagination, pageIndex: 0 });
  };

  // Calculate total pages based on the count of data and rows per page
  const totalPages = Math.ceil(
    (isUserRoute ? userPayouts?.data?.count ?? 0 : payouts?.data?.count ?? 0) /
      pagination.pageSize
  );

  const handleLastPage = () => {
    setPagination({ ...pagination, pageIndex: totalPages - 1 });
  };

  const filteredPayouts = filteredCryptoOrders?.filter(
    (payout) =>
      payout?.reference?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
      payout?.userFullName
        ?.toLowerCase()
        .includes(searchQuery?.toLowerCase()) ||
      payout?.status?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
      payout?.amount
        ?.toString()
        .toLowerCase()
        .includes(searchQuery?.toLowerCase()) ||
      payout?.Id?.toString().toLowerCase().includes(searchQuery?.toLowerCase())
    //console.log(payout)
  );

  const theme = useTheme();

  return (
    <Card>
      {selectedBulkActions && <Box flex={1} p={2}></Box>}
      {!selectedBulkActions && (
        <CardHeader
          action={
            <Box display="flex" alignItems="center" gap={1}>
              <TextField
                label="Search"
                variant="outlined"
                size="small"
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                  endAdornment: (
                    <IconButton size="small">
                      <SearchIcon />
                    </IconButton>
                  ),
                }}
                sx={{ height: "100%", width: "100%" }}
              />
              <FormControl fullWidth variant="outlined">
                <InputLabel>Status</InputLabel>
                <Select
                  value={status || "all"}
                  onChange={handleStatus}
                  label="Status"
                  autoWidth
                  sx={{ height: "40px" }}
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
            {(searchQuery ? filteredPayouts : filteredCryptoOrders) &&
            (searchQuery ? filteredPayouts : filteredCryptoOrders).length >
              0 ? (
              (searchQuery ? filteredPayouts : filteredCryptoOrders).map(
                (payout, index) => {
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
                }
              )
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
          ActionsComponent={(props) => (
            <div style={{ display: "flex" }}>
              <IconButton
                onClick={handleFirstPage}
                disabled={pagination.pageIndex === 0}
              >
                <FirstPageIcon />
              </IconButton>
              <IconButton
                onClick={() => handlePageChange(pagination.pageIndex - 1)}
                disabled={pagination.pageIndex === 0}
              >
                <NavigateBeforeIcon />
              </IconButton>
              <IconButton
                onClick={() => handlePageChange(pagination.pageIndex + 1)}
                disabled={pagination.pageIndex >= totalPages - 1}
              >
                <NavigateNextIcon />
              </IconButton>
              <IconButton
                onClick={handleLastPage}
                disabled={pagination.pageIndex >= totalPages - 1}
              >
                <LastPageIcon />
              </IconButton>
            </div>
          )}
        />
      </Box>
    </Card>
  );
}

function Row({ payout, isPayoutSelected }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const getUser = useSession();
  const user = getUser?.data?.user;
  const [payoutRId, setPayoutRId] = React.useState(null);
  const { isLoading, data } = useSingleEarningRequest(payoutRId);
  const [openToast, setOpenToast] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [declineModal, setDeclineModal] = React.useState(false);
  const [holdModal, setHoldModal] = React.useState(false);
  const [pin, setPin] = React.useState(null);
  const [reason, setReason] = React.useState("");
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [openEModal, setOpenEModal] = React.useState(false);
  const [modalData, setModalData] = React.useState(null);
  const [amountValue, setAmountValue] = useState(payout.amount);

  const handleOpenModal = async (userId, categoryId) => {
    try {
      const { data } = await axios.get(
        `https://api.vigoplace.com/api/admin/console/earning/initiators/${userId}/${categoryId}`,
        {
          headers: {
            Authorization: user?.token,
          },
        }
      );

      //console.log(data);
      setModalData(data);
      setOpenEModal(true);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const handleCloseModal = () => {
    setOpenEModal(false);
    setModalData(null);
  };

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

  const approveEarning = async ({ reference, pin, amount }) => {
    const token = await getToken();
    const parsed = await axios.patch(
      "https://api.vigoplace.com/api/admin/console/earnings/approve",
      //"http://localhost:4000/api/admin/console/earnings/approve",
      { reference: reference, approvalPin: pin, amount: amount },
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
      setAmountValue(payout.amount);
    },
    onError: async (error) => {
      console.log(error);
      setOpenToast(true);
      setPin(null);
    },
  });

  const declineEarning = async ({ reference, pin }) => {
    const token = await getToken();
    const parsed = await axios.patch(
      "https://api.vigoplace.com/api/admin/console/earnings/reject",
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
      "https://api.vigoplace.com/api/admin/console/earnings/hold",
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

  let currencyid = queryClient.getQueryData(["earningRequest", payout.Id])?.data
    ?.currencyId;
  let userid = queryClient.getQueryData(["earningRequest", payout.Id])?.data
    ?.userId;

  //'2024-04-01 05:54:59'
  function formatDueDate(dateString) {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();

    return `${month}/${year}`;
  }
  let periodid = queryClient.getQueryData(["earningRequest", payout.Id])?.data
    ?.dueAt;
  const formattedDate = formatDueDate(periodid);

  React.useEffect(() => {
    const fetchData = async () => {
      const token = await getToken();

      try {
        const { data } = await axios.get(
          //`http://localhost:4000/api/admin/console/user-earnings/list/${userid}?currencyId=${currencyid}&period=${formattedDate}`,
          `https://api.vigoplace.com/api/admin/console/user-earnings/list/${userid}?currencyId=${currencyid}&period=${formattedDate}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        queryClient.setQueryData(
          ["listUserEarnings", { userid, currencyid, payoutId: payout.Id }],
          data
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (userid) {
      fetchData();
    }
  }, [userid, queryClient]);

  const { data: listEarning, isLoading: isLoading1 } = useQuery(
    ["listUserEarnings", { userid, currencyid, payoutId: payout.Id }],
    () => {
      // This function can be empty, as the data will be set using queryClient.setQueryData
    },
    {
      onError: (err) => {
        console.log(err, "err fetching list of user earnings");
      },
      enabled: false,
    }
  );

  // console.log(queryClient.getQueryData(["earningRequest", payout.Id])?.data)
  // console.log(listEarning?.data);

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

            {isLoading1 ? (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </Box>
            ) : (
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="left">
                      Period
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="left">
                      Currency
                    </TableCell>

                    <TableCell sx={{ fontWeight: "bold" }} align="left">
                      View
                    </TableCell>

                    <TableCell sx={{ fontWeight: "bold" }} align="center">
                      Like
                    </TableCell>

                    <TableCell sx={{ fontWeight: "bold" }} align="center">
                      Comment
                    </TableCell>

                    <TableCell sx={{ fontWeight: "bold" }} align="center">
                      Followers
                    </TableCell>

                    <TableCell sx={{ fontWeight: "bold" }} align="center">
                      Picture Post
                    </TableCell>

                    <TableCell sx={{ fontWeight: "bold" }} align="center">
                      Video Post
                    </TableCell>

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
                                ""
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
                                    ""
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
                                ""
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
                                You are about to approve the earning amount of{" "}
                                <span style={{ fontWeight: "bold" }}>
                                  {amountValue}
                                  {""}
                                </span>{" "}
                                out of{" "}
                                <span style={{ fontWeight: "bold" }}>
                                  {
                                    queryClient.getQueryData([
                                      "earningRequest",
                                      payout.Id,
                                    ])?.data?.earningRequestAmount
                                  }
                                  {""}
                                </span>{" "}
                                .<br></br>
                                Please enter your admin approval pin to Approve
                                this request, if you don't have one yet, head to{" "}
                                <Link
                                  style={{ color: "blue" }}
                                  href="/settings"
                                >
                                  Settings
                                </Link>{" "}
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
                            <DialogActions
                              style={{
                                display: "flex",
                                alignItems: "center",
                                marginRight: "1rem",
                              }}
                            >
                              <div
                                style={{
                                  marginRight: "auto",
                                  marginLeft: "1rem",
                                }}
                              >
                                <TextField
                                  margin="dense"
                                  id="additionalField"
                                  label="Additional Field"
                                  type="text"
                                  variant="outlined"
                                  size="small"
                                  value={amountValue}
                                  onChange={(e) =>
                                    setAmountValue(e.target.value)
                                  }
                                  InputProps={{
                                    readOnly: false,
                                  }}
                                />
                              </div>
                              <div>
                                <Button
                                  onClick={() => {
                                    setOpenModal(false);
                                    setPin(null);
                                    setAmountValue(payout.amount);
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
                                      amount: amountValue,
                                    });
                                    setPin(null);
                                  }}
                                >
                                  Approve
                                </LoadingButton>
                              </div>
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
                              style={{
                                backgroundColor: red[800],
                                color: "white",
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
                        </div>
                      )}
                    </Menu>
                  </TableRow>
                </TableHead>

                <TableBody>
                  <TableRow
                    key={
                      queryClient.getQueryData(["earningRequest", payout.Id])
                        ?.data?.earningRequestStatus
                    }
                  >
                    <TableCell align="left">
                      {new Date(
                        queryClient.getQueryData([
                          "earningRequest",
                          payout.Id,
                        ])?.data?.earningRequestDate
                      ).toLocaleDateString()}
                    </TableCell>

                    <TableCell align="center">
                      {`${listEarning?.data?.period?.month?.slice(0, 3)} ${
                        listEarning?.data?.period?.year
                      }`}
                    </TableCell>

                    <TableCell align="center">
                      {
                        queryClient.getQueryData(["earningRequest", payout.Id])
                          ?.data?.earningRequestCurrency
                      }
                    </TableCell>

                    <TableCell align="center" style={{ padding: "0px" }}>
                      <TableCell
                        onClick={(e) => {
                          e.preventDefault();
                          handleOpenModal(
                            listEarning?.data?.earnings[0]?.userId,
                            listEarning?.data?.earnings[0]?.categoryId
                          );
                        }}
                        colSpan={1}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.textDecoration = "underline")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.textDecoration = "none")
                        }
                      >
                        <BarChart2 size={20} style={{ marginRight: "8px" }} />
                        {listEarning?.data?.earnings[0]?.count}
                      </TableCell>

                      <TableCell
                        onClick={(e) => {
                          e.preventDefault();
                          handleOpenModal(
                            listEarning?.data?.earnings[0]?.userId,
                            listEarning?.data?.earnings[0]?.categoryId
                          );
                        }}
                        colSpan={1}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.textDecoration = "underline")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.textDecoration = "none")
                        }
                      >
                        <Gift size={16} style={{ marginRight: "8px" }} />
                        {listEarning?.data?.earnings[0]?.earnings}
                      </TableCell>
                    </TableCell>

                    <TableCell align="center" style={{ padding: "0px" }}>
                      <TableCell
                        onClick={(e) => {
                          e.preventDefault();
                          handleOpenModal(
                            listEarning?.data?.earnings[1]?.userId,
                            listEarning?.data?.earnings[1]?.categoryId
                          );
                        }}
                        colSpan={1}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.textDecoration = "underline")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.textDecoration = "none")
                        }
                      >
                        <BarChart2 size={20} style={{ marginRight: "8px" }} />
                        {listEarning?.data?.earnings[1]?.count}
                      </TableCell>

                      <TableCell
                        onClick={(e) => {
                          e.preventDefault();
                          handleOpenModal(
                            listEarning?.data?.earnings[1]?.userId,
                            listEarning?.data?.earnings[1]?.categoryId
                          );
                        }}
                        colSpan={1}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.textDecoration = "underline")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.textDecoration = "none")
                        }
                      >
                        <Gift size={16} style={{ marginRight: "8px" }} />
                        {listEarning?.data?.earnings[1]?.earnings}
                      </TableCell>
                    </TableCell>

                    <TableCell align="center" style={{ padding: "0px" }}>
                      <TableCell
                        onClick={(e) => {
                          e.preventDefault();
                          handleOpenModal(
                            listEarning?.data?.earnings[2]?.userId,
                            listEarning?.data?.earnings[2]?.categoryId
                          );
                        }}
                        colSpan={1}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.textDecoration = "underline")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.textDecoration = "none")
                        }
                      >
                        <BarChart2 size={20} style={{ marginRight: "8px" }} />
                        {listEarning?.data?.earnings[2]?.count}
                      </TableCell>

                      <TableCell
                        onClick={(e) => {
                          e.preventDefault();
                          handleOpenModal(
                            listEarning?.data?.earnings[2]?.userId,
                            listEarning?.data?.earnings[2]?.categoryId
                          );
                        }}
                        colSpan={1}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.textDecoration = "underline")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.textDecoration = "none")
                        }
                      >
                        <Gift size={16} style={{ marginRight: "8px" }} />
                        {listEarning?.data?.earnings[2]?.earnings}
                      </TableCell>
                    </TableCell>

                    <TableCell align="center" style={{ padding: "0px" }}>
                      <TableCell
                        onClick={(e) => {
                          e.preventDefault();
                          handleOpenModal(
                            listEarning?.data?.earnings[3]?.userId,
                            listEarning?.data?.earnings[3]?.categoryId
                          );
                        }}
                        colSpan={1}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.textDecoration = "underline")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.textDecoration = "none")
                        }
                      >
                        <BarChart2 size={20} style={{ marginRight: "8px" }} />
                        {listEarning?.data?.earnings[3]?.count}
                      </TableCell>

                      <TableCell
                        onClick={(e) => {
                          e.preventDefault();
                          handleOpenModal(
                            listEarning?.data?.earnings[3]?.userId,
                            listEarning?.data?.earnings[3]?.categoryId
                          );
                        }}
                        colSpan={1}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.textDecoration = "underline")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.textDecoration = "none")
                        }
                      >
                        <Gift size={16} style={{ marginRight: "8px" }} />
                        {listEarning?.data?.earnings[3]?.earnings}
                      </TableCell>
                    </TableCell>

                    <TableCell align="center" style={{ padding: "0px" }}>
                      <TableCell
                        onClick={(e) => {
                          e.preventDefault();
                          handleOpenModal(
                            listEarning?.data?.earnings[4]?.userId,
                            listEarning?.data?.earnings[4]?.categoryId
                          );
                        }}
                        colSpan={1}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.textDecoration = "underline")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.textDecoration = "none")
                        }
                      >
                        <BarChart2 size={20} style={{ marginRight: "8px" }} />
                        {listEarning?.data?.earnings[4]?.count}
                      </TableCell>

                      <TableCell
                        onClick={(e) => {
                          e.preventDefault();
                          handleOpenModal(
                            listEarning?.data?.earnings[4]?.userId,
                            listEarning?.data?.earnings[4]?.categoryId
                          );
                        }}
                        colSpan={1}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.textDecoration = "underline")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.textDecoration = "none")
                        }
                      >
                        <Gift size={16} style={{ marginRight: "8px" }} />
                        {listEarning?.data?.earnings[4]?.earnings}
                      </TableCell>
                    </TableCell>

                    <TableCell align="center" style={{ padding: "0px" }}>
                      <TableCell
                        onClick={(e) => {
                          e.preventDefault();
                          handleOpenModal(
                            listEarning?.data?.earnings[5]?.userId,
                            listEarning?.data?.earnings[5]?.categoryId
                          );
                        }}
                        colSpan={1}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.textDecoration = "underline")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.textDecoration = "none")
                        }
                      >
                        <BarChart2 size={20} style={{ marginRight: "8px" }} />
                        {listEarning?.data?.earnings[5]?.count}
                      </TableCell>

                      <TableCell
                        onClick={(e) => {
                          e.preventDefault();
                          handleOpenModal(
                            listEarning?.data?.earnings[5]?.userId,
                            listEarning?.data?.earnings[5]?.categoryId
                          );
                        }}
                        colSpan={1}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.textDecoration = "underline")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.textDecoration = "none")
                        }
                      >
                        <Gift size={16} style={{ marginRight: "8px" }} />
                        {listEarning?.data?.earnings[5]?.earnings}
                      </TableCell>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}

            <Modal
              open={openEModal}
              onClose={handleCloseModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 400,
                  backgroundColor: "white",
                  boxShadow: 24,
                  p: 4,
                  maxHeight: "75vh",
                  overflowY: "auto",
                  paddingTop: "3%",
                  paddingBottom: "3%",
                  paddingRight: "5%",
                  paddingLeft: "5%",
                }}
              >
                <Typography
                  variant="h6"
                  id="modal-modal-title"
                  sx={{ marginBottom: "8px", fontSize: "1.1rem" }}
                >
                  Users Full Names
                </Typography>
                <div id="modal-modal-description">
                  {modalData?.data?.earningsInitiators?.map(
                    (initiator, index) => (
                      <Typography
                        component="a"
                        href={`/user/${initiator.initiatorId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "block",
                          marginBottom: "8px",
                          textDecoration: "none",
                        }}
                        key={index}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.textDecoration = "underline")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.textDecoration = "none")
                        }
                      >
                        {`${index + 1}. ${initiator.userFullName}`}
                      </Typography>
                    )
                  )}
                </div>
                <Button
                  onClick={handleCloseModal}
                  variant="contained"
                  color="primary"
                  style={{ marginTop: "16px" }}
                >
                  Close Modal
                </Button>
              </div>
            </Modal>
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
