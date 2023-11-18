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
export default function Activities() {
  const router = useRouter();
  const { userid } = router.query;
  const queryClient = useQueryClient();
  const getUser = useSession();
  const user = getUser?.data?.user;
  const [activities, setActivities] = useState([]);
  const [activityCount, setActivityCount] = useState(0);
  const [globalFilter, setGlobalFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });

  const fetchUserActivities = async () => {
    setIsFetching(true);
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/admin/console/users/activities?userId=${userid}&perPage=${pagination.pageSize}&page=${pagination.pageIndex}`,
        {
          headers: {
            Authorization: user?.token,
          },
        }
      );

      //console.log(data);
      setActivities(data?.data ?? []);
      setActivityCount(data?.count ?? 0);
    } catch (err) {
      setIsError(true);
      console.log(err, "err fetching user activities");
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchUserActivities();
  }, [userid, pagination]);

  const activitiesColumns = useMemo(
    () => [
      {
        accessorKey: "Action",
        enableClickToCopy: false,
        header: "Action",
      },
      {
        accessorKey: "Description",
        enableClickToCopy: true,
        header: "Description",
      },
      {
        accessorKey: "ip",
        enableClickToCopy: false,
        header: "IP Address",
      },
      {
        accessorKey: "browser",
        enableClickToCopy: false,
        header: "Browser",
      },
      {
        accessorKey: "location",
        enableClickToCopy: false,
        header: "Location",
      },
      {
        accessorFn: (row) => {
          if (row?.created_at) {
            return format(new Date(row.created_at), "MM/dd/yyyy hh:mm a");
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
        columns={activitiesColumns}
        data={activities}
        enableStickyHeader
        enablePagination
        manualPagination
        manualFiltering
        onPaginationChange={setPagination}
        rowCount={activityCount}
        onGlobalFilterChange={setGlobalFilter}
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
                <IconButton onClick={() => fetchUserActivities()}>
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
