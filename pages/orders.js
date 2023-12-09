import React, { useMemo, useState, useEffect } from "react";
import MaterialReactTable from "material-react-table";
import { useRouter } from "next/router";
import axios from "axios";
import { format } from "date-fns";
//Material UI Imports
import {
  IconButton,
  Tooltip,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

//useQuery Imports
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
  useQuery,
  useMutation,
} from "@tanstack/react-query";
import { getSession, useSession } from "next-auth/react";

const API_BASE_URL = "https://vigoplace.com/server";
//const API_BASE_URL = "http://localhost:4000";
export default function Orders() {
  const router = useRouter();
  const { userid } = router.query;
  const queryClient = useQueryClient();
  const getUser = useSession();
  const user = getUser?.data?.user;
  const [orders, setOrders] = useState([]);
  const [orderCount, setOrderCount] = useState(0);
  const [globalFilter, setGlobalFilter] = useState("");
  const [status, setStatus] = React.useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });

  const handleStatus = (event) => {
    setStatus(event.target.value);
  };

  const handleSearch = (event) => {
    setGlobalFilter(event || "");
  };

  const fetchUserOrders = async () => {
    setIsFetching(true);
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/admin/console/users/orders?status=${status}&perPage=${pagination.pageSize}&page=${pagination.pageIndex}&search=${globalFilter}`,
        {
          headers: {
            Authorization: user?.token,
          },
        }
      );

      //console.log(data);
      setOrders(data?.data?.totalUserOrders);
      setOrderCount(data?.data?.count);
    } catch (err) {
      setIsError(true);
      console.log(err, "err fetching orders");
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, [userid, status, pagination, globalFilter]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "OPSOId",
        enableClickToCopy: false,
        header: "Order Id",
      },
      {
        accessorKey: "OPSOProductId",
        enableClickToCopy: false,
        header: "Product Id",
      },
      {
        accessorKey: "OPSOTransactionId",
        enableClickToCopy: false,
        header: "Transaction Id",
      },
      {
        accessorKey: "OPSOStatus",
        enableClickToCopy: false,
        header: "Status",
      },
      {
        accessorKey: "OPSOCurrencyId",
        enableClickToCopy: false,
        header: "Currency",
      },
      {
        accessorKey: "OPSOQuantity",
        enableClickToCopy: false,
        header: "Order Quantity",
      },
      {
        accessorKey: "OPSOAmount",
        enableClickToCopy: false,
        header: "Order Currency Amount",
      },
      {
        accessorKey: "OPSOAddress",
        enableClickToCopy: false,
        header: "Address",
      },
      {
        accessorFn: (row) => {
          if (row?.OPSOCreatedAt) {
            return format(new Date(row.OPSOCreatedAt), "MM/dd/yyyy hh:mm a");
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
      <MaterialReactTable
        enableColumnFilterModes
        enableColumnOrdering
        enablePinning
        columns={columns}
        data={orders}
        enableStickyHeader
        enablePagination
        manualPagination
        manualFiltering
        onPaginationChange={setPagination}
        rowCount={orderCount}
        onGlobalFilterChange={handleSearch}
        initialState={{ showColumnFilters: false }}
        positionToolbarAlertBanner="bottom"
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
                <IconButton onClick={() => fetchUserOrders()}>
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
                  label="Status"
                >
                  <MenuItem value={"all"}>All</MenuItem>
                  <MenuItem value={"pending"}>Pending</MenuItem>
                  <MenuItem value={"shipped"}>Shipped</MenuItem>
                  <MenuItem value={"completed"}>Completed</MenuItem>
                  <MenuItem value={"cancelled"}>Cancelled</MenuItem>
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
    </>
  );
}
