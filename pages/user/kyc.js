import React, { useMemo, useState, useEffect } from "react";
import MaterialReactTable from "material-react-table";
import { useRouter } from "next/router";
import axios from "axios";
import { format } from "date-fns";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
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

const API_BASE_URL = "https://vigoplace.com/server";
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
  const [showData, setShowData] = useState(false);
  const [showData2, setShowData2] = useState(false);

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
      console.log(err, "err fetching user kyc deatils");
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchUserKycDetails();
  }, [userid]);

  const generatePDFReceipt = async (kycData) => {
    try {
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();

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
      page.drawText("KYC Details Receipt", {
        x: xCoordinate,
        y: page.getHeight() - 20, // Adjust y-coordinate as needed
        size: 12,
        font: timesRoman,
        color: rgb(0, 0, 0),
      });

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
        start: { x: 50, y: height - 55 },
        end: { x: 50 + page.getWidth() - 120, y: height - 55 },
        thickness: 0.5,
        color: rgb(0, 0, 0), // Black color
      });
      // Add KYC data to the PDF
      // Example: Add name
      drawTexts(
        "Name",
        `${kycData[0]?.metadata?.governmentData?.surname} ${kycData[0]?.metadata?.governmentData?.firstname} ${kycData[0]?.metadata?.governmentData?.middlename}`,
        50, // Calculate the y-coordinate for the data
        dataYCoordinate
      );

      drawTexts(
        "Phone Number",
        `${kycData[0]?.metadata?.governmentData?.telephoneno}`,
        50, // Calculate the y-coordinate for the data
        dataYCoordinate - 40
      );
      drawTexts(
        "BVN",
        `${kycData[0]?.bvn}`,
        50, // Calculate the y-coordinate for the data
        dataYCoordinate - 80
      );
      drawTexts(
        "NIN",
        `${kycData[0]?.nin}`,
        50, // Calculate the y-coordinate for the data
        dataYCoordinate - 120
      );
      drawTexts(
        "Passport",
        `${kycData[0]?.passport}`,
        50, // Calculate the y-coordinate for the data
        dataYCoordinate - 160
      );
      drawTexts(
        "Driver's Licence",
        `${kycData[0]?.driversLicense}`,
        50, // Calculate the y-coordinate for the data
        dataYCoordinate - 200
      );
      drawTexts(
        "Birthday",
        formatTransactionDate(
          `${kycData[0]?.metadata?.governmentData?.birthdate}`
        ),
        50, // Calculate the y-coordinate for the data
        dataYCoordinate - 240
      );
      drawTexts(
        "Profession",
        `${kycData[0]?.metadata?.governmentData?.profession}`,
        50, // Calculate the y-coordinate for the data
        dataYCoordinate - 280
      );
      drawTexts(
        "Address",
        `${kycData[0]?.metadata?.governmentData?.residence_AddressLine1}`,
        50, // Calculate the y-coordinate for the data
        dataYCoordinate - 320
      );
      drawTexts(
        "Date",
        formatTransactionDate(kycData[0]?.kycDate),
        50, // Calculate the y-coordinate for the data
        dataYCoordinate - 360
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
  const toggleDataVisibility = () => {
    setShowData((prevState) => !prevState);
  };

  const toggleDataVisibility2 = () => {
    setShowData2((prevState) => !prevState);
  };

  const renderData = (data) => {
    if (showData) {
      return data;
    } else {
      return "*".repeat(data.length);
    }
  };

  const renderData2 = (data) => {
    if (showData2) {
      return data;
    } else {
      return "*".repeat(data.length);
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
            {row?.metadata?.governmentData?.image_url ? (
              <img
                alt="User Image"
                style={{ height: "100%", borderRadius: "4%" }}
                src={row?.metadata?.governmentData?.image_url}
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
              {`${row?.metadata?.governmentData?.surname || ""} ${
                row?.metadata?.governmentData?.firstname || ""
              } ${row?.metadata?.governmentData?.middlename || ""}`.trim()}
            </Typography>
            <Typography style={{ marginBottom: "10px" }}>
              Phone Number: {row?.metadata?.governmentData?.telephoneno}
            </Typography>
            <Typography
              style={{ marginBottom: "10px" }}
              onClick={toggleDataVisibility}
            >
              BVN: {renderData(row?.bvn)}
            </Typography>
            <Typography
              style={{ marginBottom: "10px" }}
              onClick={toggleDataVisibility2}
            >
              NIN: {renderData2(row?.nin)}
            </Typography>
            <Typography style={{ marginBottom: "10px" }}>
              Passport: {row?.passport || ""}
            </Typography>
            <Typography style={{ marginBottom: "10px" }}>
              Driver's License: {row?.drivers_license || ""}
            </Typography>
            <Typography style={{ marginBottom: "10px" }}>
              Birthday: {row?.metadata?.governmentData?.birthdate || ""}
            </Typography>
            <Typography style={{ marginBottom: "10px" }}>
              Profession: {row?.metadata?.governmentData?.profession || ""}
            </Typography>
            <Typography style={{ marginBottom: "10px" }}>
              Address:{" "}
              {row?.metadata?.governmentData?.residence_AddressLine1 || ""}
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
