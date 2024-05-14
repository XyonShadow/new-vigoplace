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

const API_BASE_URL = "https://api.vigoplace.com";
//const API_BASE_URL = "http://localhost:4000";
export default function Notification() {
  const router = useRouter();
  const { userid } = router.query;
  const queryClient = useQueryClient();
  const getUser = useSession();
  const user = getUser?.data?.user;
  const [notification, setNotification] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [globalFilter, setGlobalFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });

  const handleSearch = (event) => {
    setGlobalFilter(event || "");
  };

  const fetchUserNotification = async () => {
    setIsFetching(true);
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/admin/console/user/notification?user=${userid}&perPage=${
          pagination.pageSize
        }&page=${pagination.pageIndex + 1}&search=${globalFilter}`,
        {
          headers: {
            Authorization: user?.token,
          },
        }
      );

      //console.log(data);
      setNotification(data?.data?.userNotification ?? []);
      setNotificationCount(data?.data?.count ?? 0);
    } catch (err) {
      setIsError(true);
      console.log(err, "err fetching user notifications");
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchUserNotification();
  }, [userid, pagination, globalFilter]);

  //console.log(pagination.pageIndex)

  const notificationColumn = useMemo(
    () => [
      {
        accessorKey: "from_user_full_name",
        enableClickToCopy: false,
        header: "Requested User",
        muiTableBodyCellProps: ({ cell }) => ({
          style: {
            cursor: "pointer",
          },
          onClick: () => {
            //console.log(cell.row.original)
            const userId = cell.row.original.ONUIdFrom;
            const url = `/user/${userId}`;
            window.open(url, "_blank");
          },
          onMouseEnter: (e) => {
            e.target.style.textDecoration = "underline";
          },
          onMouseLeave: (e) => {
            e.target.style.textDecoration = "none";
          },
        }),
        id: "requestedUser",
      },
      {
        accessorKey: "ONContent",
        enableClickToCopy: true,
        header: "Notification Text",
      },
      {
        accessorFn: (row) => {
          if (row?.ONCreatedAt) {
            return format(new Date(row.ONCreatedAt), "MM/dd/yyyy hh:mm a");
          } else {
            return "";
          }
        },
        enableClickToCopy: false,
        header: "Notification Date",
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
        columns={notificationColumn}
        data={notification}
        enableStickyHeader
        enablePagination
        manualPagination
        manualFiltering
        onPaginationChange={setPagination}
        rowCount={notificationCount}
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
                <IconButton onClick={() => fetchUserNotification()}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
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
