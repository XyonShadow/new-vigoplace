// import React from "react";
// import { useState } from "react";
// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   CardHeader,
//   Divider,
//   TextField,
//   Container,
//   MenuItem,
//   Typography,
//   OutlinedInput,
//   Select,
//   InputLabel,
//   FormControl,
// } from "@mui/material";
// import { useSession } from "next-auth/react";
// import { useMutation } from "@tanstack/react-query";
// import axios from "axios";
// import LoadingButton from "@mui/lab/LoadingButton";
// import Snackbar from "@mui/material/Snackbar";
// import MuiAlert from "@mui/material/Alert";
// import Slide from "@mui/material/Slide";

// const Alert = React.forwardRef(function Alert(props, ref) {
//   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });

// function Charges() {
//   const getUser = useSession();
//   const user = getUser?.data?.user;

//   const [toast, setToast] = React.useState({
//     error: false,
//     success: false,
//   });
//   const [currentCharge, setCurrentCharge] = useState("");
//   const [openModal, setOpenModal] = React.useState(false);
//   const [charges, setCharges] = useState({
//     currencyId: "",
//     operation: "",
//     newChargeValue: "",
//   });

//   const handleChargeChange = async (event) => {
//     const { name, value } = event.target;
//     setCharges({
//       ...charges,
//       //[event.target.name]: event.target.value,
//       [name]: value,
//     });

//     if (name === "operation") {
//       try {
//         const response = await axios.get(
//           `https://vigoplace.com/server/api/admin/settings/charges/${charges.currencyId}/${value}`,
//           //`http://localhost:4000/api/admin/settings/charges/${charges.currencyId}/${value}`,
//           {
//             headers: {
//               Authorization: user?.token,
//             },
//           }
//         );
//         //console.log(response);
//         setCurrentCharge(response.data.charge);
//       } catch (error) {
//         setCurrentCharge("");
//       }
//     }
//   };

//   const operations = [
//     { id: "vote", label: "Contest Vote Charge" },
//     { id: "payout", label: "Payout Charge" },
//     { id: "deposit", label: "Deposit Charge" },
//     { id: "rent", label: "Rent Charge" },
//     { id: "transfer", label: "Transfer Charge" },
//     { id: "gift", label: "Gift Charge" },
//     { id: "donation", label: "Fundraising Charge" },
//     { id: "support", label: "Support Charge" },
//     { id: "subscription", label: "Subscription Charge" },
//     { id: "buy", label: "Buying Charge" },
//     { id: "service", label: "Service Purchase Charge" },
//     { id: "product", label: "Product Charge" },
//   ];

//   const currencies = [
//     { id: "175", label: "Naira" },
//     { id: "250", label: "USD" },
//   ];

//   const updateCharges = async ({ currencyId, operation, newChargeValue }) => {
//     const updatedCharges = await axios.put(
//       //`http://localhost:4000/api/admin/settings/charges/${currencyId}`,
//       `https://vigoplace.com/server/api/admin/settings/charges/${currencyId}`,
//       { operation, newChargeValue },
//       {
//         headers: {
//           Authorization: user?.token,
//         },
//       }
//     );
//     return updatedCharges;
//   };

//   const updateChargesMutation = useMutation({
//     mutationKey: ["updateCharges"],
//     mutationFn: updateCharges,
//     onError: async (error) => {
//       // Handle error
//       setToast({ ...toast, error: true });
//       setOpenModal(false);
//     },
//     onSuccess: () => {
//       // Handle success
//       setToast({ ...toast, success: true });
//       setCharges({ currencyId: "", operation: "", newChargeValue: "" });
//       setOpenModal(false);
//     },
//   });

//   const handleClose = (event, reason) => {
//     setToast({ error: false, success: false });
//   };

