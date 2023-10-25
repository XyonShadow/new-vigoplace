import React, { useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import {
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  Tab,
  Tooltip,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import RefreshIcon from "@mui/icons-material/Refresh";
import axios from "axios";
import CheckIcon from "@mui/icons-material/Check";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import SearchIcon from "@mui/icons-material/Search";
import Input from "@mui/material/Input";
import { useRouter } from "next/router";
import { format } from "date-fns";
import Link from "next/link";

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
import TabPanel from "@mui/lab/TabPanel";
import { useEffect } from "react";

import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import PropTypes from "prop-types";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Dialog from "@mui/material/Dialog";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import { blue } from "@mui/material/colors";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { toast } from "react-toast";

const emails = ["username@gmail.com", "user02@gmail.com"];

const Users = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const getUser = useSession();
  const user = getUser?.data?.user;
  const [value, setValue] = React.useState("1");
  const [walletId, setWalletId] = React.useState(null);

  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [gender, setGender] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [flagged, setFlagged] = React.useState("");
  const [isVerified, setIsverified] = React.useState("");
  const [wallet, setWallet] = React.useState("null");
  const [email, setEmail] = React.useState("");
  const [contactModal, setContactModal] = React.useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [contactUsers, setContactUsers] = useState([]);
  const [notificationText, setNotificationText] = useState("");
  const [datalenght, setDatalenght] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleGender = (event) => {
    setGender(event.target.value);
    setPagination({
      pageIndex: 0,
      pageSize: 10,
    });
  };
  const handleStatus = (event) => {
    setStatus(event.target.value);
    setPagination({
      pageIndex: 0,
      pageSize: 10,
    });
  };
  const handleVerified = (event) => {
    setIsverified(event.target.value);
    setPagination({
      pageIndex: 0,
      pageSize: 10,
    });
  };
  const handleWallet = (event) => {
    setWallet(event.target.value);
  };
  const handleFlagged = (event) => {
    setFlagged(event.target.value);
    setPagination({
      pageIndex: 0,
      pageSize: 10,
    });
  };

  const handleClose = (value) => {
    setContactModal(false);
  };

  const handleNotificationText = (event) => {
    setNotificationText(event.target.value);
  };
  const handleNotify = () => {
    const userIds = contactUsers.map((user) => user.userId);
    notifyUserMutation.mutate({ users: userIds, message: notificationText });
  };

  const blockUser = async (id) => {
    const blockedUser = await axios.post(
      // "http://localhost:3001/api/admin/console/users/block",
      "https://vigoplace.com/server/api/admin/console/users/block",
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
      "https://vigoplace.com/server/api/admin/console/users/unblock",
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

  const flagUser = async (id) => {
    const flaggedUser = await axios.post(
      // "http://localhost:3001/api/admin/console/users/flag",
      "https://vigoplace.com/server/api/admin/console/users/flag",
      { userId: id },
      {
        headers: {
          Authorization: user?.token,
        },
      }
    );
    return flaggedUser;
  };

  const flagUserMutation = useMutation({
    mutationKey: ["flagUser"],
    mutationFn: flagUser,
    onSuccess: () => {
      queryClient.invalidateQueries("fetchUsers");
    },
    onError: async (error) => {
      // setOpenToast(true);
    },
  });

  const unflagUser = async (id) => {
    const unflaggedUser = await axios.post(
      // "http://localhost:3001/api/admin/console/users/unflag",
      "https://vigoplace.com/server/api/admin/console/users/unflag",
      { userId: id },
      {
        headers: {
          Authorization: user?.token,
        },
      }
    );
    return unflaggedUser;
  };

  const unflagUserMutation = useMutation({
    mutationKey: ["unflagUser"],
    mutationFn: unflagUser,
    onSuccess: () => {
      queryClient.invalidateQueries("fetchUsers");
    },
    onError: async (error) => {
      // setOpenToast(true);
    },
  });

  const notifyUser = async ({ users, message }) => {
    const notification = await axios.post(
      // "http://localhost:3001/api/notifications",
      "https://vigoplace.com/server/api/notifications",
      { users, message },
      {
        headers: {
          Authorization: user?.token,
        },
      }
    );

    if (notification.status === 200) {
      toast.success(notification.data.message);
    }

    return notification;
  };

  const notifyUserMutation = useMutation({
    mutationKey: ["notifyUser"],
    mutationFn: notifyUser,
    onSuccess: () => {
      setNotificationText("");
      handleClose();
    },
    onError: async (error) => {
      // setOpenToast(true);
    },
  });

  const postNoDebit = async (id) => {
    const postNoDebitUser = await axios.post(
      // "http://localhost:3001/api/admin/console/users/block",
      "https://vigoplace.com/server/api/admin/console/post-no-debit",
      { userId: id.toString(), status: "suspend" },
      {
        headers: {
          Authorization: user?.token,
        },
      }
    );
    return postNoDebitUser;
  };

  const postNoDebitMutation = useMutation({
    mutationKey: ["postNoDebitUser"],
    mutationFn: postNoDebit,
    onSuccess: () => {
      queryClient.invalidateQueries("fetchUsers");
    },
    onError: async (error) => {
      console.log("Error:", error);
      if (error.response) {
        console.log("Response Data:", error.response.data);
      }
    },
  });

  const postYesDebit = async (id) => {
    const postYesDebitUser = await axios.post(
      // "http://localhost:3001/api/admin/console/users/block",
      "https://vigoplace.com/server/api/admin/console/post-no-debit",
      { userId: id.toString(), status: "activate" },
      {
        headers: {
          Authorization: user?.token,
        },
      }
    );
    return postYesDebitUser;
  };

  const postYesDebitMutation = useMutation({
    mutationKey: ["postYesDebitUser"],
    mutationFn: postYesDebit,
    onSuccess: () => {
      queryClient.invalidateQueries("fetchUsers");
    },
    onError: async (error) => {
      console.log("Error:", error);
      if (error.response) {
        console.log("Response Data:", error.response.data);
      }
    },
  });

  useEffect(() => {
    setPagination({ ...pagination, pageIndex: 0 });
  }, [columnFilters]);

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
      isVerified,
      flagged,
      wallet,
    ],
    async () => {
      const { data } = await axios.get(
        `https://vigoplace.com/server/api/admin/console/users?limit=${10000000000}&walletCurrencyId=${wallet}${
          gender !== "" ? `&gender=${gender}` : ""
        }${status !== "" ? `&status=${status}` : ""}${
          flagged !== "" ? `&flagged=${flagged}` : ""
        }${isVerified !== "" ? `&isVerified=${isVerified}` : ""}${
          columnFilters?.length >= 1
            ? `&search=${JSON.stringify(columnFilters)}`
            : ""
        }`,
        {
          headers: {
            Authorization: user?.token,
          },
        }
      );

      setDatalenght(data?.count?.total);

      const sortedData = data?.data?.sort(
        (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );

      const paginatedData = sortedData.slice(
        pagination.pageIndex * pagination.pageSize,
        (pagination.pageIndex + 1) * pagination.pageSize
      );

      return paginatedData;
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
            {row.original.photo ? (
              <img
                // alt={row.original.fullname}
                height={30}
                src={row.original.photo}
                loading="lazy"
                style={{ borderRadius: "50%" }}
              />
            ) : (
              <AccountCircleIcon sx={{ fontSize: "33px" }} />
            )}

            <Typography>{cell.getValue()}</Typography>
          </Box>
        ),
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
        enableColumnFilter: false,
      },
      {
        // accessorKey: "createdAt",
        accessorFn: (row) => {
          if (row?.createdAt) {
            return format(new Date(row.createdAt), "MM/dd/yyyy hh:mm a");
          } else {
            return "";
          }
        },
        enableClickToCopy: false,
        header: "Joined",
        enableColumnFilter: false,
      },
      {
        accessorKey: "gender",
        enableClickToCopy: false,
        enableColumnFilter: false,
        header: "Gender",
      },

      {
        accessorKey: "phone",
        enableClickToCopy: false,
        enableColumnFilter: false,
        header: "Phone",
      },

      {
        accessorKey: "postNoDebit",
        enableClickToCopy: false,
        enableColumnFilter: false,
        header: "Wallet Status",
        Cell: ({ cell }) => (
          <span>
            {cell.getValue() === 1
              ? "Suspended"
              : cell.getValue() === 0
              ? "Active"
              : "Unknown"}
          </span>
        ),
      },
    ],
    []
  );

  function SimpleDialog(props) {
    const { onClose, selectedValue, open } = props;

    const handleClose = () => {
      onClose(selectedValue);
    };

    const handleListItemClick = (value) => {
      onClose(value);
    };

    return (
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Set backup account</DialogTitle>
        <List sx={{ pt: 0 }}>
          {emails.map((email) => (
            <ListItem disableGutters>
              <ListItemButton
                onClick={() => handleListItemClick(email)}
                key={email}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={email} />
              </ListItemButton>
            </ListItem>
          ))}

          <ListItem disableGutters>
            <ListItemButton
              autoFocus
              onClick={() => handleListItemClick("addAccount")}
            >
              <ListItemAvatar>
                <Avatar>
                  <AddIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Add account" />
            </ListItemButton>
          </ListItem>
        </List>
      </Dialog>
    );
  }

  SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedValue: PropTypes.string.isRequired,
  };

  if (user?.adminType === "sub-admin") {
    return (
      <section className="flex items-center justify-center">
        <p className="font-bold text-black">
          Sorry, you do not have permission to view this page
        </p>
      </section>
    );
  }

  return (
    <>
      <MaterialReactTable
        columns={columns}
        data={data ?? []}
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
        rowCount={datalenght ?? 0}
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
          onClick: () =>
            setRowSelection((prev) => ({
              ...prev,
              [row.id]: !prev[row.id],
            })),
          selected: rowSelection[row.id],
          sx: {
            cursor: "pointer",
          },
        })}
        renderDetailPanel={({ row }) => {
          // setWalletId(row.original.id)
          // getUserWalletMutation.mutate(row.original.id)
          return (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
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
                  <UserBio usersBio={row.original.bio} />
                  {/* <UserBalanceCard /> */}
                </Box>
              </Box>
            </>
          );
        }}
        renderRowActionMenuItems={({ closeMenu, row, table }) => {
          const handleDeactivate = () => {
            blockMutation.mutate(row.original.id);
          };

          const handleActivate = () => {
            // console.log(row.getValue("fullname"), "name");
            unblockMutation.mutate(row.original.id);
          };

          const handleFlag = () => {
            flagUserMutation.mutate(row.original.id);
          };
          const handleUnFlag = () => {
            unflagUserMutation.mutate(row.original.id);
          };

          const handlePostNoDebit = () => {
            postNoDebitMutation.mutate(row.original.id);
          };

          const handlePostYesDebit = () => {
            postYesDebitMutation.mutate(row.original.id);
          };

          return [
            <MenuItem
              key={0}
              // onClick={handleDeactivate}
              // onClick={() => handleDeactivate()}
              sx={{ m: 0 }}
            >
              {row.original?.status !== "blocked" ? (
                <Button
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
                </Button>
              ) : (
                <Button
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
                </Button>
              )}
            </MenuItem>,
            <MenuItem
              key={1}
              // onClick={handleDeactivate}
              // onClick={() => handleDeactivate()}
              sx={{ m: 0 }}
            >
              {row.original?.flagged ? (
                <Button
                  onClick={() => handleUnFlag()}
                  color="error"
                  // disabled={!table.getIsSomeRowsSelected('fullname')}
                  variant="contained"
                >
                  {blockMutation.isLoading ? (
                    <CircularProgress size={23} color="inherit" />
                  ) : (
                    "unflag"
                  )}
                  {/* {table.getRow().getValue()} */}
                </Button>
              ) : (
                <Button
                  onClick={() => handleFlag()}
                  color="success"
                  // disabled={!table.getIsSomeRowsSelected('fullname')}
                  variant="contained"
                >
                  {unblockMutation.isLoading ? (
                    <CircularProgress size={23} color="inherit" />
                  ) : (
                    "flag"
                  )}
                  {/* {table.getRow().getValue()} */}
                </Button>
              )}
            </MenuItem>,

            <MenuItem key={2}>
              {row.original?.postNoDebit ? (
                <Button
                  onClick={() => handlePostYesDebit()}
                  color="success"
                  variant="contained"
                >
                  {postYesDebitMutation.isLoading ? (
                    <CircularProgress size={23} color="inherit" />
                  ) : (
                    "Activate Wallet"
                  )}
                </Button>
              ) : (
                <Button
                  onClick={() => handlePostNoDebit()}
                  color="error"
                  variant="contained"
                >
                  {postNoDebitMutation.isLoading ? (
                    <CircularProgress size={23} color="inherit" />
                  ) : (
                    "Lien Wallet"
                  )}
                </Button>
              )}
            </MenuItem>,

            <MenuItem
              key={3}
              onClick={() => {
                // View profile logic...
                router.push(`/user/${row.original.id}`);
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

            <MenuItem
              key={4}
              // onClick={() => {
              //   // View profile logic...
              //   router.push(`/user/${row.original.id}`)
              //   closeMenu();
              // }}
              sx={{ m: 0 }}
            >
              <Button
                color="success"
                // disabled={!table.getIsSomeRowsSelected('fullname')}
                variant="contained"
              >
                <Link
                  target="_blank"
                  href={`https://web.vigoplace.com/profile/${row.original.id}?adt=${user?.token}`}
                >
                  vigoplace web profile
                </Link>
                {/* <Link target="_blank"  href={`http://localhost:3002/profile/${row.original.id}?adt=${user?.token}`}>vigoplace web profile</Link> */}
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
        renderTopToolbarCustomActions={({ table, row }) => {
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
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
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
            </Button> */}

              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-standard-label">
                  Gender
                </InputLabel>
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
                  <MenuItem value={"male"}>Male</MenuItem>
                  <MenuItem value={"female"}>Female</MenuItem>
                </Select>
              </FormControl>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-standard-label">
                  Flagged
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={flagged}
                  // value={flagged ? "Flagged Users" : "Unflagged Users"}
                  defaultValue="all Users"
                  onChange={handleFlagged}
                  label="Flagged"
                >
                  <MenuItem value="">
                    <em>All Users</em>
                  </MenuItem>
                  <MenuItem value={1}>Flagged Users</MenuItem>
                  <MenuItem value={0}>Unflagged Users</MenuItem>
                </Select>
              </FormControl>

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
                  <MenuItem value={"active"}>Active</MenuItem>
                  <MenuItem value={"inactive"}>Inactive</MenuItem>
                  <MenuItem value={"blocked"}>Blocked</MenuItem>
                  <MenuItem value={"deactivated"}>Deactivated</MenuItem>
                </Select>
              </FormControl>

              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-standard-label">
                  Verified
                </InputLabel>
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

              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-standard-label">
                  Wallet
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={wallet}
                  defaultValue={wallet}
                  onChange={handleWallet}
                  label="Wallet"
                >
                  <MenuItem value={"null"}>NONE</MenuItem>
                  <MenuItem value={175}>NGN</MenuItem>
                  <MenuItem value={251}>USD</MenuItem>
                </Select>
              </FormControl>

              <Box width={"100%"}>
                <FormControl
                  variant="standard"
                  sx={{
                    m: 1,
                    minWidth: 120,
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: "20px",
                  }}
                >
                  <Autocomplete
                    sx={{ minWidth: "50%" }}
                    key={contactUsers}
                    multiple
                    limitTags={7}
                    options={contactUsers || []}
                    defaultValue={contactUsers}
                    autoComplete={true}
                    getOptionLabel={(option) => option.fullname}
                    id="combo-box-demo"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        // label="select users to notify"
                        placeholder="selected users to notify"
                      />
                    )}
                  />

                  <Button
                    color="primary"
                    onClick={() => setContactModal(!contactModal)}
                    variant="contained"
                    size="medium"
                  >
                    Send Notification
                  </Button>
                </FormControl>

                {/* <SimpleDialog
                open={contactModal}
                onClose={handleClose}
              /> */}

                <Dialog
                  open={contactModal}
                  onClose={handleClose}
                  fullWidth
                  maxWidth={"md"}
                >
                  <DialogContent>
                    <DialogContentText>
                      Enter Notification Text
                    </DialogContentText>
                    <TextField
                      autoFocus
                      margin="normal"
                      id="name"
                      label="Enter Notification Text"
                      type="email"
                      fullWidth
                      variant="standard"
                      multiline
                      onChange={handleNotificationText}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleNotify}>
                      {notifyUserMutation.isLoading ? (
                        <CircularProgress size={23} color="inherit" />
                      ) : (
                        "Notify"
                      )}
                    </Button>
                  </DialogActions>
                </Dialog>
              </Box>

              {table.getIsSomeRowsSelected() ? (
                <Button
                  color="success"
                  onClick={() => handleSelected()}
                  variant="contained"
                  size="small"
                >
                  Add to Notification List
                </Button>
              ) : null}
            </div>
          );
        }}
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
    </>
  );
};
Users.auth = true;
export default Users;
