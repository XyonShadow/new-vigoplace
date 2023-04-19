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


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const NewUsersComponet = ({ user }) => {
  const [status, setStatus] = React.useState("pending");
  const [successAlert, setSuccessAlert] = React.useState(false);
  const [newSignupErrorAlert, setNewSignupErrorAlert] = React.useState(false);
  const [newUser, setNewUser] = React.useState({});
  const [userId, setUserId] = React.useState("");
  const [openConfirmNewSignupModal, setOpenConfirmNewSignupModal] =
    React.useState(false);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});

  const handleNewSignupRecharge = () => {
    rechargeNewSignupMutation.mutate({ userId }); // not done
  };

  const rechargeNewSignup = async ({ userId, creditNewUserId }) => {
    const notification = await axios.post(
      // "http://localhost:3001/api/admin/console/users/signup-recharge",
      "https://vigoplace.com/server/api/admin/console/users/signup-recharge",
      { userId, creditNewUserId },
      {
        headers: {
          Authorization: user?.token,
        },
      }
    );
    return notification;
  };

  const rechargeNewSignupMutation = useMutation({
    mutationKey: ["rechargeNewSignup"],
    mutationFn: rechargeNewSignup,
    onSuccess: () => {
      setOpenConfirmNewSignupModal(false);
      setSuccessAlert(true);
      queryClient.invalidateQueries("newSignups");
    },
    onError: async (error) => {
      console.log(error);
      setNewSignupErrorAlert(true);
    },
  });

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const handleStatus = (event) => {
    setStatus(event.target.value);
    setPagination({
      pageIndex: 0,
      pageSize: 10,
    });
  };

  const handleConfirmModalClose = () => {
    setOpenConfirmModal(false);
  };
  const handleConfirmNewSignUpModalOpen = (row) => {
    setNewUser({ userId: row.newUserId, creditNewUserId: row.newSignupId });
    setOpenConfirmNewSignupModal(true);
  };
  const handleConfirmNewSignUpModalClose = () => {
    setOpenConfirmNewSignupModal(false);
    setNewUser({});
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
      {
        // accessorKey: "createdAt",
        accessorFn: (row) => format(new Date(row.createdAt), "Pp"),
        enableClickToCopy: false,
        header: "Date",
        enableColumnFilter: false,
      },
    ],
    []
  );

  const {
    data: newSignups,
    isError: newSignupsError,
    isFetching: fetchingNewSignups,
    isLoading: loadingNewSignups,
    refetch: refetchNewSignups,
  } = useQuery(
    [
      "newSignups",
      status,
      columnFilters, //refetch when columnFilters changes
      globalFilter, //refetch when globalFilter changes
      pagination.pageIndex, //refetch when pagination.pageIndex changes
      pagination.pageSize, //refetch when pagination.pageSize changes
      sorting, //refetch when sorting changes
      status,
    ],
    async () => {
      const { data } = await axios.get(
        // `http://localhost:3001/api/admin/console/users/new-signups?limit=${
          `https://vigoplace.com/server/api/admin/console/users/new-signups?limit=${
          pagination.pageSize
        }&offset=${
          pagination.pageIndex * pagination.pageSize
        }&status=${status}`,
        // }${status !== "" || status !== null ? `&status=${status}` : ""}`,

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
        console.log(err, "err fetching new users");
      },
      enabled: !!user?.token,
    },
    { keepPreviousData: true }
  );

  return (
    <>
      <Snackbar
        open={newSignupErrorAlert}
        autoHideDuration={6000}
        onClose={() => setNewSignupErrorAlert(false)}
      >
        <Alert
          onClose={() => setNewSignupErrorAlert(false)}
          severity="warning"
          sx={{ width: "100%" }}
        >
          {rechargeNewSignupMutation?.error?.response?.data?.message}
        </Alert>
      </Snackbar>

      <Snackbar open={successAlert} autoHideDuration={6000} onClose={()=>setSuccessAlert(false)}>
        <Alert onClose={()=>setSuccessAlert(false)} severity="success" sx={{ width: '100%' }}>
          "Airtime recharge Successful"
        </Alert>
      </Snackbar>

      <MaterialReactTable
        columns={columns}
        data={newSignups?.data ?? []}
        getRowId={(row) => {
          return row.id;
        }}
        enableRowActions
        enableStickyHeader
        enableStickyFooter
        manualPagination
        onPaginationChange={setPagination}
        rowCount={newSignups?.totalCount ?? 0}
        onColumnFiltersChange={setColumnFilters}
        onGlobalFilterChange={setGlobalFilter}
        initialState={{ showColumnFilters: true }}
        positionToolbarAlertBanner="bottom"
        enableGlobalFilter={false}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}>
            <Tooltip title="Recharge User">
              <IconButton
                color="primary"
              >
                <Button 
                // disabled={row.original.status === "completed" || row.original.status === "processing" }
                variant="outlined"
                onClick={() => handleConfirmNewSignUpModalOpen(row.original)}
                >Recharge</Button>
              </IconButton>
            </Tooltip>
          </Box>
        )}
        muiToolbarAlertBannerProps={
          newSignupsError
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
        state={{
          isLoading: loadingNewSignups,
          isError: newSignupsError,
          showAlertBanner: newSignupsError,
          showProgressBars: fetchingNewSignups,
          pagination,
          rowSelection,
        }}
        muiTableContainerProps={{ sx: { height: "75vh" } }}
      />
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
          <Button variant="contained" onClick={()=> rechargeNewSignupMutation.mutate(newUser)}>{
            rechargeNewSignupMutation.isLoading ? ( <CircularProgress size={23} color="inherit" />): ('Recharge')
          }</Button>
        </DialogActions>
      </Dialog>  
    </>
  );
};
