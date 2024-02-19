import React from "react";
import { useState } from "react";
import {
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
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import LoadingButton from "@mui/lab/LoadingButton";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function AdminSecurity() {
  const getUser = useSession();
  const user = getUser?.data?.user;

  const [openModal, setOpenModal] = React.useState(false);
  const [openModal2, setOpenModal2] = React.useState(false);

  const [pinToast, setPinToast] = React.useState({
    error: false,
    success: false,
  });
  const [passwordToast, setPasswordToast] = React.useState({
    error: false,
    success: false,
  });

  const [createToast, setCreateToast] = React.useState({
    error: false,
    success: false,
  });

  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [approval, setApproval] = useState({
    oldPin: "",
    pin: "",
    confirmPin: "",
  });

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

  const handlePassword = (event) => {
    setPassword({
      ...password,
      [event.target.name]: event.target.value,
    });
  };

  const handlePinChange = (event) => {
    setApproval({
      ...approval,
      [event.target.name]: event.target.value,
    });
  };

  const updatePin = async ({ pin, oldPin }) => {
    const setpin = await axios.post(
      // "http://localhost:3001/api/admin/console/approvalpin",
      "https://vigoplace.com/server/api/admin/console/approvalpin",
      { pin, oldPin },
      {
        headers: {
          Authorization: user?.token,
        },
      }
    );
    return setpin;
  };

  const updatePinMutation = useMutation({
    mutationKey: ["updatePin"],
    mutationFn: updatePin,
    onError: async (error) => {
      setPinToast({ ...pinToast, error: true });
      setOpenModal(false);
    },
    onSuccess: () => {
      setPinToast({ ...pinToast, success: true });
      setApproval({ pin: "", oldPin: "", confirmPin: "" });
      setOpenModal(false);
    },
  });

  const changePassword = async ({ oldPassword, newPassword }) => {
    const password = await axios.post(
      // "http://localhost:3001/api/admin/console/password/update",
      "https://vigoplace.com/server/api/admin/console/password/update",
      { oldPassword, newPassword },
      {
        headers: {
          Authorization: user?.token,
        },
      }
    );
    return password;
  };

  const updatePasswordMutation = useMutation({
    mutationKey: ["updatePassword"],
    mutationFn: changePassword,
    onError: async (error) => {
      setPasswordToast({ ...passwordToast, error: true });
      setOpenModal2(false);
    },
    onSuccess: (msg) => {
      setPasswordToast({ ...passwordToast, success: true });
      setPassword({ newPassword: "", oldPassword: "", confirmPassword: "" });
      setOpenModal2(false);
    },
  });

  const createUser = async (userData) => {
    try {
      const response = await axios.post(
        //"https://vigoplace.com/server/api/admin/auth/register/user",
        "http://localhost:4000/api/admin/auth/register/user",
        userData,
        {
          headers: {
            Authorization: user?.token,
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

  return (
    <>
      <Snackbar
        TransitionComponent={Slide}
        open={pinToast.error}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="warning" sx={{ width: "100%" }}>
          {updatePinMutation.error?.response?.data?.message}
        </Alert>
      </Snackbar>
      <Snackbar
        TransitionComponent={Slide}
        open={pinToast.success}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          {updatePinMutation?.data?.data?.message}
        </Alert>
      </Snackbar>

      <Snackbar
        TransitionComponent={Slide}
        open={passwordToast.error}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="warning" sx={{ width: "100%" }}>
          {updatePasswordMutation.error?.response?.data?.message}
        </Alert>
      </Snackbar>
      <Snackbar
        TransitionComponent={Slide}
        open={passwordToast.success}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          {updatePasswordMutation?.data?.data?.message}
        </Alert>
      </Snackbar>

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
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          //   py: 8
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ pt: 3 }}>
            <form>
              <Card>
                <CardHeader subheader="" title="Change Password" />
                <Divider />
                <CardContent>
                  <TextField
                    fullWidth
                    label="Old Password"
                    margin="normal"
                    name="oldPassword"
                    onChange={handlePassword}
                    type="text"
                    value={password.oldPassword}
                    variant="outlined"
                  />
                  <TextField
                    fullWidth
                    label="New password"
                    margin="normal"
                    name="newPassword"
                    onChange={handlePassword}
                    type="text"
                    value={password.newPassword}
                    variant="outlined"
                  />
                  <TextField
                    fullWidth
                    label="Confirm password"
                    margin="normal"
                    name="confirmPassword"
                    onChange={handlePassword}
                    type="text"
                    value={password.confirmPassword}
                    variant="outlined"
                    error={password.newPassword !== password.confirmPassword}
                  />
                </CardContent>
                <Divider />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    p: 2,
                  }}
                >
                  <LoadingButton
                    variant="contained"
                    color="primary"
                    loading={updatePasswordMutation.isLoading}
                    disabled={
                      password.oldPassword === "" ||
                      password.newPassword === "" ||
                      password.oldPassword.length <= 5 ||
                      password.newPassword.length <= 5 ||
                      password.newPassword !== password.confirmPassword
                    }
                    onClick={() => {
                      updatePasswordMutation.mutate(password);
                      // setOpenModal2(true);
                    }}
                  >
                    Change Password
                  </LoadingButton>
                </Box>
              </Card>
            </form>
          </Box>
        </Container>

        <Container maxWidth="lg">
          <Box sx={{ pt: 3 }}>
            {/* <form> */}
            <Card>
              <CardHeader
                // subheader="Enter Old pin and"
                title="Create Approval Pin"
              />
              <Divider />
              <CardContent>
                <TextField
                  fullWidth
                  label="Old Pin"
                  margin="normal"
                  name="oldPin"
                  onChange={handlePinChange}
                  type="number"
                  value={approval.oldPin}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="New Pin"
                  margin="normal"
                  name="pin"
                  onChange={handlePinChange}
                  type="number"
                  value={approval.pin}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Confirm Pin"
                  margin="normal"
                  name="confirmPin"
                  onChange={handlePinChange}
                  type="number"
                  value={approval.confirmPin}
                  variant="outlined"
                  error={approval.pin !== approval.confirmPin}
                />
              </CardContent>
              <Divider />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  p: 2,
                }}
              >
                <LoadingButton
                  variant="contained"
                  color="primary"
                  loading={updatePinMutation.isLoading}
                  disabled={
                    approval.pin === "" ||
                    approval.oldPin === "" ||
                    approval.pin.length <= 5 ||
                    approval.oldPin.length <= 5 ||
                    approval.pin !== approval.confirmPin
                  }
                  onClick={() => {
                    // setOpenModal(true);
                    updatePinMutation.mutate(approval);
                  }}
                >
                  Update
                </LoadingButton>
              </Box>
            </Card>
            {/* </form> */}
          </Box>
        </Container>

        <Container maxWidth="lg">
          <Box sx={{ pt: 3 }}>
            <Card>
              <CardHeader title="Create User" />
              <Divider />
              <CardContent>
                {/* Username */}
                <TextField
                  fullWidth
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

export default AdminSecurity;
