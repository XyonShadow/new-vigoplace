import React, { useMemo, useState } from "react";
import MaterialReactTable from "material-react-table";
import { CircularProgress, IconButton, InputAdornment, Paper, Tab, Tooltip } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import axios from "axios";
import CheckIcon from '@mui/icons-material/Check';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import SearchIcon from '@mui/icons-material/Search';
import Input from '@mui/material/Input';
import { useRouter } from 'next/router'



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

//Icons Imports
import { AccountCircle, Send } from "@mui/icons-material";
import { UserBalanceCard } from "../src/components/dashboard/userBalanceCard";
import { UserBio } from "../src/components/dashboard/userBio";
import { TabContext, TabList } from "@mui/lab";
import TabPanel from '@mui/lab/TabPanel';
import { useEffect } from "react";


const Users = () => {
  const router = useRouter()
  const queryClient = useQueryClient();
  const getUser = useSession();
  const user = getUser?.data?.user;
  const [value, setValue] = React.useState('1');
  const [walletId, setWalletId] = React.useState(null);

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
  const [email, setEmail] = React.useState('');


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleGender = (event) => {
    setGender(event.target.value);
    setPagination({
      pageIndex: 0,
      pageSize: 10,
    })
  };
  const handleStatus = (event) => {
    setStatus(event.target.value);
    setPagination({
      pageIndex: 0,
      pageSize: 10,
    })
  };
  const handleVerified = (event) => {
    console.log({eventt: event.target.value});
    setIsverified(event.target.value);
    setPagination({
      pageIndex: 0,
      pageSize: 10,
    })
  };


  const blockUser = async (id) => {
    const blockedUser = await axios.post(
      // "http://localhost:3001/api/admin/console/users/block",
      'https://vigoplace.com/server/api/admin/console/users/block',
      { userId: id },
      {
        headers: {
          Authorization: user?.token,
        },
      }
    );
    return blockedUser;
  };

  const blockMutation = useMutation({
    mutationKey: ["blockUser"],
    mutationFn: blockUser,
    onSuccess: () => {
      queryClient.invalidateQueries("fetchUsers");
    },
    onError: async (error) => {
      // setOpenToast(true);
    },
  });

  const unblockUser = async (id) => {
    const unblockedUser = await axios.post(
      // "http://localhost:3001/api/admin/console/users/unblock",
      'https://vigoplace.com/server/api/admin/console/users/unblock',
      { userId: id },
      {
        headers: {
          Authorization: user?.token,
        },
      }
    );
    return unblockedUser;
  };

  const unblockMutation = useMutation({
    mutationKey: ["unblockUser"],
    mutationFn: unblockUser,
    onSuccess: () => {
      queryClient.invalidateQueries("fetchUsers");
    },
    onError: async (error) => {
      // setOpenToast(true);
    },
  });

  useEffect(() => {
    setPagination({...pagination, pageIndex: 0})
  }, [columnFilters])
  

  // const getUserWallet = async (id) => {
  //   const wallet = await axios.post(
  //     "http://localhost:3001/api/admin/console/users/wallets",
  //     // 'https://vigoplace.com/server/api/admin/console/approvepayout'
  //     { userId: id },
  //     {
  //       headers: {
  //         Authorization: user?.token,
  //       },
  //     }
  //   );
  //   return wallet;
  // };

  // const getUserWalletMutation = useMutation({
  //   mutationKey: ["userWallet"],
  //   mutationFn: getUserWallet,
  //   // onSuccess: () => {
  //   //   queryClient.invalidateQueries("fetchUsers");
  //   // },
  //   onError: async (error) => {
  //     // setOpenToast(true);
  //   },
  // });

  // console.log(getUserWalletMutation.data, 'data me abeg')

  const { data, isError, isFetching, isLoading, refetch } = useQuery(
    [
      "fetchUsers",
      columnFilters, //refetch when columnFilters changes
      globalFilter, //refetch when globalFilter changes
      pagination.pageIndex, //refetch when pagination.pageIndex changes
      pagination.pageSize, //refetch when pagination.pageSize changes
      sorting, //refetch when sorting changes
      gender,
      status,
      isVerified
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
        `https://vigoplace.com/server/api/admin/console/users?limit=${pagination.pageSize}&offset=${pagination.pageIndex * pagination.pageSize}${gender !=='' ? `&gender=${gender}`:''}${status !=='' ? `&status=${status}`:''}${isVerified !=='' ? `&isVerified=${isVerified}`:''}${columnFilters?.length >=1 ?`&search=${JSON.stringify(columnFilters)}`:''}`,
        // `http://localhost:3001/api/admin/console/users?limit=${pagination.pageSize}&offset=${pagination.pageIndex * pagination.pageSize}${gender !=='' ? `&gender=${gender}`:''}${status !=='' ? `&status=${status}`:''}${isVerified !=='' ? `&isVerified=${isVerified}`:''}${columnFilters?.length >=1 ? `&search=${JSON.stringify(columnFilters)}`:''}`,
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

  // const { data: wallet, isLoading: walletLoading } = useQuery(
  //   [
  //     "fetchUserWallet",
  //     walletId,
  //   ],
  //   async () => {
  //     const { data } = await axios.get(
  //       // `https://vigoplace.com/server/api/admin/console/users`,
  //       `http://localhost:3001/api/admin/console/users/wallets`,
  //       {
  //         headers: {
  //           Authorization: user?.token,
  //         },
  //       }
  //     );

  //     return data;
  //   },
  //   {
  //     onError: (err) => {
  //       console.log(err, "err fetching users");
  //     },
  //     enabled: !!user?.token,
  //   },
  //   { keepPreviousData: true }
  // );

  // console.log({walletId, wallet});

  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => row.fullname,
        // accessorFn: (row) => `${row.fullname}`,
        id: "name", //id is still required when using accessorFn instead of accessorKey
        header: "Full Name",
        Cell: ({ cell, row }) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            {
              row.original.photo ? (<img
                // alt={row.original.fullname}
                height={30}
                src={row.original.photo}
                loading="lazy"
                style={{ borderRadius: "50%" }}
              />) : (<AccountCircleIcon sx={{fontSize: '33px'}}/>)
            }
            
            <Typography>{cell.getValue()}</Typography>
          </Box>
        ),
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
      enableStickyHeader
      enableStickyFooter
      enableRowSelection
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

      renderDetailPanel={({ row }) => { 
        // setWalletId(row.original.id)
        // getUserWalletMutation.mutate(row.original.id)
      return (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start"
            }}
          >

            <Box
              sx={{
                marginRight: "20px",
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
                alignItems: "center",
              }}
            >
              <UserBio usersBio={row.original.bio}/>
              {/* <UserBalanceCard /> */}
            </Box>

          {/* <Box
              sx={{
                // display: "flex",
                // justifyContent: "space-between",
                // alignItems: "center",
                width: '100%', typography: 'body1'
              }}
            >
            <TabContext value={value}>
  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
    <TabList onChange={handleChange} aria-label="lab API tabs example">
      <Tab label="Dollar" value="1" />
      <Tab label="Naira" value="2" />
    </TabList>
  </Box>
  <TabPanel value="1">
     <Typography variant="h4">Balance: $ 30000</Typography>
  </TabPanel>
  <TabPanel value="2">Item Two</TabPanel>
</TabContext>
            </Box> */}

            </Box>

        </>
      )}}

      renderRowActionMenuItems={({ closeMenu, row, table }) => {
        // console.log(table.getSelectedRowModel().flatRows[0]?.getValue('fullname'), 'table')

        const handleDeactivate = () => {
          console.log(row.original, "orig");
          blockMutation.mutate(row.original.id);
        };

        const handleActivate = () => {
          console.log(row.getValue("fullname"), "name");
          unblockMutation.mutate(row.original.id);
        };

        return [
          
              <MenuItem
                key={0}
                // onClick={handleDeactivate}
                // onClick={() => handleDeactivate()}
                sx={{ m: 0 }}
              >
                {
                  row.original?.status !== "blocked" ? ( <Button
                    onClick={() => handleDeactivate()}
                    color="error"
                    // disabled={!table.getIsSomeRowsSelected('fullname')}
                    variant="contained"
                  >
                    {blockMutation.isLoading ? (
                      <CircularProgress size={23} color="inherit" />
                    ) : (
                      "Block"
                    )}
                    {/* {table.getRow().getValue()} */}
                  </Button>) : (    <Button
                  onClick={() => handleActivate()}
          color="success"
          // disabled={!table.getIsSomeRowsSelected('fullname')}
          variant="contained"
        >
          {unblockMutation.isLoading ? (
            <CircularProgress size={23} color="inherit" />
          ) : (
            "Unblock"
          )}
          {/* {table.getRow().getValue()} */}
        </Button>)
                }
               
              </MenuItem>
            ,

          <MenuItem
            key={1}
            onClick={() => {
              // View profile logic...
              router.push(`/user/${row.original.id}`)
              closeMenu();
            }}
            sx={{ m: 0 }}
          >
            <Button
              color="success"
              // disabled={!table.getIsSomeRowsSelected('fullname')}
              variant="contained"
            >
              View full Profile
            </Button>
          </MenuItem>,
        ];
      }}

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
        const handleDeactivate = () => {
          table.getSelectedRowModel().flatRows.map((row) => {
            alert("deactivating " + row.getValue("fullname"));
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
      </FormControl>

      {/* <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
          <InputLabel htmlFor="standard-adornment-password">Email</InputLabel>
          <Input
            id="standard-adornment-password"
            type={'text'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton

                  aria-label="search"
                  // onClick={handleClickShowPassword}
                  // onMouseDown={handleMouseDownPassword}
                >
                 <SearchIcon />
                </IconButton>
              </InputAdornment>
            }
          />
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
  );
};
Users.auth = true;
export default Users;
