import React, { useState, useEffect, useRef, useMemo } from "react";
import { MaterialReactTable } from "material-react-table";
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

const Paystack2 = () => {
  const getUser = useSession();
  const user = getUser?.data?.user;
  const [transactionPagination, setTransactionPagination] = useState({
    pageIndex: -1,
    pageSize: 10,
  });
  //const transactionPaginations = useRef(1);
  const [transactionData, setTransactionData] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [transactionCount, setTransactionCount] = useState(0);
  const [status, setStatus] = React.useState("");
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);

  console.log("page rerendered!!!");

  const {
    data: transactionsData,
    isError: transactionError,
    isFetching: transactionFetching,
    isLoading: transactionLoading,
    refetch: transactionRefetch,
  } = useQuery(
    [
      "fetchpaystackTransactions",
      columnFilters, // refetch when columnFilters changes
      globalFilter, // refetch when globalFilter changes
      //transactionPagination.pageIndex,
      //transactionPagination.pageSize > 1, // refetch when transactionPagination changes
      //transactionPagination.pageSize,
      transactionPagination,
      sorting, // refetch when sorting changes
      status,
    ],
    async () => {
      console.log("index", transactionPagination.pageIndex);
      const { data } = await axios.get(
        `https://vigoplace.com/server/api/admin/console/transactions/paystack?perPage=${transactionPagination.pageSize}&page=${transactionPagination.pageIndex}`,
        {
          headers: {
            Authorization: user?.token,
          },
        }
      );
      // console.log(transactionPagination);
      // console.log(transactionData);
      // setTransactionData(transactionsData?.data ?? []);
      setTransactionCount(transactionsData?.meta?.total ?? 0);
      return data;
    },
    {
      onError: (err) => {
        console.log(err, "err fetching users");
      },
      enabled: !!user?.token,
    }
    //{ keepPreviousData: true }
  );

  const transactionColumns = useMemo(
    () => [
      {
        accessorFn: (row) =>
          `${row?.customer?.first_name} ${row?.customer?.last_name}`,
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
        accessorFn: (row) => {
          if (row?.createdAt) {
            return format(new Date(row.createdAt), "Pp");
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
  return (
    <>
      <Box sx={{ pt: 3 }}>
        <MaterialReactTable
          // enableColumnFilterModes
          // enableColumnOrdering
          // enableGrouping
          // enablePinning
          // enableRowActions
          // enableRowSelection
          //enableColumnFilterModes
          enableColumnOrdering
          enablePinning
          columns={transactionColumns}
          data={transactionsData?.data ?? []}
          enableStickyHeader
          rowCount={transactionCount}
          //enableStickyFooter
          enablePagination
          manualPagination
          autoResetPageIndex={false}
          paginateExpandedRows={false}
          // autoResetAll={false}
          manualFiltering
          onPaginationChange={setTransactionPagination}
          //{...(transactionPagination.pageIndex > 1 && { onPaginationChange: setTransactionPagination })}

          onGlobalFilterChange={setGlobalFilter}
          initialState={{ showColumnFilters: false }}
          positionToolbarAlertBanner="bottom"
          //enableGlobalFilter={false}
          muiToolbarAlertBannerProps={
            transactionError
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

                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
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
              </div>
            );
          }}
          state={{
            isLoading: transactionLoading,
            showAlertBanner: transactionError,
            showProgressBars: transactionFetching,
            pagination: transactionPagination,
            globalFilter,
          }}
          muiTableContainerProps={{ sx: { height: "75vh" } }}
        />
      </Box>

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

export default Paystack2;
