// import { useState, useMemo } from "react";
// import { toast } from "sonner";
// import { Button } from "../../../components/ui/button";
// import { Input } from "../../../components/ui/input";
// import { Checkbox } from "../../../components/ui/checkbox";
// import debounce from "lodash/debounce";
// import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
// import {
//   Avatar,
//   AvatarImage,
//   AvatarFallback,
// } from "../../../components/ui/avatar";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../../../components/ui/table";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "../../../components/ui/dropdown-menu";
// import {
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import axios from "axios";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "../../../components/ui/pagination";
// import React from "react";
// import Frame from "../../../assets/images/icons/Frame 7.svg";
// import { useSession } from "next-auth/react";

// const API_BASE_URL = "https://api.vigoplace.com";
// //const API_BASE_URL = "http://localhost:4000";
// export const ErrorLogs = () => {
//   const queryClient = useQueryClient();
//   const [sorting, setSorting] = useState([]);
//   const [columnFilters, setColumnFilters] = useState([]);
//   const [columnVisibility, setColumnVisibility] = useState({});
//   const [rowSelection, setRowSelection] = useState({});
//   const getUser = useSession();
//   const user = getUser?.data?.user;
//   const [globalFilter, setGlobalFilter] = React.useState("");
//   const [pagination, setPagination] = useState({
//     pageIndex: 0,
//     pageSize: 10,
//   });

//   const {
//     data,
//     isError,
//     isFetching,
//     isLoading: loading,
//     refetch,
//   } = useQuery(
//     ["nonKyc", columnFilters, sorting, pagination],
//     async () => {
//       const { data } = await axios.get(
//         `https://api.vigoplace.com/api/admin/console/logs?limit=${
//           pagination.pageSize
//         }&offset=${pagination.pageIndex * pagination.pageSize}`,
//         // `http://localhost:3001/api/admin/console/logs?limit=${pagination.pageSize}&offset=${pagination.pageIndex * pagination.pageSize}`,
//         {
//           headers: {
//             Authorization: user?.token,
//           },
//         }
//       );

//       console.log(data);

//       // toast.success("Users Fetched", {
//       //   description: "Successfully fetched users.",
//       // });
//       return data;
//     },
//     {
//       onError: (err) => {
//         console.log(err, "err fetching users");
//       },
//       enabled: !!user?.token,
//     },
//     { keepPreviousData: true }
//   );

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
//               Full Name
//               <ArrowUpDown />
//             </Button>
//           );
//         },
//         cell: ({ row }) => {
//           const name = row.original.fullName;
//           const initials = name
//             ? name
//                 .split(" ")
//                 .map((word) => word[0])
//                 .join("")
//                 .toUpperCase()
//             : "US";

//           return (
//             <div className="flex items-center space-x-2">
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
//         accessorFn: (row) => `${row.fullName}`,
//       },
//       {
//         accessorKey: "email",
//         header: "Email",
//         cell: ({ row }) => (
//           <div className="lowercase">{row.getValue("email")}</div>
//         ),
//       },
//       {
//         accessorKey: "username",
//         header: "Username",
//         cell: ({ row }) => (
//           <div className="lowercase">{row.getValue("username")}</div>
//         ),
//       },
//       {
//         accessorKey: "phone",
//         header: () => <div>Phone</div>,
//         cell: ({ row }) => {
//           const phone = row.getValue("phone");

//           if (!phone) {
//             return <div className="text-left"></div>;
//           }

//           return <div className="">{phone}</div>;
//         },
//       },
//       {
//         id: "actions",
//         enableHiding: false,
//         cell: ({ row }) => {
//           const user = row.original;

//           return (
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild className="hover:cursor-pointer">
//                 <Button variant="ghost" className="h-8 w-8 p-0">
//                   <span className="sr-only">Open menu</span>
//                   <MoreHorizontal />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end">
//                 <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                 <DropdownMenuItem
//                   onClick={() => navigator.clipboard.writeText(user.userId)}
//                   className="hover:cursor-pointer"
//                 >
//                   Copy user ID
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           );
//         },
//       },
//     ],
//     []
//   );

//   const table = useReactTable({
//     data: data?.data?.nonKycUsers ?? [],
//     columns,
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     onColumnVisibilityChange: setColumnVisibility,
//     onRowSelectionChange: setRowSelection,
//     state: {
//       sorting,
//       columnFilters,
//       columnVisibility,
//       rowSelection,
//     },
//     autoResetPageIndex: false,
//     autoResetExpanded: false,
//   });

