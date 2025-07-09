// // import React, { useMemo, useState, useEffect } from "react";
// // import { MaterialReactTable } from "material-react-table";
// // import Table from "material-react-table";
// // import { useRouter } from "next/router";
// // import { Link } from "next/link";
// // import { format } from "date-fns";
// // import {
// //   Avatar,
// //   Card,
// //   CardActions,
// //   CardContent,
// //   CardHeader,
// //   CardMedia,
// //   CircularProgress,
// //   Divider,
// //   Grid,
// //   IconButton,
// //   InputAdornment,
// //   Paper,
// //   Tab,
// //   Tooltip,
// // } from "@mui/material";
// // import RefreshIcon from "@mui/icons-material/Refresh";
// // import axios from "axios";
// // import InputLabel from "@mui/material/InputLabel";
// // import FormControl from "@mui/material/FormControl";
// // import Select from "@mui/material/Select";
// // import PropTypes from "prop-types";
// // import Tabs from "@mui/material/Tabs";
// // import MuiAlert from "@mui/material/Alert";
// // import {
// //   useQueryClient,
// //   useQuery,
// // } from "@tanstack/react-query";
// // import { getSession, useSession } from "next-auth/react";
// // //Material-UI Imports
// // import {
// //   Box,
// //   MenuItem,
// //   Typography,
// // } from "@mui/material";

// // function TabPanel(props) {
// //   const { children, value, index, ...other } = props;

// //   return (
// //     <div
// //       role="tabpanel"
// //       hidden={value !== index}
// //       id={`simple-tabpanel-${index}`}
// //       aria-labelledby={`simple-tab-${index}`}
// //       {...other}
// //     >
// //       {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
// //     </div>
// //   );
// // }

// // TabPanel.propTypes = {
// //   children: PropTypes.node,
// //   index: PropTypes.number.isRequired,
// //   value: PropTypes.number.isRequired,
// // };

// // function a11yProps(index) {
// //   return {
// //     id: `simple-tab-${index}`,
// //     "aria-controls": `simple-tabpanel-${index}`,
// //   };
// // }

// // const Alert = React.forwardRef(function Alert(props, ref) {
// //   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// // });

// // const API_BASE_URL = "https://api.vigoplace.com";
// // //const API_BASE_URL = "http://localhost:4000";

// // const Flutterwave = () => {
// //   const router = useRouter();
// //   const { userid } = router.query;
// //   const queryClient = useQueryClient();
// //   const getUser = useSession();
// //   const user = getUser?.data?.user;
// //   const [columnFilters, setColumnFilters] = useState([]);
// //   const [globalFilter, setGlobalFilter] = useState("");
// //   const [sorting, setSorting] = useState([]);
// //   const [pagination, setPagination] = useState({
// //     pageIndex: 1,
// //     pageSize: 10,
// //   });
// //   const [lastId, setLastId] = useState(0);
// //   const [totalResult, setTotalResult] = useState(0);
// //   const [status, setStatus] = React.useState("");
// //   const [currency, setCurrency] = React.useState("");
// //   const [tabValue, setTabValue] = React.useState(0);
// //   const [result, setResult] = useState([]);

// //   /* ******* onchange functions ********** */

// //   const handleTabChange = (event, newValue) => {
// //     setTabValue(newValue);
// //   };

// //   useEffect(() => {
// //     setPagination({ ...pagination, pageIndex: 0 });
// //   }, [columnFilters]);

// //   const { data, isError, isFetching, isLoading, refetch } = useQuery(
// //     [
// //       "fetchFlutterwaveTransfers",
// //       columnFilters, //refetch when columnFilters changes
// //       globalFilter, //refetch when globalFilter changes
// //       pagination.pageIndex, //refetch when pagination.pageIndex changes
// //       pagination.pageSize, //refetch when pagination.pageSize changes
// //       sorting, //refetch when sorting changes
// //       status,
// //       lastId,
// //       currency,
// //     ],
// //     async () => {
// //       const { data } = await axios.get(
// //         `${API_BASE_URL}/api/admin/console/transfers/flutterwave?page=${
// //           pagination.pageIndex + 1
// //         }&page_size=${pagination.pageSize}&status=successful${
// //           columnFilters?.length >= 1
// //             ? `&search=${JSON.stringify(columnFilters)}`
// //             : ""
// //         }`,
// //         {
// //           headers: {
// //             Authorization: user?.token,
// //           },
// //         }
// //       );
// //       console.log(data);

