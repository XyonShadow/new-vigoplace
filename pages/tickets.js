import React, { useEffect, useMemo } from 'react'
import { Box, Container, Grid } from '@mui/material';
import BlogCard from "../src/components/dashboard/BlogCard";
import SalesOverview from "../src/components/dashboard/SalesOverview";
import DailyActivity from "../src/components/dashboard/DailyActivity";
import TicketsTable from "../src/components/dashboard/ticketsTable";
import { Budget } from "../src/components/dashboard/budget";
import { LatestOrders } from "../src/components/dashboard/latest-orders";
import { TasksProgress } from "../src/components/dashboard/tasks-progress";
import { TotalCustomers } from "../src/components/dashboard/total-customers";
import { TotalProfit } from "../src/components/dashboard/total-profit";
import { TotalTickets } from "../src/components/dashboard/total-tickets";
import { ResolvedTickets } from "../src/components/dashboard/resolved-tickets";
import { SettledTickets } from "../src/components/dashboard/settled-tickets";
import { PendingTickets } from "../src/components/dashboard/pending-tickets";
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
import { useRouter } from 'next/router'


function Tickets() {
  const router = useRouter()
  const queryClient = useQueryClient();
  const getUser = useSession();
  const user = getUser?.data?.user;

  const [columnFilters, setColumnFilters] = React.useState([]);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [sorting, setSorting] = React.useState([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [gender, setGender] = React.useState('');
  const [status, setStatus] = React.useState('');
  const [isVerified, setIsverified] = React.useState('');
  const [ticketType, setTicketType] = React.useState('unassigned');
  const [rowSelection, setRowSelection] = React.useState({});

console.log({rowSelection})
  useEffect(() => {
    setPagination({...pagination, pageIndex: 0})
  }, [columnFilters])

  const columns = useMemo(
    () => [
      {
        accessorKey: "username",
        enableClickToCopy: false,
        header: "Username",
      },
      {
        accessorKey: "categoryName",
        enableClickToCopy: false,
        enableColumnFilter: false,
        header: "Category",
      },
      {
        accessorKey: "subject",
        enableClickToCopy: true,
        enableColumnFilter: false,
        header: "Subject",
      },
      {
        accessorKey: "description",
        enableClickToCopy: false,
        enableColumnFilter: false,
        header: "Description",
      },
      {
        accessorKey: "status",
        enableClickToCopy: false,
        // enableColumnFilter: false,
        header: "Status",
        filterFn: 'equals',
        filterSelectOptions: [
          { text: 'queued', value: 'Queued' },
          { text: 'in-progress', value: 'In-progress' },
          { text: 'resolved', value: 'Resolved' },
          { text: 'closed', value: 'Closed' },
          { text: 'permanently-closed', value: 'Permanently-closed' },
        ],
        filterVariant: 'select',
      },
      {
        accessorKey: "ticketReference",
        enableClickToCopy: false,
        enableColumnFilter: false,
        header: "Reference",
      },
      {
        accessorFn: (row) => format(new Date(row.date), "Pp"),
        id: "date",
        enableClickToCopy: false,
        header: "Date",
      },
    ],
    []
  );

  const { data, isError, isFetching, isLoading, refetch } = useQuery(
    [
      "fetchTickets",
      columnFilters, //refetch when columnFilters changes
      globalFilter, //refetch when globalFilter changes
      pagination.pageIndex, //refetch when pagination.pageIndex changes
      pagination.pageSize, //refetch when pagination.pageSize changes
      sorting, //refetch when sorting changes
      gender,
      status,
      isVerified,
      ticketType
    ],
    async () => {
      const { data } = await axios.get(
        `https://vigoplace.com/server/api/admin/tickets/${ticketType}?limit=${pagination.pageSize}&offset=${pagination.pageIndex * pagination.pageSize}${columnFilters?.length >=1 ?`&search=${JSON.stringify(columnFilters)}`:''}`,
        // `http://localhost:3001/api/admin/tickets/${ticketType}?limit=${pagination.pageSize}&offset=${pagination.pageIndex * pagination.pageSize}${columnFilters?.length >=1 ?`&search=${JSON.stringify(columnFilters)}`:''}`,
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
        console.log(err, "err fetching users");
      },
      enabled: !!user?.token,
    },
  );

  const handleTicketType = (event) => {
    setTicketType(event.target.value);
  };

  const handleStatus = (event) => {
    setStatus(event.target.value);
    setPagination({
      pageIndex: 0,
      pageSize: 10,
    })
  };


  return (
    <>
      {/* <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth={false}>
          <Grid container spacing={3}>

            <Grid item xl={3} lg={3} sm={6} xs={12}>
              <TotalTickets />
            </Grid>

            <Grid item xl={3} lg={3} sm={6} xs={12}>
              <SettledTickets />
            </Grid>

            <Grid item xl={3} lg={3} sm={6} xs={12}>
              <PendingTickets sx={{ }} />
            </Grid>

            <Grid item xl={3} lg={3} sm={6} xs={12}>
              <ResolvedTickets />
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Grid container spacing={0}>
        <Grid item xs={12} lg={12}>
          <TicketsTable />
        </Grid>
      </Grid> */}

      <MaterialReactTable
      columns={columns}
      data={data?.data?.results ?? []}
      // enableColumnFilterModes
      // enableColumnOrdering
      // enableGrouping
      // enablePinning

      // enableRowActions
      enableStickyHeader
      enableStickyFooter
      manualPagination
      onPaginationChange={setPagination}
      rowCount={data?.count?.total ?? 0}
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
      onRowSelectionChange={setRowSelection} //connect internal row selection state to your own
      muiTableBodyRowProps={({ row }) => ({
        // onClick: () => setRowSelection(row.original),
        onClick: () => router.push(`/tickets/${row.original.ticketId}`),
        sx: { cursor: 'pointer' },
      })}

      // muiTableBodyRowProps={({ row }) => ({
      //   //implement row selection click events manually
      //   onClick: () =>
      //     setRowSelection((prev) => ({
      //       ...prev,
      //       [row.id]: !prev[row.id],
      //     })),
      //   selected: rowSelection[row.id],
      //   sx: {
      //     cursor: 'pointer',
      //   },
      // })}

      renderTopToolbarCustomActions={({ table }) => {
        // const handleDeactivate = () => {
        //   table.getSelectedRowModel().flatRows.map((row) => {
        //     alert("deactivating " + row.getValue("fullname"));
        //   });
        // };

        // const handleActivate = () => {
        //   table.getSelectedRowModel().flatRows.map((row) => {
        //     alert("activating " + row.getValue("name"));
        //   });
        // };

        // const handleContact = () => {
        //   table.getSelectedRowModel().flatRows.map((row) => {
        //     alert("contact " + row.getValue("name"));
        //   });
        // };

        return (
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Tooltip arrow title="Refresh Data">
              <IconButton onClick={() => refetch()}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>

            {/* <Button
              color="error"
              disabled={!table.getIsSomeRowsSelected()}
              onClick={handleDeactivate}
              variant="contained"
              size="small"
            >
              Delete
            </Button> */}

      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-standard-label">Ticket State</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={ticketType}
          defaultValue="unassigned"
          onChange={handleTicketType}
          label="Ticket State"
        >
          <MenuItem value="">
          </MenuItem>
          <MenuItem value={'unassigned'}>Unassigned</MenuItem>
          <MenuItem value={'assigned'}>Assigned</MenuItem>
        </Select>
      </FormControl>

      {/* <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-standard-label">Status</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={status}
          defaultValue="None"
          onChange={handleStatus}
          label="Gender"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={'queued'}>Queued</MenuItem>
          <MenuItem value={'in-progress'}>In-progress</MenuItem>
          <MenuItem value={'resolved'}>Resolved</MenuItem>
          <MenuItem value={'closed'}>Closed</MenuItem>
          <MenuItem value={'permanently-closed'}>Permanently-closed</MenuItem>
        </Select>
      </FormControl> */}
        </div>
        );
      }}

      // getPaginationRowModel={(props)=> console.log(props, "propppp")}
      // manualPagination
      // onPaginationChange={}
      // muiTablePaginationProps={}

      state={{
        isLoading,
        showAlertBanner: isError,
        showProgressBars: isFetching,
        pagination,
        rowSelection
      }}
      muiTableContainerProps={{ sx: { height: "75vh" } }}
    />
    </>
  )
}

Tickets.auth = true
Tickets.role = ['admin', 'subadmin', 'administrator']

export default Tickets