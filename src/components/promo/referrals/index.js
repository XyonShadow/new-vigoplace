'use client'
import React, { useMemo, useState } from "react";
import MaterialReactTable from "material-react-table";
import { IconButton, Tooltip, Typography,   CircularProgress,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import axios from "axios";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { format } from "date-fns";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from "@mui/material/Alert";


import { useQuery, useMutation } from "@tanstack/react-query";
import { getSession, useSession } from "next-auth/react";
//Material-UI Imports
import { Box, Button, MenuItem } from "@mui/material";
import { useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';



const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const ReferralsComponet = ({ user }) => {
  const [status, setStatus] = React.useState("pending");
  const [userReferralstatus, setUserReferralstatus] = React.useState("pending");
  const [successAlert, setSuccessAlert] = React.useState(false);
  const [newSignupErrorAlert, setNewSignupErrorAlert] = React.useState(false);
  const [newUser, setNewUser] = React.useState({});
  const [userId, setUserId] = React.useState("");
  const [openConfirmNewSignupModal, setOpenConfirmNewSignupModal] =
    React.useState(false);
  const [columnFilters, setColumnFilters] = useState([]);
  const [openConfirmModal, setOpenConfirmModal] = React.useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [referralErrorAlert, setReferralErrorAlert] = React.useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [open, setOpen] = React.useState(false);


  const handleNewSignupRecharge = () => {
    rechargeNewSignupMutation.mutate({ userId }); // not done
  };

  const rechargeReferral = async ({ userId }) => {
    const notification = await axios.post(
      // "http://localhost:3001/api/admin/console/users/referral-recharge",
      "https://api.vigoplace.com/api/admin/console/users/referral-recharge",
      { userId },
      {
        headers: {
          Authorization: user?.token,
        },
      }
    );
    return notification;
  };

  const handleConfirmModalOpen = () => {
    setOpenConfirmNewSignupModal(true);
  };

  const rechargeReferralMutation = useMutation({
    mutationKey: ["rechargeReferral"],
    mutationFn: rechargeReferral,
    onSuccess: () => {
      setOpenConfirmNewSignupModal(false)
      setOpen(false)
      setSuccessAlert(true)
      queryClient.invalidateQueries("fetchReferrals");
    },
    onError: async (error) => {
      // setOpenToast(true);]
      console.log(error)
      setReferralErrorAlert(true)
    },
  });

   const { data: referrals, isError, isFetching, isLoading, refetch } = useQuery(
    [
      "fetchReferrals",
      columnFilters, //refetch when columnFilters changes
      globalFilter, //refetch when globalFilter changes
      pagination.pageIndex, //refetch when pagination.pageIndex changes
      pagination.pageSize, //refetch when pagination.pageSize changes
      status,
    ],

    async () => {
      const { data } = await axios.get(
        // `http://localhost:3001/api/admin/console/users/referrals?limit=${
        `https://api.vigoplace.com/api/admin/console/users/referrals?limit=${
          pagination.pageSize
        }&offset=${
          pagination.pageIndex * pagination.pageSize
        }&status=${status}`,
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
        console.log(err, "err fetching referrals");
      },
      enabled: !!user?.token,
    },
    { keepPreviousData: true }
  );

  const { data: userReferrals, isError: userReferralsError, isFetching:fetchingUserReferrals, isLoading:loadingUserReferrals, refetch: refetchUserReferrals } = useQuery(
    [
      "userReferrals",
      userId,
      userReferralstatus
    ],
    async () => {
      const { data } = await axios.get(
        // `http://localhost:3001/api/admin/console/users/referrals/${userId}?status=${userReferralstatus}`,
        `https://api.vigoplace.com/api/admin/console/users/referrals/${userId}?status=${userReferralstatus}`,
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



  const handleStatus = (event) => {
    setStatus(event.target.value);
    setPagination({
      pageIndex: 0,
      pageSize: 10,
    });
  };
  const handleUserReferralStatus = (event) => {
    setUserReferralstatus(event.target.value);
  };

  const handleConfirmModalClose = () => {
    setOpenConfirmModal(false);
  };
  const handleConfirmNewSignUpModalOpen = (row) => {
    setOpenConfirmNewSignupModal(true);
  };
  const handleConfirmNewSignUpModalClose = () => {
    setOpenConfirmNewSignupModal(false);
    setNewUser({});
  };
  const handleReferralModalOpen = () => {
    setOpen(true);
  };

  const handleReferralModalClose = () => {
    setOpen(false);
  };

  const descriptionElementRef = React.useRef(null);


  useEffect(() => {
    setPagination({ ...pagination, pageIndex: 0 });
  }, [columnFilters]);

  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => row.fullname,
        // accessorFn: (row) => `${row.fullname}`,
        id: "name", //id is still required when using accessorFn instead of accessorKey
        header: "Full Name",
        enableColumnFilter: false,
      },
      {
        accessorKey: "phone",
        enableClickToCopy: true,
        header: "Mobile",
        enableColumnFilter: false,
      },
      {
        accessorKey: "total",
        enableClickToCopy: false,
        header: "Total",
        enableColumnFilter: false,
      },
    ],
    []
  );
  const userReferralColumns = useMemo(
    () => [
      {
        accessorFn: (row) => row.referredUser,
        // accessorFn: (row) => `${row.fullname}`,
        id: "name", //id is still required when using accessorFn instead of accessorKey
        header: "Full Name",
        enableColumnFilter: false,
      },
      {
        accessorKey: "phone",
        enableClickToCopy: true,
        header: "Mobile",
        enableColumnFilter: false,
      },
      {
        accessorKey: "status",
        enableClickToCopy: false,
        header: "Status",
        enableColumnFilter: false,
      },
      {
        accessorKey: "amount",
        enableClickToCopy: false,
        header: "Amount",
        enableColumnFilter: false,
      },
      // {
      //   // accessorKey: "createdAt",
      //   accessorFn: (row) => format(new Date(row.createdAt), "Pp"),
      //   enableClickToCopy: false,
      //   header: "Date",
      //   enableColumnFilter: false,
      // },

    ],
    []
  );
  return (
    <>
     <Snackbar open={referralErrorAlert} autoHideDuration={6000} onClose={()=>setReferralErrorAlert(false)}>
        <Alert onClose={()=>setReferralErrorAlert(false)} severity="warning" sx={{ width: '100%' }}>
          {rechargeReferralMutation?.error?.response?.data?.message}
        </Alert>
      </Snackbar>

      <Snackbar open={successAlert} autoHideDuration={6000} onClose={()=>setSuccessAlert(false)}>
        <Alert onClose={()=>setSuccessAlert(false)} severity="success" sx={{ width: '100%' }}>
          "Airtime recharge Successful"
        </Alert>
      </Snackbar>

      <MaterialReactTable
            columns={columns}
            data={referrals?.data ?? []}
            getRowId={(row) => {
              return row.id;
            }}
            // enableColumnFilterModes
            // enableColumnOrdering
            // enableGrouping
            // enablePinning

            enableRowActions
            enableStickyHeader
            enableStickyFooter
            // enableRowSelection
            manualPagination
            onPaginationChange={setPagination}
            rowCount={referrals?.totalCount ?? 0}
            // onColumnFiltersChange={()=>{
            //   setColumnFilters
            // }}
            onColumnFiltersChange={setColumnFilters}
            onGlobalFilterChange={setGlobalFilter}
            initialState={{ showColumnFilters: true }}
            positionToolbarAlertBanner="bottom"
            enableGlobalFilter={false}
            muiTableBodyRowProps={({ row }) => ({
              //implement row selection click events manually
              onClick: () => setUserId(row.original.userId),
              // onClick: () =>
              //   setRowSelection((prev) => ({
              //     ...prev,
              //     [row.id]: !prev[row.id],
              //   })),
              selected: rowSelection[row.id],
              sx: {
                cursor: "pointer",
              },
            })}

            renderRowActions={({ row, table }) => (
              <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
                <Tooltip title="Details">
                <IconButton
                  color="primary"
                  onClick={() =>handleReferralModalOpen()}
                >
                  <MoreHorizIcon />
                </IconButton>
                </Tooltip>     
                     
                <Tooltip title="Details">
                <IconButton
                  color="primary"
                  onClick={() =>handleConfirmNewSignUpModalOpen(row.original)}
                >
                  <Button variant="outlined">Recharge</Button>
                </IconButton>
                </Tooltip>          
              </Box>
            )}
            muiToolbarAlertBannerProps={
              isError
                ? {
                    color: "error",
                    children:
                      "Error loading data, Please use the refresh button on the table to retry",
                  }
                : undefined
            }
            renderTopToolbarCustomActions={({ table, row }) => {
              // console.log(table.getIsSomeRowsSelected(), 'selebobo')
              // console.log(table.getIsAllRowsSelected(), 'selebobo2')
              // console.log(table.getRowModel().rows.length)

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
              const handleSelected = () => {
                const sortrows = Object.keys(rowSelection)
                  .filter((rowId) => rowSelection[rowId] === true)
                  .map((rowId) => {
                    if (rowSelection[rowId] === true) {
                      return {
                        fullname: table.getRow(rowId).original.fullname,
                        userId: rowId,
                      };
                    }
                    if (rowSelection[rowId] === false) {
                      return {};
                    }
                  });

                const joinArrays = (arrays, iteratee) => {
                  // create a map
                  const map = new Map();

                  // iterate the arrays we pass to the function
                  arrays.forEach((array) => {
                    // iterate the objects in each array
                    array.forEach((object) => {
                      // set a new key/value pair for each object
                      // { 'Bob' => { name: 'Bob', food: 'Pizza' } }
                      map.set(object[iteratee], object);
                    });
                  });

                  // return a new array from our map
                  return [...map.values()];
                };

                setContactUsers(joinArrays([contactUsers, sortrows], "userId"));
                setRowSelection({});
              };

              const handleContact = () => {
                table.getSelectedRowModel().flatRows.map((row) => {
                  alert("contact " + row.getValue("name"));
                });
              };

              return (
                <div
                  style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
                >
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
                      onChange={handleStatus}
                      label="Gender"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value={"pending"}>Pending</MenuItem>
                      <MenuItem value={"processing"}>Processing</MenuItem>
                      <MenuItem value={"completed"}>Completed</MenuItem>
                      <MenuItem value={"failed"}>Failed</MenuItem>
                    </Select>
                  </FormControl>

                </div>
              );
            }}
            positionActionsColumn="last"
            // manualPagination
            // onPaginationChange={}
            // muiTablePaginationProps={}

            state={{
              isLoading,
              showAlertBanner: isError,
              showProgressBars: isFetching,
              pagination,
              rowSelection,
            }}
            // enableColumnFilterModes
            muiTableContainerProps={{ sx: { height: "75vh" } }}
          />

          <Dialog
        open={open}
        TransitionComponent={Transition}
        onClose={handleReferralModalClose}
        fullWidth={true}
        maxWidth={"md"}
        // <MenuItem value="xs">xs</MenuItem>
        //         <MenuItem value="sm">sm</MenuItem>
        //         <MenuItem value="md">md</MenuItem>
        //         <MenuItem value="lg">lg</MenuItem>
        //         <MenuItem value="xl">xl</MenuItem>
        scroll={"paper"}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        width
      >
        <DialogTitle id="scroll-dialog-title">Referral Details</DialogTitle>
        <DialogContent dividers={true}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            <MaterialReactTable
            columns={userReferralColumns}
            data={userReferrals?.data ?? []}
            enableStickyHeader
            // initialState={{ showColumnFilters: true }}
            enableColumnActions={false}
      enableColumnFilters={false}
      enablePagination={false}
      enableSorting={false}
      enableBottomToolbar={false}
      enableTopToolbar={true}
            positionToolbarAlertBanner="bottom"
            renderRowActions={({ row, table }) => (
              <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
                <Tooltip title="Details">
                <IconButton
                  color="primary"
                  onClick={() =>handleReferralModalOpen()}
                >
                  <MoreHorizIcon />
                </IconButton>
                </Tooltip>          
              </Box>
            )}
            muiToolbarAlertBannerProps={
              isError
                ? {
                    color: "error",
                    children:
                      "Error loading data, Please use the refresh button on the table to retry",
                  }
                : undefined
            }
            renderTopToolbarCustomActions={({ table, row }) => {
              return (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  <Tooltip arrow title="Refresh Data">
                    <IconButton onClick={() => refetchNewSignups()}>
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
                      value={userReferralstatus}
                      defaultValue="None"
                      onChange={handleUserReferralStatus}
                      label="status"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value={"pending"}>Pending</MenuItem>
                      <MenuItem value={"processing"}>Processing</MenuItem>
                      <MenuItem value={"completed"}>Completed</MenuItem>
                      <MenuItem value={"failed"}>Failed</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              );
            }}
            state={{
              isLoading,
              showAlertBanner: isError,
              showProgressBars: isFetching,
            }}
            // muiTableContainerProps={{ sx: { height: "75vh" } }}
          />
             </DialogContentText>
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleReferralModalClose}>Cancel</Button>
          <Button onClick={handleReferralModalClose}>Subscribe</Button>
        </DialogActions> */}
      </Dialog>



      <Dialog
        open={openConfirmNewSignupModal}
        TransitionComponent={Transition}
        onClose={handleConfirmNewSignUpModalClose}
        fullWidth={true}
        maxWidth={"sm"}
        scroll={"paper"}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        width
      >
        <DialogTitle id="scroll-dialog-title">Recharge</DialogTitle>
        <DialogContent dividers={true}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >

          <Typography variant="h3">Confirm Recharge</Typography>
         
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleConfirmNewSignUpModalClose}>Cancel</Button>
          {/* <Button variant="contained" onClick={()=> console.log(userId)}>{ */}
          <Button variant="contained" onClick={()=> rechargeReferralMutation.mutate({userId: userId})}>{
            rechargeReferralMutation.isLoading ? ( <CircularProgress size={23} color="inherit" />): ('Recharge')
          }</Button>
        </DialogActions>
      </Dialog>  
    </>
  );
};