// //       setResult(data?.data ?? []);
// //       setTotalResult(data?.data?.totalTransactions);
// //       return data;
// //     },
// //     {
// //       onError: (err) => {
// //         console.log(err, "err fetching flutterwave transactions");
// //       },
// //       enabled: !!user?.token,
// //     },
// //     { keepPreviousData: true }
// //   );

// //   const columns = useMemo(
// //     () => [
// //       {
// //         accessorKey: "reference",
// //         enableClickToCopy: false,
// //         header: "Reference",
// //       },
// //       {
// //         accessorKey: "sender",
// //         header: "Sender",
// //         muiTableBodyCellProps: ({ cell }) => ({
// //           style: {
// //             cursor: "pointer",
// //           },
// //           onClick: () => {
// //             //console.log(cell.getValue());
// //             const userId = cell.row.original.userId;
// //             const url = `/user/${userId}`;
// //             window.open(url, "_blank");
// //           },
// //           onMouseEnter: (e) => {
// //             e.target.style.textDecoration = "underline";
// //           },
// //           onMouseLeave: (e) => {
// //             e.target.style.textDecoration = "none";
// //           },
// //         }),
// //         enableClickToCopy: false,
// //         id: "sender",
// //       },
// //       {
// //         accessorKey: "description",
// //         enableClickToCopy: false,
// //         header: "Description",
// //       },
// //       {
// //         accessorKey: "currency",
// //         enableClickToCopy: false,
// //         header: "Currency",
// //       },
// //       {
// //         accessorFn: (row) => row?.amount?.toLocaleString("en-US"),
// //         enableClickToCopy: false,
// //         id: "amount",
// //         header: "Total Amount",
// //       },
// //       {
// //         accessorFn: (row) => (row.fee)?.toLocaleString("en-US"),
// //         enableClickToCopy: false,
// //         id: "fee",
// //         header: "Fee",
// //       },
// //     //   {
// //     //     accessorFn: (row) => (row.gatewayCharge)?.toLocaleString("en-US"),
// //     //     enableClickToCopy: false,
// //     //     id: "gateWayCharge",
// //     //     header: "CPF",
// //     //   },
// //     //   {
// //     //     accessorFn: (row) => row.fee?.toLocaleString("en-US"),
// //     //     enableClickToCopy: false,
// //     //     id: "total Charge",
// //     //     header: "Total Fee",
// //     //   },
// //       {
// //         accessorFn: (row) => (row.net)?.toLocaleString("en-US"),
// //         enableClickToCopy: false,
// //         id: "net",
// //         header: "User Gets",
// //       },
// //       {
// //         accessorKey: "receiver",
// //         enableClickToCopy: false,
// //         header: "Receiver",
// //       },
// //       {
// //         accessorFn: (row) => {
// //           if (row?.created_at) {
// //             return format(new Date(row.created_at), "MM/dd/yyyy hh:mm a");
// //           } else {
// //             return "";
// //           }
// //         },
// //         enableClickToCopy: false,
// //         header: "Date",
// //       },
// //     ],
// //     []
// //   );

// //   if (user?.adminType === "sub-admin") {
// //     return (
// //       <section className="flex items-center justify-center">
// //         <p className="font-bold text-black">
// //           Sorry, you do not have permission to view this page
// //         </p>
// //       </section>
// //     );
// //   }

// //   return (
// //     <>
// //       <Grid
// //         container
// //         spacing={0}
// //         sx={{
// //           display: "flex",
// //           background: "",
// //           justifyContent: "center",
// //           flexWrap: "wrap",
// //         }}
// //       >
// //         <Grid item sm={12} xs={12} lg={12}>
// //           <Box sx={{ width: "100%" }}>
// //             <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
// //               <Tabs
// //                 value={tabValue}
// //                 onChange={handleTabChange}
// //                 textColor="inherit"
// //                 centered
// //                 scrollButtons="auto"
// //                 aria-label=""
// //               >
// //                 <Tab label="Transactions" {...a11yProps(0)} />
// //                 {/* <Tab label="Transactions" {...a11yProps(1)} /> */}
// //               </Tabs>
// //             </Box>

