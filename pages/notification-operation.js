import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import { format } from "date-fns";
import debounce from "lodash/debounce";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
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
import Frame from "../assets/images/icons/Frame 7.svg";
import { UsersNotification } from "../src/components/table/UsersNotification";
import { UsersTable } from "../src/components/table/UsersTable";

const API_BASE_URL = "https://api.vigoplace.com";
//const API_BASE_URL = "http://localhost:4000";
export default function OpNotification() {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [error, setError] = useState(null);
  const [rowSelection, setRowSelection] = useState({});
  const [result, setResult] = useState([]);

  const [sorting2, setSorting2] = useState([]);
  const [columnFilters2, setColumnFilters2] = useState([]);
  const [error2, setError2] = useState(null);
  const [result2, setResult2] = useState([]);
  const [operationId, setOperationId] = useState("");
  const [selectKey, setSelectKey] = useState(0);

  const [sorting3, setSorting3] = useState([]);
  const [columnFilters3, setColumnFilters3] = useState([]);
  const [error3, setError3] = useState(null);
  const [result3, setResult3] = useState([]);
  const [users, setUsers] = useState("");

  const queryClient = useQueryClient();
  const getUser = useSession();
  const user = getUser?.data?.user;

  const {
    data,
    isError,
    isFetching,
    isLoading: loading,
    refetch,
  } = useQuery(
    ["operations", columnFilters, sorting],
    async () => {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/admin/console/notification/operations`,
        {
          headers: {
            Authorization: user?.token,
          },
        }
      );

      setResult(data?.data ?? []);
      toast.success("Operations Fetched", {
        description: "Successfully fetched operations.",
      });
      return data;
    },
    {
      onError: (err) => {
        console.log(err, "err fetching notification operations");
      },
      enabled: !!user?.token,
    },
    { keepPreviousData: true }
  );

  const {
    data: data2,
    //isError,
    isFetching: isFetching2,
    isLoading: loading2,
    refetch: refetch2,
  } = useQuery(
    ["useroperations", columnFilters2, sorting2, operationId],
    async () => {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/admin/console/users/notification/operations?operationId=${operationId}`,
        {
          headers: {
            Authorization: user?.token,
          },
        }
      );

      setResult2(data?.data ?? []);
      toast.success("Users Fetched", {
        description: "Successfully fetched users.",
      });
      return data;
    },
    {
      onError: (err) => {
        console.log(err, "err fetching user operations");
      },
      enabled: !!user?.token && operationId !== "",
    },
    { keepPreviousData: true }
  );

  const {
    data: data3,
    //isError,
    isFetching: isFetching3,
    isLoading: loading3,
    refetch: refetch3,
  } = useQuery(
    ["userop", columnFilters3, sorting3, users],
    async () => {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/admin/console/notification/user?search=${users}`,
        {
          headers: {
            Authorization: user?.token,
          },
        }
      );

      setResult3(data?.data ?? []);
      return data;
    },
    {
      onError: (err) => {
        toast.error("Error", {
          description: "Error fetching users.",
        });
        console.log(err, "err fetching users");
      },
      enabled: !!user?.token,
    },
    { keepPreviousData: true }
  );

  const onDeleteUser = async (userId, operationId) => {
    try {
      const { data: responseData } = await axios.post(
        `${API_BASE_URL}/api/admin/console/remove/user/notification/operation`,
        { userId, operationId },
        {
          headers: {
            Authorization: user?.token,
          },
        }
      );

      if (responseData?.flag === true) {
        toast.success("User Removed", {
          description: "The user has been successfully removed.",
        });
        return true;
      }
      return false;
    } catch (err) {
      toast.error("User removal Failed", {
        description:
          err instanceof Error ? err.response.data.message : "An unexpected error occurred.",
      });
      return false;
    }
  };

  const onAddUser = async (userId, operationId) => {
    try {
      const { data: responseData } = await axios.post(
        `${API_BASE_URL}/api/admin/console/add/user/notification/operation`,
        { userId, operationId },
        {
          headers: {
            Authorization: user?.token,
          },
        }
      );

      if (responseData?.flag === true) {
        toast.success("User Added", {
          description: `The user has been added to the notification operation.`,
        });
        await queryClient.invalidateQueries({
          queryKey: ["useroperations"],
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
          err instanceof Error ? err.response.data.message : "An unexpected error occurred.",
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
        id: "SNOOperation",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Operation
              <ArrowUpDown />
            </Button>
          );
        },
        cell: ({ row }) => {
          const operation = row.original.SNOOperation;

          return (
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src={Frame} />
                <AvatarFallback>OP</AvatarFallback>
              </Avatar>
              <span className="lowercase ml-3">{`${operation}`}</span>
            </div>
          );
        },
        accessorFn: (row) => `${row.SNOOperation}`,
      },
      {
        accessorKey: "SNOCreatedAt",
        header: () => <div>Created At</div>,
        cell: ({ row }) => {
          const date = row.getValue("SNOCreatedAt");

          if (!date) return <div className="text-right">—</div>;

          const formattedDate =
            typeof date === "string" || typeof date === "number"
              ? format(new Date(date), "EEE do, MMM")
              : "Invalid Date";

          return <div className="">{formattedDate}</div>;
        },
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const operation = row.original;

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
                  onClick={() => navigator.clipboard.writeText(operation.SNOId)}
                  className="hover:cursor-pointer"
                >
                  Copy Operation ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {/* <DropdownMenuItem className="hover:cursor-pointer">View Skill details</DropdownMenuItem> */}
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
        table.getColumn("SNOOperation")?.setFilterValue(filterValue);
      }, 2000);
      filterFunc(value);
    },
    [table]
  );

  const handleOperationChange = (value) => {
    if (value !== operationId) {
      setOperationId(value);
    }
  };

  const debouncedFilter2 = useCallback(
    (value) => {
      const filterFunc = debounce((filterValue) => {
        setUsers(filterValue);
      }, 2000);
      filterFunc(value);
    },
    [users]
  );

  return (
    <>
      <div className="flex flex-col items-left space-y-2 px-6 mb-5">
        <h2 className="text-left text-2xl font-semibold text-gray-900">
          Notification Operations
        </h2>
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
                  table.getColumn("SNOOperation")?.getFilterValue() ?? ""
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

      <div className="flex flex-col items-left space-y-2 px-6 mb-5 mt-10">
        <h2 className="text-left text-2xl font-semibold text-gray-900">
          Fetch Users for a particular operation
        </h2>
      </div>

      <div className="px-6">
        <div className="mb-2 bg-white lg:w-[50%] md:w-full">
          <Select
            onValueChange={handleOperationChange}
            disabled={loading}
            key={selectKey}
          >
            <SelectTrigger className="w-full min-h-[45px] border-gray-300 focus:ring-blue-500 hover:cursor-pointer">
              <SelectValue
                placeholder={
                  loading ? "Loading operations..." : "Choose an operation"
                }
              />
            </SelectTrigger>

            <SelectContent
              position="popper"
              className="max-h-60 overflow-y-auto z-50 bg-white shadow-md border border-gray-300 rounded-md"
            >
              {result?.map((operation) => (
                <SelectItem
                  key={operation.SNOId}
                  value={operation.SNOId}
                  className="w-full"
                >
                  {operation.SNOOperation}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <UsersNotification
            operation={result2}
            operationId={operationId}
            onDeleteUser={onDeleteUser}
            loading2={loading2}
            error2={error2}
          />
        </div>
      </div>

      <div className="flex flex-col items-left space-y-2 px-6 mb-5 mt-10">
        <h2 className="text-left text-2xl font-semibold text-gray-900">
          Fetch Users to add to an operation
        </h2>
      </div>

      <div className="px-6 mb-10">
        <div className="mb-2 bg-white lg:w-[50%] md:w-full">
          <Input
            placeholder="Search for users...."
            defaultValue={""}
            onChange={(event) => debouncedFilter2(event.target.value)}
            className="w-full min-h-[45px] border-gray-300 focus:ring-blue-500"
          />
        </div>

        <div>
          <UsersTable
            operations={result}
            users={result3}
            onAddUser={onAddUser}
            loading3={loading3}
            error3={error3}
          />
        </div>
      </div>
    </>
  );
}
