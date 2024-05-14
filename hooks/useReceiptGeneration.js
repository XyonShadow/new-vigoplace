import { useEffect } from "react";
import axios from "axios";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import ReceiptLogoIcon from "../assets/images/backgrounds/logo_small.png";
import Ubuntu from "../public/Ubuntu-R.ttf";

const useReceiptGeneration = (userid, walletids, startDate, endDate, user) => {
  const generateReceipt = async () => {
    try {
      // Check if walletid is a valid number
      if (isNaN(walletids)) {
        return;
      }

      // Construct the URL only if walletid is a valid number
      let url = `https://api.vigoplace.com/api/admin/console/receipt?walletId=${walletids}&id=${userid}`;

      if (startDate && endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`;
      }

      const { data } = await axios.get(url, {
        headers: {
          Authorization: user?.token,
        },
      });

      //console.log(data);

      if (data) {
        // Generate PDF document
        const pdfDoc = await PDFDocument.create();
        const urls = Ubuntu;
        const fontBytes = await fetch(urls).then((res) => res.arrayBuffer());

        pdfDoc.registerFontkit(fontkit);
        const ubuntuFont = await pdfDoc.embedFont(fontBytes, {
          subset: true,
        });
        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const timesRoman = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const page = pdfDoc.addPage();
        const { width, height } = page.getSize();

        const bodyBackgroundColor = rgb(243 / 255, 244 / 255, 248 / 255); // Hex color  #F3F4F8
        const marginTop = 40; // Adjust the margin top as needed
        const marginBottom = 40; // Adjust the margin bottom as needed
        let textY = height - 50 - marginTop; // Subtracting the margin from the initial position
        const marginLeft = width * 0.1; // 10% of the screen width
        const marginRight = width * 0.1;
        const bodyFontSize = 10;

        const formatTransactionDate = (dateString) => {
          const date = new Date(dateString);

          return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
        };

        const imageUrl = ReceiptLogoIcon.src;

        const fetchImage = async (imageUrl) => {
          const response = await fetch(imageUrl);
          if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
          }
          return await response.arrayBuffer();
        };

        const imageBytes = await fetchImage(imageUrl);
        const receiptLogoImage = await pdfDoc.embedPng(imageBytes);

        // Calculate the position to place the image, applying margin values
        const imageX = marginLeft;
        const imageY = height - receiptLogoImage.height - marginTop;

        // Draw the image onto the PDF document with applied margin
        page.drawImage(receiptLogoImage, {
          x: imageX,
          y: imageY,
          width: receiptLogoImage.width,
          height: receiptLogoImage.height,
        });

        // Calculate the position and width for "Account Statement" text and rectangle
        const accountStatementWidth = width * 0.38;
        const accountStatementX = marginLeft;
        const accountStatementY = imageY - 20; // Position just above the image
        const accountStatementHeight = 30; // Adjust the height as needed

        // Draw the background rectangle for "Account Statement"
        page.drawRectangle({
          x: accountStatementX,
          y: accountStatementY - 40,
          width: accountStatementWidth,
          height: accountStatementHeight,
          color: bodyBackgroundColor,
        });

        // Draw the "Account Statement" text
        page.drawText("Account Statement", {
          x: accountStatementX + 10,
          y: accountStatementY - 30,
          size: 10, // Adjust the font size as needed
          font: timesRoman,
          color: rgb(0, 0, 0), // Black color
        });

        // Calculate the position and width for "Summary details" text and rectangle
        const summaryDetailsWidth = width * 0.38;
        const summaryDetailsMargin = 10;
        const summaryDetailsX =
          width - marginRight - summaryDetailsWidth - summaryDetailsMargin;
        const summaryDetailsY = accountStatementY;
        const summaryDetailsHeight = accountStatementHeight;

        // Draw the background rectangle for "Summary details"
        page.drawRectangle({
          x: summaryDetailsX,
          y: summaryDetailsY - 40,
          width: summaryDetailsWidth,
          height: summaryDetailsHeight,
          color: bodyBackgroundColor,
        });

        // Draw the "Summary details" text
        page.drawText("Summary details", {
          x: summaryDetailsX + 10,
          y: summaryDetailsY - 30,
          size: 10,
          font: timesRoman,
          color: rgb(0, 0, 0), // Black color
        });

        const drawTexts = (label, value, x, y) => {
          // Convert value to string if it's a number or a function
          if (typeof value === "number") {
            value = value.toString();
          } else if (typeof value === "function") {
            value = value();
          }

          // Draw label text with black color
          page.drawText(label, {
            x: x - 15, // Adjust x position to add a left margin
            y: y - 20,
            size: bodyFontSize,
            font: timesRomanFont,
            color: rgb(0, 0, 0), // Black color
            textAlign: "left",
          });

          // Draw value text aligned to the right
          page.drawText(value, {
            x: x + 150,
            y: y - 20,
            size: bodyFontSize,
            font: ubuntuFont,
            color: rgb(0, 0, 0), // Black color
            textAlign: "right",
          });
        };

        drawTexts(
          "Generated from",
          startDate
            ? formatTransactionDate(startDate)
            : formatTransactionDate(
                data?.data?.transactions[data?.data?.transactions.length - 1]
                  ?.transactionDate
              ),
          marginLeft + 20,
          textY - 20
        );

        drawTexts(
          "Currency",
          data?.data?.transactions[0]?.currencyCode,
          marginLeft + 20,
          textY - 50
        );

        //drawTexts("Account Id", data?.data?.user?.customerCode, marginLeft + 20, textY - 80);
        //drawTexts("Account Name", data?.data?.user?.accountName, marginLeft + 20, textY - 110);

        page.drawText("Account Id", {
          x: marginLeft + 20 - 15, // Adjust x position to add a left margin
          y: textY - 80 - 20,
          size: bodyFontSize,
          font: timesRomanFont,
          color: rgb(0, 0, 0), // Black color
          textAlign: "left",
        });

        let xCoordinate;

        if (
          data &&
          data.data &&
          data.data.user &&
          data.data.user.customerCode
        ) {
          xCoordinate = marginLeft + 140;
        } else {
          xCoordinate = marginLeft + 170;
        }

        const accountId =
          data && data.data && data.data.user && data.data.user.customerCode
            ? data.data.user.customerCode
            : "0";

        page.drawText(accountId, {
          x: xCoordinate,
          y: textY - 80 - 20,
          size: 9,
          font: ubuntuFont,
          color: rgb(0, 0, 0),
          textAlign: "right",
        });

        page.drawText("Account Name", {
          x: marginLeft + 20 - 15, // Adjust x position to add a left margin
          y: textY - 110 - 20,
          size: bodyFontSize,
          font: timesRomanFont,
          color: rgb(0, 0, 0), // Black color
          textAlign: "left",
        });

        let xCoordinate2;

        if (data && data.data && data.data.user && data.data.user.accountName) {
          xCoordinate2 = marginLeft + 105;
        } else {
          xCoordinate2 = marginLeft + 170;
        }

        const accountName =
          data && data.data && data.data.user && data.data.user.accountName
            ? data.data.user.accountName
            : "N/A";

        page.drawText(accountName, {
          x: xCoordinate2,
          y: textY - 110 - 20,
          size: 9,
          font: ubuntuFont,
          color: rgb(0, 0, 0), // Black color
          textAlign: "right",
        });

        drawTexts(
          "Opening Balance",
          data?.data?.openingBalance.toLocaleString(),
          summaryDetailsX + 20,
          textY - 20
        );
        drawTexts(
          "Total Debit",
          data?.data?.totalDebit.toLocaleString(),
          summaryDetailsX + 20,
          textY - 50
        );
        drawTexts(
          "Total Credit",
          data?.data?.totalCredit.toLocaleString(),
          summaryDetailsX + 20,
          textY - 80
        );
        drawTexts(
          "Closing Balance",
          data?.data?.closingBalance.toLocaleString(),
          summaryDetailsX + 20,
          textY - 110
        );
        // Add your PDF generation logic here

        // Define positions and dimensions for the transaction table
        const tableX = 50;
        let tableY = height - 220;
        const rowHeight = 60; // Adjust the height of each row as needed
        // Draw border lines for the transaction table
        const tableWidth = width - 100; // Adjust the width of the table as needed
        const tableHeight = 10; // Adjust the height of the table as needed

        // Define column percentages
        const dateColumnWidth = 0.15;
        const descriptionColumnWidth = 0.4;
        const creditColumnWidth = 0.15;
        const debitColumnWidth = 0.15;
        const balanceColumnWidth = 0.15;

        const columnWidths = [
          dateColumnWidth,
          descriptionColumnWidth,
          creditColumnWidth,
          debitColumnWidth,
          balanceColumnWidth,
        ];

        // Calculate column positions based on percentages
        const dateColumnX = tableX;
        const descriptionColumnX = dateColumnX + tableWidth * dateColumnWidth;
        const creditColumnX =
          descriptionColumnX + tableWidth * descriptionColumnWidth;
        const debitColumnX = creditColumnX + tableWidth * creditColumnWidth;
        const balanceColumnX = debitColumnX + tableWidth * debitColumnWidth;

        page.drawRectangle({
          x: tableX,
          y: tableY - 50,
          width: tableWidth,
          height: tableHeight - 40,
          borderColor: rgb(0, 0, 0), // Black color
          borderWidth: 0.5, // Adjust the border width as needed
        });

        // Calculate the total number of transactions
        const totalTransactions = data?.data?.transactions.length || 0;
        // Calculate the total height required for all transactions
        const totalTransactionHeight = totalTransactions * rowHeight;
        // Calculate the maximum number of transactions that can fit on the first page
        let maxTransactionsPerPage = Math.floor(tableY / rowHeight - 2);
        const imageHeight = receiptLogoImage.height; // Height of the embedded image
        const summaryHeight = accountStatementHeight; // Height of the rectangle for "Summary
        const marginHeight = marginTop + marginBottom; // Total height taken by margins

        // Calculate total height taken by all elements
        const totalHeight = imageHeight + summaryHeight + marginHeight;

        // Now you can use this totalHeight to calculate the remaining space on the page
        const remainingSpace = height - totalHeight;

        // Adjust the tableY value to accommodate all transactions
        const tableYY = height - 270 - totalTransactionHeight;

        if (totalTransactions > maxTransactionsPerPage) {
          // Draw vertical line before the Date column
          page.drawLine({
            start: { x: dateColumnX, y: height - remainingSpace - 60 },
            end: {
              x: dateColumnX,
              y: height - remainingSpace + maxTransactionsPerPage * 60 - 60,
            },
            thickness: 0.5,
            color: rgb(0, 0, 0), // Black color
          });

          // Draw vertical lines to demarcate columns
          let currentX = tableX;

          columnWidths.forEach((columnWidth) => {
            currentX += tableWidth * columnWidth;
            page.drawLine({
              start: { x: currentX, y: height - remainingSpace - 60 },
              end: {
                x: currentX,
                y: height - remainingSpace + maxTransactionsPerPage * 60 - 30,
              },
              thickness: 0.5,
              color: rgb(0, 0, 0), // Black color
            });
          });
        } else {
          // Draw vertical line before the Date column
          page.drawLine({
            start: { x: dateColumnX, y: tableYY - 30 },
            end: { x: dateColumnX, y: tableYY + totalTransactionHeight },
            thickness: 0.5,
            color: rgb(0, 0, 0), // Black color
          });

          // Draw vertical lines to demarcate columns
          let currentX = tableX;

          columnWidths.forEach((columnWidth) => {
            currentX += tableWidth * columnWidth;
            page.drawLine({
              start: { x: currentX, y: tableYY - 30 },
              end: { x: currentX, y: tableYY + totalTransactionHeight },
              thickness: 0.5,
              color: rgb(0, 0, 0), // Black color
            });
          });
        }

        // Draw text in each column with center alignment
        const centerAlignText = (text, x, columnWidth) => {
          const textWidth = ubuntuFont.widthOfTextAtSize(text, 12);
          const centerX = x + (columnWidth - textWidth) / 2;
          page.drawText(text, {
            x: centerX,
            y: tableY - 70,
            size: 10,
            font: timesRoman,
          });
        };

        // Draw text in each column with center alignment
        centerAlignText("Date", dateColumnX, tableWidth * dateColumnWidth);
        centerAlignText(
          "Description",
          descriptionColumnX,
          tableWidth * descriptionColumnWidth
        );
        centerAlignText(
          "Credit",
          creditColumnX,
          tableWidth * creditColumnWidth
        );
        centerAlignText("Debit", debitColumnX, tableWidth * debitColumnWidth);
        centerAlignText(
          "Balance",
          balanceColumnX,
          tableWidth * balanceColumnWidth
        );

        // Draw the transactions

        const drawTransactions = (page, transactions) => {
          let currentY = tableY - rowHeight - 15; // Initial Y position for the first row
          for (const transaction of transactions) {
            // Draw each transaction within the table

            // Draw Date
            page.drawText(formatTransactionDate(transaction.transactionDate), {
              x: dateColumnX + 5, // Adjust x position to add a left margin
              y: currentY - 30,
              size: 10,
              font: ubuntuFont,
              color: rgb(0, 0, 0),
            });

            // Function to format and draw description with text wrapping
            function formatAndDrawDescription(
              description,
              x,
              y,
              maxWidth,
              font,
              fontSize
            ) {
              const words = description.split(" ");
              let lines = [];
              let currentLine = "";

              for (const word of words) {
                //const wordWidth = font.widthOfTextAtSize(word, fontSize);
                const currentLineWidth = font.widthOfTextAtSize(
                  currentLine + " " + word,
                  fontSize
                );

                if (currentLine === "" || currentLineWidth <= maxWidth) {
                  currentLine += (currentLine === "" ? "" : " ") + word;
                } else {
                  lines.push(currentLine);
                  currentLine = word;
                }
              }
              lines.push(currentLine);

              let currentY = y;
              for (const line of lines) {
                page.drawText(line, {
                  x: x,
                  y: currentY - 30,
                  size: fontSize,
                  font: font,
                  color: rgb(0, 0, 0),
                });
                currentY -= fontSize + 2; // Adjust line spacing as needed
              }
            }

            // Draw Description
            const descriptionTextOptions = {
              x: descriptionColumnX + 5, // Adjust x position to add a left margin
              y: currentY,
              size: 10,
              font: ubuntuFont,
              color: rgb(0, 0, 0),
            };
            const maxDescriptionWidth =
              tableWidth * descriptionColumnWidth - 10; // Max width of description column

            // Format and draw description with text wrapping
            formatAndDrawDescription(
              transaction.transactionDescription,
              descriptionTextOptions.x,
              descriptionTextOptions.y,
              maxDescriptionWidth,
              ubuntuFont,
              10
            );

            // Draw Credit
            if (transaction.transactionType === "credit") {
              page.drawText(transaction.transactionTotal.toLocaleString(), {
                x: creditColumnX + 5, // Adjust x position to add a left margin
                y: currentY - 30,
                size: 10,
                font: ubuntuFont,
                color: rgb(0, 0, 0),
              });
            } else {
              page.drawText("", {
                // Draw empty text if not a credit transaction
                x: creditColumnX + 5, // Adjust x position to add a left margin
                y: currentY - 30,
                size: 10,
                font: ubuntuFont,
                color: rgb(0, 0, 0),
              });
            }

            // Draw Debit
            if (transaction.transactionType === "debit") {
              page.drawText(transaction.transactionTotal.toLocaleString(), {
                x: debitColumnX + 5, // Adjust x position to add a left margin
                y: currentY - 30,
                size: 10,
                font: ubuntuFont,
                color: rgb(0, 0, 0),
              });
            } else {
              page.drawText("", {
                // Draw empty text if not a debit transaction
                x: debitColumnX + 5, // Adjust x position to add a left margin
                y: currentY - 30,
                size: 10,
                font: ubuntuFont,
                color: rgb(0, 0, 0),
              });
            }

            // Draw Balance
            page.drawText(
              transaction.balanceAfterTransaction.toLocaleString(),
              {
                x: balanceColumnX + 5, // Adjust x position to add a left margin
                y: currentY - 30,
                size: 10,
                font: ubuntuFont,
                color: rgb(0, 0, 0),
              }
            );

            // Draw a horizontal line to separate transactions
            page.drawLine({
              start: { x: tableX, y: currentY - 5 },
              end: { x: tableX + tableWidth, y: currentY - 5 },
              thickness: 0.5,
              color: rgb(0, 0, 0), // Black color
            });

            // Move to the next row
            currentY -= rowHeight;
          }

          // Draw horizontal line to separate transactions
          page.drawLine({
            start: { x: tableX, y: currentY - 5 },
            end: { x: tableX + tableWidth, y: currentY - 5 },
            thickness: 0.5,
            color: rgb(0, 0, 0), // Black color
          });

          // Move to the next row
          currentY -= rowHeight;
        };

        // Check if the total number of transactions exceeds what can fit on the first page
        if (totalTransactions > maxTransactionsPerPage) {
          // Slice the transactions array to get transactions for the first page
          const transactionsForFirstPage = data?.data?.transactions.slice(
            0,
            maxTransactionsPerPage
          );

          // Draw transactions for the first page
          drawTransactions(page, transactionsForFirstPage);

          // Subtract the number of transactions drawn on the first page from the total transactions
          let remainingTransactions =
            totalTransactions - maxTransactionsPerPage;

          const marginTopss = 40; // Margin at the top of the page
          const marginBottomss = 40; // Margin at the bottom of the page

          // Calculate the available height for transactions on each page
          const availableHeightPerPage = height - marginTopss - marginBottomss;

          // Calculate the maximum number of transactions that can fit on each page
          const maxTransactionsPerPages = Math.floor(
            availableHeightPerPage / rowHeight
          );

          // Calculate the number of pages needed to accommodate remaining transactions
          const totalPages = Math.ceil(
            remainingTransactions / maxTransactionsPerPages
          );

          let lastDifference;

          // Loop through each subsequent page and draw transactions accordingly
          for (
            let currentPage = 2;
            currentPage <= totalPages + 1;
            currentPage++
          ) {
            // Add a new page to the PDF document
            const newPage = pdfDoc.addPage();
            let tableY = height - 40;

            // Calculate the maximum number of transactions to be drawn on the current page
            const transactionsPerPage = Math.min(
              maxTransactionsPerPages,
              remainingTransactions
            );

            // Slice the transactions array to get transactions for the current page
            const startIndex = totalTransactions - remainingTransactions;
            const endIndex = startIndex + transactionsPerPage;
            const transactionsForPage = data?.data?.transactions.slice(
              startIndex,
              endIndex
            );

            // Update the lastDifference variable
            lastDifference = endIndex - startIndex;

            const check = (maxTransactionsPerPages - lastDifference) * 60;

            if (currentPage === totalPages + 1) {
              // Draw vertical line before the Date column
              newPage.drawLine({
                start: { x: dateColumnX, y: lastDifference * 60 + check + 80 },
                end: { x: dateColumnX, y: lastDifference + check + 70 },
                thickness: 0.5,
                color: rgb(0, 0, 0),
              });

              let currentX = tableX;
              columnWidths.forEach((columnWidth) => {
                currentX += tableWidth * columnWidth;
                newPage.drawLine({
                  start: { x: currentX, y: lastDifference * 60 + check + 80 },
                  end: { x: currentX, y: lastDifference + check + 70 },
                  thickness: 0.5,
                  color: rgb(0, 0, 0), // Black color
                });
              });
            } else {
              // Draw vertical line before the Date column
              newPage.drawLine({
                start: { x: dateColumnX, y: tableY - tableY + 80 },
                end: { x: dateColumnX, y: tableY },
                thickness: 0.5,
                color: rgb(0, 0, 0), // Black color
              });

              // Draw vertical lines to demarcate columns
              let currentX = tableX;
              columnWidths.forEach((columnWidth) => {
                currentX += tableWidth * columnWidth;
                //console.log((currentX += tableWidth * columnWidth));
                newPage.drawLine({
                  start: { x: currentX, y: tableY - tableY + 80 },
                  end: { x: currentX, y: tableY },
                  thickness: 0.5,
                  color: rgb(0, 0, 0), // Black color
                });
              });
            }

            for (const transaction of transactionsForPage) {
              // Draw Date
              newPage.drawText(
                formatTransactionDate(transaction.transactionDate),
                {
                  x: dateColumnX + 5, // Adjust x position to add a left margin
                  y: tableY - 20,
                  size: 10,
                  font: ubuntuFont,
                  color: rgb(0, 0, 0),
                }
              );

              // Function to format and draw description with text wrapping
              function formatAndDrawDescription(
                description,
                x,
                y,
                maxWidth,
                font,
                fontSize
              ) {
                const words = description.split(" ");
                let lines = [];
                let currentLine = "";

                for (const word of words) {
                  const currentLineWidth = font.widthOfTextAtSize(
                    currentLine + " " + word,
                    fontSize
                  );

                  if (currentLine === "" || currentLineWidth <= maxWidth) {
                    currentLine += (currentLine === "" ? "" : " ") + word;
                  } else {
                    lines.push(currentLine);
                    currentLine = word;
                  }
                }
                lines.push(currentLine);

                let tableY = y;
                for (const line of lines) {
                  newPage.drawText(line, {
                    x: x,
                    y: tableY - 20,
                    size: fontSize,
                    font: font,
                    color: rgb(0, 0, 0),
                  });
                  tableY -= fontSize + 2; // Adjust line spacing as needed
                }
              }

              // Draw Description
              const descriptionTextOptions = {
                x: descriptionColumnX + 5,
                y: tableY, // Adjust
                size: 10,
                font: ubuntuFont,
                color: rgb(0, 0, 0),
              };
              const maxDescriptionWidth =
                tableWidth * descriptionColumnWidth - 10;

              // Format and draw description with text wrapping
              formatAndDrawDescription(
                transaction.transactionDescription,
                descriptionTextOptions.x,
                descriptionTextOptions.y,
                maxDescriptionWidth,
                ubuntuFont,
                10
              );

              // Draw Credit
              if (transaction.transactionType === "credit") {
                newPage.drawText(
                  transaction.transactionTotal.toLocaleString(),
                  {
                    x: creditColumnX + 5,
                    y: tableY - 20,
                    size: 10,
                    font: ubuntuFont,
                    color: rgb(0, 0, 0),
                  }
                );
              } else {
                newPage.drawText("", {
                  // Draw empty text if not a credit transaction
                  x: creditColumnX + 5,
                  y: tableY - 20,
                  size: 10,
                  font: ubuntuFont,
                  color: rgb(0, 0, 0),
                });
              }

              // Draw Debit
              if (transaction.transactionType === "debit") {
                newPage.drawText(
                  transaction.transactionTotal.toLocaleString(),
                  {
                    x: debitColumnX + 5,
                    y: tableY - 20,
                    size: 10,
                    font: ubuntuFont,
                    color: rgb(0, 0, 0),
                  }
                );
              } else {
                newPage.drawText("", {
                  x: debitColumnX + 5,
                  y: tableY - 20,
                  size: 10,
                  font: ubuntuFont,
                  color: rgb(0, 0, 0),
                });
              }

              // Draw Balance
              newPage.drawText(
                transaction.balanceAfterTransaction.toLocaleString(),
                {
                  x: balanceColumnX + 5,
                  y: tableY - 20,
                  size: 10,
                  font: ubuntuFont,
                  color: rgb(0, 0, 0),
                }
              );

              // Draw a horizontal line to separate transactions
              newPage.drawLine({
                start: { x: tableX, y: tableY },
                end: { x: tableX + tableWidth, y: tableY },
                thickness: 0.5,
                color: rgb(0, 0, 0), // Black color
              });

              // Move to the next row
              tableY -= rowHeight;
            }

            // Draw a horizontal line to separate transactions
            newPage.drawLine({
              start: { x: tableX, y: tableY },
              end: { x: tableX + tableWidth, y: tableY },
              thickness: 0.5,
              color: rgb(0, 0, 0), // Black color
            });

            // Move to the next row
            tableY -= rowHeight;

            // Subtract the number of transactions drawn on the current page from the remaining transactions
            remainingTransactions -= transactionsPerPage;
          }
        } else {
          // If the total number of transactions does not exceed what can fit on the first page,
          // simply draw all transactions on the first page
          drawTransactions(page, data?.data?.transactions);
        }

        // Save PDF to bytes
        const pdfBytes = await pdfDoc.save();
        return pdfBytes;
      }
    } catch (error) {
      console.log(error, "error fetching user transaction receipt");
      if (error?.status === 400) {
        console.log(error.message);
      }
      throw error;
    }
  };

  useEffect(() => {
    // Call the receipt generation function here if needed
    generateReceipt();
  }, [startDate, endDate]);

  return { generateReceipt };
};

export { useReceiptGeneration };
