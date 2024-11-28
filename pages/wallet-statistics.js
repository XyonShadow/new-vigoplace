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

export default function Wallet() {
  const queryClient = useQueryClient();
  const getUser = useSession();
  const users = getUser?.data?.user;
  const theme = useTheme();
  const [currency, setCurrency] = useState("Naira");
  const [pagination, setPagination] = useState({
    pageSize: 10,
    pageIndex: 0,
  });

  const {
    data: balance,
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useQuery(
    ["fetchWalletBalance", currency, pagination],
    async () => {
      const { data } = await axios.get(
        `https://api.vigoplace.com/api/admin/console/wallet/balances?currency=${currency}&perPage=${
          pagination.pageSize
        }&page=${pagination.pageIndex + 1}`,
        //`http://localhost:4000/api/admin/console/wallet/balances?currency=${currency}&pageSize=${pagination.pageSize}&page=${pagination.pageIndex}`,
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
        console.log(err, "err fetching wallet balances");
      },
      enabled: !!users?.token,
    },
    { keepPreviousData: true }
  );

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
    setPagination({ ...pagination, pageIndex: 0 });
  };

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

  const formatCurrency = (value, currency) => {
    if (typeof value === "number") {
      if (currency === "Naira") {
        return `₦${value.toFixed(2)}`;
      } else if (currency === "USD") {
        return `$${value.toFixed(2)}`;
      }
    }
    return value;
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          marginLeft: 5,
        }}
      >
        <InputLabel htmlFor="currency">
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: "14px",
              [theme.breakpoints.down("sm")]: {
                fontSize: "12px",
              },
            }}
          >
            Currency
          </Typography>
        </InputLabel>
        <Select
          label=""
          id="currency"
          value={currency}
          onChange={handleCurrencyChange}
          sx={{
            height: "30px",
            width: "100px",
            "& .MuiSelect-select": {
              minHeight: "30px",
              lineHeight: "30px",
            },
            "& .MuiInputBase-input": {
              fontSize: "12px",
            },
            "& .MuiListItem-root": {
              minHeight: "30px",
            },
            "& .MuiMenuItem-root": {
              fontSize: "10px",
            },
          }}
        >
          <MenuItem value="USD">USD</MenuItem>
          <MenuItem value="Naira">Naira</MenuItem>
        </Select>
      </Box>
      <Box sx={{ padding: 5 }}>
        <Grid container spacing={0}>
          <Grid item sm={12} xs={12} lg={12}>
            <Typography
              variant="h4"
              color="text.primary"
              marginBottom={2}
              sx={{ fontWeight: "bold" }}
            >
              Users Wallet Statistics
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
                        borderRight: 1,
                        borderColor: "divider",
                        fontWeight: "bold",
                        marginLeft: "10px",
                        //display: "flex",
                        textAlign: "left",
                        alignContent: "center",
                        justifyContent: "center",
                      }}
                    >
                      Users
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", textAlign: "left" }}>
                      {currency === "Naira" ? "Naira" : "Dollar"} Wallet Balance
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {balance?.data?.result?.map((user, index) => (
                    <TableRow key={user.userId}>
                      <TableCell
                        sx={{
                          textAlign: "center",
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
                            const userId = user.userId;
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
                          {user.fullName}
                        </a>
                      </TableCell>

                      <TableCell sx={{ textAlign: "left" }}>
                        {formatCurrency(user.balance, currency)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[10, 25, 50, 100]}
              component="div"
              count={balance?.data?.count || 0}
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
                        (balance?.data?.count || 0) / pagination.pageSize
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
                          (balance?.data?.count || 0) / pagination.pageSize
                        ) - 1
                      )
                    }
                    disabled={
                      pagination.pageIndex >=
                      Math.ceil(
                        (balance?.data?.count || 0) / pagination.pageSize
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
              <b>Users Wallet Statistics</b>
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

Wallet.auth = true;
