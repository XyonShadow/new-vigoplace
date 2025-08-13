import React, { useEffect, useMemo, useState } from "react";
import { Box, Grid } from '@mui/material';
import DailyActivity from "../src/components/dashboard/DailyActivity";
import MaterialReactTable from "material-react-table";
import { CircularProgress, IconButton, InputAdornment, Paper, Tab, Tooltip } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import axios from "axios";
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { format } from "date-fns";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
  useQuery,
  useMutation,
} from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  Button,
  MenuItem,
  Typography,
} from "@mui/material";

function ErrorLogs() {
  const queryClient = useQueryClient();
  const getUser = useSession();
  const user = getUser?.data?.user;

  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [gender, setGender] = React.useState('');
  const [status, setStatus] = React.useState('');
  const [isVerified, setIsverified] = React.useState('');
  const [logCount, setLogCount] = React.useState(0);

  useEffect(() => {
    setPagination({...pagination, pageIndex: 0})
  }, [columnFilters])

  const columns = useMemo(
    () => [
      {
        accessorKey: "Action",
        enableClickToCopy: false,
        header: "Action",
      },
      {
        accessorKey: "UFullName",
        enableClickToCopy: true,
        header: "Admin",
      },
      {
        accessorFn: (row) => format(new Date(row.CreatedAt), "Pp"),
        id: "CreatedAt",
        enableClickToCopy: false,
        header: "Date",
      },
      {
        accessorKey: "Description",
        enableClickToCopy: false,
        header: "Description",
      },

    ],
    []
  );

  const { data, isError, isFetching, isLoading, refetch } = useQuery(
    [
      "fetchadminconsolelogs",
      columnFilters, //refetch when columnFilters changes
      globalFilter, //refetch when globalFilter changes
      pagination.pageIndex, //refetch when pagination.pageIndex changes
      pagination.pageSize, //refetch when pagination.pageSize changes
      sorting, //refetch when sorting changes
      gender,
      status,
      isVerified
    ],
    async () => {
      const { data } = await axios.get(
        `https://api.vigoplace.com/api/admin/console/logs?limit=${pagination.pageSize}&offset=${pagination.pageIndex * pagination.pageSize}`,
        // `http://localhost:3001/api/admin/console/logs?limit=${pagination.pageSize}&offset=${pagination.pageIndex * pagination.pageSize}`,
        {
          headers: {
            Authorization: user?.token,
          },
        }
      );

      setLogCount(data?.count?.total ?? 0);
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




  if (user?.adminType === "sub-admin") {
    return (
      <section className="flex items-center justify-center">
        <p className="font-bold text-black">Sorry, you do not have permission to view this page</p>
      </section>
    )
  }


  return (
    <>
  {/* <Grid container spacing={0}>
    <Grid item xs={12} lg={12}>
      <DailyActivity />
    </Grid>
  </Grid> */}
    <MaterialReactTable
      columns={columns}
      data={data?.data ?? []}
      // enableColumnFilterModes
      // enableColumnOrdering
      // enableGrouping
      // enablePinning

      // enableRowActions
      enableStickyHeader
      enableStickyFooter
      manualPagination
      onPaginationChange={setPagination}
      rowCount={logCount}
      // onColumnFiltersChange={()=>{
      //   setColumnFilters
      // }}
      onColumnFiltersChange={
        setColumnFilters
      }
      onGlobalFilterChange={setGlobalFilter}
      initialState={{ showColumnFilters: false }}
      positionToolbarAlertBanner="bottom"
      enableGlobalFilter={false}
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

        </div>
        );
      }}


      state={{
        isLoading,
        showAlertBanner: isError,
        showProgressBars: isFetching,
        pagination,
      }}
      muiTableContainerProps={{ sx: { height: "75vh" } }}
    />
  </>
  )
}

ActivityLogs.auth = true
export default ActivityLogs