//   return (
//     <>
//       <Snackbar
//         TransitionComponent={Slide}
//         open={toast.error}
//         autoHideDuration={6000}
//         onClose={handleClose}
//       >
//         <Alert onClose={handleClose} severity="warning" sx={{ width: "100%" }}>
//           {updateChargesMutation.error?.message}
//         </Alert>
//       </Snackbar>
//       <Snackbar
//         TransitionComponent={Slide}
//         open={toast.success}
//         autoHideDuration={6000}
//         onClose={handleClose}
//       >
//         <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
//           {updateChargesMutation?.data?.data?.message}
//         </Alert>
//       </Snackbar>
//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//         }}
//       >
//         <Container maxWidth="lg">
//           <Box sx={{ pt: 3 }}>
//             <form>
//               <Card>
//                 <CardHeader subheader="" title="Update Charges" />
//                 <Divider />
//                 <CardContent>
//                   <FormControl fullWidth>
//                     <InputLabel style={{ marginTop: "18px" }}>
//                       Select a Currency
//                     </InputLabel>
//                     <Select
//                       value={charges.currencyId}
//                       onChange={handleChargeChange}
//                       input={
//                         <OutlinedInput
//                           label="Select a Currency"
//                           name="currencyId"
//                         />
//                       }
//                       // inputProps={{
//                       //   name: "currencyId",
//                       // }}
//                       style={{ marginTop: "20px" }}
//                     >
//                       {currencies.map((op) => (
//                         <MenuItem
//                           key={op.id}
//                           value={op.id}
//                           style={{ marginBottom: "5px" }}
//                         >
//                           {op.label}
//                         </MenuItem>
//                       ))}
//                       {/* <MenuItem value={175}>Naira</MenuItem>
//                       <MenuItem value={250}>USD</MenuItem> */}
//                     </Select>
//                   </FormControl>

//                   <FormControl fullWidth>
//                     <InputLabel style={{ marginTop: "18px" }}>
//                       Select an Operation
//                     </InputLabel>
//                     <Select
//                       // labelId="demo-dialog-select-label"
//                       // id="demo-dialog-select"
//                       value={charges.operation}
//                       onChange={handleChargeChange}
//                       //   inputProps={{
//                       //     name: "operation",
//                       //   }}
//                       input={
//                         <OutlinedInput
//                           label="Select an Operation"
//                           name="operation"
//                         />
//                       }
//                       style={{ marginTop: "20px" }}
//                     >
//                       {operations.map((op) => (
//                         <MenuItem
//                           key={op.id}
//                           value={op.id}
//                           style={{ marginBottom: "10px" }}
//                         >
//                           {op.label}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>

//                   {/* Paragraph to display current charge */}
//                   {charges.operation && (
//                     <Typography
//                       variant="body1"
//                       style={{ marginTop: "6px", fontSize: "12px" }}
//                     >
//                       {currentCharge
//                         ? `Current Charge: ${currentCharge}.00`
//                         : //: "No charge available"}
//                           `Current Charge: `}
//                     </Typography>
//                   )}

//                   <TextField
//                     fullWidth
//                     label="New Charge Value"
//                     margin="normal"
//                     name="newChargeValue"
//                     onChange={handleChargeChange}
//                     type="number"
//                     value={charges.newChargeValue}
//                     variant="outlined"
//                   />
//                 </CardContent>
//                 <Divider />
//                 <Box
//                   sx={{
//                     display: "flex",
//                     justifyContent: "flex-end",
//                     p: 2,
//                   }}
//                 >
//                   <LoadingButton
//                     variant="contained"
//                     color="primary"
//                     loading={updateChargesMutation.isLoading}
//                     disabled={
//                       charges.currencyId === "" ||
//                       charges.operation === "" ||
//                       charges.newChargeValue === ""
//                     }
//                     onClick={() => {
//                       updateChargesMutation.mutate(charges);
//                     }}
//                   >
//                     Update Charges
//                   </LoadingButton>
//                 </Box>
//               </Card>
//             </form>
//           </Box>
//         </Container>
//       </Box>
//     </>
//   );
// }

// export default Charges;

function Charges() {
  <h1>Coming soon...</h1>
}

export default Charges;