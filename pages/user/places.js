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

const API_BASE_URL = "https://vigoplace.com/server";
//const API_BASE_URL = "http://localhost:4000";
export default function Places() {
  const router = useRouter();
  const { userid } = router.query;
  const queryClient = useQueryClient();
  const getUser = useSession();
  const user = getUser?.data?.user;
  const [places, setPlaces] = useState([]);
  const [placeCount, setPlaceCount] = useState(0);
  const [globalFilter, setGlobalFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });

  const handleSearch = (event) => {
    setGlobalFilter(event || "");
  };

  const fetchUserPlaces = async () => {
    setIsFetching(true);
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/admin/places/user/${userid}?perPage=${pagination.pageSize}&page=${pagination.pageIndex}&search=${globalFilter}`,
        {
          headers: {
            Authorization: user?.token,
          },
        }
      );

      //console.log(data);
      setPlaces(data?.data ?? []);
      setPlaceCount(data?.totalPlaces ?? 0);
    } catch (err) {
      setIsError(true);
      console.log(err, "err fetching user places");
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchUserPlaces();
  }, [userid, pagination, globalFilter]);

  const placesColumns = useMemo(
    () => [
      {
        accessorKey: "placeId",
        enableClickToCopy: false,
        header: "Id",
      },
      {
        accessorKey: "placeName",
        enableClickToCopy: true,
        header: "Place Name",
      },
      {
        accessorKey: "placeCategory",
        enableClickToCopy: false,
        header: "Category",
        render: (rowData) => renderCellData(rowData, "placeCategory"),
      },
      {
        accessorKey: "placeDescription",
        enableClickToCopy: false,
        header: "Place Description",
      },
      {
        accessorKey: "placeAddress",
        enableClickToCopy: false,
        header: "Place Address",
      },
      {
        accessorKey: "sysPlace",
        enableClickToCopy: false,
        header: "Sys Place",
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
        columns={placesColumns}
        data={places}
        enableStickyHeader
        enablePagination
        manualPagination
        manualFiltering
        onPaginationChange={setPagination}
        rowCount={placeCount}
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
            : undefined
        }
        renderTopToolbarCustomActions={({ table }) => {
          return (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Tooltip arrow title="Refresh Data">
                <IconButton onClick={() => fetchUserPlaces()}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
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
