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
  MenuItem,
  Typography,
  OutlinedInput,
  Select,
  InputLabel,
  FormControl,
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

function Charges() {
  const getUser = useSession();
  const user = getUser?.data?.user;

  const [toast, setToast] = React.useState({
    error: false,
    success: false,
  });
  const [openModal, setOpenModal] = React.useState(false);
  const [charges, setCharges] = useState({
    currencyId: "", // Add the currencyId state
    operation: "", // Add the operation state
    newChargeValue: "", // Add the newChargeValue state
  });

  const handleChargeChange = (event) => {
    setCharges({
      ...charges,
      [event.target.name]: event.target.value,
    });
  };

  const operations = [
    { id: "vote", label: "Vote" },
    { id: "payout", label: "Payout" },
    { id: "deposit", label: "Deposit" },
    { id: "rent", label: "Rent" },
    { id: "transfer", label: "Transfer" },
    { id: "gift", label: "Gift" },
    { id: "donation", label: "Donation" },
    { id: "support", label: "Support" },
    { id: "subscription", label: "Subscription" },
    { id: "buy", label: "Buy" },
    { id: "service", label: "Service" },
    // Add other operations as needed
  ];

  const updateCharges = async ({ currencyId, operation, newChargeValue }) => {
    const updatedCharges = await axios.put(
      //`http://localhost:4000/api/admin/settings/charges/${currencyId}`,
      `https://vigoplace.com/server/api/admin/settings/charges/${currencyId}`,
      { operation, newChargeValue },
      {
        headers: {
          Authorization: user?.token,
        },
      }
    );
    return updatedCharges;
  };

  const updateChargesMutation = useMutation({
    mutationKey: ["updateCharges"],
    mutationFn: updateCharges,
    onError: async (error) => {
      // Handle error
      setToast({ ...toast, error: true });
      setOpenModal(false);
    },
    onSuccess: () => {
      // Handle success
      setToast({ ...toast, success: true });
      setCharges({ currencyId: "", operation: "", newChargeValue: 0 });
      setOpenModal(false);
    },
  });

  const handleClose = (event, reason) => {
    setToast({ error: false, success: false });
  };

  return (
    <>
      <Snackbar
        TransitionComponent={Slide}
        open={toast.error}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="warning" sx={{ width: "100%" }}>
          {updateChargesMutation.error?.message}
        </Alert>
      </Snackbar>
      <Snackbar
        TransitionComponent={Slide}
        open={toast.success}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          {updateChargesMutation?.data?.data?.message}
        </Alert>
      </Snackbar>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ pt: 3 }}>
            <form>
              <Card>
                <CardHeader subheader="" title="Update Charges" />
                <Divider />
                <CardContent>
                  <FormControl fullWidth>
                    <InputLabel style={{ marginTop: "18px" }}>
                      Select a Currency
                    </InputLabel>
                    <Select
                      value={charges.currencyId}
                      onChange={handleChargeChange}
                      inputProps={{
                        name: "currencyId",
                      }}
                      style={{ marginTop: "20px" }}
                    >
                      <MenuItem value={175}>Naira</MenuItem>
                      <MenuItem value={250}>Usd</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel
                      //id="demo-dialog-select-label"
                      style={{ marginTop: "18px" }}
                    >
                      Select an Operation
                    </InputLabel>
                    <Select
                      //labelId="demo-dialog-select-label"
                      //id="demo-dialog-select"
                      value={charges.operation}
                      onChange={handleChargeChange}
                      //   inputProps={{
                      //     name: "operation",
                      //   }}
                      input={<OutlinedInput label="Charge" name="operation" />}
                      style={{ marginTop: "20px" }}
                    >
                      {operations.map((op) => (
                        <MenuItem key={op.id} value={op.id}>
                          {op.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    label="New Charge Value"
                    margin="normal"
                    name="newChargeValue"
                    onChange={handleChargeChange}
                    type="number"
                    value={charges.newChargeValue}
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
                    loading={updateChargesMutation.isLoading}
                    disabled={
                      charges.currencyId === "" ||
                      charges.operation === "" ||
                      charges.newChargeValue === ""
                    }
                    onClick={() => {
                      updateChargesMutation.mutate(charges);
                    }}
                  >
                    Update Charges
                  </LoadingButton>
                </Box>
              </Card>
            </form>
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default Charges;



{
  /* <Snackbar
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
      </Snackbar> */
}
{
  /* <Box
        component="main"
        sx={{
          flexGrow: 1,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ pt: 3 }}>
            <form>
              <Card>
                <CardHeader subheader="" title="Update Charges" />
                <Divider />
                <CardContent> */
}
{
  /* <TextField
                    fullWidth
                    label="Currency ID"
                    margin="normal"
                    name="currencyId"
                    onChange={handleChargeChange}
                    type="text"
                    value={charges.currencyId}
                    variant="outlined"
                  /> */
}
{
  /* <FormControl fullWidth>
                    <InputLabel
                      id="demo-dialog-select-label"
                      style={{ marginTop: "18px" }}
                    >
                      Select a Currency
                    </InputLabel>
                    <Select
                      labelId="demo-dialog-select-label"
                      id="demo-dialog-select"
                      value={charges.currencyId}
                      onChange={handleChargeChange}
                      input={<OutlinedInput label="Charge" />}
                      fullWidth
                      style={{ marginTop: "20px" }}
                    >
                      <MenuItem value={175}>NAIRA</MenuItem>
                      <MenuItem value={250}>USD</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    label="Operation"
                    margin="normal"
                    name="operation"
                    onChange={handleChargeChange}
                    type="text"
                    value={charges.operation}
                    variant="outlined"
                  />
                  <TextField
                    fullWidth
                    label="New Charge Value"
                    margin="normal"
                    name="newChargeValue"
                    onChange={handleChargeChange}
                    type="number"
                    value={charges.newChargeValue}
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
                    loading={updateChargesMutation.isLoading}
                    disabled={
                      charges.currencyId === "" ||
                      charges.operation === "" ||
                      charges.newChargeValue === 0
                    }
                    onClick={() => {
                      updateChargesMutation.mutate(charges);
                    }}
                  >
                    Update Charges
                  </LoadingButton>
                </Box>
              </Card>
            </form>
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default Charges; */
}
