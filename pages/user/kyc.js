import React, { useMemo, useState, useEffect } from "react";
import MaterialReactTable from "material-react-table";
import { useRouter } from "next/router";
import axios from "axios";
import { format } from "date-fns";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Ubuntu from "../../public/Ubuntu-R.ttf";
import fontkit from "@pdf-lib/fontkit";
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
      //   const urls = Ubuntu;
      //   const fontBytes = await fetch(urls).then((res) => res.arrayBuffer());
      //   pdfDoc.registerFontkit(fontkit);

      //   const ubuntuFont = await pdfDoc.embedFont(fontBytes, {
      //     subset: true,
      //   });

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
      //console.log(height);

      // Calculate the width of the text
      const textSize = timesRomanFont.widthOfTextAtSize(
        "KYC Details Receipt",
        14
      );

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

  const kycColumns = useMemo(
    () => [
      {
        accessorFn: (row) => {
          const surname = row?.metadata?.governmentData?.surname || "";
          const firstname = row?.metadata?.governmentData?.firstname || "";
          const middlename = row?.metadata?.governmentData?.middlename || "";

          return `${surname} ${firstname} ${middlename}`.trim();
        },
        enableClickToCopy: false,
        header: "Name",
      },
      {
        accessorFn: (row) => row?.metadata?.governmentData?.image_url,
        id: "image",
        header: "Image",
        Cell: ({ cell, row }) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            {row?.original?.metadata?.governmentData?.image_url ? (
              <img
                alt="User Image"
                height={30}
                src={row?.original?.metadata?.governmentData?.image_url}
                loading="lazy"
                style={{ borderRadius: "50%" }}
              />
            ) : (
              <AccountCircleIcon sx={{ fontSize: "33px" }} />
            )}

            <Typography>
              {row?.original?.metadata?.governmentData?.image_url
                ? "Image Available"
                : "No Image"}
            </Typography>
          </Box>
        ),
      },
      {
        accessorKey: "metadata.governmentData.telephoneno",
        enableClickToCopy: false,
        header: "Phone Number",
      },
      {
        accessorKey: "bvn",
        enableClickToCopy: false,
        header: "BVN",
        Cell: ({ cell, row }) => {
          const [showData1, setShowData1] = React.useState(false);

          const handleClick = () => {
            setShowData1(!showData1);
          };

          return (
            <span onClick={handleClick} style={{ cursor: "pointer" }}>
              {showData1 ? row.original.bvn : "**********"}
            </span>
          );
        },
      },
      {
        accessorKey: "nin",
        enableClickToCopy: false,
        header: "NIN",
        Cell: ({ cell, row }) => {
          const [showData, setShowData] = React.useState(false);

          const handleClick = () => {
            setShowData(!showData);
          };

          return (
            <span onClick={handleClick} style={{ cursor: "pointer" }}>
              {showData ? row.original.nin : "**********"}
            </span>
          );
        },
      },
      {
        accessorKey: "passport",
        enableClickToCopy: false,
        header: "Passport",
      },
      {
        accessorKey: "drivers license",
        enableClickToCopy: false,
        header: "Driver's License",
      },
      {
        accessorKey: "metadata.governmentData.birthdate",
        enableClickToCopy: false,
        header: "Birthday",
      },
      {
        accessorKey: "metadata.governmentData.profession",
        enableClickToCopy: false,
        header: "Profession",
      },
      {
        accessorKey: "metadata.governmentData.residence_AddressLine1",
        enableClickToCopy: false,
        header: "Address",
      },
      {
        accessorFn: (row) => {
          if (row?.createdAt) {
            return format(new Date(row.createdAt), "MM/dd/yyyy hh:mm a");
          } else {
            return "";
          }
        },
        enableClickToCopy: false,
        header: "Date",
      },
    ],
    []
  );

  return (
    <>
      <MaterialReactTable
        enableColumnFilterModes
        enableColumnOrdering
        enablePinning
        columns={kycColumns}
        data={kyc}
        enableStickyHeader
        enablePagination
        manualPagination
        manualFiltering
        initialState={{ showColumnFilters: false }}
        positionToolbarAlertBanner="bottom"
        muiToolbarAlertBannerProps={
          isError
            ? {
                color: "error",
                children:
                  "Error loading data, Please use the refresh button on the table to retry",
              }
            : undefined
        }
        renderTopToolbarCustomActions={({ table }) => {
          return (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Tooltip arrow title="Refresh Data">
                <IconButton onClick={() => fetchUserKycDetails()}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </div>
          );
        }}
        renderBottomToolbarCustomActions={({ table }) => {
          if (kyc.length > 0) {
            return (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "0.5rem",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => generatePDFReceipt(kyc)}
                >
                  Generate PDF Receipt
                </Button>
              </Box>
            );
          } else {
            return null; // Don't render anything if KYC data is not present
          }
        }}
        state={{
          isLoading,
          showAlertBanner: isError,
          showProgressBars: isFetching,
        }}
        muiTableContainerProps={{ sx: { height: "75vh" } }}
      />
    </>
  );
}
