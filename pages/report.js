import React, { useEffect, useMemo, useState } from "react";
import MaterialReactTable from "material-react-table";
import {
  IconButton,
  InputAdornment,
  Paper,
  Tab,
  Tooltip,
  Box,
  Tabs,
  Grid,
  Typography,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import axios from "axios";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { format } from "date-fns";
import PropTypes from "prop-types";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Reports() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const getUser = useSession();
  const user = getUser?.data?.user;
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [pagination1, setPagination1] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [tabValue, setTabValue] = React.useState(0);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

//   useEffect(() => {
//     setPagination({ ...pagination, pageIndex: 0 });
//   }, [columnFilters]);

//   useEffect(() => {
//     setPagination1({ ...pagination1, pageIndex: 1 });
//   }, [columnFilters]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  console.log(pagination1)

  const accountColumn = useMemo(
    () => [
      {
        accessorKey: "reporterPlaceId",
        enableClickToCopy: false,
        header: "reporterPlaceId",
      },
      {
        accessorKey: "reporterFullName",
        header: "reporterFullName",
        muiTableBodyCellProps: ({ cell }) => ({
          style: {
            cursor: "pointer",
          },
          onClick: () => {
            const userId = cell.row.original.reporterUserId;
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
        id: "reporterUserId",
      },
      {
        accessorKey: "reporteePlaceId",
        enableClickToCopy: false,
        header: "reporteePlaceId",
      },
      {
        accessorKey: "reporteeFullName",
        header: "reporteeFullName",
        muiTableBodyCellProps: ({ cell }) => ({
          style: {
            cursor: "pointer",
          },
          onClick: () => {
            //console.log(cell.getValue());
            const userId = cell.row.original.reporteeUserId;
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
        id: "reporteeUserId",
      },
      {
        accessorKey: "reportedDescription",
        enableClickToCopy: false,
        header: "reportedDescription",
      },
      {
        accessorKey: "categoryName",
        enableClickToCopy: false,
        header: "categoryName",
      },
    ],
    []
  );

  const postColumn = useMemo(
    () => [
      {
        accessorKey: "reporterPlaceId",
        enableClickToCopy: false,
        header: "reporterPlaceId",
      },
      {
        accessorKey: "reporterFullName",
        header: "reporterFullName",
        muiTableBodyCellProps: ({ cell }) => ({
          style: {
            cursor: "pointer",
          },
          onClick: () => {
            //console.log(cell.getValue());
            const userId = cell.row.original.reporterId;
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
        id: "reporterUserId",
      },
      {
        accessorKey: "reportedPostId",
        enableClickToCopy: false,
        header: "reportedPostId",
      },
      {
        accessorKey: "reportedDescription",
        enableClickToCopy: false,
        header: "reportedDescription",
      },
      {
        accessorKey: "categoryName",
        enableClickToCopy: false,
        header: "categoryName",
      },
    ],
    []
  );

  const { data, isError, isFetching, isLoading, refetch } = useQuery(
    [
      "fetchAccountReports",
      columnFilters,
      globalFilter,
      pagination,
    ],
    async () => {
      const { data } = await axios.get(
        `https://vigoplace.com/server/api/admin/console/account-reports?perPage=${pagination.pageSize}&page=${pagination.pageIndex}`,
        //`http://localhost:4000/api/admin/console/account-reports?perPage=${pagination.pageSize}&page=${pagination.pageIndex}`,
        {
          headers: {
            Authorization: user?.token,
          },
        }
      );

      console.log(data);
      return data;
    },
    {
      onError: (err) => {
        console.log(err, "err fetching account reports");
      },
      enabled: !!user?.token,
    }
  );

  const {
    data: data1,
    isError: isError1,
    isFetching: isFetching1,
    isLoading: isLoading1,
    refetch: refetch1,
  } = useQuery(
    [
      "fetchPostReports",
      columnFilters,
      globalFilter,
      pagination1,
    ],
    async () => {
      const { data } = await axios.get(
        `https://vigoplace.com/server/api/admin/console/post-reports?perPage=${pagination1.pageSize}&page=${pagination1.pageIndex}`,
        // `http://localhost:4000/api/admin/console/post-reports?perPage=${pagination1.pageSize}&page=${pagination1.pageIndex}`,
        {
          headers: {
            Authorization: user?.token,
          },
        }
      );

      console.log(data);

      return data;
    },
    {
      onError: (err) => {
        console.log(err, "err fetching post reports");
      },
      enabled: !!user?.token,
    }
  );

  return (
    <>
      <Grid
        container
        spacing={0}
        sx={{
          display: "flex",
          background: "",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Grid item sm={12} xs={12} lg={12}>
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                textColor="inherit"
                centered
                scrollButtons="auto"
                aria-label=""
              >
                <Tab label="Account Reports" {...a11yProps(0)} />
                <Tab label="Post Reports" {...a11yProps(1)} />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <Box sx={{ pt: 3 }}>
                <MaterialReactTable
                  columns={accountColumn}
                  data={data?.data?.result ?? []}
                //   enableColumnFilterModes
                //   enableColumnOrdering
                //   enableGrouping
                //   enablePinning
                  //enableRowActions
                  enableStickyHeader
                  enableStickyFooter
                  manualPagination
                  onPaginationChange={setPagination}
                  rowCount={data?.data?.count ?? 0}
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
                  renderTopToolbarCustomActions={({ table }) => {
                    return (
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <Tooltip arrow title="Refresh Data">
                          <IconButton onClick={() => refetch()}>
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
                  }}
                  muiTableContainerProps={{ sx: { height: "75vh" } }}
                />
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Box sx={{ pt: 3 }}>
                <MaterialReactTable
                  columns={postColumn}
                  data={data1?.data?.result ?? []}
                //   enableColumnFilterModes
                //   enableColumnOrdering
                //   enableGrouping
                //   enablePinning
                  //enableRowActions
                  enableStickyHeader
                  enableStickyFooter
                  manualPagination
                  onPaginationChange={setPagination1}
                  rowCount={data1?.data?.count ?? 0}
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
                  renderTopToolbarCustomActions={({ table }) => {
                    return (
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <Tooltip arrow title="Refresh Data">
                          <IconButton onClick={() => refetch1()}>
                            <RefreshIcon />
                          </IconButton>
                        </Tooltip>
                      </div>
                    );
                  }}
                  state={{
                    isLoading1,
                    showAlertBanner: isError1,
                    showProgressBars: isFetching1,
                    pagination1,
                  }}
                  muiTableContainerProps={{ sx: { height: "75vh" } }}
                />
              </Box>
            </TabPanel>
          </Box>
        </Grid>
      </Grid>

      <Typography
        align="center"
        marginTop={1}
        variant="h3"
        color="text.secondary"
      >
        <b>Reports</b>
      </Typography>
    </>
  );
}

Reports.auth = true;

export default Reports;
