import React, { useMemo, useState } from "react";
import MaterialReactTable from "material-react-table";
import { useRouter } from 'next/router'
import { Avatar, Card, CardActions, CardContent, CardHeader, CardMedia, CircularProgress, Divider, Grid, IconButton, InputAdornment, Paper, Tab, Tooltip } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import axios from "axios";
import CheckIcon from '@mui/icons-material/Check';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import SearchIcon from '@mui/icons-material/Search';
import Input from '@mui/material/Input';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';



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
import { UserBalanceCard } from "../../src/components/dashboard/userBalanceCard";
import { UserBio } from "../../src/components/dashboard/userBio";
import { TabContext, TabList } from "@mui/lab";
import TabPanel from '@mui/lab/TabPanel';
import BaseCard from "../../src/components/baseCard/BaseCard";


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

  const { userid } = router.query


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


  const { data: userWallet } = useQuery(
    [
      "fetchUserWallet",
    ],
    async () => {
      const { data } = await axios.post(
        `https://vigoplace.com/server/api/admin/console/users/wallets`,
        // `http://localhost:3001/api/admin/console/users/wallets`,
        {
          userId: userid
        },
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

  const { data: userDetails, isError, isFetching, isLoading, refetch } = useQuery(
    [
      "fetchSingleUser",
    ],
    async () => {
      const { data } = await axios.get(
        `https://vigoplace.com/server/api/admin/console/user?userId=${userid}`,
        // `http://localhost:3001/api/admin/console/user?userId=${userid}`,
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

  const { data: userTransactions, isError:fetchTransError, isFetching: fetchingTransactions, isLoading: loadingTransactions, refetch:refetchTransactions } = useQuery(
    [
      "fetchSingleUserTransactions",
    ],
    async () => {
      const { data } = await axios.get(
        `https://vigoplace.com/server/api/admin/console/users/transactions?userId=${userid}`,
        // `http://localhost:3001/api/admin/console/users/transactions?userId=${userid}`,
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

  const columns = useMemo(
    () => [
     
      {
        accessorKey: "transactionType",
        enableClickToCopy: false,
        header: "Type",
      },
      {
        accessorKey: "transactionReference",
        enableClickToCopy: true,
        header: "Reference",
      },
      {
        accessorKey: "transactionStatus",
        enableClickToCopy: false,
        header: "Status",
      },
      {
        accessorKey: "transactionDescription",
        enableClickToCopy: false,
        header: "Description",
      },
      {
        accessorKey: "currency",
        enableClickToCopy: false,
        header: "Currency",
      },
      {
        accessorKey: "transactionTotal",
        enableClickToCopy: false,
        header: "Amount",
      },
      {
        accessorKey: "transactionDate",
        enableClickToCopy: false,
        header: "Date",
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

console.log({userDetails, userWallet, userTransactions}, 'userDetails')

  return (
    <>
        <Grid container spacing={0} >
      <Grid  item xs={12} lg={12} sx={{display: 'flex'}}>
        {/* <BaseCard title=""> */}
        <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: 'red' }} src={userDetails?.data?.user?.photo} aria-label="user image"/>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={userDetails?.data?.user?.fullname}
        subheader={userDetails?.data?.user?.email}
      />
      <CardMedia
        component="img"
        height="194"
        image={userDetails?.data?.user?.photo}
        alt="user profile picture"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
         <b>Phone:</b> {userDetails?.data?.user?.phone}
        </Typography>
        <Typography variant="body2" color="text.secondary">
         <b>User name:</b> {userDetails?.data?.user?.username}
        </Typography>
        <Typography variant="body2" color="text.secondary">
         <b>Address:</b> {userDetails?.data?.user?.address}
        </Typography>
        <Typography variant="body2" color="text.secondary">
         <b>BIO:</b> {userDetails?.data?.user?.bio}
        </Typography>

        <Divider variant="middle"/>

        <Typography align="center" marginTop={1} variant="body2" color="text.secondary">
         <b>Wallets</b> 
        </Typography>


          {
            userWallet ? userWallet?.data.map((wallet)=>(
              <>
              <Stack direction="row" spacing={2} marginBottom={2}>
              <Chip label={wallet.SCCurrency} size="small" variant="outlined" />
              <Typography align="center" marginTop={1} variant="body2" color="text.secondary">
                {wallet.SCSymbol} {wallet.WBalance}
              </Typography>   
            </Stack>
            </>

            )) : null
          }

      

      </CardContent>

    </Card>

    {/* <Divider orientation="horizontal" variant="middle"  /> */}


      </Grid>

    </Grid>

    <Typography align="center" marginTop={1} variant="h3" color="text.secondary">
         <b>Transactions</b> 
        </Typography>


    <MaterialReactTable
columns={columns}
data={userTransactions?.data ?? []}
// enableColumnFilterModes
// enableColumnOrdering
// enableGrouping
// enablePinning

// enableRowActions
enableStickyHeader
enableStickyFooter
// enableRowSelection
// manualPagination

// onPaginationChange={setPagination}
// rowCount={data?.count?.total ?? 0}
// onGlobalFilterChange={setGlobalFilter}
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

    
  );
};
Users.auth = true;
export default Users;