// //             <TabPanel value={tabValue} index={0}>
// //               <Box sx={{ pt: 3 }}>
// //                 <MaterialReactTable
// //                   enableColumnFilterModes
// //                   enableColumnOrdering
// //                   enablePinning
// //                   columns={columns}
// //                   //data={data?.data?.transactions ?? []}
// //                   data={result}
// //                   enableStickyHeader
// //                   //enableStickyFooter
// //                   enablePagination
// //                   manualPagination
// //                   manualFiltering
// //                   onPaginationChange={setPagination}
// //                   rowCount={totalResult}
// //                   onGlobalFilterChange={setGlobalFilter}
// //                   onColumnFiltersChange={setColumnFilters}
// //                   initialState={{ showColumnFilters: false }}
// //                   positionToolbarAlertBanner="bottom"
// //                   muiToolbarAlertBannerProps={
// //                     isError
// //                       ? {
// //                           color: "error",
// //                           children:
// //                             "Error loading data, Please use the refresh button on the table to retry",
// //                         }
// //                       : undefined
// //                   }
// //                   renderTopToolbarCustomActions={({ table }) => {
// //                     return (
// //                       <div style={{ display: "flex", gap: "0.5rem" }}>
// //                         <Tooltip arrow title="Refresh Data">
// //                           <IconButton onClick={() => refetch()}>
// //                             <RefreshIcon />
// //                           </IconButton>
// //                         </Tooltip>

// //                         <FormControl
// //                           variant="standard"
// //                           sx={{ m: 1, minWidth: 120 }}
// //                         >
// //                           <InputLabel id="demo-simple-select-standard-label">
// //                             Currency
// //                           </InputLabel>
// //                           <Select
// //                             labelId="demo-simple-select-standard-label"
// //                             id="demo-simple-select-standard"
// //                             value={currency}
// //                             defaultValue="None"
// //                             //onChange={setCurrency}
// //                             label="Gender"
// //                           >
// //                             <MenuItem value="None">
// //                               <em>None</em>
// //                             </MenuItem>
// //                             <MenuItem value={"USD"}>USD</MenuItem>
// //                             <MenuItem value={"NGN"}>NGN</MenuItem>
// //                           </Select>
// //                         </FormControl>
// //                       </div>
// //                     );
// //                   }}
// //                   state={{
// //                     isLoading,
// //                     showAlertBanner: isError,
// //                     showProgressBars: isFetching,
// //                     pagination,
// //                     globalFilter,
// //                   }}
// //                   muiTableContainerProps={{ sx: { height: "75vh" } }}
// //                 />
// //               </Box>
// //             </TabPanel>
// //           </Box>
// //         </Grid>
// //       </Grid>

// //       <Typography
// //         align="center"
// //         marginTop={1}
// //         variant="h3"
// //         color="text.secondary"
// //       >
// //         <b>Transactions</b>
// //       </Typography>
// //     </>
// //   );
// // };

// // Flutterwave.auth = true;
// // export default Flutterwave;

// import React, { useEffect, useState, useMemo, useCallback } from "react";
// import { useSession } from "next-auth/react";
// import axios from "axios";
// import { Typography, InputLabel, Box, useTheme, MenuItem } from "@mui/material";
// import { toast } from "sonner";
// import { Button } from "../components/ui/button";
// import { Input } from "../components/ui/input";
// import { Checkbox } from "../components/ui/checkbox";
// import { format } from "date-fns";
// import debounce from "lodash/debounce";
// import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
// import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";
// import Frame from "../assets/images/icons/Frame 7.svg";

// const API_BASE_URL = "https://api.vigoplace.com";
// //const API_BASE_URL = "http://localhost:4000";
// export default function Flutterwave() {
//   const getUser = useSession();
//   const users = getUser?.data?.user;
//   const theme = useTheme();
//   const [sorting, setSorting] = useState([]);
//   const [columnFilters, setColumnFilters] = useState([]);
//   const [columnVisibility, setColumnVisibility] = useState({});
//   const [rowSelection, setRowSelection] = useState({});
//   const [status, setStatus] = useState("successful");
//   const [currency, setCurrency] = useState("NGN");
//   const [pagination, setPagination] = useState({
//     pageSize: 10,
//     pageIndex: 0,
//   });

