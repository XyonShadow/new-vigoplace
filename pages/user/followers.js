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
  Typography,
  Box,
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

let prevUserId = null;
let prevPagination = null;

export default function Followers() {
  const router = useRouter();
  const { userid } = router.query;
  const queryClient = useQueryClient();
  const getUser = useSession();
  const user = getUser?.data?.user;
  const [followers, setFollowers] = useState([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [startUserDate, setStartUserDate] = useState("");
  const [endUserDate, setUserEndDate] = useState("");
  const [startFollowerDate, setStartFollowerDate] = useState("");
  const [endFollowerDate, setFollowerEndDate] = useState("");
  const [globalFilter, setGlobalFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [error, setError] = useState(false);
  const [anyDatePopulated, setAnyDatePopulated] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 20,
  });

  const handleUserStart = (event) => {
    setStartUserDate(event.target.value);
  };

  const handleUserEnd = (event) => {
    setUserEndDate(event.target.value);
  };

  const handleFollowerStart = (event) => {
    setStartFollowerDate(event.target.value);
  };

  const handleFollowerEnd = (event) => {
    setFollowerEndDate(event.target.value);
  };

  const handleSearch = (event) => {
    setGlobalFilter(event || "");
  };

  const fetchUserFollowers = async () => {
    setIsFetching(true);
    setIsLoading(true);
    try {
      const url = `${API_BASE_URL}/api/admin/console/followers?userId=${userid}&perPage=${
        pagination.pageSize
      }&page=${
        pagination.pageIndex + 1
      }&followRequestStart=${startFollowerDate}&followRequestEnd=${endFollowerDate}&userCreatedAtStart=${startUserDate}&userCreatedAtEnd=${endUserDate}&search=${globalFilter}`;

      const { data } = await axios.get(url, {
        headers: {
          Authorization: user?.token,
        },
      });

      //console.log(data);
      setFollowers(data?.data?.followers);
      setFollowerCount(data?.data?.totalFollowers);
    } catch (err) {
      setIsError(true);
      console.log(err, "err fetching user followers");
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  };

  // useEffect(() => {
  //   console.log(startUserDate);
  //   console.log(endUserDate);
  //   let shouldFetch = false;

  //   const allDateRangesAvailable =
  //     startUserDate !== "" &&
  //     endUserDate !== "" &&
  //     startFollowerDate !== "" &&
  //     endFollowerDate !== "";

  //   const anyDateEntered =
  //     (startUserDate !== "" && endUserDate !== "") ||
  //     (startFollowerDate !== "" && endFollowerDate !== "");

  //   //console.log(anyDateEntered)

  //   const searched = globalFilter !== "" || globalFilter === "";

  //   if (anyDateEntered) {
  //     setAnyDatePopulated(true);
  //   }

  //   console.log(anyDatePopulated);

  //   if (anyDatePopulated && !anyDateEntered) {
  //     console.log("here");
  //     shouldFetch = true;
  //     setAnyDatePopulated(false);
  //     setErrorText("");
  //     setError(false);
  //   }

  //   if (
  //     startUserDate &&
  //     endUserDate &&
  //     !startFollowerDate &&
  //     !endFollowerDate
  //   ) {
  //     console.log("hereeee");
  //     shouldFetch = true;
  //     setErrorText("");
  //     setError(false);
  //   } else if (
  //     !startUserDate &&
  //     !endUserDate &&
  //     startFollowerDate &&
  //     endFollowerDate
  //   ) {
  //     console.log("therrrreee");
  //     shouldFetch = true;
  //     setErrorText("");
  //     setError(false);
  //   }

  //   if (userid !== prevUserId || pagination !== prevPagination) {
  //     console.log("damnn");
  //     shouldFetch = true;
  //   }

  //   if (searched) {
  //     shouldFetch = true;
  //   }

  //   if (allDateRangesAvailable) {
  //     shouldFetch = false;
  //     setErrorText(
  //       "Please provide either user date range or follower date range, but not both."
  //     );
  //     setError(true);
  //     setFollowers([]);
  //     setFollowerCount(0);
  //   }

  //   //console.log(shouldFetch)
  //   if (shouldFetch) {
  //     fetchUserFollowers();
  //   }

  //   prevUserId = userid;
  //   prevPagination = pagination;
  // }, [
  //   userid,
  //   pagination,
  //   startUserDate,
  //   endUserDate,
  //   startFollowerDate,
  //   endFollowerDate,
  //   anyDatePopulated,
  //   globalFilter,
  // ]);


  //2

  // useEffect(() => {
  //   // Determine whether to fetch data based on conditions
  //   const shouldFetch =
  //     (startUserDate && endUserDate) || (startFollowerDate && endFollowerDate);

  //   if (shouldFetch) {
  //     fetchUserFollowers();
  //   }
  // }, [startUserDate, endUserDate, startFollowerDate, endFollowerDate]);


  //3
  useEffect(() => {
    // Determine whether to fetch data based on conditions
    const shouldFetch =
      (startUserDate && !endUserDate) ||
      (!startUserDate && endUserDate) ||
      (startFollowerDate && !endFollowerDate) ||
      (!startFollowerDate && endFollowerDate);
  
    if (shouldFetch) {
      setErrorText(
        "Please provide either user date range or follower date range, but not both."
      );
    } else {
      setErrorText(""); // Clear error text if conditions are met
      fetchUserFollowers();
    }
  }, [startUserDate, endUserDate, startFollowerDate, endFollowerDate]);
  
  // useEffect for refetching when all inputs are cleared
  useEffect(() => {
    const allInputsCleared =
      startUserDate === "" &&
      endUserDate === "" &&
      startFollowerDate === "" &&
      endFollowerDate === "";
  
    if (allInputsCleared) {
      fetchUserFollowers();
    }
  }, [startUserDate, endUserDate, startFollowerDate, endFollowerDate, pagination]); 
  
  console.log(pagination)
  

  const columns = useMemo(
    () => [
      {
        accessorKey: "UId",
        enableClickToCopy: false,
        header: "User Id",
      },
      {
        accessorKey: "UEmail",
        enableClickToCopy: false,
        header: "Email",
      },
      {
        accessorKey: "UFullName",
        enableClickToCopy: false,
        header: "Fullname",
      },
      {
        accessorKey: "UUsername",
        enableClickToCopy: false,
        header: "Username",
      },
      {
        accessorFn: (row) => {
          if (row?.FollowerCreatedAt) {
            return format(
              new Date(row.FollowerCreatedAt),
              "MM/dd/yyyy hh:mm a"
            );
          } else {
            return "";
          }
        },
        enableClickToCopy: false,
        header: "Followed Date",
      },
      {
        accessorFn: (row) => {
          if (row?.UCreatedAt) {
            return format(new Date(row.UCreatedAt), "MM/dd/yyyy hh:mm a");
          } else {
            return "";
          }
        },
        enableClickToCopy: false,
        header: "Create Account Date",
      },
      {
        accessorFn: (row) => {
          if (row?.ULastLogin) {
            return format(new Date(row.ULastLogin), "MM/dd/yyyy hh:mm a");
          } else {
            return "";
          }
        },
        enableClickToCopy: false,
        header: "User Last Login",
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
        data={followers}
        enableStickyHeader
        enablePagination
        manualPagination
        manualFiltering
        onPaginationChange={setPagination}
        rowCount={followerCount}
        onGlobalFilterChange={handleSearch}
        initialState={{ showColumnFilters: false }}
        positionToolbarAlertBanner="bottom"
        muiToolbarAlertBannerProps={
          isError
            ? {
                color: "error",
                children:
                  "Error loading data, Please use the refresh button on the table to retry",
              }
            : error
            ? {
                color: "error",
                children: errorText,
              }
            : undefined
        }
        renderTopToolbarCustomActions={({ table }) => {
          return (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Tooltip arrow title="Refresh Data">
                <IconButton onClick={() => fetchUserFollowers()}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>

              <Box
                sx={{
                  display: "flex",
                  gap: 20,
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: "10px",
                  }}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    User Creation Date
                  </InputLabel>
                  <Box sx={{ display: "flex", flexDirection: "row" }}>
                    <FormControl
                      variant="standard"
                      //sx={{ m: 1, minWidth: 120 }}
                    >
                      <label htmlFor="startUserDate">
                        {" "}
                        <Typography
                          sx={{
                            fontWeight: 500,
                            fontSize: "14px",
                          }}
                        >
                          Start date
                        </Typography>
                      </label>
                      <input
                        style={{ marginRight: "2px" }}
                        className="text-xs"
                        type="date"
                        id="startUserDate"
                        value={startUserDate}
                        onChange={handleUserStart}
                      />

                      <label htmlFor="endUserDate">
                        {" "}
                        <Typography
                          sx={{
                            fontWeight: 500,
                            fontSize: "14px",
                          }}
                        >
                          End date
                        </Typography>
                      </label>
                      <input
                        className="text-xs"
                        type="date"
                        id="endUserDate"
                        value={endUserDate}
                        onChange={handleUserEnd}
                      />
                    </FormControl>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <InputLabel id="demo-simple-select-standard-label">
                    Followed Date
                  </InputLabel>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <FormControl
                      variant="standard"
                      //sx={{ m: 1, minWidth: 120 }}
                    >
                      <label htmlFor="startFollowerDate">
                        {" "}
                        <Typography
                          sx={{
                            fontWeight: 500,
                            fontSize: "14px",
                          }}
                        >
                          Start date
                        </Typography>
                      </label>
                      <input
                        style={{ marginRight: "2px" }}
                        className="text-xs"
                        type="date"
                        id="startFollowerDate"
                        value={startFollowerDate}
                        onChange={handleFollowerStart}
                      />

                      <label htmlFor="endFollowerDate">
                        {" "}
                        <Typography
                          sx={{
                            fontWeight: 500,
                            fontSize: "14px",
                          }}
                        >
                          End date
                        </Typography>
                      </label>
                      <input
                        className="text-xs"
                        type="date"
                        id="endFollowerDate"
                        value={endFollowerDate}
                        onChange={handleFollowerEnd}
                      />
                    </FormControl>
                  </Box>
                </Box>
              </Box>
            </div>
          );
        }}
        state={{
          isLoading,
          showAlertBanner: isError || error,
          showProgressBars: isFetching,
          pagination,
          globalFilter,
        }}
        muiTableContainerProps={{ sx: { height: "75vh" } }}
      />
    </>
  );
}
