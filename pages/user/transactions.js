import React, { useMemo, useState, useEffect } from "react";
import MaterialReactTable from "material-react-table";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import ReceiptLogoIcon from "../../assets/images/backgrounds/logo_small.png";
import axios from "axios";
import { format } from "date-fns";
//Material UI Imports
import {
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Grid,
  Box,
  Divider,
  CardHeader,
  Card,
  CardContent,
  form,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

//useQuery Imports
import { useQueryClient } from "@tanstack/react-query";
import { getSession, useSession } from "next-auth/react";

const API_BASE_URL = "https://api.vigoplace.com";
//const API_BASE_URL = "http://localhost:4000";

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

export default function Transaction() {
  const router = useRouter();
  const { userid } = router.query;
  const queryClient = useQueryClient();
  const getUser = useSession();
  const user = getUser?.data?.user;
  const [transaction, setTransaction] = useState([]);
  const [transactionCount, setTransactionCount] = useState(0);
  const [globalFilter, setGlobalFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [transaction1, setTransaction1] = useState([]);
  const [transactionCount1, setTransactionCount1] = useState(0);
  const [globalFilter1, setGlobalFilter1] = useState("");
  const [isLoading1, setIsLoading1] = useState(false);
  const [isError1, setIsError1] = useState(false);
  const [isFetching1, setIsFetching1] = useState(false);
  const [pagination1, setPagination1] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [tabValue, setTabValue] = React.useState(0);

  const handleSearch = (event) => {
    setGlobalFilter(event || "");
  };

  const handleSearch1 = (event) => {
    setGlobalFilter1(event || "");
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const fetchUserTransactions = async () => {
    setIsFetching(true);
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/admin/console/users/transactions?userId=${userid}&perPage=${
          pagination.pageSize
        }&page=${
          pagination.pageIndex + 1
        }&search=${globalFilter}&currency=${"Naira"}`,
        {
          headers: {
            Authorization: user?.token,
          },
        }
      );

      console.log(data);
      setTransaction(data?.data ?? []);
      setTransactionCount(data?.count?.total ?? 0);
    } catch (err) {
      setIsError(true);
      console.log(err, "err fetching user transactions");
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchUserTransactions();
  }, [userid, pagination, globalFilter, tabValue]);

  const fetchUserTransactions1 = async () => {
    setIsFetching1(true);
    setIsLoading1(true);
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/admin/console/users/transactions?userId=${userid}&perPage=${
          pagination1.pageSize
        }&page=${
          pagination1.pageIndex + 1
        }&search=${globalFilter1}&currency=${"US Dollar"}`,
        {
          headers: {
            Authorization: user?.token,
          },
        }
      );

      //console.log(data);
      setTransaction1(data?.data ?? []);
      setTransactionCount1(data?.count?.total ?? 0);
    } catch (err) {
      setIsError1(true);
      console.log(err, "err fetching user transactions");
    } finally {
      setIsLoading1(false);
      setIsFetching1(false);
    }
  };

  useEffect(() => {
    fetchUserTransactions1();
  }, [userid, pagination1, globalFilter1, tabValue]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "transactionType",
        enableClickToCopy: false,
        header: "Type",
      },
      {
        accessorKey: "transactionFrom",
        enableClickToCopy: false,
        muiTableBodyCellProps: ({ cell }) => {
          const transactionType = cell.row.original.transactionType;
          const transactionReference = cell.row.original.transactionReference;
          return {
            style: {
              cursor: transactionType === "credit" ? "pointer" : "default",
            },
            onClick: () => {
              if (transactionType === "credit") {
                console.log(cell.getValue());
                const userId = cell.row.original.userid;
                const url = `/user/transaction/${transactionReference}/${transactionType}`;
                window.open(url, "_blank");
              }
            },
            onMouseEnter: (e) => {
              if (transactionType === "credit") {
                e.target.style.textDecoration = "underline";
              }
            },
            onMouseLeave: (e) => {
              if (transactionType === "credit") {
                e.target.style.textDecoration = "none";
              }
            },
          };
        },
        header: "Sender",
        id: "transactionFrom",
      },
      {
        accessorKey: "transactionTo",
        enableClickToCopy: false,
        muiTableBodyCellProps: ({ cell }) => {
          const transactionType = cell.row.original.transactionType;
          const transactionReference = cell.row.original.transactionReference;
          return {
            style: {
              cursor: transactionType === "debit" ? "pointer" : "default",
            },
            onClick: () => {
              if (transactionType === "debit") {
                console.log(cell.getValue());
                const userId = cell.row.original.userid;
                const url = `/user/transaction/${transactionReference}/${transactionType}`;
                window.open(url, "_blank");
              }
            },
            onMouseEnter: (e) => {
              if (transactionType === "debit") {
                e.target.style.textDecoration = "underline";
              }
            },
            onMouseLeave: (e) => {
              if (transactionType === "debit") {
                e.target.style.textDecoration = "none";
              }
            },
          };
        },
        header: "Receiver",
        id: "transactionTo",
      },
      {
        accessorKey: "transactionReference",
        enableClickToCopy: true,
        header: "Reference",
      },
      {
        accessorKey: "transactionStatus",
        enableClickToCopy: false,
        header: "Status",
      },
      {
        accessorKey: "transactionDescription",
        enableClickToCopy: false,
        header: "Description",
      },
      //WIsDefault
      {
        accessorKey: "currency",
        enableClickToCopy: false,
        header: "Currency",
      },
      {
        id: "WIsDefault",
        accessorFn: (row) => {
          let walletLabel = `Wallet ID: ${row.walletId}`;

          if (row.currency) {
            walletLabel += ` (${row.currency})`;
          }

          if (row.WIsDefault === 1) {
            walletLabel += " (Default)";
          }

          return walletLabel;
        },
        enableClickToCopy: false,
        header: "Wallet Category",
      },
      {
        id: "transactionTotal",
        accessorFn: (row) => row.transactionNetTotal?.toLocaleString("en-US"),
        enableClickToCopy: false,
        header: "Amount",
      },
      {
        id: "transactionFee",
        accessorKey: "transactionFee",
        enableClickToCopy: false,
        header: "Vigoplace Fee",
      },
      {
        id: "gatewayCharge",
        accessorKey: "gatewayCharge",
        enableClickToCopy: false,
        header: "gateway Fee",
      },
      {
        accessorFn: (row) =>
          (row.gatewayCharge + row.transactionFee)?.toLocaleString("en-US"),
        id: "totalFee",
        enableClickToCopy: false,
        header: "Total Fee",
      },
      {
        accessorFn: (row) => {
          if (row?.transactionDate) {
            return format(new Date(row.transactionDate), "Pp");
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
      <Grid
        // container
        spacing={0}
        // xs={12}
        // lg={12}
        sx={{
          display: "flex",
          background: "",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Grid item sm={12} xs={12} lg={12}>
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderColor: "divider" }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                textColor="inherit"
                centered
                scrollButtons="auto"
                aria-label=""
              >
                <Tab label="Naira" {...a11yProps(0)} />
                <Tab label="Usd" {...a11yProps(1)} />
              </Tabs>
            </Box>

            <Box sx={{ pt: 3 }}>
              <form>
                <Card>
                  <CardHeader subheader="" title="User Transactions" />
                  <Divider />
                  <CardContent>
                    <TabPanel value={tabValue} index={0}>
                      <Box>
                        <MaterialReactTable
                          enableColumnFilterModes
                          enableColumnOrdering
                          enablePinning
                          columns={columns}
                          data={transaction}
                          enableStickyHeader
                          enablePagination
                          manualPagination
                          manualFiltering
                          onPaginationChange={setPagination}
                          rowCount={transactionCount}
                          onGlobalFilterChange={handleSearch}
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
                          // muiTableBodyRowProps={({ row }) => ({
                          //   onClick: async () => {
                          //     const {
                          //       transactionDate,
                          //       transactionDescription,
                          //       transactionFee,
                          //       transactionFrom,
                          //       transactionId,
                          //       transactionNetTotal,
                          //       transactionReference,
                          //       transactionStatus,
                          //       transactionTo,
                          //       transactionTotal,
                          //       transactionType,
                          //       currency,
                          //       currencySymbol,
                          //     } = row.original;

                          //     const formattedTransactionDate = format(
                          //       new Date(transactionDate),
                          //       "MMM dd, yyyy h:mm a"
                          //     );

                          //     // Create a new PDFDocument
                          //     const pdfDoc = await PDFDocument.create();

                          //     // Embed the Times Roman font
                          //     const timesRomanFont = await pdfDoc.embedFont(
                          //       StandardFonts.Helvetica
                          //     );

                          //     const imageUrl = ReceiptLogoIcon.src;

                          //     const fetchImage = async (imageUrl) => {
                          //       const response = await fetch(imageUrl);
                          //       if (!response.ok) {
                          //         throw new Error(
                          //           `Failed to fetch image: ${response.statusText}`
                          //         );
                          //       }
                          //       return await response.arrayBuffer();
                          //     };

                          //     // Usage:
                          //     const imageBytes = await fetchImage(imageUrl);

                          //     // Embed the image into the PDF document
                          //     const receiptLogoImage = await pdfDoc.embedPng(
                          //       imageBytes
                          //     );

                          //     // Add a blank page to the document
                          //     const page = pdfDoc.addPage();

                          //     // Get the width and height of the page
                          //     const { width, height } = page.getSize();

                          //     // Set initial y position for text
                          //     const marginTop = 40; // Adjust the margin top as needed
                          //     let textY = height - 50 - marginTop; // Subtracting the margin from the initial position
                          //     const marginLeft = width * 0.1; // 10% of the screen width
                          //     const marginRight = width * 0.1;

                          //     const bodyBackgroundColor = rgb(
                          //       243 / 255,
                          //       244 / 255,
                          //       248 / 255
                          //     ); // Hex color  #F3F4F8

                          //     // Adjust the font size for heading
                          //     const fontSize = 20;
                          //     const headingFontSize = 16;
                          //     const headingValueFontSize = 40;
                          //     const bodyFontSize = 14;

                          //     // Background colors
                          //     const headingBackgroundColor = rgb(
                          //       129 / 255,
                          //       53 / 255,
                          //       249 / 255
                          //     ); // Hex color #8135F9
                          //     const totalAmountValueBackgroundColor = rgb(
                          //       141 / 255,
                          //       73 / 255,
                          //       249 / 255
                          //     ); // #8d49f9

                          //     const receiptTextStyle = {
                          //       size: fontSize,
                          //       color: rgb(0, 0, 0),
                          //     };

                          //     // Styling for the total amount section
                          //     const totalAmountLabelStyle = {
                          //       size: headingFontSize,
                          //       color: rgb(255 / 255, 255 / 255, 255 / 255), // White color
                          //       //bold: true,
                          //     };

                          //     const totalAmountValueStyle = {
                          //       size: headingValueFontSize,
                          //       color: rgb(255 / 255, 255 / 255, 255 / 255),
                          //     };

                          //     // Function to draw text with specified style and alignment
                          //     const drawText = (text, style, width) => {
                          //       // Calculate the x-coordinate to center the text horizontally
                          //       const textWidth =
                          //         timesRomanFont.widthOfTextAtSize(
                          //           text,
                          //           style.size
                          //         );
                          //       const x = (width - textWidth) / 2;

                          //       page.drawText(text, {
                          //         x: x,
                          //         y: textY + 20,
                          //         size: style.size,
                          //         font: timesRomanFont,
                          //         color: style.color,
                          //       });

                          //       textY -= 20;
                          //     };

                          //     // Draw "Transaction receipt" text
                          //     drawText(
                          //       "Transaction receipt",
                          //       receiptTextStyle,
                          //       width
                          //     ); // Pass the width of the page as an argument
                          //     textY -= 20;

                          //     // Draw the first rectangle (heading background)
                          //     page.drawRectangle({
                          //       x: marginLeft, // Start from the left edge of the page
                          //       y: textY, // Adjust the vertical position as needed
                          //       width: width - marginLeft - marginRight, // Set the width to be equal to the width of the page
                          //       height: 40, // Adjust the height as needed
                          //       color: headingBackgroundColor,
                          //     });

                          //     // Draw the total amount label
                          //     drawText(
                          //       "TOTAL AMOUNT",
                          //       totalAmountLabelStyle,
                          //       width
                          //     ); // Pass the width of the page as an argument
                          //     textY -= 40; // Adjust the vertical spacing after the heading

                          //     // Draw the second rectangle (total amount value background)
                          //     page.drawRectangle({
                          //       x: marginLeft,
                          //       y: textY,
                          //       width: width - marginLeft - marginRight,
                          //       height: 60,
                          //       color: totalAmountValueBackgroundColor,
                          //     });

                          //     // Draw the total amount value
                          //     drawText(
                          //       `${transactionTotal.toString()} ${currency}`,
                          //       totalAmountValueStyle,
                          //       width
                          //     );

                          //     textY -= 40;

                          //     // Draw background for body
                          //     let totalDescriptionHeight = 0;

                          //     page.drawRectangle({
                          //       x: marginLeft,
                          //       y: textY,
                          //       width: width - marginLeft - marginRight,
                          //       height: 40,
                          //       color: bodyBackgroundColor,
                          //     });

                          //     // Function to draw text with specified style and alignment
                          //     const drawTexts = (label, value) => {
                          //       // Convert value to string if it's a number
                          //       if (typeof value === "number") {
                          //         value = value.toString();
                          //       }

                          //       // Draw label text with black color
                          //       page.drawText(label, {
                          //         x: marginLeft + 20, // Adjust x position to add a left margin
                          //         y: textY,
                          //         size: bodyFontSize,
                          //         font: timesRomanFont,
                          //         color: rgb(0, 0, 0), // Black color
                          //         textAlign: "left",
                          //       });

                          //       // Calculate the width of the value text
                          //       const valueTextWidth =
                          //         timesRomanFont.widthOfTextAtSize(
                          //           value,
                          //           bodyFontSize
                          //         );

                          //       // Draw value text aligned to the right
                          //       page.drawText(value, {
                          //         x: width - marginRight - valueTextWidth - 20, // Adjust x position to add a right margin
                          //         y: textY,
                          //         size: bodyFontSize,
                          //         font: timesRomanFont,
                          //         color: rgb(0, 0, 0), // Black color
                          //         textAlign: "right",
                          //       });

                          //       textY -= 20 + 30; // Adjust the vertical spacing as needed
                          //     };

                          //     function formatDescription(
                          //       description,
                          //       maxWidth,
                          //       font,
                          //       fontSize
                          //     ) {
                          //       const words = description.split(" ");
                          //       let lines = [];
                          //       let currentLine = "";

                          //       for (const word of words) {
                          //         const wordWidth = font.widthOfTextAtSize(
                          //           word,
                          //           fontSize
                          //         );
                          //         const currentLineWidth =
                          //           font.widthOfTextAtSize(
                          //             currentLine + " " + word,
                          //             fontSize
                          //           );

                          //         if (
                          //           currentLine === "" ||
                          //           currentLineWidth <= maxWidth
                          //         ) {
                          //           currentLine +=
                          //             (currentLine === "" ? "" : " ") + word;
                          //         } else {
                          //           lines.push(currentLine);
                          //           currentLine = word;
                          //         }
                          //       }
                          //       lines.push(currentLine);

                          //       return lines; // Return array of lines without joining them
                          //     }

                          //     const widthRatio = 0.5;

                          //     // Calculate the maximum width available for the description
                          //     const maxDescriptionWidth =
                          //       (width - marginLeft - marginRight) * widthRatio;

                          //     function formatAndDrawDescription(description) {
                          //       const formattedDescriptionLines =
                          //         formatDescription(
                          //           description,
                          //           maxDescriptionWidth,
                          //           timesRomanFont,
                          //           bodyFontSize
                          //         );

                          //       // Draw Transaction Details
                          //       if (formattedDescriptionLines.length > 0) {
                          //         drawTexts(
                          //           "Transaction Details",
                          //           formattedDescriptionLines[0]
                          //         );
                          //         totalDescriptionHeight += 20; // Assuming each line has a height of 20

                          //         // Draw the rest of Transaction Details lines starting from the second line
                          //         for (
                          //           let i = 1;
                          //           i < formattedDescriptionLines.length;
                          //           i++
                          //         ) {
                          //           drawTexts("", formattedDescriptionLines[i]);
                          //           totalDescriptionHeight += 20; // Assuming each line has a height of 20
                          //         }

                          //         // Increment totalDescriptionHeight for additional lines
                          //         if (formattedDescriptionLines.length > 1) {
                          //           totalDescriptionHeight +=
                          //             20 *
                          //             (formattedDescriptionLines.length - 1);
                          //         }
                          //       }
                          //     }

                          //     const totalSectionsHeight =
                          //       9 * (20 + 40) + totalDescriptionHeight;

                          //     // Draw background for body
                          //     page.drawRectangle({
                          //       x: marginLeft,
                          //       y: textY - totalSectionsHeight,
                          //       width: width - marginLeft - marginRight,
                          //       height: totalSectionsHeight,
                          //       color: bodyBackgroundColor,
                          //     });

                          //     // Draw other sections with appropriate styles
                          //     drawTexts("Sender Name", transactionFrom);
                          //     drawTexts("Beneficiary", transactionTo);
                          //     drawTexts("Transaction Type", transactionType);
                          //     drawTexts(
                          //       "Transaction Status",
                          //       transactionStatus
                          //     );
                          //     drawTexts(
                          //       "Transaction Date",
                          //       formattedTransactionDate
                          //     );
                          //     drawTexts("Transaction Fee", transactionFee);
                          //     formatAndDrawDescription(transactionDescription);

                          //     drawTexts(
                          //       "Transaction Net Total",
                          //       transactionNetTotal
                          //     );
                          //     drawTexts("Transaction ID", transactionReference);

                          //     const poweredByText = "Powered by";
                          //     const poweredByTextWidth =
                          //       timesRomanFont.widthOfTextAtSize(
                          //         poweredByText,
                          //         12 // Adjust font size as needed
                          //       );
                          //     const poweredByTextX =
                          //       (width - poweredByTextWidth) / 2; // Centered horizontally
                          //     const poweredByTextY = marginTop + 40; // Adjust Y position as needed

                          //     // Draw "Powered by" text
                          //     page.drawText(poweredByText, {
                          //       x: poweredByTextX - 30,
                          //       y: poweredByTextY,
                          //       size: 12, // Adjust font size as needed
                          //       font: timesRomanFont,
                          //       color: rgb(0, 0, 0), // Adjust color as needed
                          //     });

                          //     const imageX = marginLeft; // Adjust X position as needed
                          //     const imageY = marginTop; // Adjust Y position as needed

                          //     // Draw the logo image on the page
                          //     page.drawImage(receiptLogoImage, {
                          //       x: poweredByTextX + 40,
                          //       y: poweredByTextY - 5,
                          //       width: 50,
                          //       height: 15,
                          //     });

                          //     const pdfBytes = await pdfDoc.save();

                          //     // Create a Blob from PDF bytes
                          //     const blob = new Blob([pdfBytes], {
                          //       type: "application/pdf",
                          //     });

                          //     // Create a URL for the Blob
                          //     const url = URL.createObjectURL(blob);

                          //     // Open PDF in a new tab
                          //     window.open(url, "_blank");

                          //     // Clean up URL object after use to release memory
                          //     URL.revokeObjectURL(url);
                          //   },
                          //   sx: { cursor: "pointer" },
                          // })}
                          renderTopToolbarCustomActions={({ table }) => {
                            return (
                              <div style={{ display: "flex", gap: "0.5rem" }}>
                                <Tooltip arrow title="Refresh Data">
                                  <IconButton
                                    onClick={() => fetchUserTransactions()}
                                  >
                                    <RefreshIcon />
                                  </IconButton>
                                </Tooltip>
                              </div>
                            );
                          }}
                          state={{
                            isLoading,
                            showAlertBanner: isError,
                            showProgressBars: isFetching,
                            pagination,
                            globalFilter,
                          }}
                          muiTableContainerProps={{ sx: { height: "75vh" } }}
                        />
                      </Box>
                    </TabPanel>

                    <TabPanel value={tabValue} index={1}>
                      <Box>
                        <MaterialReactTable
                          enableColumnFilterModes
                          enableColumnOrdering
                          enablePinning
                          columns={columns}
                          data={transaction1}
                          enableStickyHeader
                          enablePagination
                          manualPagination
                          manualFiltering
                          onPaginationChange={setPagination1}
                          rowCount={transactionCount1}
                          onGlobalFilterChange={handleSearch1}
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
                          // muiTableBodyRowProps={({ row }) => ({
                          //   onClick: async () => {
                          //     const {
                          //       transactionDate,
                          //       transactionDescription,
                          //       transactionFee,
                          //       transactionFrom,
                          //       transactionId,
                          //       transactionNetTotal,
                          //       transactionReference,
                          //       transactionStatus,
                          //       transactionTo,
                          //       transactionTotal,
                          //       transactionType,
                          //       currency,
                          //       currencySymbol,
                          //     } = row.original;

                          //     const formattedTransactionDate = format(
                          //       new Date(transactionDate),
                          //       "MMM dd, yyyy h:mm a"
                          //     );

                          //     // Create a new PDFDocument
                          //     const pdfDoc = await PDFDocument.create();

                          //     // Embed the Times Roman font
                          //     const timesRomanFont = await pdfDoc.embedFont(
                          //       StandardFonts.Helvetica
                          //     );

                          //     const imageUrl = ReceiptLogoIcon.src;

                          //     const fetchImage = async (imageUrl) => {
                          //       const response = await fetch(imageUrl);
                          //       if (!response.ok) {
                          //         throw new Error(
                          //           `Failed to fetch image: ${response.statusText}`
                          //         );
                          //       }
                          //       return await response.arrayBuffer();
                          //     };

                          //     // Usage:
                          //     const imageBytes = await fetchImage(imageUrl);

                          //     // Embed the image into the PDF document
                          //     const receiptLogoImage = await pdfDoc.embedPng(
                          //       imageBytes
                          //     );

                          //     // Add a blank page to the document
                          //     const page = pdfDoc.addPage();

                          //     // Get the width and height of the page
                          //     const { width, height } = page.getSize();

                          //     // Set initial y position for text
                          //     const marginTop = 40; // Adjust the margin top as needed
                          //     let textY = height - 50 - marginTop; // Subtracting the margin from the initial position
                          //     const marginLeft = width * 0.1; // 10% of the screen width
                          //     const marginRight = width * 0.1;

                          //     const bodyBackgroundColor = rgb(
                          //       243 / 255,
                          //       244 / 255,
                          //       248 / 255
                          //     ); // Hex color  #F3F4F8

                          //     // Adjust the font size for heading
                          //     const fontSize = 20;
                          //     const headingFontSize = 16;
                          //     const headingValueFontSize = 40;
                          //     const bodyFontSize = 14;

                          //     // Background colors
                          //     const headingBackgroundColor = rgb(
                          //       129 / 255,
                          //       53 / 255,
                          //       249 / 255
                          //     ); // Hex color #8135F9
                          //     const totalAmountValueBackgroundColor = rgb(
                          //       141 / 255,
                          //       73 / 255,
                          //       249 / 255
                          //     ); // #8d49f9

                          //     const receiptTextStyle = {
                          //       size: fontSize,
                          //       color: rgb(0, 0, 0),
                          //     };

                          //     // Styling for the total amount section
                          //     const totalAmountLabelStyle = {
                          //       size: headingFontSize,
                          //       color: rgb(255 / 255, 255 / 255, 255 / 255), // White color
                          //       //bold: true,
                          //     };

                          //     const totalAmountValueStyle = {
                          //       size: headingValueFontSize,
                          //       color: rgb(255 / 255, 255 / 255, 255 / 255),
                          //     };

                          //     // Function to draw text with specified style and alignment
                          //     const drawText = (text, style, width) => {
                          //       // Calculate the x-coordinate to center the text horizontally
                          //       const textWidth =
                          //         timesRomanFont.widthOfTextAtSize(
                          //           text,
                          //           style.size
                          //         );
                          //       const x = (width - textWidth) / 2;

                          //       page.drawText(text, {
                          //         x: x,
                          //         y: textY + 20,
                          //         size: style.size,
                          //         font: timesRomanFont,
                          //         color: style.color,
                          //       });

                          //       textY -= 20;
                          //     };

                          //     // Draw "Transaction receipt" text
                          //     drawText(
                          //       "Transaction receipt",
                          //       receiptTextStyle,
                          //       width
                          //     ); // Pass the width of the page as an argument
                          //     textY -= 20;

                          //     // Draw the first rectangle (heading background)
                          //     page.drawRectangle({
                          //       x: marginLeft, // Start from the left edge of the page
                          //       y: textY, // Adjust the vertical position as needed
                          //       width: width - marginLeft - marginRight, // Set the width to be equal to the width of the page
                          //       height: 40, // Adjust the height as needed
                          //       color: headingBackgroundColor,
                          //     });

                          //     // Draw the total amount label
                          //     drawText(
                          //       "TOTAL AMOUNT",
                          //       totalAmountLabelStyle,
                          //       width
                          //     ); // Pass the width of the page as an argument
                          //     textY -= 40; // Adjust the vertical spacing after the heading

                          //     // Draw the second rectangle (total amount value background)
                          //     page.drawRectangle({
                          //       x: marginLeft,
                          //       y: textY,
                          //       width: width - marginLeft - marginRight,
                          //       height: 60,
                          //       color: totalAmountValueBackgroundColor,
                          //     });

                          //     // Draw the total amount value
                          //     drawText(
                          //       `${transactionTotal.toString()} ${currency}`,
                          //       totalAmountValueStyle,
                          //       width
                          //     );

                          //     textY -= 40;

                          //     // Draw background for body
                          //     let totalDescriptionHeight = 0;

                          //     page.drawRectangle({
                          //       x: marginLeft,
                          //       y: textY,
                          //       width: width - marginLeft - marginRight,
                          //       height: 40,
                          //       color: bodyBackgroundColor,
                          //     });

                          //     // Function to draw text with specified style and alignment
                          //     const drawTexts = (label, value) => {
                          //       // Convert value to string if it's a number
                          //       if (typeof value === "number") {
                          //         value = value.toString();
                          //       }

                          //       // Draw label text with black color
                          //       page.drawText(label, {
                          //         x: marginLeft + 20, // Adjust x position to add a left margin
                          //         y: textY,
                          //         size: bodyFontSize,
                          //         font: timesRomanFont,
                          //         color: rgb(0, 0, 0), // Black color
                          //         textAlign: "left",
                          //       });

                          //       // Calculate the width of the value text
                          //       const valueTextWidth =
                          //         timesRomanFont.widthOfTextAtSize(
                          //           value,
                          //           bodyFontSize
                          //         );

                          //       // Draw value text aligned to the right
                          //       page.drawText(value, {
                          //         x: width - marginRight - valueTextWidth - 20, // Adjust x position to add a right margin
                          //         y: textY,
                          //         size: bodyFontSize,
                          //         font: timesRomanFont,
                          //         color: rgb(0, 0, 0), // Black color
                          //         textAlign: "right",
                          //       });

                          //       textY -= 20 + 30; // Adjust the vertical spacing as needed
                          //     };

                          //     function formatDescription(
                          //       description,
                          //       maxWidth,
                          //       font,
                          //       fontSize
                          //     ) {
                          //       const words = description.split(" ");
                          //       let lines = [];
                          //       let currentLine = "";

                          //       for (const word of words) {
                          //         const wordWidth = font.widthOfTextAtSize(
                          //           word,
                          //           fontSize
                          //         );
                          //         const currentLineWidth =
                          //           font.widthOfTextAtSize(
                          //             currentLine + " " + word,
                          //             fontSize
                          //           );

                          //         if (
                          //           currentLine === "" ||
                          //           currentLineWidth <= maxWidth
                          //         ) {
                          //           currentLine +=
                          //             (currentLine === "" ? "" : " ") + word;
                          //         } else {
                          //           lines.push(currentLine);
                          //           currentLine = word;
                          //         }
                          //       }
                          //       lines.push(currentLine);

                          //       return lines; // Return array of lines without joining them
                          //     }

                          //     const widthRatio = 0.5;

                          //     // Calculate the maximum width available for the description
                          //     const maxDescriptionWidth =
                          //       (width - marginLeft - marginRight) * widthRatio;

                          //     function formatAndDrawDescription(description) {
                          //       const formattedDescriptionLines =
                          //         formatDescription(
                          //           description,
                          //           maxDescriptionWidth,
                          //           timesRomanFont,
                          //           bodyFontSize
                          //         );

                          //       // Draw Transaction Details
                          //       if (formattedDescriptionLines.length > 0) {
                          //         drawTexts(
                          //           "Transaction Details",
                          //           formattedDescriptionLines[0]
                          //         );
                          //         totalDescriptionHeight += 20; // Assuming each line has a height of 20

                          //         // Draw the rest of Transaction Details lines starting from the second line
                          //         for (
                          //           let i = 1;
                          //           i < formattedDescriptionLines.length;
                          //           i++
                          //         ) {
                          //           drawTexts("", formattedDescriptionLines[i]);
                          //           totalDescriptionHeight += 20; // Assuming each line has a height of 20
                          //         }

                          //         // Increment totalDescriptionHeight for additional lines
                          //         if (formattedDescriptionLines.length > 1) {
                          //           totalDescriptionHeight +=
                          //             20 *
                          //             (formattedDescriptionLines.length - 1);
                          //         }
                          //       }
                          //     }

                          //     const totalSectionsHeight =
                          //       9 * (20 + 40) + totalDescriptionHeight;

                          //     // Draw background for body
                          //     page.drawRectangle({
                          //       x: marginLeft,
                          //       y: textY - totalSectionsHeight,
                          //       width: width - marginLeft - marginRight,
                          //       height: totalSectionsHeight,
                          //       color: bodyBackgroundColor,
                          //     });

                          //     // Draw other sections with appropriate styles
                          //     drawTexts("Sender Name", transactionFrom);
                          //     drawTexts("Beneficiary", transactionTo);
                          //     drawTexts("Transaction Type", transactionType);
                          //     drawTexts(
                          //       "Transaction Status",
                          //       transactionStatus
                          //     );
                          //     drawTexts(
                          //       "Transaction Date",
                          //       formattedTransactionDate
                          //     );
                          //     drawTexts("Transaction Fee", transactionFee);
                          //     formatAndDrawDescription(transactionDescription);

                          //     drawTexts(
                          //       "Transaction Net Total",
                          //       transactionNetTotal
                          //     );
                          //     drawTexts("Transaction ID", transactionReference);

                          //     const poweredByText = "Powered by";
                          //     const poweredByTextWidth =
                          //       timesRomanFont.widthOfTextAtSize(
                          //         poweredByText,
                          //         12 // Adjust font size as needed
                          //       );
                          //     const poweredByTextX =
                          //       (width - poweredByTextWidth) / 2; // Centered horizontally
                          //     const poweredByTextY = marginTop + 40; // Adjust Y position as needed

                          //     // Draw "Powered by" text
                          //     page.drawText(poweredByText, {
                          //       x: poweredByTextX - 30,
                          //       y: poweredByTextY,
                          //       size: 12, // Adjust font size as needed
                          //       font: timesRomanFont,
                          //       color: rgb(0, 0, 0), // Adjust color as needed
                          //     });

                          //     const imageX = marginLeft; // Adjust X position as needed
                          //     const imageY = marginTop; // Adjust Y position as needed

                          //     // Draw the logo image on the page
                          //     page.drawImage(receiptLogoImage, {
                          //       x: poweredByTextX + 40,
                          //       y: poweredByTextY - 5,
                          //       width: 50,
                          //       height: 15,
                          //     });

                          //     const pdfBytes = await pdfDoc.save();

                          //     // Create a Blob from PDF bytes
                          //     const blob = new Blob([pdfBytes], {
                          //       type: "application/pdf",
                          //     });

                          //     // Create a URL for the Blob
                          //     const url = URL.createObjectURL(blob);

                          //     // Open PDF in a new tab
                          //     window.open(url, "_blank");

                          //     // Clean up URL object after use to release memory
                          //     URL.revokeObjectURL(url);
                          //   },
                          //   sx: { cursor: "pointer" },
                          // })}
                          renderTopToolbarCustomActions={({ table }) => {
                            return (
                              <div style={{ display: "flex", gap: "0.5rem" }}>
                                <Tooltip arrow title="Refresh Data">
                                  <IconButton
                                    onClick={() => fetchUserTransactions1()}
                                  >
                                    <RefreshIcon />
                                  </IconButton>
                                </Tooltip>
                              </div>
                            );
                          }}
                          state={{
                            isLoading1,
                            showAlertBanner: isError1,
                            showProgressBars: isFetching1,
                            pagination1,
                            globalFilter1,
                          }}
                          muiTableContainerProps={{ sx: { height: "75vh" } }}
                        />
                      </Box>
                    </TabPanel>
                  </CardContent>
                </Card>
              </form>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
