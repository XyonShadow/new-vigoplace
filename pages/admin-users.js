import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
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
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Container,
  Typography,
  FormControl,
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
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";
import { DeveloperModeTwoTone } from "@mui/icons-material";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Admin() {
  const queryClient = useQueryClient();
  const [createToast, setCreateToast] = useState({
    error: false,
    success: false,
  });

  const [promoteUserSuccessToast, setPromoteUserSuccessToast] = useState(false);
  const [promoteUserErrorToast, setPromoteUserErrorToast] = useState(false);
  const [demoteUserSuccessToast, setDemoteUserSuccessToast] = useState(false);
  const [demoteUserErrorToast, setDemoteUserErrorToast] = useState(false);
  // State variables for user creation
  const [newUserData, setNewUserData] = useState({
    username: "",
    email: "",
    dob: "",
    password: "",
    fullname: "",
  });

  // State variable for user role
  const [userRole, setUserRole] = useState("user");

  // Handler for updating user data
  const handleUserDataChange = (e) => {
    const { name, value } = e.target;
    setNewUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handler for updating user role
  const handleUserRoleChange = (e) => {
    setUserRole(e.target.value);
  };

  const getUser = useSession();
  const users = getUser?.data?.user;

  // console.log(user);

  useEffect(() => {
    if (users) {
      //console.log(user)
    }
  }, [users]);

  const {
    data: adminUsers,
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useQuery(
    ["fetchAdminUsers"],
    async () => {
      const { data } = await axios.get(
        `https://vigoplace.com/server/api/admin/console/admin-users`,
        //`http://localhost:4000/api/admin/console/admin-users`,
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
        console.log(err, "err fetching admin users");
      },
      enabled: !!users?.token,
    },
    { keepPreviousData: true }
  );

  const createUser = async (userData) => {
    try {
      const response = await axios.post(
        "https://vigoplace.com/server/api/admin/auth/register/user",
        //"http://localhost:4000/api/admin/auth/register/user",
        userData,
        {
          headers: {
            Authorization: users?.token,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };

  const createUserMutation = useMutation({
    mutationKey: ["createUser"],
    mutationFn: createUser,
    onError: async (error) => {
      console.error("Error creating user:", error);
      setCreateToast({ ...createToast, error: true });
      // Handle error feedback if needed
    },
    onSuccess: (data) => {
      console.log("User created successfully:", data);
      setCreateToast({ ...createToast, success: true });
      // Handle success feedback if needed
      setNewUserData({
        username: "",
        email: "",
        dob: "",
        password: "",
        fullname: "",
      });
      setUserRole("user");
    },
  });

  const handleCreateUser = () => {
    // Prepare user data from state
    const userData = {
      ...newUserData,
      role: userRole,
    };
    createUserMutation.mutate(userData);
  };

  const handleClose = (event, reason) => {
    setPinToast({ error: false, success: false });
    setPasswordToast({ error: false, success: false });
    setCreateToast({ error: false, success: false });
  };

  const promoteUser = async (userId) => {
    try {
      const response = await axios.post(
        "https://vigoplace.com/server/api/admin/console/promote-users",
        //"http://localhost:4000/api/admin/console/demote-users",
        userId,
        {
          headers: {
            Authorization: users?.token,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };

  const promoteUserMutation = useMutation({
    mutationKey: ["promoteUser"],
    mutationFn: promoteUser,
    onError: async (error) => {
      console.log(error);
      setPromoteUserErrorToast(true);
    },
    onSuccess: () => {
      setPromoteUserSuccessToast(true);
      queryClient.invalidateQueries("fetchAdminUsers");
    },
  });

  const demoteUser = async (userId) => {
    try {
      const response = await axios.post(
        "https://vigoplace.com/server/api/admin/console/demote-users",
        //"http://localhost:4000/api/admin/console/demote-users",
        userId,
        {
          headers: {
            Authorization: users?.token,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log(error);
      throw error.response.data;
    }
  };

  const demoteUserMutation = useMutation({
    mutationKey: ["demoteUser"],
    mutationFn: demoteUser,
    onError: async (error) => {
      setDemoteUserErrorToast(true);
      console.log(error);
    },
    onSuccess: () => {
      setDemoteUserSuccessToast(true);
      queryClient.invalidateQueries("fetchAdminUsers");
    },
  });

  const handlepromoteUserErrorToastClose = (event, reason) => {
    setPromoteUserErrorToast(false);
  };

  const handlePromoteUserSuccessToastClose = (event, reason) => {
    setPromoteUserSuccessToast(false);
  };

  const handleDemoteUserErrorToastClose = (event, reason) => {
    setDemoteUserErrorToast(false);
  };

  const handleDemoteUserSuccessToastClose = (event, reason) => {
    setDemoteUserSuccessToast(false);
  };

  return (
    <>
      <Snackbar
        TransitionComponent={Slide}
        open={promoteUserSuccessToast}
        autoHideDuration={6000}
        onClose={handlePromoteUserSuccessToastClose}
      >
        <Alert
          onClose={handlePromoteUserSuccessToastClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {"Successfully promoted admin user"}
        </Alert>
      </Snackbar>

      <Snackbar
        TransitionComponent={Slide}
        open={promoteUserErrorToast}
        autoHideDuration={6000}
        onClose={handlepromoteUserErrorToastClose}
      >
        <Alert
          onClose={handlepromoteUserErrorToastClose}
          severity="warning"
          sx={{ width: "100%" }}
        >
          {promoteUserMutation?.error?.response?.data?.message}
        </Alert>
      </Snackbar>

      <Snackbar
        TransitionComponent={Slide}
        open={demoteUserSuccessToast}
        autoHideDuration={6000}
        onClose={handleDemoteUserSuccessToastClose}
      >
        <Alert
          onClose={handleDemoteUserSuccessToastClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {"Successfully demoted admin user"}
        </Alert>
      </Snackbar>

      <Snackbar
        TransitionComponent={Slide}
        open={demoteUserErrorToast}
        autoHideDuration={6000}
        onClose={handleDemoteUserErrorToastClose}
      >
        <Alert
          onClose={handleDemoteUserErrorToastClose}
          severity="warning"
          sx={{ width: "100%" }}
        >
          {demoteUserMutation?.error?.response?.data?.message}
        </Alert>
      </Snackbar>
      <Box sx={{ padding: 5, marginBottom: "70px" }}>
        <Grid container spacing={0}>
          <Grid item sm={12} xs={12} lg={12}>
            <Typography
              variant="h4"
              color="text.primary"
              marginBottom={2}
              sx={{ fontWeight: "bold" }}
            >
              Admin Users
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
                        display: "flex",
                        alignContent: "center",
                        justifyContent: "center",
                      }}
                    >
                      Admins
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                      Privileges
                    </TableCell>
                    {users?.role === "root" && (
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          borderLeft: 1,
                          borderColor: "divider",
                          display: "flex",
                          alignContent: "center",
                          justifyContent: "center",
                        }}
                      >
                        {users?.role === "root" ? "Actions" : null}
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Display the first 3 most active users */}
                  {adminUsers?.map((user, index) => (
                    <TableRow key={user.UFullName}>
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
                            const userId = user.UId;
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
                          {index + 1}. {user.UFullName}
                        </a>
                      </TableCell>

                      <TableCell sx={{ textAlign: "center" }}>
                        {user.UPrivilege}
                      </TableCell>
                      {users?.role === "root" && (
                        <TableCell
                          sx={{
                            borderLeft: 1,
                            borderColor: "divider",
                            textAlign: "center",
                          }}
                        >
                          {user?.UPrivilege === "admin" && (
                            <>
                              <Button
                                onClick={() =>
                                  promoteUserMutation.mutate({
                                    userId: user.UId,
                                  })
                                }
                                sx={{
                                  backgroundColor: "#6495ED", // Cornflower Blue
                                  borderRadius: "8px", // Adjust the border radius as needed
                                  color: "white", // Text color
                                  padding: "3px 12px", // Adjust padding as needed
                                  height: "auto", // Auto-adjust height
                                  marginRight: "15px", // Adjust margin
                                  "&:hover": {
                                    backgroundColor: "#4169E1", // Royal Blue
                                  },
                                }}
                              >
                                Make Root
                              </Button>
                              <Button
                                onClick={() =>
                                  demoteUserMutation.mutate({
                                    userId: user.UId,
                                  })
                                }
                                variant="outlined" // Set the button variant to outlined
                                sx={{
                                  borderColor: "red", // Border color for the outlined button
                                  borderRadius: "8px", // Adjust the border radius as needed
                                  color: "red", // Text color
                                  padding: "3px 12px", // Adjust padding as needed
                                  "&:hover": {
                                    borderColor: "darkred", // Change border color on hover if desired
                                    color: "darkred", // Change text color on hover if desired
                                  },
                                }}
                              >
                                Demote
                              </Button>
                            </>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Box>

      <Snackbar
        TransitionComponent={Slide}
        open={createToast.error}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="warning" sx={{ width: "100%" }}>
          {createUserMutation.error?.message}
        </Alert>
      </Snackbar>
      <Snackbar
        TransitionComponent={Slide}
        open={createToast.success}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          {createUserMutation?.data?.message}
        </Alert>
      </Snackbar>

      <Box sx={{ width: "100%" }}>
        <Container maxWidth="lg">
          <Box sx={{ pt: 3 }}>
            <Card>
              <CardHeader title="Create User" />
              <Divider />
              <CardContent>
                {/* Username */}
                <TextField
                  fullWidth
                  type="text"
                  label="Username"
                  margin="normal"
                  name="username"
                  onChange={handleUserDataChange}
                  value={newUserData.username}
                  variant="outlined"
                />

                {/* Email */}
                <TextField
                  fullWidth
                  label="Email"
                  margin="normal"
                  name="email"
                  onChange={handleUserDataChange}
                  value={newUserData.email}
                  variant="outlined"
                />

                {/* Date of Birth */}
                <TextField
                  fullWidth
                  label="Date of Birth"
                  margin="normal"
                  name="dob"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={handleUserDataChange}
                  value={newUserData.dob}
                  variant="outlined"
                />

                {/* Password */}
                <TextField
                  fullWidth
                  label="Password"
                  margin="normal"
                  name="password"
                  onChange={handleUserDataChange}
                  type="password"
                  value={newUserData.password}
                  variant="outlined"
                />

                {/* Full Name */}
                <TextField
                  fullWidth
                  label="Full Name"
                  margin="normal"
                  name="fullname"
                  onChange={handleUserDataChange}
                  value={newUserData.fullname}
                  variant="outlined"
                />

                {/* User Role (if applicable) */}
                {/* If you want to allow the admin to select user role */}
                <FormControl fullWidth variant="outlined" margin="normal">
                  <InputLabel>User Role</InputLabel>
                  <Select
                    value={userRole}
                    onChange={handleUserRoleChange}
                    label="User Role"
                  >
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                    {/* Add other roles as needed */}
                  </Select>
                </FormControl>

                <Divider />
                {/* Button to create user */}
                <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreateUser}
                    disabled={
                      !newUserData.username ||
                      !newUserData.email ||
                      !newUserData.dob ||
                      !newUserData.password ||
                      !newUserData.fullname
                    }
                  >
                    Create User
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
}

Admin.auth = true;
