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

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const Paystack1 = () => {
  const getUser = useSession();
  const user = getUser?.data?.user;
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });
  const [transferData, setTransferData] = useState([]);
  const [transferCount, setTransferCount] = useState(0);
  const [status, setStatus] = React.useState("");
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);

  const { data, isError, isFetching, isLoading, refetch } = useQuery(
    [
      "fetchpaystackTransfers",
      columnFilters, //refetch when columnFilters changes
      globalFilter, //refetch when globalFilter changes
      pagination.pageIndex, //refetch when pagination.pageIndex changes
      pagination.pageSize, //refetch when pagination.pageSize changes
      sorting, //refetch when sorting changes
      status,
    ],
    async () => {
      const { data } = await axios.get(
        `https://api.vigoplace.com/api/console/transfers/paystack?perPage=${pagination.pageSize}&page=${pagination.pageIndex}`,
        // `http://localhost:3001/api/admin/console/transfers/paystack?perPage=${pagination.pageSize}&page=${pagination.pageIndex}`,
        {
          headers: {
            Authorization: user?.token,
          },
        }
      );

      //console.log(data);
      setTransferData(data?.data ?? []);
      setTransferCount(data?.meta?.total ?? 0);
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

  const columns = useMemo(
    () => [
      {
        accessorKey: "transfer_code",
        enableClickToCopy: true,
        header: "transfer_code",
      },
      {
        accessorKey: "recipient.name",
        header: "Name",
        enableClickToCopy: false,
      },
      {
        accessorKey: "currency",
        enableClickToCopy: false,
        header: "Currency",
      },
      {
        // accessorKey: "amount",
        accessorFn: (row) => (row.amount / 100)?.toLocaleString("en-US"),
        enableClickToCopy: false,
        id: "amount",
        header: "Amount",
      },
      {
        accessorKey: "recipient.details.bank_name",
        enableClickToCopy: false,
        header: "Bank Name",
      },
      {
        accessorKey: "status",
        enableClickToCopy: false,
        header: "Status",
      },
      {
        // accessorKey: "transactionDate",
        accessorFn: (row) => {
          if (row?.createdAt) {
            return format(new Date(row.createdAt), "Pp");
          } else {
            return "";
          }
        },
        id: "createdAt",
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
          enableColumnFilterModes
          enableColumnOrdering
          enablePinning
          columns={columns}
          data={transferData}
          enableStickyHeader
          enableStickyFooter
          enablePagination
          manualPagination
          manualFiltering
          onPaginationChange={setPagination}
          // onPaginationChange={(e, f)=> console.log({e, f}, "oginidixx")}
          //rowCount={data?.meta?.total ?? 0}
          rowCount={transferCount}
          onGlobalFilterChange={setGlobalFilter}
          initialState={{ showColumnFilters: false }}
          positionToolbarAlertBanner="bottom"
          //enableGlobalFilter={false}
          muiToolbarAlertBannerProps={
            isError
              ? {
                  color: "error",
                  children:
                    "Error loading data, Please use the refresh button on the table to retry",
                }
              : undefined
          }
          renderTopToolbarCustomActions={({ table }) => {
            return (
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Tooltip arrow title="Refresh Data">
                  <IconButton onClick={() => refetch()}>
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
            isLoading,
            showAlertBanner: isError,
            showProgressBars: isFetching,
            pagination,
            globalFilter,
          }}
          muiTableContainerProps={{ sx: { height: "75vh" } }}
        />
      </Box>
      <Typography
        align="center"
        marginTop={2}
        variant="h3"
        color="text.secondary"
      >
        <b>Paystack Transfers</b>
      </Typography>
    </>
  );
};

export default Paystack1;
