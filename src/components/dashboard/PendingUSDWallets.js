import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Checkbox } from "../../../components/ui/checkbox";
import debounce from "lodash/debounce";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../../components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import axios from "axios";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../components/ui/pagination";
import React from "react";
import Frame from "../../../assets/images/icons/Frame 7.svg";
import { useSession } from "next-auth/react";

const API_BASE_URL = "https://api.vigoplace.com";
//const API_BASE_URL = "http://localhost:4000";
export const PendingUSDWallets = () => {
  const queryClient = useQueryClient();
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

  const {
    data,
    isError,
    isFetching,
    isLoading: loading,
    refetch,
  } = useQuery(
    ["nonKyc", columnFilters, sorting, pagination],
    async () => {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/admin/console/users/dollar/unverified-wallets?perPage=${
          pagination.pageSize
        }&page=${pagination.pageIndex + 1}&search=${globalFilter}`,
        {
          headers: {
            Authorization: user?.token,
          },
        }
      );

      //console.log(data);

      toast.success("Users Fetched", {
        description: "Successfully fetched users.",
      });
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
        id: "fullName",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Full Name
              <ArrowUpDown />
            </Button>
          );
        },
        cell: ({ row }) => {
          const name = row.original.fullName;
          const initials = name
            ? name
                .split(" ")
                .map((word) => word[0])
                .join("")
                .toUpperCase()
            : "US";

          return (
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src={Frame} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <span
                className="lowercase ml-3"
                onClick={() => {
                  const userId = row.original.userId;
                  const url = `/user/${userId}`;
                  window.open(url, "_blank");
                }}
                onMouseEnter={(e) => {
                  e.target.style.textDecoration = "underline";
                }}
                onMouseLeave={(e) => {
                  e.target.style.textDecoration = "none";
                }}
                style={{ cursor: "pointer" }}
              >{`${name}`}</span>
            </div>
          );
        },
        accessorFn: (row) => `${row.fullName}`,
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <div className="lowercase">{row.getValue("email")}</div>
        ),
      },
      {
        accessorKey: "username",
        header: "Username",
        cell: ({ row }) => (
          <div className="lowercase">{row.getValue("username")}</div>
        ),
      },
      {
        accessorKey: "walletBalance",
        header: "Wallet Balance",
        cell: ({ row }) => (
          <div className="">{row.getValue("walletBalance")}</div>
        ),
      },
      {
        accessorKey: "restrictedBalance",
        header: "Restricted Balance",
        cell: ({ row }) => (
          <div className="">{row.getValue("restrictedBalance")}</div>
        ),
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const user = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="hover:cursor-pointer">
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(user.userId)}
                  className="hover:cursor-pointer"
                >
                  Copy user ID
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: data?.data?.users ?? [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    //getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    rowCount: data?.data?.count,
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
        table.getColumn("fullName")?.setFilterValue(value);
      }, 2000),
    [table]
  );

  const handleSearchChange = debounce((event) => {
    setGlobalFilter(event.target.value);
    refetch();
  }, 2000);

  return (
    <div className="flex flex-col w-full">
      {loading ? (
        <div className="w-full bg-white rounded-md px-6 py-6">
          <div className="flex items-center py-4">
            <div className="h-10 w-48 bg-gray-200 rounded animate-pulse max-w-sm"></div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="h-10 w-32 bg-gray-200 rounded ml-auto animate-pulse"></div>
              </DropdownMenuTrigger>
            </DropdownMenu>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#F8F8F8]">
                  {table
                    .getHeaderGroups()
                    .map((headerGroup) =>
                      headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))
                    )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 10 }).map((_, index) => (
                  <TableRow key={index} className="animate-pulse">
                    {columns.map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : isError ? (
        <div className="w-full bg-white rounded-md px-6 py-4 text-center text-red-500">
          <p>Error: {isError}</p>
        </div>
      ) : (
        <div className="w-full bg-white rounded-md px-6">
          <Input
            placeholder="Global search..."
            value={globalFilter}
            onChange={(event) => {
              setGlobalFilter(event.target.value);
              handleSearchChange(event);
            }}
            className="max-w-sm mt-4"
          />
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter names..."
              defaultValue={table.getColumn("fullName")?.getFilterValue() ?? ""}
              onChange={(event) => debouncedFilter(event.target.value)}
              className="max-w-sm"
            />
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
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
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
                      No results.
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
              >
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
            </Pagination>
          </div>
        </div>
      )}
    </div>
  );
};