//   const { data, isError, isFetching, isLoading, refetch } = useQuery(
//     ["fetchFlutterwaveTransfers", status, pagination],
//     async () => {
//       const { data } = await axios.get(
//         `${API_BASE_URL}/api/admin/console/transfers/flutterwave?page=${
//           pagination.pageIndex + 1
//         }&page_size=${
//           pagination.pageSize
//         }&status=${status}&currency=${currency}`,
//         //`http://localhost:4000/api/admin/console/wallet/balances?currency=${currency}&pageSize=${pagination.pageSize}&page=${pagination.pageIndex}`,
//         {
//           headers: {
//             Authorization: users?.token,
//           },
//         }
//       );

//       //console.log(data);
//       return data;
//     },
//     {
//       onError: (err) => {
//         console.log(err, "err fetching flutterwave transactions");
//       },
//       enabled: !!users?.token,
//     },
//     { keepPreviousData: true }
//   );

//   //   const handleCurrencyChange = (event) => {
//   //     setStatus(event.target.value);
//   //     //setPagination({ ...pagination, pageIndex: 0 });
//   //   };

//   //   const formatCurrency = (value, currency) => {
//   //     if (typeof value === "number") {
//   //       if (currency === "Naira") {
//   //         return `₦${value.toFixed(2)}`;
//   //       } else if (currency === "USD") {
//   //         return `$${value.toFixed(2)}`;
//   //       }
//   //     }
//   //     return value;
//   //   };

//   const columns = useMemo(
//     () => [
//       {
//         id: "select",
//         header: ({ table }) => (
//           <Checkbox
//             checked={
//               table.getIsAllPageRowsSelected() ||
//               (table.getIsSomePageRowsSelected() && "indeterminate")
//             }
//             onCheckedChange={(value) =>
//               table.toggleAllPageRowsSelected(!!value)
//             }
//             aria-label="Select all"
//           />
//         ),
//         cell: ({ row }) => (
//           <Checkbox
//             checked={row.getIsSelected()}
//             onCheckedChange={(value) => row.toggleSelected(!!value)}
//             aria-label="Select row"
//           />
//         ),
//         enableSorting: false,
//         enableHiding: false,
//       },
//       {
//         id: "fullName",
//         header: ({ column }) => {
//           return (
//             <Button
//               variant="ghost"
//               onClick={() =>
//                 column.toggleSorting(column.getIsSorted() === "asc")
//               }
//             >
//               User
//               <ArrowUpDown />
//             </Button>
//           );
//         },
//         cell: ({ row }) => {
//           const name = row.original.full_name;
//           const initials = name
//             ? name
//                 .split(" ")
//                 .map((word) => word[0])
//                 .join("")
//                 .toUpperCase()
//             : "US";

//           return (
//             <div className="flex items-center space-x-4 px-2">
//               <Avatar>
//                 <AvatarImage src={Frame} />
//                 <AvatarFallback>{initials}</AvatarFallback>
//               </Avatar>
//               <span
//                 className="lowercase ml-3"
//                 onClick={() => {
//                   const userId = row.original.userId;
//                   const url = `/user/${userId}`;
//                   window.open(url, "_blank");
//                 }}
//                 onMouseEnter={(e) => {
//                   e.target.style.textDecoration = "underline";
//                 }}
//                 onMouseLeave={(e) => {
//                   e.target.style.textDecoration = "none";
//                 }}
//                 style={{ cursor: "pointer" }}
//               >{`${name}`}</span>
//             </div>
//           );
//         },
//         accessorFn: (row) => `${row.full_name}`,
//       },

