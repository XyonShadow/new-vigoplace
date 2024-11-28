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
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import LastPageIcon from "@mui/icons-material/LastPage";
import { format } from "date-fns";

export default function Virtual() {
  const queryClient = useQueryClient();
  const getUser = useSession();
  const users = getUser?.data?.user;
  const theme = useTheme();
  const [pagination, setPagination] = useState({
    pageSize: 10,
    pageIndex: 0,
  });

  const { data, isError, isFetching, isLoading, refetch } = useQuery(
    ["fetchVirtualAccounts", pagination],
    async () => {
      const { data } = await axios.get(
        `https://api.vigoplace.com/api/admin/console/virtual-accounts?pageSize=${
          pagination.pageSize
        }&page=${pagination.pageIndex + 1}`,
        //`http://localhost:7000/api/admin/console/virtual-accounts?pageSize=${pagination.pageSize}&page=${pagination.pageIndex}`,
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
        console.log(err, "err fetching user virtual accounts");
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

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "-";
    try {
      return format(new Date(dateTime), "dd/MM/yyyy hh:mm a");
    } catch (error) {
      return "-";
    }
  };

  return (
    <>
      <Box sx={{ padding: 5 }}>
        <Grid container spacing={0}>
          <Grid item sm={12} xs={12} lg={12}>
            <Typography
              variant="h4"
              color="text.primary"
              marginBottom={2}
              sx={{ fontWeight: "bold" }}
            >
              Users Virtual Accounts
            </Typography>

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
                        marginLeft: "10px",
                        //display: "flex",
                        alignContent: "center",
                        justifyContent: "center",
                        textAlign: "center",
                      }}
                    >
                      S/N
                    </TableCell>

                    <TableCell
                      sx={{
                        textAlign: "left",
                        borderRight: 1,
                        borderColor: "divider",
                        fontWeight: "bold",
                        marginLeft: "10px",
                        //display: "flex",
                        alignContent: "center",
                        justifyContent: "center",
                      }}
                    >
                      Account Name
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "left",
                        borderRight: 1,
                        borderColor: "divider",
                        fontWeight: "bold",
                        marginLeft: "10px",
                        //display: "flex",
                        alignContent: "center",
                        justifyContent: "center",
                      }}
                    >
                      Account Number
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "left",
                        borderRight: 1,
                        borderColor: "divider",
                        fontWeight: "bold",
                        marginLeft: "10px",
                        //display: "flex",
                        alignContent: "center",
                        justifyContent: "center",
                      }}
                    >
                      Date Issued
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.data?.result?.map((user, index) => (
                    <TableRow key={user?.OVAUserId}>
                      <TableCell
                        sx={{
                          textAlign: "left",
                          borderRight: 1,
                          borderColor: "divider",
                        }}
                      >
                        {pagination.pageIndex * pagination.pageSize + index + 1}
                      </TableCell>
                      <TableCell
                        sx={{
                          borderRight: 1,
                          borderColor: "divider",
                          textAlign: "left",
                        }}
                      >
                        <a
                          href={`/user/${user?.OVAUserId}`}
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
                            const userId = user.OVAUserId;
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
                          {user?.OVAAccountName}
                        </a>
                      </TableCell>

                      <TableCell
                        sx={{
                          textAlign: "left",
                          borderRight: 1,
                          borderColor: "divider",
                        }}
                      >
                        {user?.OVAAccountNumber}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "left",
                          borderRight: 1,
                          borderColor: "divider",
                        }}
                      >
                        {formatDateTime(user?.OVACreatedAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[10, 25, 50, 100]}
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
                    onClick={() => handlePageChange(pagination.pageIndex - 1)}
                    disabled={pagination.pageIndex === 0}
                  >
                    <NavigateBeforeIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handlePageChange(pagination.pageIndex + 1)}
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
              <b>Users Virtual Accounts</b>
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

Virtual.auth = true;
