import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
  useQuery,
  useMutation,
} from "@tanstack/react-query";
import axios from "axios";
import {
  Grid,
  Box,
  Typography,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  useTheme,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import RefreshIcon from "@mui/icons-material/Refresh";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import LastPageIcon from "@mui/icons-material/LastPage";
import SearchIcon from "@mui/icons-material/Search";

export default function AutoPayout() {
  const queryClient = useQueryClient();
  const getUser = useSession();
  const users = getUser?.data?.user;
  const theme = useTheme();
  const [pagination, setPagination] = useState({
    pageSize: 10,
    pageIndex: 0,
  });
  const [globalFilter, setGlobalFilter] = React.useState("");

  const {
    data: data,
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useQuery(
    ["AutoPayoutUsers", globalFilter, pagination],
    async () => {
      const { data } = await axios.get(
        `https://api.vigoplace.com/api/admin/console/auto-payout?pageSize=${
          pagination.pageSize
        }&page=${pagination.pageIndex + 1}&search=${globalFilter}`,
        //`http://localhost:4000/api/admin/console/auto-payout?pageSize=${pagination.pageSize}&page=${pagination.pageIndex}&search=${globalFilter}`,
        {
          headers: {
            Authorization: users?.token,
          },
        }
      );

      //console.log(data);
      return data;
    },
    {
      onError: (err) => {
        console.log(err, "err fetching auto payout users");
      },
      enabled: !!users?.token,
    },
    { keepPreviousData: true }
  );

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, pageIndex: newPage });
    refetch();
  };

  const handleRowsPerPageChange = (event) => {
    setPagination({
      ...pagination,
      pageSize: parseInt(event.target.value, 10),
      pageIndex: 0,
    });
    refetch();
  };

  const handleSearchChange = (event) => {
    setGlobalFilter(event.target.value);
    refetch();
  };

  return (
    <>
      <Box sx={{ padding: 3 }}>
        <Grid container spacing={0}>
          <Grid item sm={12} xs={12} lg={12}>
            <Grid container spacing={2} alignItems="center" marginBottom={2}>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="h4"
                  color="text.primary"
                  sx={{ fontWeight: "bold" }}
                >
                  Auto Payout Users
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                container
                justifyContent="flex-end"
                alignItems="center"
                spacing={1}
              >
                <Grid item>
                  <TextField
                    label="Search"
                    variant="outlined"
                    value={globalFilter}
                    onChange={handleSearchChange}
                    InputLabelProps={{
                      sx: {
                        lineHeight: "0.8em",
                        "&.Mui-focused": {
                          lineHeight: "0.8em",
                        },
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                      sx: {
                        height: "36px",
                        "& .MuiOutlinedInput-input": {
                          py: "8px",
                        },
                      },
                    }}
                    sx={{
                      height: "36px",
                      "& .MuiOutlinedInput-root": {
                        height: "36px",
                      },
                    }}
                  />
                </Grid>
                <Grid item>
                  <Tooltip arrow title="Refresh Data">
                    <IconButton onClick={() => refetch()}>
                      <RefreshIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            </Grid>

            <TableContainer
              component={Paper}
              sx={{ width: "100%", marginBottom: 4 }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        borderRight: 1,
                        borderColor: "divider",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      FullName
                    </TableCell>
                    <TableCell
                      sx={{
                        borderRight: 1,
                        borderColor: "divider",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      Email
                    </TableCell>
                    <TableCell
                      sx={{
                        borderRight: 1,
                        borderColor: "divider",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      UserName
                    </TableCell>
                    <TableCell
                      sx={{
                        borderRight: 1,
                        borderColor: "divider",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      Phone
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.data?.AutoPayoutUsers?.map((user, index) => (
                    <TableRow key={user.id}>
                      <TableCell
                        sx={{
                          borderRight: 1,
                          borderColor: "divider",
                          //textAlign: "center",
                        }}
                      >
                        <a
                          href={user.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            cursor: "pointer",
                            textDecoration: "none",
                            color: "inherit",
                            borderBottom: "1px solid transparent",
                            transition: "border-color 0.2s ease",
                            "&:hover": {
                              borderBottomColor: "blue",
                              textDecoration: "underline",
                            },
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            const userId = user.id;
                            const url = `/user/${userId}`;
                            window.open(url, "_blank");
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.textDecoration = "underline";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.textDecoration = "none";
                          }}
                        >
                          {pagination.pageIndex * pagination.pageSize +
                            index +
                            1}
                          . {user.fullname}
                        </a>
                      </TableCell>

                      <TableCell
                        sx={{
                          borderRight: 1,
                          borderColor: "divider",
                          //textAlign: "center",
                        }}
                      >
                        {user.email}
                      </TableCell>
                      <TableCell
                        sx={{
                          borderRight: 1,
                          borderColor: "divider",
                          //textAlign: "center",
                        }}
                      >
                        {user.username}
                      </TableCell>
                      <TableCell
                        sx={{
                          borderRight: 1,
                          borderColor: "divider",
                          //textAlign: "center",
                        }}
                      >
                        {user.phone === null ? "Not Applicable" : user.phone}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={data?.data?.count || 0}
              rowsPerPage={pagination.pageSize}
              page={pagination.pageIndex}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              ActionsComponent={(props) => (
                <div style={{ display: "flex" }}>
                  <IconButton
                    onClick={() => handlePageChange(0)}
                    disabled={pagination.pageIndex === 0}
                  >
                    <FirstPageIcon />
                  </IconButton>
                  <IconButton
                    onClick={() =>
                      handlePageChange(pagination.pageIndex - 1)
                    }
                    disabled={pagination.pageIndex === 0}
                  >
                    <NavigateBeforeIcon />
                  </IconButton>
                  <IconButton
                    onClick={() =>
                      handlePageChange(pagination.pageIndex + 1)
                    }
                    disabled={
                      pagination.pageIndex >=
                      Math.ceil(
                        (data?.data?.count || 0) / pagination.pageSize
                      ) -
                        1
                    }
                  >
                    <NavigateNextIcon />
                  </IconButton>
                  <IconButton
                    onClick={() =>
                      handlePageChange(
                        Math.ceil(
                          (data?.data?.count || 0) / pagination.pageSize
                        ) - 1
                      )
                    }
                    disabled={
                      pagination.pageIndex >=
                      Math.ceil(
                        (data?.data?.count || 0) / pagination.pageSize
                      ) -
                        1
                    }
                  >
                    <LastPageIcon />
                  </IconButton>
                </div>
              )}
            />

            {/* <div style={{ display: "flex", gap: "0.5rem" }}>
              <Tooltip arrow title="Refresh Data">
                <IconButton onClick={() => refetch()}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </div> */}

            <Typography
              align="center"
              marginTop={3}
              variant="h3"
              color="text.secondary"
            >
              <b>Auto Payout Users</b>
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

AutoPayout.auth = true;
