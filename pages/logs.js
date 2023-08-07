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

function ActivityLogs() {
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

      // {
      //   accessorFn: (row) => new Date(row.startDate), //convert to Date for sorting and filtering
      //   id: "startDate",
      //   header: "Start Date",
      //   filterFn: "lessThanOrEqualTo",
      //   sortingFn: "datetime",
      //   Cell: ({ cell }) => cell.getValue()?.toLocaleDateString(), //render Date as a string
      //   Header: ({ column }) => <em>{column.columnDef.header}</em>, //custom header markup
      //   //Custom Date Picker Filter from @mui/x-date-pickers
      //   Filter: ({ column }) => (
      //     <LocalizationProvider dateAdapter={AdapterDayjs}>
      //       <DatePicker
      //         onChange={(newValue) => {
      //           column.setFilterValue(newValue);
      //         }}
      //         renderInput={(params) => (
      //           <TextField
      //             {...params}
      //             helperText={"Filter Mode: Lesss Than"}
      //             sx={{ minWidth: "120px" }}
      //             variant="standard"
      //           />
      //         )}
      //         value={column.getFilterValue()}
      //       />
      //     </LocalizationProvider>
      //   )
      // }
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
        `https://vigoplace.com/server/api/admin/console/logs?limit=${pagination.pageSize}&offset=${pagination.pageIndex * pagination.pageSize}`,
        // `http://localhost:3001/api/admin/console/logs?limit=${pagination.pageSize}&offset=${pagination.pageIndex * pagination.pageSize}`,
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
            </Button>
            <Button
              color="success"
              disabled={!table.getIsSomeRowsSelected()}
              onClick={handleContact}
              variant="contained"
              size="small"
            >
              Contact
            </Button>

            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-standard-label">Gender</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={gender}
          defaultValue="None"
          onChange={handleGender}
          label="Gender"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={'male'}>Male</MenuItem>
          <MenuItem value={'female'}>Female</MenuItem>
        </Select>
      </FormControl>

      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
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
          <MenuItem value={'active'}>Active</MenuItem>
          <MenuItem value={'inactive'}>Inactive</MenuItem>
          <MenuItem value={'blocked'}>Blocked</MenuItem>
          <MenuItem value={'deactivated'}>Deactivated</MenuItem>
        </Select>
      </FormControl>

      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-standard-label">Verified</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={isVerified}
          defaultValue="None"
          onChange={handleVerified}
          label="Gender"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={1}>Verified</MenuItem>
          <MenuItem value={0}>Unverified</MenuItem>
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
      }}
      muiTableContainerProps={{ sx: { height: "75vh" } }}
    />
  </>
  )
}
ActivityLogs.auth = true
export default ActivityLogs