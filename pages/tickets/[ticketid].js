import React, { useMemo, useState } from "react";
import MaterialReactTable from "material-react-table";
import { useRouter } from "next/router";
import { format } from "date-fns"
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  CircularProgress,
  IconButton,
  InputAdornment,
  Tab,
  Tooltip,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import axios from "axios";
import CheckIcon from "@mui/icons-material/Check";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import SearchIcon from "@mui/icons-material/Search";
import Input from "@mui/material/Input";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import MuiAlert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import Snackbar from "@mui/material/Snackbar";
import SendIcon from "@mui/icons-material/Send";
import { Avatar, Grid, Typography, List, Paper, Divider, TextField, ListItem, ListItemIcon, ListItemText, Fab, useMediaQuery,  ImageList, ImageListItem } from '@mui/material';



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
  MenuItem,
} from "@mui/material";

//Icons Imports
import { AccountCircle, Send } from "@mui/icons-material";
import { UserBalanceCard } from "../../src/components/dashboard/userBalanceCard";
import { UserBio } from "../../src/components/dashboard/userBio";
import { LoadingButton, TabContext, TabList } from "@mui/lab";
import BaseCard from "../../src/components/baseCard/BaseCard";
import { Container } from "@mui/system";


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function srcset(image, size, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${size * cols}&h=${
      size * rows
    }&fit=crop&auto=format&dpr=2 2x`,
  };
}

const SingleTicket = () => {
  const router = useRouter();
  const { ticketid } = router.query;
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
  const [creditSuccessToast, setCreditSuccessToast] = React.useState(false);
  const [creditErrorToast, setCreditErrorToast] = React.useState(false);
  const [debitSuccessToast, setDebitSuccessToast] = React.useState(false);
  const [debitErrorToast, setDebitErrorToast] = React.useState(false);
  const sm = useMediaQuery((theme) => theme.breakpoints.down("sm"));



  const [status, setStatus] = React.useState("");
  const [isVerified, setIsverified] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [tabValue, setTabValue] = React.useState(0);
  const [creditDetails, setCreditDetails] = useState({
    amount: "",
    approvalPin: "",
  });
  const [debitDetails, setDebitDetails] = useState({
    amount: "",
    approvalPin: "",
  });
  const [showAttachments, setShowAttachments] = useState(false);
  

  /* ******* onchange functions ********** */

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCreditChange = (event) => {
    setCreditDetails({
      ...creditDetails,
      [event.target.name]: event.target.value,
    });
  };

  const handleDebitChange = (event) => {
    setDebitDetails({
      ...debitDetails,
      [event.target.name]: event.target.value,
    });
  };

  const handleWalletIdChange = (event) => {
    setWalletId(event.target.value);
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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  /* ************* Queries *************** */
  const {
    data: messages,
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useQuery(
    ["fetchTicketMessages"],
    async () => {
      const { data } = await axios.get(
        `https://vigoplace.com/server/api/admin/ticket/messages/${ticketid}`,
        // `http://localhost:3001/api/admin/ticket/messages/${ticketid},
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

  const {
    data: ticket,
    isError: getTicketError,
    isFetching: getTicketFetching,
    isLoading: getTicketLoading,
    refetch: refetchTicket,
  } = useQuery(
    ["fetchTicket"],
    async () => {
      const { data } = await axios.get(
        `https://vigoplace.com/server/api/admin/ticket/${ticketid}`,
        // `http://localhost:3001/api/admin/ticket/${ticketid},
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
        console.log(err, "err fetching ticket");
      },
      enabled: !!user?.token,
    },
    { keepPreviousData: true }
  );

  const {
    data: userDetails,
  } = useQuery(
    ["fetchSingleUser"],
    async () => {
      const { data } = await axios.get(
        `https://vigoplace.com/server/api/admin/console/user?userId=${ticket?.data.userId}`,
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
      enabled: !!ticket?.data?.userId,
    },
    { keepPreviousData: true }
  );

  /* ********** Mutations *************** */

  const chat = async (id) => {
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

  // const unblockMutation = useMutation({
  //   mutationKey: ["unblockUser"],
  //   mutationFn: unblockUser,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries("fetchUsers");
  //   },
  //   onError: async (error) => {
  //     // setOpenToast(true);
  //   },
  // });



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
        // accessorKey: "transactionTotal",
        id: "transactionTotal",
        accessorFn: (row) => row.transactionNetTotal.toLocaleString("en-US"),
        enableClickToCopy: false,
        header: "Amount",
      },
      {
        // accessorKey: "transactionDate",
        accessorFn: (row) => format(new Date(row.transactionDate), "Pp"),
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

  const handleCreditSuccessToastClose = (event, reason) => {
    setCreditSuccessToast(false);
  };
  const handleCreditErrorToastClose = (event, reason) => {
    setCreditErrorToast(false);
  };

  const handleDebitSuccessToastClose = (event, reason) => {
    setDebitSuccessToast(false);
  };
  const handleDebitErrorToastClose = (event, reason) => {
    setDebitErrorToast(false);
  };

  return (
    <>
      {/* <Snackbar TransitionComponent={Slide} open={creditSuccessToast} autoHideDuration={6000} onClose={handleCreditSuccessToastClose}>
        <Alert onClose={handleCreditSuccessToastClose} severity="success" sx={{ width: '100%' }}>
          {creditUserMutation?.data?.data?.message}
        </Alert>
    </Snackbar>

    <Snackbar TransitionComponent={Slide} open={creditErrorToast} autoHideDuration={6000} onClose={handleCreditErrorToastClose}>
        <Alert onClose={handleCreditErrorToastClose} severity="warning" sx={{ width: '100%' }}>
          {creditUserMutation?.error?.response?.data?.message}
        </Alert>
    </Snackbar>


    <Snackbar TransitionComponent={Slide} open={debitSuccessToast} autoHideDuration={6000} onClose={handleDebitSuccessToastClose}>
        <Alert onClose={handleDebitSuccessToastClose} severity="success" sx={{ width: '100%' }}>
          {debitUserMutation?.data?.data?.message}
        </Alert>
    </Snackbar>

    <Snackbar TransitionComponent={Slide} open={debitErrorToast} autoHideDuration={6000} onClose={handleDebitErrorToastClose}>
        <Alert onClose={handleDebitErrorToastClose} severity="warning" sx={{ width: '100%' }}>
          {debitUserMutation?.error?.response?.data?.message}
        </Alert>
    </Snackbar> */}

{/* attachments */}
<Typography variant="h1" marginBottom={2}><b>Attachments:</b> <Button onClick={()=> setShowAttachments(!showAttachments)} variant="outlined" color="success">{showAttachments? "Hide" : "Show"}</Button></Typography> 

{
  showAttachments && (<Grid container spacing={0}>
    <Grid item xs={12} lg={12}>
      <BaseCard title="Attachments">
        <ImageList
          // sx={{ height: 450 }}
          variant="quilted"
          cols={4}
          // rowHeight={121}
        >
          { ticket?.data?.attachments.length >=1 ? ticket?.data?.attachments?.map((item, index) => (
            <ImageListItem
              key={index}
              cols={3}
              rows={4}
            >
              <img
                // {...srcset(item.url, 121)}
                src={item.url}
                loading="lazy"
              />
            </ImageListItem>
          )): <Typography variant="p" >No Attachments for this Ticket</Typography>  }
        </ImageList>
      </BaseCard>
    </Grid>
  </Grid>)
}



      <Box
        component="main"
        sx={{
          display: sm ? "block" : "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
          <Grid pt={2} gap={5} display={"flex"} alignItems={"center"} xs={12} sm={12} lg={4}>
                    <Container sx={{}}>
                    <Typography variant="h5" marginBottom={2}><b>Category:</b> {ticket?.data.categoryName}</Typography> 
                    <Typography  variant="h5" marginBottom={2}><b>Subject:</b> {ticket?.data.subject}</Typography> 
                    <Typography  variant="h5"><b>Description:</b> {ticket?.data.description}</Typography> 

                    </Container>


            
          </Grid> 



          <Chat messages={messages} ticket={ticket} userDetails={userDetails} />


      </Box>
    </>
  );
};

export const Chat = ({ messages, ticket, userDetails }) => {
  const getUser = useSession();
  const user = getUser?.data?.user;
  const queryClient = useQueryClient();
  const [chatMessage, setChatMessage] = useState('');

  const chat = async ({ ticketid, message }) => {
    const sendmessage = await axios.post(
      // "http://localhost:3001/api/admin/console/users/unblock",
      "https://vigoplace.com/server/api/admin/ticket/message",
      { ticketid, message },
      {
        headers: {
          Authorization: user?.token,
        },
      }
    );
    return sendmessage;
  };

   const chatMutation = useMutation({
    mutationKey: ["ticketChat"],
    mutationFn: chat,
    onSuccess: () => {
      queryClient.invalidateQueries("fetchTicketMessages");
      setChatMessage('')
    },
    onError: async (error) => {
      // setOpenToast(true);
    },
  });

  const handleChat = (event) => {
    setChatMessage(event.target.value);
  };



  return (
      <Grid xs={12} sm={12} lg={8} container component={Paper} sx={{ width: "100%", height: "100%" }}>

        <Grid padding={'15px'} xs={12}>
          <Grid item xs={12} display={'flex'} alignItems={'center'} marginBottom={'10px'} >
            <Avatar alt="" src={ticket?.data?.userphoto} sx={{ marginRight: "40px" }} />
            <Typography variant="h2" sx={{ fontWeight: "bold" }} className="header-message">{userDetails?.data?.user?.fullname}</Typography>
          </Grid>
          <Divider variant="fullWidth" orientation="horizontal" />
        </Grid>

        <Grid item xs={12}>
          <List sx={{ height: "58vh", overflowY: "auto" }}>
            {
              messages?.data && messages?.data.map((message, index) => (
                <ListItem key={index}>
                  <Grid container>
                    <Grid item xs={12} display={'flex'}>
                      {
                     message.type === 'sent' ? (<> <Avatar alt="" src={message.userphoto} />

                     <ListItemText align={message.type === 'sent' ? "left" : "right"} sx={{maxWidth: "50%", paddingLeft: "20px", whiteSpace: "normal" }} primary={message.message}
                     // secondary="oh yeah man"
                     ></ListItemText>

                     </>) : (
                     <ListItemText align="right" sx={{ whiteSpace: "normal" }} primary={message.message}
                      ></ListItemText>)

                      }

                      
                      
                      </Grid>
                    <Grid item xs={12}>
                      <ListItemText align={message.type === 'sent' ? "left" : "right"} secondary={format(new Date(message.date), "Pp")}></ListItemText>
                    </Grid>
                  </Grid>
                </ListItem>
              ))
            }
          </List>
          <Divider />
          <Grid container style={{ padding: '20px' }}>
            <Grid item xs={11}>
              <TextField id="chat" value={chatMessage} onChange={handleChat} label="..." fullWidth />
            </Grid>
            <Grid item xs={1} align="right">
              <Fab color="primary" aria-label="add" onClick={()=>{
                chatMutation.mutate({ticketid: ticket.data.ticketId, message: chatMessage })
              }}><SendIcon /></Fab>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
  );
}

SingleTicket.auth = true;
export default SingleTicket;