//       {
//         accessorKey: "account_number",
//         header: "Account Number",
//         cell: ({ row }) => (
//           <div className="px-4">{row.getValue("account_number")}</div>
//         ),
//       },
//       {
//         accessorKey: "bank_name",
//         header: "Bank Name",
//         cell: ({ row }) => (
//           <div className="px-4">{row.getValue("bank_name")}</div>
//         ),
//       },
//       {
//         accessorKey: "narration",
//         header: "Description",
//         cell: ({ row }) => <div className="">{row.getValue("narration")}</div>,
//       },
//       {
//         accessorKey: "amount",
//         header: "Amount",
//         cell: ({ row }) => {
//           const amount = row.getValue("amount");
//           return (
//             <div className="">
//               {typeof amount === "number"
//                 ? amount.toLocaleString("en-US")
//                 : amount}
//             </div>
//           );
//         },
//       },
//       {
//         accessorKey: "currency",
//         header: "Currency",
//         cell: ({ row }) => <div className="">{row.getValue("currency")}</div>,
//       },
//       {
//         accessorKey: "fee",
//         header: "Fee",
//         cell: ({ row }) => <div className="">{row.getValue("fee")}</div>,
//       },
//       {
//         accessorKey: "status",
//         header: "Status",
//         cell: ({ row }) => {
//           const status = row.getValue("status");
//           let color = "";
//           if (typeof status === "string") {
//             const lowerStatus = status.toLowerCase();
//             if (lowerStatus === "successful") color = "text-green-600";
//             else if (lowerStatus === "pending") color = "text-yellow-600";
//             else if (lowerStatus === "failed") color = "text-red-600";
//             else color = "";
//             return <div className={`${color}`}>{lowerStatus}</div>;
//           }
//           return <div className="">{status}</div>;
//         },
//       },
//       {
//         accessorKey: "reference",
//         header: "Reference",
//         cell: ({ row }) => <div className="">{row.getValue("reference")}</div>,
//       },
//       {
//         accessorKey: "requires_approval",
//         header: "Requires Approval",
//         cell: ({ row }) => {
//           const value = row.getValue("requires_approval");
//           return <div className="px-4">{value === 1 ? "true" : "false"}</div>;
//         },
//       },
//       {
//         accessorKey: "created_at",
//         header: () => <div>Created At</div>,
//         cell: ({ row }) => {
//           const date = row.getValue("created_at");

//           if (!date) return <div className="text-right px-4">—</div>;

//           const formattedDate =
//             typeof date === "string" || typeof date === "number"
//               ? format(new Date(date), "EEE do, MMM")
//               : "Invalid Date";

//           return <div className="">{formattedDate}</div>;
//         },
//       },
//       {
//         id: "actions",
//         enableHiding: false,
//         cell: ({ row }) => {
//           const operation = row.original;

//           return (
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild className="hover:cursor-pointer">
//                 <Button variant="ghost" className="h-8 w-8 p-0">
//                   <span className="sr-only">Open menu</span>
//                   <MoreHorizontal />
//                 </Button>
//               </DropdownMenuTrigger>
//             </DropdownMenu>
//           );
//         },
//       },
//     ],
//     [status]
//   );

//   const table = useReactTable({
//     data: data?.data ?? [],
//     columns,
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     // manualPagination: true,
//     // rowCount: balance?.data?.count,
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     onColumnVisibilityChange: setColumnVisibility,
//     onRowSelectionChange: setRowSelection,
//     onPaginationChange: setPagination,
//     state: {
//       sorting,
//       columnFilters,
//       columnVisibility,
//       rowSelection,
//       pagination,
//     },
//     autoResetPageIndex: false,
//     autoResetExpanded: false,
//   });

//   const debouncedFilter = useCallback(
//     (value) => {
//       const filterFunc = debounce((filterValue) => {
//         table.getColumn("fullName")?.setFilterValue(filterValue);
//       }, 2000);
//       filterFunc(value);
//     },
//     [table]
//   );

//   return (
//     <>
//       <Typography
//         variant="h3"
//         color="text.primary"
//         marginBottom={2}
//         sx={{ fontWeight: "bold", textAlign: "center" }}
//       >
//         Flutterwave Transactions
//       </Typography>

