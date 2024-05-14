import React, { useMemo, useState, useEffect } from "react";
import MaterialReactTable from "material-react-table";
import { useRouter } from "next/router";
import axios from "axios";
import { format } from "date-fns";
//Material UI Imports
import {
  IconButton,
  Tooltip,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

//useQuery Imports
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
  useQuery,
  useMutation,
} from "@tanstack/react-query";
import { getSession, useSession } from "next-auth/react";

const API_BASE_URL = "https://api.vigoplace.com";
//const API_BASE_URL = "http://localhost:4000";
export default function Tickets() {
  const router = useRouter();
  const { userid } = router.query;
  const queryClient = useQueryClient();
  const getUser = useSession();
  const user = getUser?.data?.user;
  const [tickets, setTickets] = useState([]);
  const [ticketCount, setTicketCount] = useState(0);
  const [globalFilter, setGlobalFilter] = useState("");
  const [status, setStatus] = React.useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [ticketType, setTicketType] = useState("unassigned");
  const [datalenght, setDatalenght] = useState(0);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });

  const handleStatus = (event) => {
    setStatus(event.target.value);
  };

  const handleSearch = (event) => {
    setGlobalFilter(event || "");
  };

  const handleTicketType = (event) => {
    setTicketType(event.target.value);
  };

  const fetchUserTickets = async () => {
    setIsFetching(true);
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `https://api.vigoplace.com/api/admin/tickets/${ticketType}/user?id=${userid}limit=${1000}${
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

      //console.log(data);
      setDatalenght(data?.count?.total);

      const sortedData = data?.data?.results?.sort(
        (a, b) => Date.parse(b.date) - Date.parse(a.date)
      );
      const paginatedData = sortedData.slice(
        pagination.pageIndex * pagination.pageSize,
        (pagination.pageIndex + 1) * pagination.pageSize
      );

      setTickets(paginatedData)
      return paginatedData;
    } catch (err) {
      setIsError(true);
      console.log(err, "err fetching user tickets");
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchUserTickets();
  }, [userid, status, pagination, globalFilter]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "username",
        enableClickToCopy: false,
        header: "Username",
        muiTableBodyCellProps: ({ cell }) => ({
          style: {
            fontWeight: cell.row.original.isRead === 0 ? 700 : "inherit",
          },
        }),
      },
      {
        accessorKey: "categoryName",
        enableClickToCopy: false,
        enableColumnFilter: false,
        header: "Category",
        muiTableBodyCellProps: ({ cell }) => ({
          style: {
            fontWeight: cell.row.original.isRead === 0 ? 700 : "inherit",
          },
        }),
      },
      {
        accessorKey: "subject",
        enableClickToCopy: false,
        enableColumnFilter: false,
        header: "Subject",
        Cell: ({ cell }) => {
          const subject = cell?.row?.original?.subject || "";

          // Define the maximum number of words to display
          const maxWords = 7;

          // Split the description into words
          const words = subject.split(" ");

          // Truncate the description if it exceeds the maximum number of words
          const truncatedSubject =
            words.length > maxWords
              ? words.slice(0, maxWords).join(" ") + "..."
              : subject;

          return <div>{truncatedSubject}</div>;
        },
        muiTableBodyCellProps: ({ cell }) => ({
          style: {
            fontWeight: cell.row.original.isRead === 0 ? 700 : "inherit",
          },
        }),
      },
      {
        accessorKey: "message",
        Cell: ({ cell }) => {
          const message = cell?.row?.original?.message || "";

          let words;
          if (message.includes("||")) {
            // Split the message into sentences
            const sentences = message.split("||");
            // Get the last sentence
            const lastSentence =
              sentences.length > 0 ? sentences[sentences.length - 1] : "";
            // Split the last sentence into words
            words = lastSentence.split(" ");
          } else {
            words = message.split(" ");
          }

          // Define the maximum number of words to display
          const maxWords = 7;

          // Truncate the last sentence if it exceeds the maximum number of words
          const truncatedMessage =
            words.length > maxWords
              ? words.slice(0, maxWords).join(" ") + "..."
              : words.join(" ");

          return <div>{truncatedMessage}</div>;
        },
        enableClickToCopy: false,
        enableColumnFilter: false,
        header: "Description",
        muiTableBodyCellProps: ({ cell }) => ({
          style: {
            fontWeight: cell.row.original.isRead === 0 ? 700 : "inherit",
          },
        }),
      },
      {
        accessorKey: "status",
        enableClickToCopy: false,
        // enableColumnFilter: false,
        header: "Status",
        filterFn: "equals",
        filterSelectOptions: [
          { text: "queued", value: "Queued" },
          { text: "in-progress", value: "In-progress" },
          { text: "resolved", value: "Resolved" },
          { text: "closed", value: "Closed" },
          { text: "permanently-closed", value: "Permanently-closed" },
        ],
        filterVariant: "select",
        muiTableBodyCellProps: ({ cell }) => ({
          style: {
            fontWeight: cell.row.original.isRead === 0 ? 700 : "inherit",
          },
        }),
      },
      {
        accessorKey: "ticketReference",
        enableClickToCopy: false,
        enableColumnFilter: false,
        header: "Reference",
        muiTableBodyCellProps: ({ cell }) => ({
          style: {
            fontWeight: cell.row.original.isRead === 0 ? 700 : "inherit",
          },
        }),
      },
      {
        accessorFn: (row) => format(new Date(row.date), "Pp"),
        id: "date",
        enableClickToCopy: false,
        header: "Date",
        muiTableBodyCellProps: ({ cell }) => ({
          style: {
            fontWeight: cell.row.original.isRead === 0 ? 700 : "inherit",
          },
        }),
      },
    ],
    []
  );

  return (
    <>
      <MaterialReactTable
        enableColumnFilterModes
        enableColumnOrdering
        enablePinning
        columns={columns}
        data={tickets ?? []}
        enableStickyHeader
        enablePagination
        manualPagination
        manualFiltering
        onPaginationChange={setPagination}
        rowCount={datalenght ?? 0}
        onGlobalFilterChange={handleSearch}
        onRowSelectionChange={setRowSelection}
        initialState={{ showColumnFilters: false }}
        positionToolbarAlertBanner="bottom"
        muiToolbarAlertBannerProps={
          isError
            ? {
                color: "error",
                children:
                  "Error loading data, Please use the refresh button on the table to retry",
              }
            : undefined
        }
        muiTableBodyRowProps={({ row }) => ({
          onClick: async () => {
            if (row.original.isRead === 0) {
              try {
                await axios.put(
                  `https://api.vigoplace.com/api/admin/ticket/${row.original.ticketId}`,
                  {
                    isRead: 1,
                  },
                  {
                    headers: {
                      Authorization: user?.token,
                    },
                  }
                );

                queryClient.invalidateQueries("fetchTicketss");
              } catch (error) {
                console.error("Error updating isRead:", error);
              }
            }
            router.push(`/tickets/${row.original.ticketId}`);
          },
          sx: { cursor: "pointer" },
        })}
        renderTopToolbarCustomActions={({ table }) => {
          return (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Tooltip arrow title="Refresh Data">
                <IconButton onClick={() => fetchUserTickets()}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>

              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-standard-label">
                  Ticket State
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={ticketType}
                  defaultValue="unassigned"
                  onChange={handleTicketType}
                  label="Ticket State"
                >
                  <MenuItem value=""></MenuItem>
                  <MenuItem value={"unassigned"}>Unassigned</MenuItem>
                  <MenuItem value={"assigned"}>Assigned</MenuItem>
                </Select>
              </FormControl>
            </div>
          );
        }}
        state={{
          isLoading,
          showAlertBanner: isError,
          showProgressBars: isFetching,
          pagination,
          globalFilter,
        }}
        muiTableContainerProps={{ sx: { height: "75vh" } }}
      />
    </>
  );
}
