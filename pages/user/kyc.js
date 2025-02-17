import React, { useMemo, useState, useEffect } from "react";
//import fetch from 'node-fetch';
import { useRouter } from "next/router";
import axios from "axios";
import { format } from "date-fns";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { LoadingButton } from "@mui/lab";
//Material UI Imports
import {
  IconButton,
  Tooltip,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  TextField,
  Typography,
  Box,
  Button,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckIcon from "@mui/icons-material/Check";
import MuiAlert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";
import Snackbar from "@mui/material/Snackbar";

//useQuery Imports
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
  useQuery,
  useMutation,
} from "@tanstack/react-query";
import { getSession, useSession } from "next-auth/react";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const API_BASE_URL = "https://api.vigoplace.com";
//const API_BASE_URL = "http://localhost:4000";
export default function Kyc({ isVerified }) {
  const router = useRouter();
  const { userid } = router.query;
  const queryClient = useQueryClient();
  const getUser = useSession();
  const user = getUser?.data?.user;
  const [kyc, setKyc] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [showData, setShowData] = useState({ bvn: false, nin: false });
  const [imageSrc, setImageSrc] = useState("");
  const [nin, setNin] = useState("");
  const [selfie, setSelfie] = useState("");
  const [rejectKycModal, setRejectKycModal] = useState(false);
  const [notificationText, setNotificationText] = useState("");
  const [kycApproveStatusErrorToast, setKycApproveStatusErrorToast] =
    useState(false);
  const [kycApproveStatusSuccessToast, setKycApproveStatusSuccessToast] =
    useState(false);
  const [kycRejectStatusSuccessToast, setKycRejectStatusSuccessToast] =
    useState(false);
  const [kycRejectStatusErrorToast, setKycRejectStatusErrorToast] =
    useState(false);
  const [isLoadingReceipt, setIsLoadingReceipt] = useState(false);
  const fetchUserKycDetails = async () => {
    setIsFetching(true);
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/admin/console/users/kyc?id=${userid}`,
        {
          headers: {
            Authorization: user?.token,
          },
        }
      );

      //console.log(data);
      setKyc(data?.data ?? []);
    } catch (err) {
      setIsError(true);
      console.log(err, "err fetching user kyc details");
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchUserKycDetails();
  }, [userid]);

  const kycStatusChange = async ({ users, message, type }) => {
    const kycChange = await axios.post(
      //"http://localhost:4000/api/admin/notifications/kyc-verification",
      "https://api.vigoplace.com/api/admin/notifications/kyc-verification",
      { users, message, type },
      {
        headers: {
          Authorization: user?.token,
        },
      }
    );
    return kycChange;
  };

  const kycStatusChangeMutation = useMutation({
    mutationKey: ["kycChange"],
    mutationFn: kycStatusChange,
    onError: async (error) => {
      setKycApproveStatusErrorToast(true);
      console.log(error);
    },
    onSuccess: () => {
      setKycApproveStatusSuccessToast(true);
      queryClient.invalidateQueries("kycChange");
      setTimeout(() => {
        kycStatusChangeMutation.reset(); // Reset the mutation
      }, 6000);
      setNotificationText("");
    },
  });

  const kycRejectStatusChange = async ({ users, message, type }) => {
    const kycChange = await axios.post(
      //"http://localhost:4000/api/admin/notifications/kyc-verification",
      "https://api.vigoplace.com/api/admin/notifications/kyc-verification",
      { users, message, type },
      {
        headers: {
          Authorization: user?.token,
        },
      }
    );
    return kycChange;
  };

  const kycRejectStatusChangeMutation = useMutation({
    mutationKey: ["kycRejectChange"],
    mutationFn: kycRejectStatusChange,
    onError: async (error) => {
      setKycRejectStatusErrorToast(true);
      console.log(error);
    },
    onSuccess: () => {
      setKycRejectStatusSuccessToast(true);
      queryClient.invalidateQueries("kycChange");
      setTimeout(() => {
        kycRejectStatusChangeMutation.reset(); // Reset the mutation
      }, 6000);
      setNotificationText("");
    },
  });

  async function uploadImageToCloudinary(selfie) {
    try {
      const uploadPreset = "a9fkz998"; // Replace with your Cloudinary upload preset
      const formData = new FormData();
      formData.append("file", selfie);
      formData.append("upload_preset", uploadPreset);

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dnhu3eqn5/image/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      //console.log(response);

      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      throw error;
    }
  }

  const decodeBase64Image = async (base64String) => {
    if (base64String) {
      const base64Image = base64String.replace(
        /^data:image\/(png|jpeg|jpg);base64,/,
        ""
      );
      const binaryString = atob(base64Image);
      const byteArray = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        byteArray[i] = binaryString.charCodeAt(i);
      }

      // Create blob and convert to File object
      const blob = new Blob([byteArray], { type: "image/jpeg" });
      const file = new File([blob], "image.jpg", { type: "image/jpeg" });

      // Upload to Cloudinary
      const cloudinaryUrl = await uploadImageToCloudinary(file);
      setImageSrc(cloudinaryUrl);
    }
  };

  useEffect(() => {
    if (kyc.length > 0) {
      decodeBase64Image(kyc[0]?.verifiedData?.entity?.image);
      //selfie
      setSelfie(kyc[0]?.selfie);
      //nin
      setNin(kyc[0]?.ninSlip);
    }
  }, [kyc]);

  const generatePDFReceipt = async (kycData) => {
    setIsLoadingReceipt(true);
    try {
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();

      const imageUrl = kycData[0]?.metadata?.governmentData?.image_url;
      //console.log(kycData[0])

      // Embed the Times Roman font
      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const timesRoman = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const formatTransactionDate = (dateString) => {
        // Convert the string representation of the date to a Date object
        const date = new Date(dateString);

        // Format the date as needed (e.g., "18/03/2024")
        return date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      };

      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();

      // Calculate the width of the text
      const textSize = timesRomanFont.widthOfTextAtSize("KYC Details", 14);

      // Calculate the y-coordinate for the data
      const dataYCoordinate = page.getHeight() - 80; // Adjust as needed

      // Calculate the x-coordinate to position the text at the top middle of the page
      const xCoordinate = (page.getWidth() - textSize) / 2;

      // Add content to the page
      page.drawText("KYC Details", {
        x: xCoordinate,
        y: page.getHeight() - 20, // Adjust y-coordinate as needed
        size: 12,
        font: timesRoman,
        color: rgb(0, 0, 0),
      });

      ///////////////////IMAGE MANIPULATION////////////////

      if (imageSrc) {
        // Function to download the image from Cloudinary
        async function downloadImageFromCloudinary(selfie) {
          try {
            const response = await axios.get(selfie, {
              responseType: "arraybuffer",
            });

            return response.data; // Image data buffer
          } catch (error) {
            console.error("Error downloading image from Cloudinary:", error);
            throw error;
          }
        }

        const bvnData = await downloadImageFromCloudinary(imageSrc);

        const selfieUrl = selfie
          ? await uploadImageToCloudinary(selfie)
          : selfieUrl;
        const selfieData = selfie
          ? await downloadImageFromCloudinary(selfieUrl)
          : await downloadImageFromCloudinary(
              "https://res.cloudinary.com/dnhu3eqn5/image/upload/v1739407699/download_lkfpj2.png"
            );

        const ninUrl = nin
          ? await uploadImageToCloudinary(nin)
          : await downloadImageFromCloudinary(
              "https://res.cloudinary.com/dnhu3eqn5/image/upload/v1739407699/download_lkfpj2.png"
            );
        const ninData = nin
          ? await downloadImageFromCloudinary(ninUrl)
          : ninUrl;

        // Embed the image into the PDF document
        const selfieImage = await pdfDoc.embedJpg(selfieData);
        const ninImage = await pdfDoc.embedPng(ninData);
        const bvnImage = await pdfDoc.embedJpg(bvnData);

        // Labels
        page.drawText("Bvn Image", {
          x: xCoordinate - 210,
          y: page.getHeight() - 150, // Adjust y-coordinate as needed
          size: 12,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        });
        page.drawText("Nin Slip", {
          x: xCoordinate - 20,
          y: page.getHeight() - 150, // Adjust y-coordinate as needed
          size: 12,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        });
        page.drawText("Selfie Image", {
          x: xCoordinate + 160,
          y: page.getHeight() - 150, // Adjust y-coordinate as needed
          size: 12,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        });

        page.drawImage(bvnImage, {
          x: xCoordinate - 210,
          y: page.getHeight() - 135,
          width: 100,
          height: 100,
        });

        page.drawImage(ninImage, {
          x: xCoordinate - 20,
          y: page.getHeight() - 135,
          width: 100,
          height: 100,
        });

        page.drawImage(selfieImage, {
          x: xCoordinate + 160,
          y: page.getHeight() - 135,
          width: 100,
          height: 100,
        });
      }
      //////////////IMAGE MANIPULATION END//////////////////////////

      const drawTexts = (label, value, x, y) => {
        // Convert value to string if it's a number or a function
        if (typeof value === "number") {
          value = value.toString();
        } else if (typeof value === "function") {
          value = value();
        }

        // Draw vertical line before label
        page.drawLine({
          start: { x: x, y: y + 25 },
          end: { x: x, y: y - 15 },
          thickness: 0.5,
          color: rgb(0, 0, 0), // Black color
        });

        // Draw label text with black color
        page.drawText(label, {
          x: x + 5, // Adjust x position to add a left margin
          y: y,
          size: 10,
          font: timesRomanFont,
          color: rgb(0, 0, 0), // Black color
          textAlign: "left",
        });

        // Draw value text aligned to the right
        page.drawText(value, {
          x: x + 100, // Adjust x position to align the value text to the right
          y: y,
          size: 10,
          font: timesRomanFont,
          color: rgb(0, 0, 0), // Black color
          textAlign: "right",
        });

        page.drawLine({
          start: { x: x + page.getWidth() - 120, y: y + 25 },
          end: { x: x + page.getWidth() - 120, y: y - 15 },
          thickness: 0.5,
          color: rgb(0, 0, 0), // Black color
        });

        const lineHeight = 15;

        // Draw vertical line
        page.drawLine({
          start: { x: x + 80, y: y + 25 },
          end: { x: x + 80, y: y - lineHeight },
          thickness: 0.5,
          color: rgb(0, 0, 0), // Black color
        });

        const newY = y - 15;

        // Draw horizontal line
        page.drawLine({
          start: { x: x, y: newY },
          end: { x: x + page.getWidth() - 120, y: newY },
          thickness: 0.5,
          color: rgb(0, 0, 0), // Black color
        });

        return newY; // Return the updated y-coordinate
      };

      page.drawLine({
        start: { x: 50, y: imageSrc ? height - 170 : height - 55 },
        end: {
          x: 50 + page.getWidth() - 120,
          y: imageSrc ? height - 170 : height - 55,
        },
        thickness: 0.5,
        color: rgb(0, 0, 0), // Black color
      });
      // Add KYC data to the PDF
      // Example: Add name
      drawTexts(
        "Name",
        `${
          kycData[0]?.metadata?.governmentData?.surname ||
          kycData[0]?.verifiedData?.entity?.last_name ||
          ""
        } ${
          kycData[0]?.metadata?.governmentData?.firstname ||
          kycData[0]?.verifiedData?.entity?.first_name ||
          ""
        } ${
          kycData[0]?.metadata?.governmentData?.middlename ||
          kycData[0]?.verifiedData?.entity?.middle_name ||
          ""
        }`,
        50, // Calculate the y-coordinate for the data
        imageSrc ? dataYCoordinate - 115 : dataYCoordinate
      );

      drawTexts(
        "Phone Number",
        `${
          kycData[0]?.metadata?.governmentData?.telephoneno ||
          kycData[0]?.verifiedData?.entity?.phone_number1
        }`,
        50, // Calculate the y-coordinate for the data
        imageSrc ? dataYCoordinate - 155 : dataYCoordinate - 40
      );
      drawTexts(
        "BVN",
        `${kycData[0]?.bvn || "N/A"}`,
        50, // Calculate the y-coordinate for the data
        imageSrc ? dataYCoordinate - 195 : dataYCoordinate - 80
      );
      drawTexts(
        "NIN",
        `${kycData[0]?.nin || "N/A"}`,
        50, // Calculate the y-coordinate for the data
        imageSrc ? dataYCoordinate - 235 : dataYCoordinate - 120
      );
      drawTexts(
        "Passport",
        `${kycData[0]?.passport || "N/A"}`,
        50, // Calculate the y-coordinate for the data
        imageSrc ? dataYCoordinate - 275 : dataYCoordinate - 160
      );
      drawTexts(
        "Driver's Licence",
        `${kycData[0]?.driversLicense || "N/A"}`,
        50, // Calculate the y-coordinate for the data
        imageSrc ? dataYCoordinate - 315 : dataYCoordinate - 200
      );
      drawTexts(
        "Birthday",
        formatTransactionDate(
          `${
            kycData[0]?.metadata?.governmentData?.birthdate ||
            kycData[0]?.verifiedData?.entity?.date_of_birth
          }`
        ),
        50, // Calculate the y-coordinate for the data
        imageSrc ? dataYCoordinate - 355 : dataYCoordinate - 240
      );
      drawTexts(
        "Profession",
        `${kycData[0]?.metadata?.governmentData?.profession || "N/A"}`,
        50, // Calculate the y-coordinate for the data
        imageSrc ? dataYCoordinate - 395 : dataYCoordinate - 280
      );
      drawTexts(
        "Address",
        `${
          kycData[0]?.metadata?.governmentData?.residence_AddressLine1 || "N/A"
        }`,
        50, // Calculate the y-coordinate for the data
        imageSrc ? dataYCoordinate - 435 : dataYCoordinate - 320
      );
      drawTexts(
        "Date",
        formatTransactionDate(kycData[0]?.kycDate),
        50, // Calculate the y-coordinate for the data
        imageSrc ? dataYCoordinate - 475 : dataYCoordinate - 360
      );

      // Add more KYC data as needed

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], {
        type: "application/pdf",
      });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      URL.revokeObjectURL(url);
      setIsLoadingReceipt(false);
    } catch (error) {
      setIsLoadingReceipt(false);
      console.error("Error generating PDF receipt:", error);
    }
  };

  // Function to toggle between showing actual data and asterisks
  const toggleDataVisibility = (key) => {
    setShowData((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const renderData = (data, key) => {
    if (showData[key]) {
      return data;
    } else {
      return "*".repeat(data?.length);
    }
  };

  const handleKycApproveStatusSuccess = (event, reason) => {
    setKycApproveStatusSuccessToast(false);
  };
  const handleKycApproveStatusError = (event, reason) => {
    setKycApproveStatusErrorToast(false);
  };

  const handleKycRejectStatusSuccess = (event, reason) => {
    setKycRejectStatusSuccessToast(false);
  };
  const handleKycRejectStatusError = (event, reason) => {
    setKycRejectStatusErrorToast(false);
  };
  return (
    <>
      <Snackbar
        TransitionComponent={Slide}
        open={kycApproveStatusSuccessToast}
        autoHideDuration={6000}
        onClose={handleKycApproveStatusSuccess}
      >
        <Alert
          onClose={handleKycApproveStatusSuccess}
          severity="success"
          sx={{ width: "100%" }}
        >
          {kycStatusChangeMutation?.data?.data?.message}
        </Alert>
      </Snackbar>

      <Snackbar
        TransitionComponent={Slide}
        open={kycApproveStatusErrorToast}
        autoHideDuration={6000}
        onClose={handleKycApproveStatusError}
      >
        <Alert
          onClose={handleKycApproveStatusError}
          severity="warning"
          sx={{ width: "100%" }}
        >
          {kycStatusChangeMutation?.error?.response?.data?.message}
        </Alert>
      </Snackbar>

      <Snackbar
        TransitionComponent={Slide}
        open={kycRejectStatusSuccessToast}
        autoHideDuration={6000}
        onClose={handleKycRejectStatusSuccess}
      >
        <Alert
          onClose={handleKycRejectStatusSuccess}
          severity="success"
          sx={{ width: "100%" }}
        >
          {kycRejectStatusChangeMutation?.data?.data?.message}
        </Alert>
      </Snackbar>

      <Snackbar
        TransitionComponent={Slide}
        open={kycRejectStatusErrorToast}
        autoHideDuration={6000}
        onClose={handleKycRejectStatusError}
      >
        <Alert
          onClose={handleKycRejectStatusError}
          severity="warning"
          sx={{ width: "100%" }}
        >
          {kycRejectStatusChangeMutation?.error?.response?.data?.message}
        </Alert>
      </Snackbar>

      {kyc.map((row, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Click the image to view the full image
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr",
                md: "repeat(3, 1fr)",
              },
              gap: "1rem",
              alignItems: "center",
            }}
          >
            <Box
              style={{ height: "45vh", marginTop: "20px" }}
              onClick={() => window.open(imageSrc, "_blank")}
              sx={{
                cursor: "pointer",
                marginRight: {
                  xs: "0",
                  md: "30px",
                },
              }}
            >
              <Typography variant="subtitle1" gutterBottom>
                Bvn Image
              </Typography>
              {imageSrc ? (
                <img
                  alt="Bvn Image"
                  style={{
                    height: "100%",
                    borderRadius: "4%",
                    width: "100%",
                    objectFit: "cover",
                  }}
                  src={imageSrc}
                  loading="lazy"
                />
              ) : (
                <AccountCircleIcon sx={{ fontSize: "100px" }} />
              )}
            </Box>
            <Box
              style={{ height: "45vh", marginTop: "20px" }}
              onClick={() => window.open(nin, "_blank")}
              sx={{
                cursor: "pointer",
                marginRight: {
                  xs: "0",
                  md: "30px",
                },
              }}
            >
              <Typography variant="subtitle1" gutterBottom>
                NIN
              </Typography>
              {nin ? (
                <img
                  alt="NIN"
                  style={{
                    height: "100%",
                    borderRadius: "4%",
                    width: "100%",
                    objectFit: "cover",
                  }}
                  src={nin}
                  loading="lazy"
                />
              ) : (
                <AccountCircleIcon sx={{ fontSize: "100px" }} />
              )}
            </Box>
            <Box
              style={{ height: "45vh", marginTop: "20px" }}
              onClick={() => window.open(selfie, "_blank")}
              sx={{
                cursor: "pointer",
                marginRight: {
                  xs: "0",
                  md: "30px",
                },
              }}
            >
              <Typography variant="subtitle1" gutterBottom>
                Selfie
              </Typography>
              {selfie ? (
                <img
                  alt="Selfie"
                  style={{
                    height: "100%",
                    borderRadius: "4%",
                    width: "100%",
                    objectFit: "cover",
                    //transform: "rotate(90deg)"
                  }}
                  src={selfie}
                  loading="lazy"
                />
              ) : (
                <AccountCircleIcon sx={{ fontSize: "100px" }} />
              )}
            </Box>
          </Box>{" "}
          <Box
            sx={{
              width: {
                xs: "100%",
                sm: "80%",
                md: "50%",
                lg: "35%",
              },
              mt: 2,
            }}
          >
            <Typography
              variant="h5"
              style={{
                marginBottom: "15px",
                marginTop: "20px",
                fontSize: "25px",
                fontWeight: "bold",
              }}
            >
              {`${
                row?.metadata?.governmentData?.surname ||
                row?.verifiedData?.entity?.last_name ||
                ""
              } 
             ${
               row?.metadata?.governmentData?.firstname ||
               row?.verifiedData?.entity?.first_name ||
               ""
             } 
            ${
              row?.metadata?.governmentData?.middlename ||
              row?.verifiedData?.entity?.middle_name ||
              ""
            }`.trim()}
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <Typography>
                <span style={{ fontWeight: "bold" }}>Phone Number:</span>
              </Typography>
              <Typography>
                {row?.metadata?.governmentData?.telephoneno ||
                  row?.verifiedData?.entity?.phone_number1}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography>
                  <span style={{ fontWeight: "bold" }}>BVN:</span>
                </Typography>
              </Box>
              <Typography
                sx={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                {renderData(row?.bvn, "bvn") || "N/A"}
                <IconButton onClick={() => toggleDataVisibility("bvn")}>
                  {showData.bvn ? (
                    <VisibilityOff fontSize="small" />
                  ) : (
                    <Visibility fontSize="small" />
                  )}
                </IconButton>
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography>
                  <span style={{ fontWeight: "bold" }}>NIN:</span>
                </Typography>
              </Box>
              <Typography>
                {renderData(row?.nin, "nin") || "N/A"}
                <IconButton onClick={() => toggleDataVisibility("nin")}>
                  {showData.nin ? (
                    <VisibilityOff fontSize="small" />
                  ) : (
                    <Visibility fontSize="small" />
                  )}
                </IconButton>
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <Typography>
                <span style={{ fontWeight: "bold" }}>Passport:</span>
              </Typography>
              <Typography>{row?.passport || "N/A"}</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <Typography>
                <span style={{ fontWeight: "bold" }}>Driver's License:</span>
              </Typography>
              <Typography>{row?.drivers_license || "N/A"}</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <Typography>
                <span style={{ fontWeight: "bold" }}>Birthday:</span>
              </Typography>
              <Typography>
                {row?.metadata?.governmentData?.birthdate ||
                  row?.verifiedData?.entity?.date_of_birth ||
                  "N/A"}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <Typography>
                <span style={{ fontWeight: "bold" }}>Profession:</span>
              </Typography>
              <Typography>
                {row?.metadata?.governmentData?.profession || "N/A"}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <Typography>
                <span style={{ fontWeight: "bold" }}>Address:</span>
              </Typography>
              <Typography>
                {row?.metadata?.governmentData?.residence_AddressLine1 || "N/A"}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <Typography>
                <span style={{ fontWeight: "bold" }}>Date:</span>
              </Typography>
              <Typography>
                {row?.createdAt
                  ? format(new Date(row.createdAt), "MM/dd/yyyy hh:mm a")
                  : ""}
              </Typography>
            </Box>
          </Box>{" "}
        </Box>
      ))}
      {isLoading && <Typography>Loading...</Typography>}
      {isFetching && <Typography>Fetching data...</Typography>}
      {kyc.length > 0 && (
        <Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              disabled={isLoadingReceipt}
              onClick={() => generatePDFReceipt(kyc)}
            >
              {isLoadingReceipt ? (
                <CircularProgress size={23} color="inherit" />
              ) : (
                "Download report"
              )}
            </Button>
          </Box>
          {isVerified === "unverified" && (
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button
                variant="contained"
                color="danger"
                onClick={() => setRejectKycModal(true)}
                sx={{ marginRight: "10px" }}
              >
                {/* Reject KYC */}

                {kycRejectStatusChangeMutation.isLoading ? (
                  <CircularProgress size={23} color="inherit" />
                ) : kycRejectStatusChangeMutation.isSuccess ? (
                  <CheckIcon />
                ) : (
                  "Reject KYC"
                )}
              </Button>

              {/* <MenuItem sx={{ width: "100%", marginRight: "auto" }}>
              <Typography
                variant="body2"
                color="text.secondary"
                onClick={() => setNotifyModal(true)}
              >
                {notifyUserMutation.isLoading ? (
                  <CircularProgress size={23} color="inherit" />
                ) : notifyUserMutation.isSuccess ? (
                  <CheckIcon />
                ) : (
                  "Send Notification"
                )}
              </Typography>
            </MenuItem> */}

              <Dialog
                open={rejectKycModal}
                onClose={() => {
                  setRejectKycModal(false);
                }}
              >
                <DialogTitle>Reject KYC</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Enter Notification Text You Wish To Send To This User For
                    Rejecting his/her KYC
                  </DialogContentText>

                  <TextField
                    autoFocus
                    margin="normal"
                    id="name"
                    label="Enter Notification Text"
                    multiline
                    fullWidth
                    variant="standard"
                    onChange={(e) => setNotificationText(e.target.value)}
                  />
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={() => {
                      setNotificationText("");
                      setRejectKycModal(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <LoadingButton
                    variant="contained"
                    loading={kycRejectStatusChangeMutation.isLoading}
                    disabled={notificationText === ""}
                    onClick={() => {
                      kycRejectStatusChangeMutation.mutate({
                        users: userid,
                        message: notificationText,
                        type: "reject",
                      });
                      setNotificationText("");
                      setRejectKycModal(false);
                    }}
                  >
                    Notify
                  </LoadingButton>
                </DialogActions>
              </Dialog>

              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  kycStatusChangeMutation.mutate({
                    users: userid,
                    message: "Your KYC request has been successfully approved",
                    type: "approve",
                  });
                }}
              >
                {kycStatusChangeMutation.isLoading ? (
                  <CircularProgress size={23} color="inherit" />
                ) : kycStatusChangeMutation.isSuccess ? (
                  <CheckIcon />
                ) : (
                  "Approve Kyc"
                )}
              </Button>
            </Box>
          )}
        </Box>
      )}
    </>
  );
}