//       <div className="flex justify-between">
//         <div className="flex flex-col gap-2 ml-5 mb-5">
//           <label htmlFor="status" className="text-sm font-medium">
//             Status
//           </label>
//           <Select value={status} onValueChange={(value) => setStatus(value)}>
//             <SelectTrigger className="w-[100px] h-[30px] text-xs">
//               <SelectValue placeholder="Select" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="successful" className="text-xs h-[30px]">
//                 Successful
//               </SelectItem>
//               <SelectItem value="pending" className="text-xs h-[30px]">
//                 Pending
//               </SelectItem>
//               <SelectItem value="failed" className="text-xs h-[30px]">
//                 Failed
//               </SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         <div className="flex flex-col gap-2 mr-5 mb-5">
//           <label htmlFor="status" className="text-sm font-medium">
//             Currency
//           </label>
//           <Select
//             value={currency}
//             onValueChange={(value) => setCurrency(value)}
//           >
//             <SelectTrigger className="w-[100px] h-[30px] text-xs">
//               <SelectValue placeholder="Select" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="NGN" className="text-xs h-[30px]">
//                 Naira
//               </SelectItem>
//               <SelectItem value="USD" className="text-xs h-[30px]">
//                 USD
//               </SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       <div className="flex flex-col w-full px-6">
//         {isLoading ? (
//           <div className="w-full bg-white rounded-md px-6 py-6">
//             <div className="flex items-center py-4">
//               <div className="h-10 w-48 bg-gray-200 rounded animate-pulse max-w-sm"></div>

//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <div className="h-10 w-32 bg-gray-200 rounded ml-auto animate-pulse"></div>
//                 </DropdownMenuTrigger>
//               </DropdownMenu>
//             </div>

