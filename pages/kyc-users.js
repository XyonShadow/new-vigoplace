import React, { useEffect, useMemo, useState, useCallback } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import { format } from "date-fns";
import PropTypes from "prop-types";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import MuiAlert from "@mui/material/Alert";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import LastPageIcon from "@mui/icons-material/LastPage";

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

function KycUsers() {
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
  const [pagination2, setPagination2] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [pagination3, setPagination3] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [tabValue, setTabValue] = React.useState(0);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [globalFilter1, setGlobalFilter1] = React.useState("");
  const [globalFilter2, setGlobalFilter2] = React.useState("");
  const [globalFilter3, setGlobalFilter3] = React.useState("");

//   const [data2, setData2] = useState(null);
// const [isLoading2, setIsLoading2] = useState(false);
// const [isError2, setIsError2] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const { data, isError, isFetching, isLoading, refetch } = useQuery(
    ["fetchVerifiedKycUsers", globalFilter, pagination],
    async () => {
      const { data } = await axios.get(
        `https://api.vigoplace.com/api/admin/console/kyc-verified?perPage=${pagination.pageSize}&page=${pagination.pageIndex}&search=${globalFilter}`,
        //`http://localhost:4000/api/admin/console/kyc-verified?perPage=${pagination.pageSize}&page=${pagination + 1}&search=${globalFilter}`,
        {
          headers: {
            Authorization: user?.token,
          },
        }
      );

      //console.log(data);
      return data;
    },
    {
      onError: (err) => {
        console.log(err, "err fetching verified kyc users");
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
    ["fetchUnVerifiedKycUsers", globalFilter1, pagination1],
    async () => {
      const { data } = await axios.get(
        `https://api.vigoplace.com/api/admin/console/kyc-unverified?perPage=${pagination1.pageSize}&page=${pagination1.pageIndex}&search=${globalFilter1}`,
        //`http://localhost:4000/api/admin/console/kyc-unverified?perPage=${pagination1.pageSize}&page=${pagination1.pageIndex + 1}&search=${globalFilter1}`,
        {
          headers: {
            Authorization: user?.token,
          },
        }
      );

      //console.log(data);

      return data;
    },
    {
      onError: (err) => {
        console.log(err, "err fetching unverified kyc users");
      },
      enabled: !!user?.token,
    }
  );

  const {
    data: data2,
    isError: isError2,
    isFetching: isFetching2,
    isLoading: isLoading2,
    refetch: refetch2,
  } = useQuery(
    ["manualVerificationKycUsers", globalFilter2, pagination2],
    async () => {
      const { data } = await axios.get(
        `https://api.vigoplace.com/api/admin/console/kyc-slip-status?perPage=${pagination2.pageSize}&page=${pagination2.pageIndex + 1}&search=${globalFilter2}`,
        //`http://localhost:4000/api/admin/console/kyc-unverified?perPage=${pagination1.pageSize}&page=${pagination1.pageIndex + 1}&search=${globalFilter1}`,
        {
          headers: {
            Authorization: user?.token,
          },
        }
      );

      //console.log(data);

      return data;
    },
    {
      keepPreviousData: true,
      onError: (err) => {
        console.log(err, "err fetching manual verification kyc users");
      },
      enabled: !!user?.token,
    }
    );

    const {
      data: data3,
      isError: isError3,
      isFetching: isFetching3,
      isLoading: isLoading3,
      refetch: refetch3,
    } = useQuery(
      ["pending", globalFilter3, pagination3],
      async () => {
        const { data } = await axios.get(
          `https://api.vigoplace.com/api/admin/console/kyc-pending-status?perPage=${pagination3.pageSize}&page=${pagination3.pageIndex + 1}&search=${globalFilter3}`,
          //`http://localhost:4000/api/admin/console/kyc-unverified?perPage=${pagination1.pageSize}&page=${pagination1.pageIndex + 1}&search=${globalFilter1}`,
          {
            headers: {
              Authorization: user?.token,
            },
          }
        );
  
        //console.log(data);
  
        return data;
      },
      {
        keepPreviousData: true,
        onError: (err) => {
          console.log(err, "err fetching pending verification kyc users");
        },
        enabled: !!user?.token,
      }
      );

  // const fetchData = useCallback(async () => {
  //   setIsLoading2(true);
  //   try {
  //     const { data } = await axios.get(
  //       //`http://localhost:4000/api/admin/console/kyc-slip-status?perPage=${pagination2.pageSize}&page=${pagination2.pageIndex + 1}&search=${globalFilter2}`,
  //       `https://api.vigoplace.com/api/admin/console/kyc-slip-status?perPage=${pagination2.pageSize}&page=${pagination2.pageIndex}&search=${globalFilter2}`,
  //       {
  //         headers: {
  //           Authorization: user?.token,
  //         },
  //       }
  //     );
  //     setData2(data);
  //     setIsError2(false);
  //   } catch (error) {
  //     console.log(error, "err fetching manual verification kyc users");
  //     setIsError2(true);
  //   } finally {
  //     setIsLoading2(false);
  //   }
  // }, [pagination2, globalFilter2, user?.token]);

  // console.log(pagination2)
  
  // useEffect(() => {
  //   if (user?.token) {
  //     fetchData();
  //   }
  // }, [fetchData]);
  
  // const refetch2 = useCallback(() => {
  //   if (user?.token) {
  //     fetchData();
  //   }
  // }, [fetchData, user?.token]);

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

  const handlePageChange1 = (newPage) => {
    setPagination1({ ...pagination1, pageIndex: newPage });
    refetch1();
  };

  const handleRowsPerPageChange1 = (event) => {
    setPagination1({
      ...pagination1,
      pageSize: parseInt(event.target.value, 10),
      pageIndex: 0,
    });
    refetch1();
  };

  const handlePageChange2 = (newPage) => {
    setPagination2({ ...pagination2, pageIndex: newPage });
    refetch2();
  };

  const handleRowsPerPageChange2 = (event) => {
    setPagination2({
      ...pagination2,
      pageSize: parseInt(event.target.value, 10),
      pageIndex: 0,
    });
    setTimeout(() => {
      refetch2();
    }, 0);
  };

  const handlePageChange3 = (newPage) => {
    setPagination3({ ...pagination3, pageIndex: newPage });
    refetch3();
  };

  const handleRowsPerPageChange3 = (event) => {
    setPagination3({
      ...pagination3,
      pageSize: parseInt(event.target.value, 10),
      pageIndex: 0,
    });
    setTimeout(() => {
      refetch3();
    }, 0);
  };

  const handleSearchChange = (event) => {
    setGlobalFilter(event.target.value);
    refetch(); // Refetch data whenever the search input changes
  };

  const handleSearchChange1 = (event) => {
    setGlobalFilter1(event.target.value);
    refetch1(); // Refetch data whenever the search input changes
  };

  const handleSearchChange2 = (event) => {
    setGlobalFilter2(event.target.value);
    refetch2(); // Refetch data whenever the search input changes
  };

  const handleSearchChange3 = (event) => {
    setGlobalFilter3(event.target.value);
    refetch3(); // Refetch data whenever the search input changes
  };

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
                <Tab label="Verified" {...a11yProps(0)} />
                <Tab label="Pending" {...a11yProps(1)} />
                <Tab label="Incomplete Verification" {...a11yProps(2)} />
                <Tab label="UnVerified" {...a11yProps(3)} />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <Box sx={{ padding: 3 }}>
                <Grid container spacing={0}>
                  <Grid item sm={12} xs={12} lg={12}>
                    <Grid
                      container
                      spacing={2}
                      justifyContent="right"
                      marginBottom={2}
                    >
                      <Grid item>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <TextField
                            label="Search"
                            variant="outlined"
                            fullWidth
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
                                pr: "32px",
                                height: "36px",
                                "& .MuiOutlinedInput-input": {
                                  py: "10px",
                                },
                              },
                            }}
                          />

                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <Tooltip arrow title="Refresh Data">
                              <IconButton onClick={() => refetch()}>
                                <RefreshIcon />
                              </IconButton>
                            </Tooltip>
                          </div>
                        </Box>
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
                                textAlign: "left",
                              }}
                            >
                              FullName
                            </TableCell>
                            <TableCell
                              sx={{
                                borderRight: 1,
                                borderColor: "divider",
                                fontWeight: "bold",
                                marginLeft: "10px",
                                textAlign: "left",
                              }}
                            >
                              Email
                            </TableCell>
                            <TableCell
                              sx={{
                                borderRight: 1,
                                borderColor: "divider",
                                fontWeight: "bold",
                                marginLeft: "10px",
                                textAlign: "left",
                              }}
                            >
                              UserName
                            </TableCell>
                            <TableCell
                              sx={{
                                borderRight: 1,
                                borderColor: "divider",
                                fontWeight: "bold",
                                marginLeft: "10px",
                                textAlign: "left",
                              }}
                            >
                              Phone
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {data?.data?.VerifiedKycUsers?.map((user, index) => (
                            <TableRow key={user.id}>
                              <TableCell
                                sx={{
                                  textAlign: "center",
                                  borderRight: 1,
                                  borderColor: "divider",
                                }}
                              >
                                {pagination.pageIndex * pagination.pageSize +
                                  index +
                                  1}
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
                                  {user.fullname}
                                </a>
                              </TableCell>

                              <TableCell
                                sx={{
                                  borderRight: 1,
                                  borderColor: "divider",
                                  textAlign: "left",
                                }}
                              >
                                {user?.email?.split("-")[0]}
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderRight: 1,
                                  borderColor: "divider",
                                  textAlign: "left",
                                }}
                              >
                                {user?.username?.split("-")[0]}
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderRight: 1,
                                  borderColor: "divider",
                                  textAlign: "left",
                                }}
                              >
                                {user?.phone?.split("-")[0]}
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

                    <Typography
                      align="center"
                      marginTop={1}
                      variant="h3"
                      color="text.secondary"
                    >
                      <b>Verified Kyc Users</b>
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>





            <TabPanel value={tabValue} index={1}>
              <Box sx={{ padding: 3 }}>
                <Grid container spacing={0}>
                  <Grid item sm={12} xs={12} lg={12}>
                    <Grid
                      container
                      spacing={2}
                      justifyContent="right"
                      marginBottom={2}
                    >
                      <Grid item>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <TextField
                            label="Search"
                            variant="outlined"
                            fullWidth
                            value={globalFilter3}
                            onChange={handleSearchChange3}
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
                                pr: "32px",
                                height: "36px",
                                "& .MuiOutlinedInput-input": {
                                  py: "10px",
                                },
                              },
                            }}
                          />

                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <Tooltip arrow title="Refresh Data">
                              <IconButton onClick={() => refetch3()}>
                                <RefreshIcon />
                              </IconButton>
                            </Tooltip>
                          </div>
                        </Box>
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
                                textAlign: "left",
                              }}
                            >
                              FullName
                            </TableCell>
                            <TableCell
                              sx={{
                                borderRight: 1,
                                borderColor: "divider",
                                fontWeight: "bold",
                                marginLeft: "10px",
                                textAlign: "left",
                              }}
                            >
                              Email
                            </TableCell>
                            <TableCell
                              sx={{
                                borderRight: 1,
                                borderColor: "divider",
                                fontWeight: "bold",
                                marginLeft: "10px",
                                textAlign: "left",
                              }}
                            >
                              UserName
                            </TableCell>
                            <TableCell
                              sx={{
                                borderRight: 1,
                                borderColor: "divider",
                                fontWeight: "bold",
                                marginLeft: "10px",
                                textAlign: "left",
                              }}
                            >
                              Phone
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {data3?.data?.result?.map((user, index) => (
                            <TableRow key={user.userId}>
                              <TableCell
                                sx={{
                                  textAlign: "center",
                                  borderRight: 1,
                                  borderColor: "divider",
                                }}
                              >
                                {pagination3.pageIndex * pagination3.pageSize +
                                  index +
                                  1}
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

                              <TableCell
                                sx={{
                                  borderRight: 1,
                                  borderColor: "divider",
                                  textAlign: "left",
                                }}
                              >
                                {user?.email?.split("-")[0]}
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderRight: 1,
                                  borderColor: "divider",
                                  textAlign: "left",
                                }}
                              >
                                {user?.username?.split("-")[0]}
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderRight: 1,
                                  borderColor: "divider",
                                  textAlign: "left",
                                }}
                              >
                                {user?.phone?.split("-")[0]}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    <TablePagination
                      rowsPerPageOptions={[10, 25, 50]}
                      component="div"
                      count={data3?.data?.count || 0}
                      rowsPerPage={pagination3.pageSize}
                      page={pagination3.pageIndex}
                      onPageChange={handlePageChange3}
                      onRowsPerPageChange={handleRowsPerPageChange3}
                      ActionsComponent={(props) => (
                        <div style={{ display: "flex" }}>
                          <IconButton
                            onClick={() => handlePageChange3(0)}
                            disabled={pagination3.pageIndex === 0}
                          >
                            <FirstPageIcon />
                          </IconButton>
                          <IconButton
                            onClick={() =>
                              handlePageChange3(pagination3.pageIndex - 1)
                            }
                            disabled={pagination3.pageIndex === 0}
                          >
                            <NavigateBeforeIcon />
                          </IconButton>
                          <IconButton
                            onClick={() =>
                              handlePageChange3(pagination3.pageIndex + 1)
                            }
                            disabled={
                              pagination3.pageIndex >=
                              Math.ceil(
                                (data3?.data?.count || 0) / pagination3.pageSize
                              ) -
                                1
                            }
                          >
                            <NavigateNextIcon />
                          </IconButton>
                          <IconButton
                            onClick={() =>
                              handlePageChange3(
                                Math.ceil(
                                  (data3?.data?.count || 0) / pagination3.pageSize
                                ) - 1
                              )
                            }
                            disabled={
                              pagination3.pageIndex >=
                              Math.ceil(
                                (data3?.data?.count || 0) / pagination3.pageSize
                              ) -
                                1
                            }
                          >
                            <LastPageIcon />
                          </IconButton>
                        </div>
                      )}
                    />

                    <Typography
                      align="center"
                      marginTop={1}
                      variant="h3"
                      color="text.secondary"
                    >
                      <b>Pending Kyc Users</b>
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>





            <TabPanel value={tabValue} index={2}>
              <Box sx={{ padding: 3 }}>
                <Grid container spacing={0}>
                  <Grid item sm={12} xs={12} lg={12}>
                    <Grid
                      container
                      spacing={2}
                      justifyContent="right"
                      marginBottom={2}
                    >
                      <Grid item>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <TextField
                            label="Search"
                            variant="outlined"
                            fullWidth
                            value={globalFilter2}
                            onChange={handleSearchChange2}
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
                                pr: "32px",
                                height: "36px",
                                "& .MuiOutlinedInput-input": {
                                  py: "10px",
                                },
                              },
                            }}
                          />

                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <Tooltip arrow title="Refresh Data">
                              <IconButton onClick={() => refetch2()}>
                                <RefreshIcon />
                              </IconButton>
                            </Tooltip>
                          </div>
                        </Box>
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
                                textAlign: "left",
                              }}
                            >
                              FullName
                            </TableCell>
                            <TableCell
                              sx={{
                                borderRight: 1,
                                borderColor: "divider",
                                fontWeight: "bold",
                                marginLeft: "10px",
                                textAlign: "left",
                              }}
                            >
                              Email
                            </TableCell>
                            <TableCell
                              sx={{
                                borderRight: 1,
                                borderColor: "divider",
                                fontWeight: "bold",
                                marginLeft: "10px",
                                textAlign: "left",
                              }}
                            >
                              UserName
                            </TableCell>
                            <TableCell
                              sx={{
                                borderRight: 1,
                                borderColor: "divider",
                                fontWeight: "bold",
                                marginLeft: "10px",
                                textAlign: "left",
                              }}
                            >
                              Phone
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {data2?.data?.result?.map((user, index) => (
                            <TableRow key={user.userId}>
                              <TableCell
                                sx={{
                                  textAlign: "center",
                                  borderRight: 1,
                                  borderColor: "divider",
                                }}
                              >
                                {pagination2.pageIndex * pagination2.pageSize +
                                  index +
                                  1}
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

                              <TableCell
                                sx={{
                                  borderRight: 1,
                                  borderColor: "divider",
                                  textAlign: "left",
                                }}
                              >
                                {user?.email?.split("-")[0]}
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderRight: 1,
                                  borderColor: "divider",
                                }}
                              >
                                {user?.username?.split("-")[0]}
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderRight: 1,
                                  borderColor: "divider",
                                }}
                              >
                                {user?.phone?.split("-")[0]}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    <TablePagination
                      rowsPerPageOptions={[10, 25, 50]}
                      component="div"
                      count={data2?.data?.count || 0}
                      rowsPerPage={pagination2.pageSize}
                      page={pagination2.pageIndex}
                      onPageChange={handlePageChange2}
                      onRowsPerPageChange={handleRowsPerPageChange2}
                      ActionsComponent={(props) => (
                        <div style={{ display: "flex" }}>
                          <IconButton
                            onClick={() => handlePageChange2(0)}
                            disabled={pagination2.pageIndex === 0}
                          >
                            <FirstPageIcon />
                          </IconButton>

                          <IconButton
                            onClick={() =>
                              handlePageChange2(pagination2.pageIndex - 1)
                            }
                            disabled={pagination2.pageIndex === 0}
                          >
                            <NavigateBeforeIcon />
                          </IconButton>

                          <IconButton
                            onClick={() =>
                              handlePageChange2(pagination2.pageIndex + 1)
                            }
                            disabled={
                              pagination2.pageIndex >=
                              Math.ceil(
                                (data2?.data?.count || 0) / pagination2.pageSize
                              ) -
                                1
                            }
                          >
                            <NavigateNextIcon />
                          </IconButton>

                          <IconButton
                            onClick={() =>
                              handlePageChange2(
                                Math.ceil(
                                  (data2?.data?.count || 0) /
                                    pagination2.pageSize
                                ) - 1
                              )
                            }
                            disabled={
                              pagination2.pageIndex >=
                              Math.ceil(
                                (data2?.data?.count || 0) / pagination2.pageSize
                              ) -
                                1
                            }
                          >
                            <LastPageIcon />
                          </IconButton>
                        </div>
                      )}
                    />

                    <Typography
                      align="center"
                      //marginTop={1}
                      variant="h3"
                      color="text.secondary"
                    >
                      <b>Incomplete Verification Kyc Users</b>
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
              <Box sx={{ padding: 3 }}>
                <Grid container spacing={0}>
                  <Grid item sm={12} xs={12} lg={12}>
                    <Grid
                      container
                      spacing={2}
                      justifyContent="right"
                      marginBottom={2}
                    >
                      <Grid item>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <TextField
                            label="Search"
                            variant="outlined"
                            fullWidth
                            value={globalFilter1}
                            onChange={handleSearchChange1}
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
                                pr: "32px",
                                height: "36px",
                                "& .MuiOutlinedInput-input": {
                                  py: "10px",
                                },
                              },
                            }}
                          />

                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <Tooltip arrow title="Refresh Data">
                              <IconButton onClick={() => refetch1()}>
                                <RefreshIcon />
                              </IconButton>
                            </Tooltip>
                          </div>
                        </Box>
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
                                textAlign: "left",
                              }}
                            >
                              FullName
                            </TableCell>
                            <TableCell
                              sx={{
                                borderRight: 1,
                                borderColor: "divider",
                                fontWeight: "bold",
                                marginLeft: "10px",
                                textAlign: "left",
                              }}
                            >
                              Email
                            </TableCell>
                            <TableCell
                              sx={{
                                borderRight: 1,
                                borderColor: "divider",
                                fontWeight: "bold",
                                marginLeft: "10px",
                                textAlign: "left",
                              }}
                            >
                              UserName
                            </TableCell>
                            <TableCell
                              sx={{
                                borderRight: 1,
                                borderColor: "divider",
                                fontWeight: "bold",
                                marginLeft: "10px",
                                textAlign: "left",
                              }}
                            >
                              Phone
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {data1?.data?.unVerifiedKycUsers?.map(
                            (user, index) => (
                              <TableRow key={user.id}>
                                <TableCell
                                  sx={{
                                    textAlign: "center",
                                    borderRight: 1,
                                    borderColor: "divider",
                                  }}
                                >
                                  {pagination1.pageIndex *
                                    pagination1.pageSize +
                                    index +
                                    1}
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
                                      const userId = user.id;
                                      const url = `/user/${userId}`;
                                      window.open(url, "_blank");
                                    }}
                                    onMouseEnter={(e) => {
                                      e.target.style.textDecoration =
                                        "underline";
                                    }}
                                    onMouseLeave={(e) => {
                                      e.target.style.textDecoration = "none";
                                    }}
                                  >
                                    {user.fullname}
                                  </a>
                                </TableCell>

                                <TableCell
                                  sx={{
                                    borderRight: 1,
                                    borderColor: "divider",
                                    textAlign: "left",
                                  }}
                                >
                                  {user?.email?.split("-")[0]}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    borderRight: 1,
                                    borderColor: "divider",
                                  }}
                                >
                                  {user?.username?.split("-")[0]}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    borderRight: 1,
                                    borderColor: "divider",
                                  }}
                                >
                                  {user?.phone?.split("-")[0]}
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    <TablePagination
                      rowsPerPageOptions={[10, 25, 50]}
                      component="div"
                      count={data1?.data?.count || 0}
                      rowsPerPage={pagination1.pageSize}
                      page={pagination1.pageIndex}
                      onPageChange={handlePageChange1}
                      onRowsPerPageChange={handleRowsPerPageChange1}
                      ActionsComponent={(props) => (
                        <div style={{ display: "flex" }}>
                          <IconButton
                            onClick={() => handlePageChange1(0)}
                            disabled={pagination1.pageIndex === 0}
                          >
                            <FirstPageIcon />
                          </IconButton>
                          <IconButton
                            onClick={() =>
                              handlePageChange1(pagination1.pageIndex - 1)
                            }
                            disabled={pagination1.pageIndex === 0}
                          >
                            <NavigateBeforeIcon />
                          </IconButton>
                          <IconButton
                            onClick={() =>
                              handlePageChange1(pagination1.pageIndex + 1)
                            }
                            disabled={
                              pagination1.pageIndex >=
                              Math.ceil(
                                (data1?.data?.count || 0) / pagination1.pageSize
                              ) -
                                1
                            }
                          >
                            <NavigateNextIcon />
                          </IconButton>
                          <IconButton
                            onClick={() =>
                              handlePageChange1(
                                Math.ceil(
                                  (data1?.data?.count || 0) /
                                    pagination1.pageSize
                                ) - 1
                              )
                            }
                            disabled={
                              pagination1.pageIndex >=
                              Math.ceil(
                                (data1?.data?.count || 0) / pagination1.pageSize
                              ) -
                                1
                            }
                          >
                            <LastPageIcon />
                          </IconButton>
                        </div>
                      )}
                    />

                    <Typography
                      align="center"
                      //marginTop={1}
                      variant="h3"
                      color="text.secondary"
                    >
                      <b>UnVerified Kyc Users</b>
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

KycUsers.auth = true;
export default KycUsers;
