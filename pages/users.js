import React, { useMemo, useState } from 'react';
import MaterialReactTable from 'material-react-table';
import { IconButton, Tooltip } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from "axios";
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import {getSession, useSession} from 'next-auth/react'
//Material-UI Imports
import {
  Box,
  Button,
  ListItemIcon,
  MenuItem,
  Typography,
  TextField
} from "@mui/material";

//Icons Imports
import { AccountCircle, Send } from "@mui/icons-material";

const Settings = () => {
  const getUser = useSession()
  const user = getUser?.data?.user

  console.log(getUser, 'user ooooooo')

  const { data, isError, isFetching, isLoading, refetch } = useQuery(
    [
      'table-data',
      // columnFilters,
      // globalFilter,
      // pagination.pageIndex,
      // pagination.pageSize,
      // sorting,
    ],
    // async () => {
    //   // const url = new URL(
    //   //   'localhost:3001/api/admin/console/users',
    //   //   process.env.NODE_ENV === 'production'
    //   //     ? 'https://www.material-react-table.com'
    //   //     : 'http://localhost:30001',
    //   // );
    //   const url = new URL('localhost:3001/api/admin/console/users');
    //   url.searchParams.set(
    //     'start',
    //     `${pagination.pageIndex * pagination.pageSize}`,
    //   );
    //   url.searchParams.set('size', `${pagination.pageSize}`);
    //   url.searchParams.set('filters', JSON.stringify(columnFilters ?? []));
    //   url.searchParams.set('globalFilter', globalFilter ?? '');
    //   url.searchParams.set('sorting', JSON.stringify(sorting ?? []));

    //   const response = await fetch(url.href);
    //   const json = await response.json();
    //   return json;

    // },
    async () => {
      const { data } = await axios.get(
        `https://vigoplace.com/server/api/admin/console/users`,
        // `http://localhost:3001/api/admin/console/users?gender=female`,
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
       console.log(err, 'err fetching users')
      },
      enabled: !!user?.token
    },
    { keepPreviousData: true },
  );

  const columns = useMemo(
    () => [
          {
            accessorFn: (row) => row.fullname,
            // accessorFn: (row) => `${row.fullname}`,
            id: "fullname", //id is still required when using accessorFn instead of accessorKey
            header: "Full Name",
            Cell: ({ cell, row }) => (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem"
                }}
              >
                <img
                  // alt={row.original.fullname}
                  height={30}
                  src={row.original.photo}
                  loading="lazy"
                  style={{ borderRadius: "50%" }}
                />
                <Typography>{cell.getValue()}</Typography>
              </Box>
            )
          },
          {
            accessorKey: "gender",
            enableClickToCopy: false,
            header: "Gender",
          },
          {
            accessorKey: "email",
            enableClickToCopy: true,
            header: "Email",
          },
          {
            accessorKey: "status",
            enableClickToCopy: false,
            header: "Status",
          },
          {
            accessorKey: "phone",
            enableClickToCopy: false,
            header: "Phone",
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

  return (
    <MaterialReactTable
      columns={columns}
      data={data?.data ?? []}
      // enableColumnFilterModes
      // enableColumnOrdering
      // enableGrouping
      // enablePinning
      enableRowActions
      enableRowSelection
      initialState={{ showColumnFilters: false }}
      positionToolbarAlertBanner="bottom"
      renderDetailPanel={({ row }) => (
        <>
        <Box
          sx={{
            display: "flex"
          }}
        >
        <Box
          sx={{
            marginRight: "20px"
          }}
        >
          <img
            alt="avatar"
            height={200}
            src={row.original.photo}
            loading="lazy"
            style={{ borderRadius: "50%" }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: ""
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            {/* <Typography variant="h2">Wallet :</Typography> */}
            <Typography variant="h4">
            </Typography>
          </Box>
        </Box>

        </Box>
        </>
      )}
      renderRowActionMenuItems={({ closeMenu }) => [
        <MenuItem
          key={0}
          onClick={() => {
            // View profile logic...
            closeMenu();
          }}
          sx={{ m: 0 }}
        >
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          View Profile
        </MenuItem>,
        <MenuItem
          key={1}
          onClick={() => {
            // Send email logic...
            closeMenu();
          }}
          sx={{ m: 0 }}
        >
          <ListItemIcon>
            <Send />
          </ListItemIcon>
          Send Email
        </MenuItem>
      ]}
      muiToolbarAlertBannerProps={
        isError
          ? {
              color: 'error',
              children: 'Error loading data, Please use the refresh button on the table to retry',
            }
          : undefined
      }
      renderTopToolbarCustomActions={({ table }) => {
        const handleDeactivate = () => {
          table.getSelectedRowModel().flatRows.map((row) => {
            alert("deactivating " + row.getValue("name"));
          });
        };

        const handleActivate = () => {
          table.getSelectedRowModel().flatRows.map((row) => {
            alert("activating " + row.getValue("name"));
          });
        };

        const handleContact = () => {
          table.getSelectedRowModel().flatRows.map((row) => {
            alert("contact " + row.getValue("name"));
          });
        };

        return (
          <div style={{ display: "flex", gap: "0.5rem" }}>
               <Tooltip arrow title="Refresh Data">
          <IconButton onClick={() => refetch()}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
            <Button
              color="error"
              disabled={!table.getIsSomeRowsSelected()}
              onClick={handleDeactivate}
              variant="contained"
            >
              Deactivate
            </Button>
            <Button
              color="success"
              disabled={!table.getIsSomeRowsSelected()}
              onClick={handleActivate}
              variant="contained"
            >
              Activate
            </Button>
            <Button
              color="info"
              disabled={!table.getIsSomeRowsSelected()}
              onClick={handleContact}
              variant="contained"
            >
              Contact
            </Button>
          </div>
        );
      }}
      state={{
        isLoading,
        showAlertBanner: isError,
        showProgressBars: isFetching,
      }}
    />
  );
};
Settings.auth = true
export default Settings;
