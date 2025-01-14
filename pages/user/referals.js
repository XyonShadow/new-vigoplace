import React, { useMemo, useState, useEffect } from "react";
import MaterialReactTable from "material-react-table";
import { useRouter } from "next/router";
import axios from "axios";
import { format } from "date-fns";
//Material UI Imports
import {
  IconButton,
  Tooltip,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

//useQuery Imports
import {
  useQueryClient,
} from "@tanstack/react-query";
import { getSession, useSession } from "next-auth/react";

const API_BASE_URL = "https://api.vigoplace.com";
//const API_BASE_URL = "http://localhost:4000";
export default function Referals() {
  const router = useRouter();
  const { userid } = router.query;
  const queryClient = useQueryClient();
  const getUser = useSession();
  const user = getUser?.data?.user;
  const [referals, setReferals] = useState([]);
  const [referalsCount, setReferalsCount] = useState(0);
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

  const fetchUserReferals = async () => {
    setIsFetching(true);
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/admin/console/users/referrals/${userid}?perPage=${
          pagination.pageSize
        }&page=${
          pagination.pageIndex + 1
        }&search=${globalFilter}`,
        {
          headers: {
            Authorization: user?.token,
          },
        }
      );

      //console.log(data);
      setReferals(data?.data?.referrals ?? []);
      setReferalsCount(data?.data?.count ?? 0);
    } catch (err) {
      setIsError(true);
      console.log(err, "err fetching user referals");
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchUserReferals();
  }, [userid, pagination, globalFilter]);

  const referalsColumns = useMemo(
    () => [
      {
        accessorKey: "referredUser",
        header: "Referred User",
        muiTableBodyCellProps: ({ cell }) => ({
          style: {
            cursor: "pointer",
          },
          onClick: () => {
            //console.log(cell.getValue());
            const userId = cell.row.original.referredId;
            const url = `/user/${userId}`;
            window.open(url, "_blank");
          },
          onMouseEnter: (e) => {
            e.target.style.textDecoration = "underline";
          },
          onMouseLeave: (e) => {
            e.target.style.textDecoration = "none";
          },
        }),
        enableClickToCopy: false,
        id: "referredUser",
      },
      {
        id: "phone",
        accessorFn: (row) => row.phone?.split("-")[0],
        enableClickToCopy: false,
        header: "Phone",
      },
      {
        accessorKey: "status",
        accessorFn: (row) => row.status,
        Cell: ({ cell }) => {
          const status = cell.getValue();
          let color = "black";
          if (status === "completed") {
            color = "#22c55e";
          } else if (status === "pending") {
            color = "#f97316";
          }
          return <span style={{ color }}>{status}</span>;
        },
        enableClickToCopy: false,
        header: "Status",
      },
      {
        accessorFn: (row) => {
          if (row?.createdAt) {
            return format(new Date(row.createdAt), "MM/dd/yyyy hh:mm a");
          } else {
            return "";
          }
        },
        enableClickToCopy: false,
        header: "Date",
      },
      {
        accessorKey: "amount",
        enableClickToCopy: false,
        header: "Amount",
      },
      {
        id: "walletId",
        accessorFn: (row) => row.walletId,
        Cell: ({ cell }) => {
          const wallet = cell.getValue();
          let text = "";
          if (wallet === null) {
            text = "No";
          } else {
            text = "Yes";
          }
          return <span>{text}</span>;
        },
        enableClickToCopy: false,
        header: "Has Wallet",
      },
      {
        id: "accountId",
        accessorFn: (row) => row.accountId,
        Cell: ({ cell }) => {
          const account = cell.getValue();
          let text = "";
          if (account === null) {
            text = "No";
          } else {
            text = "Yes";
          }
          return <span>{text}</span>;
        },
        enableClickToCopy: false,
        header: "Has virtual account",
      },
      {
        id: "kycStatus",
        Cell: ({ row }) => {
          const walletId = row.original.walletId;
          const accountId = row.original.accountId;

          let status = "pending";
          let color = "#f97316";
          if (walletId !== null && accountId !== null) {
            status = "completed";
            color = "#22c55e";
          }

          return <span style={{ color }}>{status}</span>;
        },
        enableClickToCopy: false,
        header: "Kyc Completed Status",
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
        columns={referalsColumns}
        data={referals}
        enableStickyHeader
        enablePagination
        manualPagination
        manualFiltering
        onPaginationChange={setPagination}
        rowCount={referalsCount}
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
                <IconButton onClick={() => fetchUserReferals()}>
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
