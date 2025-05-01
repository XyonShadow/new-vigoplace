import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Checkbox } from "../../../components/ui/checkbox";
import { format } from "date-fns";
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
} from "@/components/ui/table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
} from "@/components/ui/pagination";
import React from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import Frame from "../../../assets/images/icons/Frame 7.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const API_BASE_URL = "https://api.vigoplace.com";
//const API_BASE_URL = "http://localhost:4000";
export default function OnboardedUserSales({ repsUsername }) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [error, setError] = useState(null);
  const [rowSelection, setRowSelection] = useState({});
  const [result, setResult] = useState([]);
  const [username, setUsername] = useState("");
  const queryClient = useQueryClient();
  const getUser = useSession();
  const user = getUser?.data?.user;
  const [selectedDate, setSelectedDate] = useState(new Date());

  const month = selectedDate.getMonth() + 1;
  const year = selectedDate.getFullYear();

  const {
    data,
    isError,
    isFetching,
    isLoading: loading,
    refetch,
  } = useQuery(
    ["onboardUsers", columnFilters, sorting, selectedDate],
    async () => {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/admin/onboarded/65?month=${month}&year=${year}`,
        {
          headers: {
            Authorization: user?.token,
          },
        }
      );

      console.log("data", data);
      setResult(data?.data ?? []);
      toast.success("Onboarded users Fetched", {
        description: "Successfully onboarded users.",
      });
      return data;
    },
    {
      onError: (err) => {
        console.log(err, "err fetching onboarded users");
      },
      enabled: !!user?.token,
    },
    { keepPreviousData: true }
  );

  const onAddUser = async (userName) => {
    try {
      const { data: responseData } = await axios.post(
        `${API_BASE_URL}/api/admin/add`,
        { repsUsername, userName },
        {
          headers: {
            Authorization: user?.token,
          },
        }
      );

      if (responseData?.flag === true) {
        toast.success("User Added", {
          description: `The user has been added among onboarded users.`,
        });
        await queryClient.invalidateQueries({
          queryKey: ["onboardUsers"],
        });
        return true;
      }

      if (responseData?.flag === false) {
        toast.error("User addition Failed", {
          description: responseData?.message,
        });
      }
      return false;
    } catch (err) {
      toast.error("User addition Failed", {
        description:
          err instanceof Error ? err.message : "An unexpected error occurred.",
      });
      return false;
    }
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
        id: "UFullName",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Name
              <ArrowUpDown />
            </Button>
          );
        },
        cell: ({ row }) => {
          const name = row.original.UFullName;

          return (
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src={Frame} />
                <AvatarFallback>US</AvatarFallback>
              </Avatar>
              <span
                className="lowercase ml-3"
                onClick={() => {
                  const userId = row.original.UId;
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
        accessorFn: (row) => `${row.UFullName}`,
      },
      {
        accessorKey: "UEmail",
        header: "Email",
        cell: ({ row }) => (
          <div className="lowercase">{row.getValue("UEmail")}</div>
        ),
      },
      {
        accessorKey: "UUsername",
        header: "Username",
        cell: ({ row }) => <div className="">{row.getValue("UUsername")}</div>,
      },
      {
        accessorKey: "UKycVerified",
        header: "Kyc Verified",
        cell: ({ row }) => {
          const isVerified = row.getValue("UKycVerified") === "verified";
          return (
            <div className="flex items-center">
              {isVerified ? (
                <span className="text-green-500">✔</span>
              ) : (
                <span className="text-red-500">✘</span>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "HasWallet",
        header: "Has Wallet",
        cell: ({ row }) => {
          const hasWallet = row.getValue("HasWallet") === true;
          return (
            <div className="flex items-center">
              {hasWallet ? (
                <span className="text-green-500">✔</span>
              ) : (
                <span className="text-red-500">✘</span>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "BalanceStatus",
        header: "Positive Wallet",
        cell: ({ row }) => {
          const positiveWallet = row.getValue("BalanceStatus") === "positive";
          return (
            <div className="flex items-center">
              {positiveWallet ? (
                <span className="text-green-500">✔</span>
              ) : (
                <span className="text-red-500">✘</span>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "",
        header: "Amount Earned",
        cell: ({ row }) => {
          const isVerified = row.getValue("UKycVerified") === "verified";
          const hasWallet = row.getValue("HasWallet") === true;
          const positiveWallet = row.getValue("BalanceStatus") === "positive";

          const amountEarned =
            isVerified && hasWallet && positiveWallet ? 1500 : 1000;

          return <div className="">{amountEarned}</div>;
        },
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
                  onClick={() => navigator.clipboard.writeText(user.UId)}
                  className="hover:cursor-pointer"
                >
                  Copy user ID
                </DropdownMenuItem>
                {/* <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="hover:cursor-pointer text-blue-500"
                    onClick={async () => {
                      setSelectedUser(user);
                      setOpen(true);
                    }}
                  >
                    Add among sales reps
                  </DropdownMenuItem> */}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: result,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const debouncedFilter = useCallback(
    (value) => {
      const filterFunc = debounce((filterValue) => {
        table.getColumn("UFullName")?.setFilterValue(filterValue);
      }, 2000);
      filterFunc(value);
    },
    [table]
  );

  return (
    <>
      <div className="flex flex-col items-left space-y-2 px-6 mb-5">
        <h2 className="text-2xl font-semibold text-gray-900 text-center">
          Onboarded Users
        </h2>

        <div className="">
          <h2 className="text-sm font-semibold text-center mb-2">
            Add a user by username to join onboarded users
          </h2>
          <Input
            placeholder="Username"
            onChange={(event) => setUsername(event.target.value)}
            className="max-w-sm mx-auto mb-2"
          />
          <div className="flex justify-center mt-2 mb-6">
            <Button
              onClick={() => onAddUser(username)}
              disabled={!username}
              className="text-center w-full max-w-sm"
            >
              Add User
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center space-x-4 mb-4">
        <label htmlFor="month-picker" className="text-sm font-medium">
          Pick Month & Year:
        </label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="MM/yyyy"
          showMonthYearPicker
          className="border px-3 py-2 rounded-md"
        />
        <Button onClick={() => refetch()} className="text-center">
          Fetch Users
        </Button>
      </div>

      <div className="flex flex-col w-full px-6">
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
        ) : error ? (
          <div className="w-full bg-white rounded-md px-6 py-4 text-center text-red-500">
            <p>Error: {error}</p>
          </div>
        ) : (
          <div className="w-full bg-white rounded-md px-6">
            <div className="flex items-center py-4">
              <Input
                placeholder="Filter notification operations..."
                defaultValue={
                  table.getColumn("UFullName")?.getFilterValue() ?? ""
                }
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
                          {/* <PaginationEllipsis className='mb-0'/> */}
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
              </Pagination>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
