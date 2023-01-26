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
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import LoadingButton from "@mui/lab/LoadingButton";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";

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

  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [approval, setApproval] = useState({
    oldPin: "",
    pin: "",
  });

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
      setOpenModal(false)
    },
    onSuccess: () => {
      setPinToast({ ...pinToast, success: true });
      setApproval({pin: '', oldPin: ''})
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
      setOpenModal2(false)
    },
    onSuccess: (msg) => {
      setPasswordToast({ ...passwordToast, success: true });
      setPassword({newPassword: "", oldPassword:""})
      setOpenModal2(false)
    },
  });

  const handleClose = (event, reason) => {
    setPinToast({ error: false, success: false });
    setPasswordToast({ error: false, success: false });
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
                      password.newPassword.length <= 5
                    }
                    onClick={() => {
                    //   updatePasswordMutation.mutate(password);
                    setOpenModal2(true);
                    }}
                  >
                    Change Password
                  </LoadingButton>
                  <Dialog
                  open={openModal2}
                  onClose={() => {
                    setOpenModal(false);
                  }}
                >
                  <DialogTitle>Confirm Action</DialogTitle>
                  <DialogContent>
                    <DialogContentText>Update Password?</DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={() => {
                        setOpenModal2(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <LoadingButton
                  variant="contained"
                  color="primary"
                  loading={updatePasswordMutation.isLoading}
                  onClick={() => {
                    updatePasswordMutation.mutate(password);
                  }}
                >
                  Update
                </LoadingButton>
                  </DialogActions>
                </Dialog>
                </Box>
              </Card>
            </form>
          </Box>
        </Container>

        <Container maxWidth="lg">
          {/* <Typography
  sx={{ mb: 3 }}
  variant="h4"
>
  Settings
</Typography> */}
          <Box sx={{ pt: 3 }}>
            {/* <form> */}
            <Card>
              <CardHeader
                subheader="if this is your first approval pin kindly use 000000 as old pin"
                title="Set Approval Pin"
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
                    approval.oldPin.length <= 5
                  }
                  onClick={() => {
                    setOpenModal(true);
                  }}
                >
                  Update
                </LoadingButton>

                <Dialog
                  open={openModal}
                  onClose={() => {
                    setOpenModal(false);
                  }}
                >
                  <DialogTitle>Confirm Action</DialogTitle>
                  <DialogContent>
                    <DialogContentText>Update Approval Pin?</DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={() => {
                        setOpenModal(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <LoadingButton
                  variant="contained"
                  color="primary"
                  loading={updatePinMutation.isLoading}
                  onClick={() => {
                      updatePinMutation.mutate(approval)
                  }}
                >
                  Update
                </LoadingButton>
                  </DialogActions>
                </Dialog>
              </Box>
            </Card>
            {/* </form> */}
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default AdminSecurity;