//             <div className="rounded-md border">
//               <Table>
//                 <TableHeader>
//                   <TableRow className="bg-[#F8F8F8]">
//                     {table
//                       .getHeaderGroups()
//                       .map((headerGroup) =>
//                         headerGroup.headers.map((header) => (
//                           <TableHead key={header.id}>
//                             {header.isPlaceholder
//                               ? null
//                               : flexRender(
//                                   header.column.columnDef.header,
//                                   header.getContext()
//                                 )}
//                           </TableHead>
//                         ))
//                       )}
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {Array.from({ length: 10 }).map((_, index) => (
//                     <TableRow key={index} className="animate-pulse">
//                       {columns.map((_, cellIndex) => (
//                         <TableCell key={cellIndex}>
//                           <div className="h-4 bg-gray-200 rounded w-full"></div>
//                         </TableCell>
//                       ))}
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           </div>
//         ) : isError ? (
//           <div className="w-full bg-white rounded-md px-6 py-4 text-center text-red-500">
//             <p>Error: {isError}</p>
//           </div>
//         ) : (
//           <div className="w-full bg-white rounded-md px-6">
//             <div className="flex items-center py-4">
//               <Input
//                 placeholder="Filter users by name..."
//                 defaultValue={
//                   table.getColumn("fullName")?.getFilterValue() ?? ""
//                 }
//                 onChange={(event) => debouncedFilter(event.target.value)}
//                 className="max-w-sm"
//               />
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button
//                     variant="outline"
//                     className="ml-auto hover:cursor-pointer"
//                   >
//                     Columns <ChevronDown />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end">
//                   {table
//                     .getAllColumns()
//                     .filter((column) => column.getCanHide())
//                     .map((column) => {
//                       return (
//                         <DropdownMenuCheckboxItem
//                           key={column.id}
//                           className="capitalize"
//                           checked={column.getIsVisible()}
//                           onCheckedChange={(value) =>
//                             column.toggleVisibility(!!value)
//                           }
//                         >
//                           {column.id}
//                         </DropdownMenuCheckboxItem>
//                       );
//                     })}
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>
//             <div className="rounded-md border">
//               <Table>
//                 <TableHeader>
//                   {table.getHeaderGroups().map((headerGroup) => (
//                     <TableRow key={headerGroup.id} className="bg-[#F8F8F8]">
//                       {headerGroup.headers.map((header) => {
//                         return (
//                           <TableHead key={header.id}>
//                             {header.isPlaceholder
//                               ? null
//                               : flexRender(
//                                   header.column.columnDef.header,
//                                   header.getContext()
//                                 )}
//                           </TableHead>
//                         );
//                       })}
//                     </TableRow>
//                   ))}
//                 </TableHeader>
//                 <TableBody>
//                   {table.getRowModel().rows?.length ? (
//                     table.getRowModel().rows.map((row) => (
//                       <TableRow
//                         key={row.id}
//                         data-state={row.getIsSelected() && "selected"}
//                       >
//                         {row.getVisibleCells().map((cell) => (
//                           <TableCell key={cell.id}>
//                             {flexRender(
//                               cell.column.columnDef.cell,
//                               cell.getContext()
//                             )}
//                           </TableCell>
//                         ))}
//                       </TableRow>
//                     ))
//                   ) : (
//                     <TableRow>
//                       <TableCell
//                         colSpan={columns.length}
//                         className="h-24 text-center"
//                       >
//                         No results.
//                       </TableCell>
//                     </TableRow>
//                   )}
//                 </TableBody>
//               </Table>
//             </div>
//             <div className="flex items-center py-4 px-0">
//               <div className="text-sm text-muted-foreground mr-4 w-full">
//                 {table.getFilteredSelectedRowModel().rows.length} of{" "}
//                 {table.getFilteredRowModel().rows.length} row(s) selected.
//               </div>

//               <Pagination className="ml-auto mb-0">
//                 <PaginationContent>
//                   <PaginationItem>
//                     <PaginationPrevious
//                       onClick={() => table.previousPage()}
//                       className={
//                         !table.getCanPreviousPage()
//                           ? "pointer-events-none opacity-50"
//                           : "hover:cursor-pointer"
//                       }
//                     />
//                   </PaginationItem>

//                   {[...Array(table.getPageCount())].map((_, index) => {
//                     if (
//                       table.getPageCount() <= 3 ||
//                       index < 2 ||
//                       index === table.getPageCount() - 1
//                     ) {
//                       return (
//                         <PaginationItem key={index}>
//                           <PaginationLink
//                             onClick={() => table.setPageIndex(index)}
//                             isActive={
//                               table.getState().pagination.pageIndex === index
//                             }
//                             className="hover:cursor-pointer"
//                           >
//                             {index + 1}
//                           </PaginationLink>
//                         </PaginationItem>
//                       );
//                     }
//                     if (index === 2 && table.getPageCount() > 3) {
//                       return (
//                         <PaginationItem key={index} className="mb-auto text-xl">
//                           ...
//                         </PaginationItem>
//                       );
//                     }
//                     return null;
//                   })}

//                   <PaginationItem>
//                     <PaginationNext
//                       onClick={() => table.nextPage()}
//                       className={
//                         !table.getCanNextPage()
//                           ? "pointer-events-none opacity-50"
//                           : "hover:cursor-pointer"
//                       }
//                     />
//                   </PaginationItem>
//                 </PaginationContent>
//                 <select
//                   value={table.getState().pagination.pageSize}
//                   onChange={(e) => {
//                     table.setPageSize(Number(e.target.value));
//                   }}
//                 >
//                   {[10, 20, 30, 40, 50].map((pageSize) => (
//                     <option key={pageSize} value={pageSize}>
//                       {pageSize}
//                     </option>
//                   ))}
//                 </select>
//               </Pagination>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

// Flutterwave.auth = true;

import FlutterwaveNaira from "@/src/components/dashboard/FlutterwaveNaira";
import FlutterwaveUsd from "@/src/components/dashboard/FlutterwaveUsd";
import { Tab, Tabs, Grid, Box, Typography } from "@mui/material";
import PropTypes from "prop-types";
import React from "react";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Flutterwave() {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div>
      <Typography
        variant="h3"
        color="text.primary"
        marginBottom={2}
        sx={{ fontWeight: "bold", textAlign: "center" }}
      >
        Flutterwave Transactions
      </Typography>
      <Grid
        container
        spacing={0}
        sx={{
          display: "flex",
          background: "",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Grid item sm={12} xs={12} lg={12}>
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                textColor="inherit"
                centered
                scrollButtons="auto"
                aria-label=""
              >
                <Tab label="Naira" {...a11yProps(0)} />
                <Tab label="USD" {...a11yProps(1)} />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <FlutterwaveNaira />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <FlutterwaveUsd />
            </TabPanel>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}

