import React, { useEffect, useMemo, useState } from "react";
import MaterialReactTable from "material-react-table";
import {
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  Tab,
  Tooltip,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import axios from "axios";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { format } from "date-fns";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
  useQuery,
  useMutation,
} from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Button, MenuItem, Typography } from "@mui/material";
import { useRouter } from "next/router";

function Tickets() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const getUser = useSession();
  const user = getUser?.data?.user;

  const [columnFilters, setColumnFilters] = React.useState([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [sorting, setSorting] = React.useState([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [gender, setGender] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [isVerified, setIsverified] = React.useState("");
  const [ticketType, setTicketType] = React.useState("unassigned");
  const [rowSelection, setRowSelection] = React.useState({});
  const [datalenght, setDatalenght] = useState(0);

  //console.log({ rowSelection });
  useEffect(() => {
    setPagination({ ...pagination, pageIndex: 0 });
  }, [columnFilters]);

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

  const { data, isError, isFetching, isLoading, refetch } = useQuery(
    [
      "fetchTickets",
      columnFilters, //refetch when columnFilters changes
      globalFilter, //refetch when globalFilter changes
      pagination.pageIndex, //refetch when pagination.pageIndex changes
      pagination.pageSize, //refetch when pagination.pageSize changes
      sorting, //refetch when sorting changes
      gender,
      status,
      isVerified,
      ticketType,
    ],
    async () => {
      const { data } = await axios.get(
        `https://vigoplace.com/server/api/admin/tickets/${ticketType}?limit=${1000}${
          columnFilters?.length >= 1
            ? `&search=${JSON.stringify(columnFilters)}`
            : ""
        }`,
        // `http://localhost:4000/api/admin/tickets/${ticketType}?limit=${1000}${
        //   columnFilters?.length >= 1
        //     ? `&search=${JSON.stringify(columnFilters)}`
        //     : ""
        // }`,

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
      return paginatedData;
    },
    {
      onError: (err) => {
        console.log(err, "err fetching users tickets");
      },
      enabled: !!user?.token,
    }
  );

  const handleTicketType = (event) => {
    setTicketType(event.target.value);
  };

  const handleStatus = (event) => {
    setStatus(event.target.value);
    setPagination({
      pageIndex: 0,
      pageSize: 10,
    });
  };

  return (
    <>
      <MaterialReactTable
        columns={columns}
        data={data ?? []}
        // enableColumnFilterModes
        // enableColumnOrdering
        // enableGrouping
        // enablePinning

        // enableRowActions
        enableStickyHeader
        enableStickyFooter
        manualPagination
        onPaginationChange={setPagination}
        rowCount={datalenght ?? 0}
        onColumnFiltersChange={setColumnFilters}
        onGlobalFilterChange={setGlobalFilter}
        initialState={{ showColumnFilters: false }}
        positionToolbarAlertBanner="bottom"
        enableGlobalFilter={false}
        muiToolbarAlertBannerProps={
          isError
            ? {
                color: "error",
                children:
                  "Error loading data, Please use the refresh button on the table to retry",
              }
            : undefined
        }
        onRowSelectionChange={setRowSelection}
        muiTableBodyRowProps={({ row }) => ({
          onClick: async () => {
            if (row.original.isRead === 0) {
              try {
                await axios.put(
                  `https://vigoplace.com/server/api/admin/ticket/${row.original.ticketId}`,
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
                <IconButton onClick={() => refetch()}>
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
          rowSelection,
        }}
        muiTableContainerProps={{ sx: { height: "75vh" } }}
      />
    </>
  );
}

Tickets.auth = true;
Tickets.role = ["admin", "subadmin", "administrator"];

export default Tickets;
