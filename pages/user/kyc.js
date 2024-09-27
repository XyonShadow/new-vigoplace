import React, { useMemo, useState, useEffect } from "react";
//import fetch from 'node-fetch';
import { useRouter } from "next/router";
import axios from "axios";
import { format } from "date-fns";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
//Material UI Imports
import {
  IconButton,
  Tooltip,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Typography,
  Box,
  Button,
  Grid,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

//useQuery Imports
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
  useQuery,
  useMutation,
} from "@tanstack/react-query";
import { getSession, useSession } from "next-auth/react";

const API_BASE_URL = "https://api.vigoplace.com";
//const API_BASE_URL = "http://localhost:4000";
export default function Kyc() {
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

  const decodeBase64Image = (base64String) => {
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
      const blob = new Blob([byteArray], { type: "image/jpeg" });
      const imageUrl = URL.createObjectURL(blob);
      setImageSrc(imageUrl);
    }
  };

  useEffect(() => {
    if (kyc.length > 0) {
      decodeBase64Image(kyc[0]?.verifiedData?.entity?.image);
    }
  }, [kyc]);

  const generatePDFReceipt = async (kycData) => {
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

      // if (imageUrl) {
      //   // Function to upload image to Cloudinary
      //   async function uploadImageToCloudinary(imageUrl) {
      //     try {
      //       const uploadPreset = "a9fkz998"; // Replace with your Cloudinary upload preset
      //       const formData = new FormData();
      //       formData.append("file", imageUrl);
      //       formData.append("upload_preset", uploadPreset);

      //       const response = await axios.post(
      //         `https://api.cloudinary.com/v1_1/dnhu3eqn5/image/upload`,
      //         formData,
      //         {
      //           headers: {
      //             "Content-Type": "multipart/form-data",
      //           },
      //         }
      //       );

      //       console.log(response)

      //       return response.data.secure_url;
      //     } catch (error) {
      //       console.error("Error uploading image to Cloudinary:", error);
      //       throw error;
      //     }
      //   }

      //   // Function to download the image from Cloudinary
      //   async function downloadImageFromCloudinary(imageUrl) {
      //     try {
      //       const response = await axios.get(imageUrl, {
      //         responseType: "arraybuffer",
      //       });

      //       return response.data; // Image data buffer
      //     } catch (error) {
      //       console.error("Error downloading image from Cloudinary:", error);
      //       throw error;
      //     }
      //   }

      //   // Upload image to Cloudinary
      //   const cloudinaryUrl = await uploadImageToCloudinary(imageUrl);

      //   // Download the image from Cloudinary
      //   const imageData = await downloadImageFromCloudinary(cloudinaryUrl);

      //   // Embed the image into the PDF document
      //   const kycImage = await pdfDoc.embedPng(imageData);

      //   page.drawImage(kycImage, {
      //     x: xCoordinate - 20,
      //     y: page.getHeight() - 135,
      //     width: 100,
      //     height: 100,
      //   });
      // }

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
        start: { x: 50, y: imageUrl ? height - 170 : height - 55 },
        end: {
          x: 50 + page.getWidth() - 120,
          y: imageUrl ? height - 170 : height - 55,
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
        imageUrl ? dataYCoordinate - 115 : dataYCoordinate
      );

      drawTexts(
        "Phone Number",
        `${
          kycData[0]?.metadata?.governmentData?.telephoneno ||
          kycData[0]?.verifiedData?.entity?.phone_number1
        }`,
        50, // Calculate the y-coordinate for the data
        imageUrl ? dataYCoordinate - 155 : dataYCoordinate - 40
      );
      drawTexts(
        "BVN",
        `${kycData[0]?.bvn || "Not applicable"}`,
        50, // Calculate the y-coordinate for the data
        imageUrl ? dataYCoordinate - 195 : dataYCoordinate - 80
      );
      drawTexts(
        "NIN",
        `${kycData[0]?.nin || "Not applicable"}`,
        50, // Calculate the y-coordinate for the data
        imageUrl ? dataYCoordinate - 235 : dataYCoordinate - 120
      );
      drawTexts(
        "Passport",
        `${kycData[0]?.passport || "Not applicable"}`,
        50, // Calculate the y-coordinate for the data
        imageUrl ? dataYCoordinate - 275 : dataYCoordinate - 160
      );
      drawTexts(
        "Driver's Licence",
        `${kycData[0]?.driversLicense || "Not applicable"}`,
        50, // Calculate the y-coordinate for the data
        imageUrl ? dataYCoordinate - 315 : dataYCoordinate - 200
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
        imageUrl ? dataYCoordinate - 355 : dataYCoordinate - 240
      );
      drawTexts(
        "Profession",
        `${
          kycData[0]?.metadata?.governmentData?.profession || "Not applicable"
        }`,
        50, // Calculate the y-coordinate for the data
        imageUrl ? dataYCoordinate - 395 : dataYCoordinate - 280
      );
      drawTexts(
        "Address",
        `${
          kycData[0]?.metadata?.governmentData?.residence_AddressLine1 ||
          "Not applicable"
        }`,
        50, // Calculate the y-coordinate for the data
        imageUrl ? dataYCoordinate - 435 : dataYCoordinate - 320
      );
      drawTexts(
        "Date",
        formatTransactionDate(kycData[0]?.kycDate),
        50, // Calculate the y-coordinate for the data
        imageUrl ? dataYCoordinate - 475 : dataYCoordinate - 360
      );

      // Add more KYC data as needed

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], {
        type: "application/pdf",
      });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      URL.revokeObjectURL(url);
    } catch (error) {
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

  return (
    <>
      {kyc.map((row, index) => (
        <Box
          key={index}
          sx={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <Box
            style={{ height: "60vh", marginTop: "20px", marginRight: "30px" }}
          >
            {imageSrc ? (
              <img
                alt="User Image"
                style={{ height: "100%", borderRadius: "4%" }}
                src={imageSrc}
                loading="lazy"
              />
            ) : (
              <AccountCircleIcon sx={{ fontSize: "100px" }} />
            )}
          </Box>

          <Box>
            <Typography
              variant="h5"
              style={{ marginBottom: "15px", fontSize: "30px" }}
            >
              {`${
                row?.metadata?.governmentData?.surname ||
                row?.verifiedData?.entity?.last_name ||
                "Not applicable"
              } 
             ${
               row?.metadata?.governmentData?.firstname ||
               row?.verifiedData?.entity?.first_name ||
               "Not applicable"
             } 
            ${
              row?.metadata?.governmentData?.middlename ||
              row?.verifiedData?.entity?.middle_name ||
              "Not applicable"
            }`.trim()}
            </Typography>

            <Typography style={{ marginBottom: "10px" }}>
              Phone Number:{" "}
              {row?.metadata?.governmentData?.telephoneno ||
                row?.verifiedData?.entity?.phone_number1}
            </Typography>
            <Grid
              container
              alignItems="center"
              style={{ marginBottom: "10px" }}
            >
              <Grid item>
                <Typography>
                  BVN: {renderData(row?.bvn, "bvn") || "Not applicable"}
                </Typography>
              </Grid>
              <Grid item>
                <IconButton onClick={() => toggleDataVisibility("bvn")}>
                  {showData.bvn ? (
                    <VisibilityOff fontSize="small" />
                  ) : (
                    <Visibility fontSize="small" />
                  )}
                </IconButton>
              </Grid>
            </Grid>
            <Grid
              container
              alignItems="center"
              style={{ marginBottom: "10px" }}
            >
              <Grid item>
                <Typography>
                  NIN: {renderData(row?.nin, "nin") || "Not applicable"}
                </Typography>
              </Grid>
              <Grid item>
                <IconButton onClick={() => toggleDataVisibility("nin")}>
                  {showData.nin ? (
                    <VisibilityOff fontSize="small" />
                  ) : (
                    <Visibility fontSize="small" />
                  )}
                </IconButton>
              </Grid>
            </Grid>
            <Typography style={{ marginBottom: "10px" }}>
              Passport: {row?.passport || "Not applicable"}
            </Typography>
            <Typography style={{ marginBottom: "10px" }}>
              Driver's License: {row?.drivers_license || "Not applicable"}
            </Typography>
            <Typography style={{ marginBottom: "10px" }}>
              Birthday:{" "}
              {row?.metadata?.governmentData?.birthdate ||
                row?.verifiedData?.entity?.date_of_birth ||
                "Not applicable"}
            </Typography>
            <Typography style={{ marginBottom: "10px" }}>
              Profession:{" "}
              {row?.metadata?.governmentData?.profession || "Not applicable"}
            </Typography>
            <Typography style={{ marginBottom: "10px" }}>
              Address:{" "}
              {row?.metadata?.governmentData?.residence_AddressLine1 ||
                "Not applicable"}
            </Typography>
            <Typography style={{ marginBottom: "10px" }}>
              Date:{" "}
              {row?.createdAt
                ? format(new Date(row.createdAt), "MM/dd/yyyy hh:mm a")
                : ""}
            </Typography>
          </Box>
        </Box>
      ))}
      {isLoading && <Typography>Loading...</Typography>}
      {isFetching && <Typography>Fetching data...</Typography>}
      {kyc.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => generatePDFReceipt(kyc)}
          >
            Download report
          </Button>
        </Box>
      )}
    </>
  );
}
