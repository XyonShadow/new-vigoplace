import React, { useState, useEffect } from "react";
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
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import ReceiptLogoIcon from "../../assets/images/backgrounds/logo_small.png";
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
  Tabs,
  Tab,
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

import Label from "./Label/index";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import {
  fetchSinglePayoutRequest,
  useSinglePayoutRequest,
} from "../../hooks/useSinglePayoutRequest";
import { toast } from "react-toast";
// import BulkActions from './BulkActions';

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
      color: red[800],
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

const API_BASE_URL = "https://api.vigoplace.com";
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
  const [tabValue, setTabValue] = React.useState(0);
  const [filters, setFilters] = useState({
    status: null,
  });
  const [currency, setCurrency] = useState(175);
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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setCurrency(newValue === 0 ? 175 : 251); // Update currency based on tab value
  };

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

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, pageIndex: newPage });
  };

  const handleLimitChange = (event) => {
    setPagination({ ...pagination, pageSize: event.target.value });
  };

  const isUserRoute = router.pathname.startsWith("/user/"); // Check if it's a user route

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
      searchQuery,
    ],
    async () => {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/admin/console/payouts?perPage=${
          pagination.pageSize
        }&page=${pagination.pageIndex + 1}&search=${searchQuery}${
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

  let userPayoutsData;
  if (isUserRoute) {
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
        pagination.pageIndex, //refetch when pagination.pageIndex changes
        pagination.pageSize, //refetch when pagination.pageSize changes
        status,
        page,
        limit,
        searchQuery,
        currency
      ],
      async () => {
        const { data } = await axios.get(
          `${API_BASE_URL}/api/admin/console/payouts/user/${userid}?perPage=${
            pagination.pageSize
          }&page=${pagination.pageIndex + 1}&search=${searchQuery}${
            status !== undefined && status !== null ? `&status=${status}` : ""
          }&currency=${currency}`,
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

    userPayoutsData = userPayouts?.data;
  }

  const dataToUse = isUserRoute
    ? userPayoutsData?.payoutRequests
    : payouts?.data?.payoutRequests;

  const filteredCryptoOrders = applyFilters(dataToUse, filters);

  const handleFirstPage = () => {
    setPagination({ ...pagination, pageIndex: 0 });
  };

  // Calculate total pages based on the count of data and rows per page
  const totalPages = Math.ceil(
    (isUserRoute ? userPayoutsData?.count ?? 0 : payouts?.data?.count ?? 0) /
      pagination.pageSize
  );

  const handleLastPage = () => {
    setPagination({ ...pagination, pageIndex: totalPages - 1 });
  };

  const filteredPayouts = filteredCryptoOrders?.filter(
    (payout) =>
      payout?.payoutRequestReference
        ?.toLowerCase()
        .includes(searchQuery?.toLowerCase()) ||
      payout?.userFullName
        ?.toLowerCase()
        .includes(searchQuery?.toLowerCase()) ||
      payout?.payoutRequestStatus
        ?.toLowerCase()
        .includes(searchQuery?.toLowerCase()) ||
      payout?.payoutRequestAmount
        ?.toString()
        .toLowerCase()
        .includes(searchQuery?.toLowerCase()) ||
      payout?.payoutRequestId
        ?.toString()
        .toLowerCase()
        .includes(searchQuery?.toLowerCase())
    //console.log(payout)
  );

  const theme = useTheme();

  return (
    <Card>
      {selectedBulkActions && (
        <Box flex={1} p={2}>
          {/* <BulkActions /> */}
        </Box>
      )}
  
      {isUserRoute ? (
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
              <Tab label="Naira" {...a11yProps(0)} />
              <Tab label="USD" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <TabPanel value={tabValue} index={0}>
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
                  {(searchQuery ? filteredPayouts : filteredCryptoOrders) &&
                  (searchQuery ? filteredPayouts : filteredCryptoOrders).length > 0 ? (
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
                  isUserRoute ? userPayoutsData?.count ?? 0 : payouts?.data?.count ?? 0
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
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            {/* Repeat the content for the second tab if necessary */}
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
                  {(searchQuery ? filteredPayouts : filteredCryptoOrders) &&
                  (searchQuery ? filteredPayouts : filteredCryptoOrders).length > 0 ? (
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
                  isUserRoute ? userPayoutsData?.count ?? 0 : payouts?.data?.count ?? 0
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
          </TabPanel>
        </Box>
      ) : (
        <>
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
                {(searchQuery ? filteredPayouts : filteredCryptoOrders) &&
                (searchQuery ? filteredPayouts : filteredCryptoOrders).length > 0 ? (
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
                isUserRoute ? userPayoutsData?.count ?? 0 : payouts?.data?.count ?? 0
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
        </>
      )}
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
  const { userid } = router.query;
  const getUser = useSession();
  const user = getUser?.data?.user;
  const [transaction, setTransaction] = useState([]);
  const [isLoading1, setIsLoading1] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 1,
  });

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

  const reference = queryClient.getQueryData([
    "payoutRequest",
    payout.payoutRequestId,
  ])?.data?.payoutRequestReference;
  const userids = queryClient.getQueryData([
    "payoutRequest",
    payout.payoutRequestId,
  ])?.data?.userId;

  const fetchUserTransactions = async () => {
    try {
      const { data } = await axios.get(
        `https://api.vigoplace.com/api/admin/console/users/transaction?userId=${userids}&reference=${reference}`,
        {
          headers: {
            Authorization: user?.token,
          },
        }
      );

      //console.log(data);
      setTransaction(data?.data ?? []);
    } catch (err) {
      //setIsError(true);
      console.log(err, "err fetching user transactions");
    }
  };

  useEffect(() => {
    if (reference && userids) {
      fetchUserTransactions();
    }
  }, [reference, userids]);

  const approvePayOut = async ({ id, pin, users }) => {
    //console.log(users)
    const token = await getToken();
    const parsed = await axios.post(
      //"http://localhost:4000/api/admin/console/approvepayout",
      "https://api.vigoplace.com/api/admin/console/approvepayout",
      { payoutRequestId: id, approvalPin: pin, users },
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

  const approveUSDPayOut = async ({ id, pin, deliveryETA, users }) => {
    if (deliveryETA === "") {
      toast.error("Please pick a date");
      return;
    }
    const token = await getToken();
    const parsed = await axios.post(
      // "http://localhost:3001/api/admin/console/approvepayout",
      "https://api.vigoplace.com/api/admin/console/approvepayout",
      { payoutRequestId: id, approvalPin: pin, deliveryETA, users },
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

  const declinePayOut = async ({ id, pin, reason, users }) => {
    const token = await getToken();
    const parsed = await axios.post(
      // "http://localhost:3001/api/admin/console/declinepayout",
      "https://api.vigoplace.com/api/admin/console/declinepayout",
      { payoutRequestId: id, approvalPin: pin, reason, users },
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

  const splitPayOut = async ({
    reference,
    amount1,
    amount2,
    pin,
    reason,
    users,
  }) => {
    const token = await getToken();
    const parsed = await axios.post(
      //"http://localhost:4000/api/admin/console/split/payment",
      "https://api.vigoplace.com/api/admin/console/split/payment",
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
        users,
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

  const holdPayOut = async ({ reference, pin, reason, users }) => {
    const token = await getToken();
    const parsed = await axios.put(
      //"http://localhost:4000/api/admin/console/transaction",
      "https://api.vigoplace.com/api/api/admin/console/transaction",
      {
        reference: reference,
        status: "onHold",
        approvalPin: pin,
        reason,
        users,
      },
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

  const handleReceiptGeneration = async () => {
    const {
      transactionDate,
      transactionDescription,
      transactionFee,
      transactionFrom,
      transactionId,
      transactionNetTotal,
      transactionReference,
      transactionStatus,
      transactionTo,
      transactionTotal,
      transactionType,
      currency,
      currencySymbol,
    } = transaction[0];

    const formattedTransactionDate = format(
      new Date(transactionDate),
      "MMM dd, yyyy h:mm a"
    );

    // Create a new PDFDocument
    const pdfDoc = await PDFDocument.create();

    // Embed the Times Roman font
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const imageUrl = ReceiptLogoIcon.src;

    const fetchImage = async (imageUrl) => {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      return await response.arrayBuffer();
    };

    // Usage:
    const imageBytes = await fetchImage(imageUrl);

    // Embed the image into the PDF document
    const receiptLogoImage = await pdfDoc.embedPng(imageBytes);

    // Add a blank page to the document
    const page = pdfDoc.addPage();

    // Get the width and height of the page
    const { width, height } = page.getSize();

    // Set initial y position for text
    const marginTop = 40; // Adjust the margin top as needed
    let textY = height - 50 - marginTop; // Subtracting the margin from the initial position
    const marginLeft = width * 0.1; // 10% of the screen width
    const marginRight = width * 0.1;

    const bodyBackgroundColor = rgb(243 / 255, 244 / 255, 248 / 255); // Hex color  #F3F4F8

    // Adjust the font size for heading
    const fontSize = 20;
    const headingFontSize = 16;
    const headingValueFontSize = 40;
    const bodyFontSize = 14;

    // Background colors
    const headingBackgroundColor = rgb(129 / 255, 53 / 255, 249 / 255); // Hex color #8135F9
    const totalAmountValueBackgroundColor = rgb(141 / 255, 73 / 255, 249 / 255); // #8d49f9

    const receiptTextStyle = {
      size: fontSize,
      color: rgb(0, 0, 0),
    };

    // Styling for the total amount section
    const totalAmountLabelStyle = {
      size: headingFontSize,
      color: rgb(255 / 255, 255 / 255, 255 / 255), // White color
      //bold: true,
    };

    const totalAmountValueStyle = {
      size: headingValueFontSize,
      color: rgb(255 / 255, 255 / 255, 255 / 255),
    };

    // Function to draw text with specified style and alignment
    const drawText = (text, style, width) => {
      // Calculate the x-coordinate to center the text horizontally
      const textWidth = timesRomanFont.widthOfTextAtSize(text, style.size);
      const x = (width - textWidth) / 2;

      page.drawText(text, {
        x: x,
        y: textY + 20,
        size: style.size,
        font: timesRomanFont,
        color: style.color,
      });

      textY -= 20;
    };

    // Draw "Transaction receipt" text
    drawText("Transaction receipt", receiptTextStyle, width); // Pass the width of the page as an argument
    textY -= 20;

    // Draw the first rectangle (heading background)
    page.drawRectangle({
      x: marginLeft, // Start from the left edge of the page
      y: textY, // Adjust the vertical position as needed
      width: width - marginLeft - marginRight, // Set the width to be equal to the width of the page
      height: 40, // Adjust the height as needed
      color: headingBackgroundColor,
    });

    // Draw the total amount label
    drawText("TOTAL AMOUNT", totalAmountLabelStyle, width); // Pass the width of the page as an argument
    textY -= 40; // Adjust the vertical spacing after the heading

    // Draw the second rectangle (total amount value background)
    page.drawRectangle({
      x: marginLeft,
      y: textY,
      width: width - marginLeft - marginRight,
      height: 60,
      color: totalAmountValueBackgroundColor,
    });

    // Draw the total amount value
    drawText(
      `${transactionTotal.toString()} ${currency}`,
      totalAmountValueStyle,
      width
    );

    textY -= 40;

    // Draw background for body
    let totalDescriptionHeight = 0;

    page.drawRectangle({
      x: marginLeft,
      y: textY,
      width: width - marginLeft - marginRight,
      height: 40,
      color: bodyBackgroundColor,
    });

    // Function to draw text with specified style and alignment
    const drawTexts = (label, value) => {
      // Convert value to string if it's a number
      if (typeof value === "number") {
        value = value.toString();
      }

      // Draw label text with black color
      page.drawText(label, {
        x: marginLeft + 20, // Adjust x position to add a left margin
        y: textY,
        size: bodyFontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0), // Black color
        textAlign: "left",
      });

      // Calculate the width of the value text
      const valueTextWidth = timesRomanFont.widthOfTextAtSize(
        value,
        bodyFontSize
      );

      // Draw value text aligned to the right
      page.drawText(value, {
        x: width - marginRight - valueTextWidth - 20, // Adjust x position to add a right margin
        y: textY,
        size: bodyFontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0), // Black color
        textAlign: "right",
      });

      textY -= 20 + 30; // Adjust the vertical spacing as needed
    };

    function formatDescription(description, maxWidth, font, fontSize) {
      const words = description.split(" ");
      let lines = [];
      let currentLine = "";

      for (const word of words) {
        const wordWidth = font.widthOfTextAtSize(word, fontSize);
        const currentLineWidth = font.widthOfTextAtSize(
          currentLine + " " + word,
          fontSize
        );

        if (currentLine === "" || currentLineWidth <= maxWidth) {
          currentLine += (currentLine === "" ? "" : " ") + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      lines.push(currentLine);

      return lines; // Return array of lines without joining them
    }

    const widthRatio = 0.5;

    // Calculate the maximum width available for the description
    const maxDescriptionWidth = (width - marginLeft - marginRight) * widthRatio;

    function formatAndDrawDescription(description) {
      const formattedDescriptionLines = formatDescription(
        description,
        maxDescriptionWidth,
        timesRomanFont,
        bodyFontSize
      );

      // Draw Transaction Details
      if (formattedDescriptionLines.length > 0) {
        drawTexts("Transaction Details", formattedDescriptionLines[0]);
        totalDescriptionHeight += 20; // Assuming each line has a height of 20

        // Draw the rest of Transaction Details lines starting from the second line
        for (let i = 1; i < formattedDescriptionLines.length; i++) {
          drawTexts("", formattedDescriptionLines[i]);
          totalDescriptionHeight += 20; // Assuming each line has a height of 20
        }

        // Increment totalDescriptionHeight for additional lines
        if (formattedDescriptionLines.length > 1) {
          totalDescriptionHeight += 20 * (formattedDescriptionLines.length - 1);
        }
      }
    }

    const totalSectionsHeight = 9 * (20 + 40) + totalDescriptionHeight;

    // Draw background for body
    page.drawRectangle({
      x: marginLeft,
      y: textY - totalSectionsHeight,
      width: width - marginLeft - marginRight,
      height: totalSectionsHeight,
      color: bodyBackgroundColor,
    });

    // Draw other sections with appropriate styles
    drawTexts("Sender Name", transactionFrom);
    drawTexts("Beneficiary", transactionTo);
    drawTexts("Transaction Type", transactionType);
    drawTexts("Transaction Status", transactionStatus);
    drawTexts("Transaction Date", formattedTransactionDate);
    formatAndDrawDescription(transactionDescription);
    drawTexts(
      "Account Number",
      queryClient.getQueryData(["payoutRequest", payout.payoutRequestId])?.data
        ?.accountNumber
    );
    drawTexts(
      "Bank Name",
      queryClient.getQueryData(["payoutRequest", payout.payoutRequestId])?.data
        ?.acountBankName
    );
    drawTexts("Transaction Net Total", transactionNetTotal);
    drawTexts("Transaction ID", transactionReference);

    const poweredByText = "Powered by";
    const poweredByTextWidth = timesRomanFont.widthOfTextAtSize(
      poweredByText,
      12 // Adjust font size as needed
    );
    const poweredByTextX = (width - poweredByTextWidth) / 2; // Centered horizontally
    const poweredByTextY = marginTop + 40; // Adjust Y position as needed

    // Draw "Powered by" text
    page.drawText(poweredByText, {
      x: poweredByTextX - 30,
      y: poweredByTextY,
      size: 12, // Adjust font size as needed
      font: timesRomanFont,
      color: rgb(0, 0, 0), // Adjust color as needed
    });

    const imageX = marginLeft; // Adjust X position as needed
    const imageY = marginTop; // Adjust Y position as needed

    // Draw the logo image on the page
    page.drawImage(receiptLogoImage, {
      x: poweredByTextX + 40,
      y: poweredByTextY - 5,
      width: 50,
      height: 15,
    });

    const pdfBytes = await pdfDoc.save();

    // Create a Blob from PDF bytes
    const blob = new Blob([pdfBytes], {
      type: "application/pdf",
    });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Open PDF in a new tab
    window.open(url, "_blank");

    // Clean up URL object after use to release memory
    URL.revokeObjectURL(url);

    sx: {
      cursor: "pointer";
    }
  };

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
                                  }
                                  {""}
                                  {queryClient
                                    .getQueryData([
                                      "payoutRequest",
                                      payout.payoutRequestId,
                                    ])
                                    ?.data?.payoutRequestAmount.toLocaleString()}
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
                                          users: payout?.payoutRequestUId,
                                        }
                                      : {
                                          id: payout.payoutRequestId,
                                          pin,
                                          deliveryETA,
                                          users: payout?.payoutRequestUId,
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
                                    users: payout.payoutRequestUId,
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
                                    users: payout.payoutRequestUId,
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
                                    users: payout.payoutRequestUId,
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
                          <MenuItem>
                            <Button
                              sx={{ margin: 1, bgcolor: green["A700"] }}
                              size="small"
                              variant="contained"
                              color="success"
                              onClick={() => {
                                // setOpenModal(true);
                                handleReceiptGeneration();
                              }}
                            >
                              Report
                            </Button>
                          </MenuItem>
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