//   const debouncedFilter = useMemo(
//     () =>
//       debounce((value) => {
//         table.getColumn("fullName")?.setFilterValue(value);
//       }, 2000),
//     [table]
//   );

//   const handleSearchChange = debounce((event) => {
//     setGlobalFilter(event.target.value);
//     refetch();
//   }, 2000);

//   return (
//     <div className="flex flex-col w-full">
//       {loading ? (
//         <div className="w-full bg-white rounded-md px-6 py-6">
//           <div className="flex items-center py-4">
//             <div className="h-10 w-48 bg-gray-200 rounded animate-pulse max-w-sm"></div>

//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <div className="h-10 w-32 bg-gray-200 rounded ml-auto animate-pulse"></div>
//               </DropdownMenuTrigger>
//             </DropdownMenu>
//           </div>

//           <div className="rounded-md border">
//             <Table>
//               <TableHeader>
//                 <TableRow className="bg-[#F8F8F8]">
//                   {table
//                     .getHeaderGroups()
//                     .map((headerGroup) =>
//                       headerGroup.headers.map((header) => (
//                         <TableHead key={header.id}>
//                           {header.isPlaceholder
//                             ? null
//                             : flexRender(
//                                 header.column.columnDef.header,
//                                 header.getContext()
//                               )}
//                         </TableHead>
//                       ))
//                     )}
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {Array.from({ length: 10 }).map((_, index) => (
//                   <TableRow key={index} className="animate-pulse">
//                     {columns.map((_, cellIndex) => (
//                       <TableCell key={cellIndex}>
//                         <div className="h-4 bg-gray-200 rounded w-full"></div>
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </div>
//       ) : isError ? (
//         <div className="w-full bg-white rounded-md px-6 py-4 text-center text-red-500">
//           <p>Error: {isError}</p>
//         </div>
//       ) : (
//         <div className="w-full bg-white rounded-md px-6">
//           <Input
//             placeholder="Global search..."
//             value={globalFilter}
//             onChange={(event) => {
//               setGlobalFilter(event.target.value);
//               handleSearchChange(event);
//             }}
//             className="max-w-sm mt-4"
//           />
//           <div className="flex items-center py-4">
//             <Input
//               placeholder="Filter names..."
//               defaultValue={table.getColumn("fullName")?.getFilterValue() ?? ""}
//               onChange={(event) => debouncedFilter(event.target.value)}
//               className="max-w-sm"
//             />
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button
//                   variant="outline"
//                   className="ml-auto hover:cursor-pointer"
//                 >
//                   Columns <ChevronDown />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end">
//                 {table
//                   .getAllColumns()
//                   .filter((column) => column.getCanHide())
//                   .map((column) => {
//                     return (
//                       <DropdownMenuCheckboxItem
//                         key={column.id}
//                         className="capitalize"
//                         checked={column.getIsVisible()}
//                         onCheckedChange={(value) =>
//                           column.toggleVisibility(!!value)
//                         }
//                       >
//                         {column.id}
//                       </DropdownMenuCheckboxItem>
//                     );
//                   })}
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//           <div className="rounded-md border">
//             <Table>
//               <TableHeader>
//                 {table.getHeaderGroups().map((headerGroup) => (
//                   <TableRow key={headerGroup.id} className="bg-[#F8F8F8]">
//                     {headerGroup.headers.map((header) => {
//                       return (
//                         <TableHead key={header.id}>
//                           {header.isPlaceholder
//                             ? null
//                             : flexRender(
//                                 header.column.columnDef.header,
//                                 header.getContext()
//                               )}
//                         </TableHead>
//                       );
//                     })}
//                   </TableRow>
//                 ))}
//               </TableHeader>
//               <TableBody>
//                 {table.getRowModel().rows?.length ? (
//                   table.getRowModel().rows.map((row) => (
//                     <TableRow
//                       key={row.id}
//                       data-state={row.getIsSelected() && "selected"}
//                     >
//                       {row.getVisibleCells().map((cell) => (
//                         <TableCell key={cell.id}>
//                           {flexRender(
//                             cell.column.columnDef.cell,
//                             cell.getContext()
//                           )}
//                         </TableCell>
//                       ))}
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell
//                       colSpan={columns.length}
//                       className="h-24 text-center"
//                     >
//                       No results.
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </div>
//           <div className="flex items-center py-4 px-0">
//             <div className="text-sm text-muted-foreground mr-4 w-full">
//               {table.getFilteredSelectedRowModel().rows.length} of{" "}
//               {table.getFilteredRowModel().rows.length} row(s) selected.
//             </div>

//             <Pagination className="ml-auto mb-0">
//               <PaginationContent>
//                 <PaginationItem>
//                   <PaginationPrevious
//                     onClick={() => table.previousPage()}
//                     className={
//                       !table.getCanPreviousPage()
//                         ? "pointer-events-none opacity-50"
//                         : "hover:cursor-pointer"
//                     }
//                   />
//                 </PaginationItem>

//                 {[...Array(table.getPageCount())].map((_, index) => {
//                   if (
//                     table.getPageCount() <= 3 ||
//                     index < 2 ||
//                     index === table.getPageCount() - 1
//                   ) {
//                     return (
//                       <PaginationItem key={index}>
//                         <PaginationLink
//                           onClick={() => table.setPageIndex(index)}
//                           isActive={
//                             table.getState().pagination.pageIndex === index
//                           }
//                           className="hover:cursor-pointer"
//                         >
//                           {index + 1}
//                         </PaginationLink>
//                       </PaginationItem>
//                     );
//                   }
//                   if (index === 2 && table.getPageCount() > 3) {
//                     return (
//                       <PaginationItem key={index} className="mb-auto text-xl">
//                         ...
//                       </PaginationItem>
//                     );
//                   }
//                   return null;
//                 })}

//                 <PaginationItem>
//                   <PaginationNext
//                     onClick={() => table.nextPage()}
//                     className={
//                       !table.getCanNextPage()
//                         ? "pointer-events-none opacity-50"
//                         : "hover:cursor-pointer"
//                     }
//                   />
//                 </PaginationItem>
//               </PaginationContent>
//               <select
//                 value={table.getState().pagination.pageSize}
//                 onChange={(e) => {
//                   table.setPageSize(Number(e.target.value));
//                 }}
//               >
//                 {[10, 20, 30, 40, 50].map((pageSize) => (
//                   <option key={pageSize} value={pageSize}>
//                     {pageSize}
//                   </option>
//                 ))}
//               </select>
//             </Pagination>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// import { useState, useMemo, useEffect } from "react";
// import { toast } from "sonner";
// import { Button } from "../components/ui/button";
// import { Input } from "../components/ui/input";
// import { Checkbox } from "../components/ui/checkbox";
// import debounce from "lodash/debounce";
// import {
//   ArrowUpDown,
//   ChevronDown,
//   MoreHorizontal,
//   RefreshCw,
//   Play,
//   Pause,
// } from "lucide-react";
// import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../components/ui/table";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "../components/ui/dropdown-menu";
// import {
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import axios from "axios";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "../components/ui/pagination";
// import React from "react";
// //import Frame from "../../assets/images/icons/Frame 7.svg";
// import { useSession } from "next-auth/react";

// const API_BASE_URL = "https://api.vigoplace.com";

// function ErrorLogs() {
//   const queryClient = useQueryClient();
//   const [sorting, setSorting] = useState([]);
//   const [columnFilters, setColumnFilters] = useState([]);
//   const [columnVisibility, setColumnVisibility] = useState({});
//   const [rowSelection, setRowSelection] = useState({});
//   const getUser = useSession();
//   const user = getUser?.data?.user;
//   const [globalFilter, setGlobalFilter] = React.useState("");
//   const [pagination, setPagination] = useState({
//     pageIndex: 0,
//     pageSize: 10,
//   });

//   // Auto-refresh controls
//   const [autoRefresh, setAutoRefresh] = useState(true);
//   const [refreshInterval, setRefreshInterval] = useState(5000); // 5 seconds default

//   const {
//     data,
//     isError,
//     isFetching,
//     isLoading: loading,
//     refetch,
//   } = useQuery(
//     ["errorLogs", columnFilters, sorting, pagination],
//     async () => {
//       const { data } = await axios.get(
//         `${API_BASE_URL}/api/logs?limit=${
//           pagination.pageSize
//         }&offset=${pagination.pageIndex * pagination.pageSize}`,
//         {
//           headers: {
//             Authorization: user?.token,
//           },
//         }
//       );

//       console.log(data);
//       return data;
//     },
//     {
//       onError: (err) => {
//         console.log(err, "err fetching error logs");
//         toast.error("Failed to fetch error logs");
//       },
//       enabled: !!user?.token,
//       refetchInterval: autoRefresh ? refreshInterval : false,
//       refetchIntervalInBackground: true,
//       keepPreviousData: true,
//     }
//   );

//   // Update columns for error logs instead of user data
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
//         accessorKey: "timestamp",
//         header: ({ column }) => {
//           return (
//             <Button
//               variant="ghost"
//               onClick={() =>
//                 column.toggleSorting(column.getIsSorted() === "asc")
//               }
//             >
//               Timestamp
//               <ArrowUpDown />
//             </Button>
//           );
//         },
//         cell: ({ row }) => {
//           const timestamp = row.getValue("timestamp");
//           return (
//             <div className="text-sm">
//               {timestamp ? new Date(timestamp).toLocaleString() : "N/A"}
//             </div>
//           );
//         },
//       },
//       {
//         accessorKey: "level",
//         header: "Level",
//         cell: ({ row }) => {
//           const level = row.getValue("level");
//           const levelColors = {
//             error: "text-red-600 bg-red-50",
//             warn: "text-yellow-600 bg-yellow-50",
//             info: "text-blue-600 bg-blue-50",
//             debug: "text-gray-600 bg-gray-50",
//           };

//           return (
//             <span
//               className={`px-2 py-1 rounded text-xs font-medium ${
//                 levelColors[level] || "text-gray-600 bg-gray-50"
//               }`}
//             >
//               {level || "UNKNOWN"}
//             </span>
//           );
//         },
//       },
//       {
//         accessorKey: "message",
//         header: "Message",
//         cell: ({ row }) => {
//           const message = row.getValue("message");
//           return (
//             <div className="max-w-md truncate" title={message}>
//               {message || "No message"}
//             </div>
//           );
//         },
//       },
//       {
//         accessorKey: "source",
//         header: "Source",
//         cell: ({ row }) => (
//           <div className="text-sm">{row.getValue("source") || "Unknown"}</div>
//         ),
//       },
//       {
//         accessorKey: "userId",
//         header: "User ID",
//         cell: ({ row }) => {
//           const userId = row.getValue("userId");
//           return userId ? (
//             <div
//               className="text-sm cursor-pointer hover:underline text-blue-600"
//               onClick={() => window.open(`/user/${userId}`, "_blank")}
//             >
//               {userId}
//             </div>
//           ) : (
//             <div className="text-sm text-gray-400">System</div>
//           );
//         },
//       },
//       {
//         id: "actions",
//         enableHiding: false,
//         cell: ({ row }) => {
//           const log = row.original;

//           return (
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild className="hover:cursor-pointer">
//                 <Button variant="ghost" className="h-8 w-8 p-0">
//                   <span className="sr-only">Open menu</span>
//                   <MoreHorizontal />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end">
//                 <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                 <DropdownMenuItem
//                   onClick={() =>
//                     navigator.clipboard.writeText(log.id || log.message)
//                   }
//                   className="hover:cursor-pointer"
//                 >
//                   Copy log ID/message
//                 </DropdownMenuItem>
//                 <DropdownMenuItem
//                   onClick={() => {
//                     // Open detailed view or copy full error details
//                     const details = JSON.stringify(log, null, 2);
//                     navigator.clipboard.writeText(details);
//                     toast.success("Full log details copied to clipboard");
//                   }}
//                   className="hover:cursor-pointer"
//                 >
//                   Copy full details
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           );
//         },
//       },
//     ],
//     []
//   );

//   const table = useReactTable({
//     data: data?.data?.logs ?? [], // Updated to match error logs structure
//     columns,
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     onColumnVisibilityChange: setColumnVisibility,
//     onRowSelectionChange: setRowSelection,
//     state: {
//       sorting,
//       columnFilters,
//       columnVisibility,
//       rowSelection,
//     },
//     autoResetPageIndex: false,
//     autoResetExpanded: false,
//   });

//   const debouncedFilter = useMemo(
//     () =>
//       debounce((value) => {
//         table.getColumn("message")?.setFilterValue(value);
//       }, 1000),
//     [table]
//   );

//   const handleSearchChange = debounce((event) => {
//     setGlobalFilter(event.target.value);
//     refetch();
//   }, 1000);

//   // Manual refresh function
//   const handleManualRefresh = () => {
//     refetch();
//     toast.success("Error logs refreshed");
//   };

//   // Toggle auto-refresh
//   const toggleAutoRefresh = () => {
//     setAutoRefresh(!autoRefresh);
//     toast.info(autoRefresh ? "Auto-refresh disabled" : "Auto-refresh enabled");
//   };

//   return (
//     <div className="flex flex-col w-full">
//       {loading ? (
//         <div className="w-full bg-white rounded-md px-6 py-6">
//           <div className="flex items-center py-4">
//             <div className="h-10 w-48 bg-gray-200 rounded animate-pulse max-w-sm"></div>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <div className="h-10 w-32 bg-gray-200 rounded ml-auto animate-pulse"></div>
//               </DropdownMenuTrigger>
//             </DropdownMenu>
//           </div>

//           <div className="rounded-md border">
//             <Table>
//               <TableHeader>
//                 <TableRow className="bg-[#F8F8F8]">
//                   {table
//                     .getHeaderGroups()
//                     .map((headerGroup) =>
//                       headerGroup.headers.map((header) => (
//                         <TableHead key={header.id}>
//                           {header.isPlaceholder
//                             ? null
//                             : flexRender(
//                                 header.column.columnDef.header,
//                                 header.getContext()
//                               )}
//                         </TableHead>
//                       ))
//                     )}
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {Array.from({ length: 10 }).map((_, index) => (
//                   <TableRow key={index} className="animate-pulse">
//                     {columns.map((_, cellIndex) => (
//                       <TableCell key={cellIndex}>
//                         <div className="h-4 bg-gray-200 rounded w-full"></div>
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </div>
//       ) : isError ? (
//         <div className="w-full bg-white rounded-md px-6 py-4 text-center text-red-500">
//           <p>Error loading logs</p>
//           <Button onClick={handleManualRefresh} className="mt-2">
//             Retry
//           </Button>
//         </div>
//       ) : (
//         <div className="w-full bg-white rounded-md px-6">
//           {/* Controls section */}
//           <div className="flex items-center justify-between mt-4 mb-4">
//             <div className="flex items-center space-x-4">
//               <Input
//                 placeholder="Search error logs..."
//                 value={globalFilter}
//                 onChange={(event) => {
//                   setGlobalFilter(event.target.value);
//                   handleSearchChange(event);
//                 }}
//                 className="max-w-sm"
//               />

//               {/* Auto-refresh controls */}
//               <div className="flex items-center space-x-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={toggleAutoRefresh}
//                   className="flex items-center space-x-2"
//                 >
//                   {autoRefresh ? (
//                     <Pause className="h-4 w-4" />
//                   ) : (
//                     <Play className="h-4 w-4" />
//                   )}
//                   <span>{autoRefresh ? "Pause" : "Resume"}</span>
//                 </Button>

//                 <select
//                   value={refreshInterval}
//                   onChange={(e) => setRefreshInterval(Number(e.target.value))}
//                   className="text-sm border rounded px-2 py-1"
//                   disabled={!autoRefresh}
//                 >
//                   <option value={2000}>2s</option>
//                   <option value={5000}>5s</option>
//                   <option value={10000}>10s</option>
//                   <option value={30000}>30s</option>
//                 </select>
//               </div>

//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={handleManualRefresh}
//                 disabled={isFetching}
//                 className="flex items-center space-x-2"
//               >
//                 <RefreshCw
//                   className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
//                 />
//                 <span>Refresh</span>
//               </Button>
//             </div>

//             {/* Status indicator */}
//             <div className="flex items-center space-x-2 text-sm text-gray-600">
//               <div
//                 className={`w-2 h-2 rounded-full ${
//                   autoRefresh ? "bg-green-500" : "bg-gray-400"
//                 }`}
//               ></div>
//               <span>{autoRefresh ? "Live" : "Paused"}</span>
//               {isFetching && <span className="text-blue-600">Updating...</span>}
//             </div>
//           </div>

//           <div className="flex items-center py-4">
//             <Input
//               placeholder="Filter by message..."
//               defaultValue={table.getColumn("message")?.getFilterValue() ?? ""}
//               onChange={(event) => debouncedFilter(event.target.value)}
//               className="max-w-sm"
//             />

//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button
//                   variant="outline"
//                   className="ml-auto hover:cursor-pointer"
//                 >
//                   Columns <ChevronDown />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end">
//                 {table
//                   .getAllColumns()
//                   .filter((column) => column.getCanHide())
//                   .map((column) => {
//                     return (
//                       <DropdownMenuCheckboxItem
//                         key={column.id}
//                         className="capitalize"
//                         checked={column.getIsVisible()}
//                         onCheckedChange={(value) =>
//                           column.toggleVisibility(!!value)
//                         }
//                       >
//                         {column.id}
//                       </DropdownMenuCheckboxItem>
//                     );
//                   })}
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>

//           <div className="rounded-md border">
//             <Table>
//               <TableHeader>
//                 {table.getHeaderGroups().map((headerGroup) => (
//                   <TableRow key={headerGroup.id} className="bg-[#F8F8F8]">
//                     {headerGroup.headers.map((header) => {
//                       return (
//                         <TableHead key={header.id}>
//                           {header.isPlaceholder
//                             ? null
//                             : flexRender(
//                                 header.column.columnDef.header,
//                                 header.getContext()
//                               )}
//                         </TableHead>
//                       );
//                     })}
//                   </TableRow>
//                 ))}
//               </TableHeader>
//               <TableBody>
//                 {table.getRowModel().rows?.length ? (
//                   table.getRowModel().rows.map((row) => (
//                     <TableRow
//                       key={row.id}
//                       data-state={row.getIsSelected() && "selected"}
//                       className="hover:bg-gray-50"
//                     >
//                       {row.getVisibleCells().map((cell) => (
//                         <TableCell key={cell.id}>
//                           {flexRender(
//                             cell.column.columnDef.cell,
//                             cell.getContext()
//                           )}
//                         </TableCell>
//                       ))}
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell
//                       colSpan={columns.length}
//                       className="h-24 text-center"
//                     >
//                       No error logs found.
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </div>

//           <div className="flex items-center py-4 px-0">
//             <div className="text-sm text-muted-foreground mr-4 w-full">
//               {table.getFilteredSelectedRowModel().rows.length} of{" "}
//               {table.getFilteredRowModel().rows.length} row(s) selected.
//             </div>

//             <Pagination className="ml-auto mb-0">
//               <PaginationContent>
//                 <PaginationItem>
//                   <PaginationPrevious
//                     onClick={() => table.previousPage()}
//                     className={
//                       !table.getCanPreviousPage()
//                         ? "pointer-events-none opacity-50"
//                         : "hover:cursor-pointer"
//                     }
//                   />
//                 </PaginationItem>

//                 {[...Array(table.getPageCount())].map((_, index) => {
//                   if (
//                     table.getPageCount() <= 3 ||
//                     index < 2 ||
//                     index === table.getPageCount() - 1
//                   ) {
//                     return (
//                       <PaginationItem key={index}>
//                         <PaginationLink
//                           onClick={() => table.setPageIndex(index)}
//                           isActive={
//                             table.getState().pagination.pageIndex === index
//                           }
//                           className="hover:cursor-pointer"
//                         >
//                           {index + 1}
//                         </PaginationLink>
//                       </PaginationItem>
//                     );
//                   }
//                   if (index === 2 && table.getPageCount() > 3) {
//                     return (
//                       <PaginationItem key={index} className="mb-auto text-xl">
//                         ...
//                       </PaginationItem>
//                     );
//                   }
//                   return null;
//                 })}

//                 <PaginationItem>
//                   <PaginationNext
//                     onClick={() => table.nextPage()}
//                     className={
//                       !table.getCanNextPage()
//                         ? "pointer-events-none opacity-50"
//                         : "hover:cursor-pointer"
//                     }
//                   />
//                 </PaginationItem>
//               </PaginationContent>
//               <select
//                 value={table.getState().pagination.pageSize}
//                 onChange={(e) => {
//                   table.setPageSize(Number(e.target.value));
//                 }}
//                 className="ml-2 border rounded px-2 py-1 text-sm"
//               >
//                 {[10, 20, 30, 40, 50].map((pageSize) => (
//                   <option key={pageSize} value={pageSize}>
//                     {pageSize}
//                   </option>
//                 ))}
//               </select>
//             </Pagination>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default ErrorLogs;



import { useState, useMemo, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import debounce from "lodash/debounce";
import { ArrowUpDown, ChevronDown, MoreHorizontal, RefreshCw, Play, Pause, Wifi, WifiOff } from "lucide-react";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";
import React from "react";
//import Frame from "../../../assets/images/icons/Frame 7.svg";
import { useSession } from "next-auth/react";

const API_BASE_URL = "https://api.vigoplace.com";

function ErrorLogs() {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const getUser = useSession();
  const user = getUser?.data?.user;
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  
  // SSE state management
  const [logs, setLogs] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const eventSourceRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Connect to SSE stream
  const connectToStream = () => {
    if (!user?.token) return;
    
    setIsConnecting(true);
    setConnectionError(null);

    try {
      // Close existing connection if any
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      // Create new EventSource connection
      const eventSource = new EventSource(
        `${API_BASE_URL}/api/logs?limit=${pagination.pageSize}&offset=${pagination.pageIndex * pagination.pageSize}`,
        {
          headers: {
            Authorization: user.token,
          }
        }
      );

      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        setIsConnected(true);
        setIsConnecting(false);
        setConnectionError(null);
        toast.success("Connected to error logs stream");
      };

      eventSource.onmessage = (event) => {
        try {
          const newLog = JSON.parse(event.data);
          
          setLogs(prevLogs => {
            // Add new log to the beginning (most recent first)
            const updatedLogs = [newLog, ...prevLogs];
            
            // Keep only the last 1000 logs to prevent memory issues
            return updatedLogs.slice(0, 1000);
          });

          // Auto-scroll to top if enabled
          if (autoScroll && pagination.pageIndex === 0) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        } catch (error) {
          console.error("Error parsing log data:", error);
        }
      };

      eventSource.onerror = (error) => {
        console.error("SSE Error:", error);
        setIsConnected(false);
        setIsConnecting(false);
        setConnectionError("Connection lost. Retrying...");
        
        // Attempt to reconnect after 3 seconds
        setTimeout(() => {
          if (eventSourceRef.current?.readyState === EventSource.CLOSED) {
            connectToStream();
          }
        }, 3000);
      };

    } catch (error) {
      setIsConnecting(false);
      setConnectionError("Failed to connect to log stream");
      toast.error("Failed to connect to log stream");
    }
  };

  // Disconnect from stream
  const disconnectFromStream = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
    toast.info("Disconnected from log stream");
  };

  // Connect on component mount and when user token is available
  useEffect(() => {
    if (user?.token) {
      connectToStream();
    }

    // Cleanup on unmount
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [user?.token]);

  // Clear logs function
  const clearLogs = () => {
    setLogs([]);
    toast.info("Logs cleared");
  };

  const columns = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "timestamp",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Timestamp
              <ArrowUpDown />
            </Button>
          );
        },
        cell: ({ row }) => {
          const timestamp = row.getValue("timestamp");
          return (
            <div className="text-sm">
              {timestamp ? new Date(timestamp).toLocaleString() : "N/A"}
            </div>
          );
        },
      },
      // {
      //   accessorKey: "level",
      //   header: "Level",
      //   cell: ({ row }) => {
      //     const level = row.getValue("level");
      //     const levelColors = {
      //       error: "text-red-600 bg-red-50 border-red-200",
      //       warn: "text-yellow-600 bg-yellow-50 border-yellow-200",
      //       info: "text-blue-600 bg-blue-50 border-blue-200",
      //       debug: "text-gray-600 bg-gray-50 border-gray-200",
      //     };
          
      //     return (
      //       <span className={`px-2 py-1 rounded text-xs font-medium border ${levelColors[level] || "text-gray-600 bg-gray-50 border-gray-200"}`}>
      //         {(level || "UNKNOWN").toUpperCase()}
      //       </span>
      //     );
      //   },
      // },
      {
        accessorKey: "method", //message
        header: "Method",
        cell: ({ row }) => {
          const method = row.getValue("method");
          return (
            <div className="max-w-md truncate" title={method}>
              {method || "No message"}
            </div>
          );
        },
      },
      {
        accessorKey: "url",
        header: "Endpoint",
        cell: ({ row }) => (
          <div className="text-sm font-mono">{row.getValue("url") || "Unknown"}</div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status Code",
        cell: ({ row }) => (
          <div className="text-sm font-mono">{row.getValue("status") || "Unknown"}</div>
        ),
      },
      {
        accessorKey: "responseTime",
        header: "Response Time",
        cell: ({ row }) => (
          <div className="text-sm font-mono">{row.getValue("responseTime") || "Unknown"}</div>
        ),
      },
      // {
      //   accessorKey: "userId",
      //   header: "User ID",
      //   cell: ({ row }) => {
      //     const userId = row.getValue("userId");
      //     return userId ? (
      //       <div 
      //         className="text-sm cursor-pointer hover:underline text-blue-600 font-mono"
      //         onClick={() => window.open(`/user/${userId}`, "_blank")}
      //       >
      //         {userId}
      //       </div>
      //     ) : (
      //       <div className="text-sm text-gray-400">System</div>
      //     );
      //   },
      // },
      // {
      //   id: "actions",
      //   enableHiding: false,
      //   cell: ({ row }) => {
      //     const log = row.original;

      //     return (
      //       <DropdownMenu>
      //         <DropdownMenuTrigger asChild className="hover:cursor-pointer">
      //           <Button variant="ghost" className="h-8 w-8 p-0">
      //             <span className="sr-only">Open menu</span>
      //             <MoreHorizontal />
      //           </Button>
      //         </DropdownMenuTrigger>
      //         <DropdownMenuContent align="end">
      //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
      //           <DropdownMenuItem
      //             onClick={() => {
      //               navigator.clipboard.writeText(log.id || log.message);
      //               toast.success("Copied to clipboard");
      //             }}
      //             className="hover:cursor-pointer"
      //           >
      //             Copy log ID/message
      //           </DropdownMenuItem>
      //           <DropdownMenuItem
      //             onClick={() => {
      //               const details = JSON.stringify(log, null, 2);
      //               navigator.clipboard.writeText(details);
      //               toast.success("Full log details copied");
      //             }}
      //             className="hover:cursor-pointer"
      //           >
      //             Copy full details
      //           </DropdownMenuItem>
      //           <DropdownMenuSeparator />
      //           <DropdownMenuItem
      //             onClick={() => {
      //               // Filter to show only this log level
      //               table.getColumn("level")?.setFilterValue(log.level);
      //             }}
      //             className="hover:cursor-pointer"
      //           >
      //             Filter by level
      //           </DropdownMenuItem>
      //         </DropdownMenuContent>
      //       </DropdownMenu>
      //     );
      //   },
      // },
    ],
    []
  );

  const table = useReactTable({
    data: logs,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    autoResetPageIndex: false,
    autoResetExpanded: false,
  });

  const debouncedFilter = useMemo(
    () =>
      debounce((value) => {
        table.getColumn("message")?.setFilterValue(value);
      }, 500),
    [table]
  );

  return (
    <div className="flex flex-col w-full">
      <div className="w-full bg-white rounded-md px-6">
        {/* Connection Status and Controls */}
        <div className="flex items-center justify-between mt-4 mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <Wifi className="h-4 w-4 text-green-600" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-600" />
              )}
              <span className={`text-sm font-medium ${isConnected ? "text-green-600" : "text-red-600"}`}>
                {isConnecting ? "Connecting..." : isConnected ? "Live Stream Active" : "Disconnected"}
              </span>
              {connectionError && (
                <span className="text-sm text-red-500">({connectionError})</span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={isConnected ? disconnectFromStream : connectToStream}
                disabled={isConnecting}
                className="flex items-center space-x-2"
              >
                {isConnected ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                <span>{isConnected ? "Disconnect" : "Connect"}</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={clearLogs}
                className="flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Clear</span>
              </Button>
            </div>
          </div>

          {/* Log count and auto-scroll */}
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>{logs.length} logs total</span>
            <label className="flex items-center space-x-2">
              <Checkbox
                checked={autoScroll}
                onCheckedChange={setAutoScroll}
              />
              <span>Auto-scroll</span>
            </label>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Search logs..."
              value={globalFilter}
              onChange={(event) => {
                setGlobalFilter(event.target.value);
                debouncedFilter(event.target.value);
              }}
              className="max-w-sm"
            />
            
            {/* Level filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Filter Level <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => table.getColumn("level")?.setFilterValue("")}>
                  All Levels
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => table.getColumn("level")?.setFilterValue("error")}>
                  Errors Only
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => table.getColumn("level")?.setFilterValue("warn")}>
                  Warnings Only
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => table.getColumn("level")?.setFilterValue("info")}>
                  Info Only
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="ml-auto hover:cursor-pointer"
              >
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-[#F8F8F8]">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={`hover:bg-gray-50 ${
                      index === 0 && isConnected ? "bg-green-50 border-l-4 border-l-green-500" : ""
                    }`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {isConnected ? "Waiting for error logs..." : "Not connected to log stream"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="flex items-center py-4 px-0">
          <div className="text-sm text-muted-foreground mr-4 w-full">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
            {logs.length > 0 && (
              <span className="ml-2">
                ({logs.length} total logs in memory)
              </span>
            )}
          </div>

          <Pagination className="ml-auto mb-0">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => table.previousPage()}
                  className={
                    !table.getCanPreviousPage()
                      ? "pointer-events-none opacity-50"
                      : "hover:cursor-pointer"
                  }
                />
              </PaginationItem>

              {[...Array(table.getPageCount())].map((_, index) => {
                if (
                  table.getPageCount() <= 3 ||
                  index < 2 ||
                  index === table.getPageCount() - 1
                ) {
                  return (
                    <PaginationItem key={index}>
                      <PaginationLink
                        onClick={() => table.setPageIndex(index)}
                        isActive={
                          table.getState().pagination.pageIndex === index
                        }
                        className="hover:cursor-pointer"
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                if (index === 2 && table.getPageCount() > 3) {
                  return (
                    <PaginationItem key={index} className="mb-auto text-xl">
                      ...
                    </PaginationItem>
                  );
                }
                return null;
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => table.nextPage()}
                  className={
                    !table.getCanNextPage()
                      ? "pointer-events-none opacity-50"
                      : "hover:cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
              className="ml-2 border rounded px-2 py-1 text-sm"
            >
              {[10, 20, 30, 40, 50, 100].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default ErrorLogs;