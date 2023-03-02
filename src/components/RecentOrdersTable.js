import React, { useState } from "react";
import {
  useQueryClient,
  useQuery,
  useMutation,
} from "@tanstack/react-query";
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
import { green, yellow } from "@mui/material/colors";
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

import LoadingButton from "@mui/lab/LoadingButton";

import Label from "./Label/index";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import {
  fetchSinglePayoutRequest,
  useSinglePayoutRequest,
} from "../../hooks/useSinglePayoutRequest";
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
    processing: {
      text: "Processing",
      color: yellow[700],
    },
  };
  const { text, color } = map[cryptoOrderStatus];

  return <Label sx={{ color }}>{text}</Label>;
  // return <Label sx={{}} color={color}>{text}</Label>;
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

export default function RecentOrdersTable() {
  const queryClient = useQueryClient();
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
    })
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
    setPagination({...pagination, pageIndex: newPage})
  };

  const handleLimitChange = (event) => {
    // setLimit(parseInt(event.target.value));
    setPagination({...pagination, pageSize: event.target.value})
  };

  const { data: payouts, isError, isFetching, isLoading, refetch } = useQuery(
    [
      "payoutRequests",
      // columnFilters, //refetch when columnFilters changes
      // globalFilter, //refetch when globalFilter changes
      pagination.pageIndex, //refetch when pagination.pageIndex changes
      pagination.pageSize, //refetch when pagination.pageSize changes
      // sorting, //refetch when sorting changes
      status,
      page,
      limit
    ],
    async () => {
      const { data } = await axios.get(
        `https://vigoplace.com/server/api/admin/console/payouts?limit=${pagination.pageSize}&offset=${pagination.pageIndex * pagination.pageSize}${status !== undefined && status !== null ? `&status=${status}` : '' }`,
        // `http://localhost:3001/api/admin/console/payouts?limit=${pagination.pageSize}&offset=${pagination.pageIndex * pagination.pageSize}${status !== undefined && status !== null ? `&status=${status}` : '' }`,
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
        console.log(err, "err fetching payouts");
      },
      enabled: !!user?.token,
    },
    { keepPreviousData: true }
  );




  const filteredCryptoOrders = applyFilters(payouts?.data?.payoutRequests, filters);
  const paginatedCryptoOrders = applyPagination(
    filteredCryptoOrders,
    pagination.pageIndex,
    pagination.pageSize,
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
              <TableCell padding="checkbox">
                {/* <Checkbox
                  color="primary"
                  checked={selectedAllCryptoOrders}
                  indeterminate={selectedSomeCryptoOrders}
                  onChange={handleSelectAllCryptoOrders}
                /> */}
              </TableCell>

              {/* <TableCell>Order Details</TableCell> */}
              {/* <TableCell>Request ID</TableCell>
              <TableCell>Source</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Actions</TableCell> */}

              <TableCell>Request ID</TableCell>
              <TableCell>Reference</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCryptoOrders &&
              filteredCryptoOrders.map((payout, index) => {
                const isPayoutSelected = selectedCryptoOrders.includes(
                  payout.payoutRequestId
                );
                return (
                  <Row
                    // key={payout.payoutRequestId}
                    key={index}
                    payout={payout}
                    isPayoutSelected={isPayoutSelected}
                    // setRequestId={setPayoutRId}
                    // isLoading={isLoading}
                  />
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box p={2}>
        <TablePagination
          component="div"
          count={payouts?.data?.count ?? 0}
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
  const theme = useTheme();
    const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const [payoutRId, setPayoutRId] = React.useState(null);
  const { isLoading } = useSinglePayoutRequest(payoutRId);
  const [openToast, setOpenToast] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [buffer, setBuffer] = React.useState(10);
  const [openModal, setOpenModal] = React.useState(false);
  const [declineModal, setDeclineModal] = React.useState(false);
  const [pin, setPin] = React.useState(null);
  const [reason, setReason] = React.useState("");


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
      'https://vigoplace.com/server/api/admin/console/approvepayout',
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
      'https://vigoplace.com/server/api/admin/console/declinepayout',
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
      setReason("")
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
          {approvePayOutMutation.error?.response?.data?.message || declinePayOutMutation.error?.response?.data?.message}
        </Alert>
      </Snackbar>
      <TableRow hover selected={isPayoutSelected}>
        {/* <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={isPayoutSelected}
                    onChange={(event) => handleSelectOneCryptoOrder(event, payout.payoutRequestId)}
                    value={isPayoutSelected}
                  />
                </TableCell> */}
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
            {payout.payoutRequestId}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {/* {format(payouts.payoutRequestDate, 'MMMM dd yyyy')} */}
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
            {payout.payoutRequestReference}
          </Typography>
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
          {/* <Typography variant="body2" color="text.secondary" noWrap>
                    {numeral(payout.payoutRequestAmount).format(
                      `${cryptoOrder.currency}0,0.00`
                    )}
                  </Typography> */}
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

        <TableCell align="right">
          {/* <Tooltip title="Edit Order" arrow>
            <IconButton
              sx={{
                "&:hover": {
                  // background: theme.colors.primary.lighter
                },
                color: theme.palette.primary.main,
              }}
              color="inherit"
              size="small"
            >
              <EditTwoToneIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete Order" arrow>
            <IconButton
              sx={{
                // '&:hover': { background: theme.colors.error.lighter },
                color: theme.palette.error.main,
              }}
              color="inherit"
              size="small"
            >
              <DeleteTwoToneIcon fontSize="small" />
            </IconButton>
          </Tooltip> */}
          {payout.payoutRequestStatus === "pending" ? (
            <>
              <Button
                sx={{ margin: 1, bgcolor: green[500] }}
                size="small"
                variant="contained"
                color="success"
                onClick={
                  () => {
                    setOpenModal(true);
                  }
                }
              >
                {approvePayOutMutation.isLoading ? (
                  <CircularProgress size={23} color="inherit" />
                ) : approvePayOutMutation.isSuccess ? (
                  <CheckIcon />
                ) : (
                  "Approve"
                )}
              </Button>
              <Button size="small" variant="contained" color="error" onClick={
                  () => {
                    setDeclineModal(true);
                  }
                }>
                  {
                    declinePayOutMutation.isLoading ? (<CircularProgress size={23} color="inherit" />) :  approvePayOutMutation.isSuccess ? (<CheckIcon />) : ("Decline")
                  }
              </Button>
              <Button
                sx={{ margin: 1, bgcolor: green['A700'] }}
                size="small"
                variant="contained"
                color="success"
                onClick={
                  () => {
                    // setOpenModal(true);
                    router.push(`/user/${payout.payoutRequestUId}`)
                  }
                }
              >
               Profile
              </Button>

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
                    Please enter your admin approval pin to approve this
                    request, if you dont have one yet, head to{" "}
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
                    loading={approvePayOutMutation.isLoading}
                    disabled={pin === null || pin?.length <= 5}
                    onClick={() => {
                      approvePayOutMutation.mutate({
                        id: payout.payoutRequestId,
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
                open={declineModal}
                onClose={() => {
                  setDeclineModal(false);
                  setPin(null);
                }}
              >
                <DialogTitle>Decline Payout</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Please enter your admin approval pin to Decline this
                    request, if you dont have one yet, head to{" "}
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
                      // setReason("")

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
                        reason
                      });
                      setPin(null);
                    }}
                  >
                    Decline
                  </LoadingButton>
                </DialogActions>
              </Dialog>
            </>
          ) : payout.payoutRequestStatus === "processing" ? (
            <>
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
              <Button
                sx={{ margin: 1, bgcolor: green[500] }}
                size="small"
                variant="contained"
                color="success"
                onClick={
                  () => {
                    // setOpenModal(true);
                    router.push(`/user/${payout.payoutRequestUId}`)
                  }
                }
              >
               Profile
              </Button>
            </>
          ) : payout.payoutRequestStatus === "declined" ? (
            <>
              <Button
                size="small"
                disabled
                variant="contained"
                color="error"
                sx={{ bgcolor: green[500] }}
              >
                Declined <CancelIcon />
              </Button>
              <Button
                sx={{ margin: 1, bgcolor: green['A700'] }}
                size="small"
                variant="contained"
                color="success"
                onClick={
                  () => {
                    // setOpenModal(true);
                    router.push(`/user/${payout.payoutRequestUId}`)
                  }
                }
              >
               Profile
              </Button>
            </>
          ) : (
            <>
              <Button
                size="small"
                variant="contained"
                color="error"
                sx={{ bgcolor: green[500] }}
              >
                Approved <CheckIcon />
              </Button>
              <Button
                sx={{ margin: 1, bgcolor: green['A700'] }}
                size="small"
                variant="contained"
                color="success"
                onClick={
                  () => {
                    // setOpenModal(true);
                    router.push(`/user/${payout.payoutRequestUId}`)
                  }
                }
              >
               Profile
              </Button>
            </>
          )}
        </TableCell>
      </TableRow>
      <TableCell
        style={{
          paddingBottom: 0,
          paddingTop: 0,
          background: "rgb(230 230 230)",
        }}
        colSpan={6}
      >
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box sx={{ margin: 1 }}>
            <Typography
              variant="h6"
              fontWeight={"bold"}
              gutterBottom
              component="div"
            >
              More Details
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
                    <TableCell sx={{ fontWeight: "bold" }}>Full Name</TableCell>
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* {
                  queryClient.getQueryData(["payoutRequest", 10])

                } */}
                  {
                    // row.history.map((historyRow) => (
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
                      <TableCell align="center">
                        {
                          queryClient.getQueryData([
                            "payoutRequest",
                            payout.payoutRequestId,
                          ])?.data?.userFullname
                        }
                      </TableCell>
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

                      {/* <TableCell align="right">
                      {Math.round(historyRow.amount * row.price * 100) / 100}
                    </TableCell> */}
                    </TableRow>
                    // ))
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
