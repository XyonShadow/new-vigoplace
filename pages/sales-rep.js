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
import { SalessRep } from "../src/components/table/SalesRep";
import { UsersTable2 } from "@/src/components/table/UsersTable2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const API_BASE_URL = "https://api.vigoplace.com";
//const API_BASE_URL = "http://localhost:4000";
export default function SalesRep() {
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
  const [selectedDate, setSelectedDate] = useState(new Date());

  const month = selectedDate.getMonth() + 1;
  const year = selectedDate.getFullYear();

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
    ["usersales", columnFilters, sorting],
    async () => {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/admin/list?month=${month}&year=${year}`,
        {
          headers: {
            Authorization: user?.token,
          },
        }
      );

      setResult(data?.data ?? []);
      //console.log(data?.data);
      toast.success("Sales representatives Fetched", {
        description: "Successfully fetched sales reps.",
      });
      return data;
    },
    {
      onError: (err) => {
        console.log(err, "err fetching sales reps");
      },
      enabled: !!user?.token,
    },
    { keepPreviousData: true }
  );

  const {
    data: data2,
    //isError,
    isFetching: isFetching3,
    isLoading: loading2,
    refetch: refetch2,
  } = useQuery(
    ["usersfetching", columnFilters3, sorting3, users],
    async () => {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/admin/console/notification/user?search=${users}`,
        {
          headers: {
            Authorization: user?.token,
          },
        }
      );

      setResult2(data?.data ?? []);
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

  const onAddUser = async (userId) => {
    try {
      const { data: responseData } = await axios.post(
        `${API_BASE_URL}/api/admin/create`,
        { userId },
        {
          headers: {
            Authorization: user?.token,
          },
        }
      );

      if (responseData?.flag === true) {
        toast.success("User Added", {
          description: `The user has been added among sales representatives.`,
        });
        await queryClient.invalidateQueries({
          queryKey: ["usersales"],
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
          err instanceof Error
            ? err.response.data.message
            : "An unexpected error occurred.",
      });
      return false;
    }
  };

  //   const debouncedFilter = useCallback(
  //     (value) => {
  //       const filterFunc = debounce((filterValue) => {
  //         table.getColumn("SNOOperation")?.setFilterValue(filterValue);
  //       }, 2000);
  //       filterFunc(value);
  //     },
  //     [table]
  //   );

  //   const handleOperationChange = (value) => {
  //     if (value !== operationId) {
  //       setOperationId(value);
  //     }
  //   };

  const debouncedFilter = useCallback(
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
      <div className="flex flex-col items-left space-y-2 px-6 mb-5 mt-10">
        <h2 className="text-left text-2xl font-semibold text-gray-900">
          Sales Representatives
        </h2>
      </div>

      <div className="px-6">
        {/* <div className="mb-2 bg-white lg:w-[50%] md:w-full">
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
        </div> */}

        <div>
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
            {/* <Button onClick={() => refetch()} className="text-center">
                  Fetch Users
                </Button> */}
          </div>
          <SalessRep sales={result} loading={loading} error={error} />
        </div>
      </div>

      <div className="flex flex-col items-left space-y-2 px-6 mb-5 mt-10">
        <h2 className="text-left text-2xl font-semibold text-gray-900">
          Fetch Users to add to among sales representatives
        </h2>
      </div>

      <div className="px-6 mb-10">
        <div className="mb-2 bg-white lg:w-[50%] md:w-full">
          <Input
            placeholder="Search for users...."
            defaultValue={""}
            onChange={(event) => debouncedFilter(event.target.value)}
            className="w-full min-h-[45px] border-gray-300 focus:ring-blue-500"
          />
        </div>

        <div>
          <UsersTable2
            users={result2}
            onAddUser={onAddUser}
            loading2={loading2}
            error2={error2}
          />
        </div>
      </div>
    </>
  );
}
