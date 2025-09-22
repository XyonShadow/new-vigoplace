import { useState, useEffect, useRef } from "react";
import { utils, writeFile } from "xlsx";
import {
  Box,
  Typography,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  Grid,
  Paper,
  styled,
  useTheme,
  Button,
  Card,
} from "@mui/material";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

const KPI = (props) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [checkedCheckboxes, setCheckedCheckboxes] = useState([]);
  const [currency, setCurrency] = useState("USD");
  const tableRef = useRef(null);

  const theme = useTheme();

  const getUser = useSession();
  const user = getUser?.data?.user;

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  const { data: kpis, refetch } = useQuery(
    ["fetchkpi"],
    async () => {
      let url = "https://api.vigoplace.com/api/admin/statistics/dashboard";

      const queryParams = checkedCheckboxes.reduce((acc, checkbox) => {
        acc[checkbox.value] = true;
        return acc;
      }, {});

      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }
      const { data } = await axios.get(url, {
        params: {
          ...queryParams,
          currency: currency,
        },
        headers: {
          Authorization: user?.token,
        },
      });

      return data;
    },
    {
      onError: (err) => {
        console.log(err, "err fetching kpi");
      },
      enabled: !!user?.token,
    }
  );

  useEffect(() => {
    refetch();
  }, [startDate, endDate, checkedCheckboxes, currency]);

  const firstCheckboxData = [
    { id: "users", value: "totalUsers", label: "Users", isCurrency: false },
    {
      id: "user_activities",
      value: "totalUserActivities",
      label: "User Activities",
      isCurrency: false,
    },
    {
      id: "deleted_users",
      value: "totalDeletedUsers",
      label: "Deleted Users",
      isCurrency: false,
    },
    {
      id: "wallet",
      value: "totalWalletCount",
      label: "Wallet count",
      isCurrency: false,
    },
    {
      id: "totalkycCount",
      value: "totalKyc",
      label: "Total KYC count",
      isCurrency: false,
    },
    {
      id: "verifiedkycCount",
      value: "verifiedKyc",
      label: "Verified KYC count",
      isCurrency: false,
    },
    {
      id: "pendingkycCount",
      value: "pendingKyc",
      label: "Pending KYC count",
      isCurrency: false,
    },
    {
      id: "incompletekycCount",
      value: "incompleteKyc",
      label: "Incomplete KYC count",
      isCurrency: false,
    },
    {
      id: "emails",
      value: "totalVerifiedEmails",
      label: "Verified emails",
      isCurrency: false,
    },
    {
      id: "virtual_accounts",
      value: "totalVirtualAccounts",
      label: "Virtual accounts",
      isCurrency: false,
    },
    {
      id: "phone_numbers",
      value: "totalVerifiedPhoneNumbers",
      label: "Verified phone numbers",
      isCurrency: false,
    },
  ];

  const secondCheckboxData = [
    {
      id: "basic_place",
      value: "basicPlaceCount",
      label: "Basic place",
      isCurrency: false,
    },
    {
      id: "channel_place",
      value: "channelPlaceCount",
      label: "Channel place",
      isCurrency: false,
    },
    {
      id: "contest_place",
      value: "contestPlaceCount",
      label: "Contest place",
      isCurrency: false,
    },
    {
      id: "market_place",
      value: "marketPlaceCount",
      label: "Market place",
      isCurrency: false,
    },
  ];

  const thirdCheckboxData = [
    {
      id: "gift_post",
      value: "giftPostCount",
      label: "Gift post",
      isCurrency: false,
    },
    {
      id: "news_post",
      value: "newsPostCount",
      label: "News post",
      isCurrency: false,
    },
  ];

  const fourthCheckboxData = [
    {
      id: "channel_suscribe_revenue",
      value: "channelSuscribeRevenue",
      label: "Channel Suscribe revenue",
      isCurrency: false,
    },
    {
      id: "channel_rent_revenue",
      value: "channelRentRevenue",
      label: "Channel Rent revenue",
      isCurrency: false,
    },
    {
      id: "channel_buy_revenue",
      value: "channelBuyRevenue",
      label: "Channel Buy revenue",
      isCurrency: false,
    },
    {
      id: "market_place_revenue",
      value: "marketPlaceRevenue",
      label: "Market place revenue",
      isCurrency: false,
    },
    // {
    //   id: "contest_place_revenue",
    //   value: "contestPlaceRevenue",
    //   label: "Contest place revenue",
    //   isCurrency: false,
    // },
    {
      id: "payout_revenue",
      value: "payoutRevenue",
      label: "Payout revenue",
      isCurrency: false,
    },
    {
      id: "virtual_wallet_loading_revenue",
      value: "virtualWalletLoadingRevenue",
      label: "Virtual Wallet Loading revenue",
      isCurrency: false,
    },
    {
      id: "card_wallet_loading_revenue",
      value: "cardWalletLoadingRevenue",
      label: "Card Wallet Loading revenue",
      isCurrency: false,
    },
    {
      id: "gift_revenue",
      value: "giftRevenue",
      label: "Gift revenue",
      isCurrency: false,
    },
    {
      id: "kyc_revenue",
      value: "kycRevenue",
      label: "KYC revenue",
      isCurrency: false,
    },
    {
      id: "ebook_revenue",
      value: "ebookRevenue",
      label: "Ebook revenue",
      isCurrency: false,
    },
    {
      id: "fund_raising_revenue",
      value: "fundRaisingRevenue",
      label: "Fund Raising revenue",
      isCurrency: false,
    },
    {
      id: "place_promotion_revenue",
      value: "placePromotionRevenue",
      label: "Place Promotion revenue",
      isCurrency: false,
    },
    {
      id: "ministry_give_revenue",
      value: "ministryGiveRevenue",
      label: "Ministry Give revenue",
      isCurrency: false,
    },
    {
      id: "minstry_request_revenue",
      value: "ministryRequestRevenue",
      label: "Ministry Request revenue",
      isCurrency: false,
    },
    {
      id: "form_post_revenue",
      value: "formPostRevenue",
      label: "Form Post revenue",
      isCurrency: false,
    },
    {
      id: "data_and_airtime_revenue",
      value: "dataAndAirtimeRevnue",
      label: "Data and airtime revenue",
      isCurrency: false,
    },
    {
      id: "electricity_revenue",
      value: "electricityRevenue",
      label: "Electricity revenue",
      isCurrency: false,
    },
    {
      id: "total_revenue",
      value: "totalRevenue",
      label: "Total revenue",
      isCurrency: false,
    },
  ];

  const allCheckboxCategories = [
    { title: "User_Statistics", data: firstCheckboxData },
    { title: "Place_Types", data: secondCheckboxData },
    { title: "Post_Types", data: thirdCheckboxData },
    { title: "Revenue", data: fourthCheckboxData },
  ];

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  };

  const handleCheckboxChange = (event) => {
    const { value, checked, id } = event.target;

    if (checked) {
      setCheckedCheckboxes((prevState) => [
        ...prevState,
        { value: value, label: id, checked: true },
      ]);
    } else {
      setCheckedCheckboxes((prevState) =>
        prevState.filter((item) => item.value !== value)
      );
    }
  };

  const formatCurrency = (value, currency) => {
    const formattedValue =
      typeof value === "number"
        ? currency === "NGN"
          ? `₦${value.toFixed(2)}`
          : `$${value.toFixed(2)}`
        : value;
    return formattedValue;
  };

  // Function to check if a checkbox belongs to a specific category
  const belongsToCategory = (checkboxValue, categoryData) => {
    return categoryData.some((item) => item.value === checkboxValue);
  };

  // Get selected checkboxes for a category
  const getSelectedCheckboxesForCategory = (categoryData) => {
    return checkedCheckboxes.filter((checkbox) =>
      belongsToCategory(checkbox.value, categoryData)
    );
  };

  // Export to Excel function using xlsx
  const exportToExcel = (categoryData, categoryTitle) => {
    const selectedInCategory = getSelectedCheckboxesForCategory(categoryData);

    if (selectedInCategory.length === 0 || !kpis?.data) return;

    // Create data for xlsx
    const worksheet = utils.json_to_sheet(
      selectedInCategory.map((item) => {
        const originalItem = categoryData.find(
          (orig) => orig.value === item.value
        );
        const isCurrencyItem = originalItem?.isCurrency || false;

        const value = kpis?.data?.[item.value];
        let displayValue = value;

        if (isCurrencyItem && typeof value === "number") {
          displayValue =
            currency === "NGN"
              ? `₦${value.toFixed(2)}`
              : `$${value.toFixed(2)}`;
        }

        return {
          KPI: item.label,
          Value: displayValue,
        };
      })
    );

    // Set column widths
    const columnWidths = [
      { wch: 30 }, // Metric column width
      { wch: 20 }, // Value column width
    ];
    worksheet["!cols"] = columnWidths;

    // Create workbook and add worksheet
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, categoryTitle);

    // Generate filename with date range info
    const dateInfo =
      startDate && endDate ? `_${startDate}_to_${endDate}` : "_all_time";

    const filename = `${categoryTitle}_KPI${dateInfo}.xlsx`;

    // Export file
    writeFile(workbook, filename);
  };

  return (
    <>
      <Typography
        variant="h3"
        color="text.primary"
        marginBottom={2}
        sx={{ fontWeight: "bold", textAlign: "center" }}
      >
        KPI'S
      </Typography>

      <Card {...props}>
        <Box
          sx={{
            p: 2,
            background: "#8135F9",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              color: "white",
              [theme.breakpoints.down("sm")]: {
                fontSize: "12px",
              },
            }}
          >
            To begin enter your start and end date then click on the checkbox to
            select a KPI.
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: "6rem",
            p: 5,
            [theme.breakpoints.down("sm")]: {
              flexDirection: "column",
              p: 2,
            },
          }}
        >
          <Box
            sx={{
              width: "60%",
              [theme.breakpoints.down("sm")]: {
                width: "100%",
              },
            }}
          >
            <Box sx={{ display: "flex", gap: 3 }}>
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <label htmlFor="startDate">
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: "14px",
                      [theme.breakpoints.down("sm")]: {
                        fontSize: "12px",
                      },
                    }}
                  >
                    Start date
                  </Typography>
                </label>
                <input
                  className="text-xs"
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={handleStartDateChange}
                />
              </Box>
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <label htmlFor="endDate">
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: "14px",
                      [theme.breakpoints.down("sm")]: {
                        fontSize: "12px",
                      },
                    }}
                  >
                    End date
                  </Typography>
                </label>
                <input
                  className="text-xs"
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={handleEndDateChange}
                />
              </Box>

              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <InputLabel htmlFor="currency">
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: "14px",
                      [theme.breakpoints.down("sm")]: {
                        fontSize: "12px",
                      },
                    }}
                  >
                    Currency
                  </Typography>
                </InputLabel>
                <Select
                  label="Currency"
                  id="currency"
                  value={currency}
                  onChange={handleCurrencyChange}
                  sx={{
                    height: "30px",
                    width: "100px",
                    "& .MuiSelect-select": {
                      minHeight: "30px",
                      lineHeight: "30px",
                    },
                    "& .MuiInputBase-input": {
                      fontSize: "12px",
                    },
                    "& .MuiListItem-root": {
                      minHeight: "30px",
                    },
                    "& .MuiMenuItem-root": {
                      fontSize: "10px",
                    },
                  }}
                >
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="NGN">NGN</MenuItem>
                </Select>
              </Box>
            </Box>
            <Grid
              container
              spacing={2}
              sx={{
                mt: "52px",
                width: "100%",
                height: "433px",
                background: "#F4F4F4",
                borderRadius: 1,
                px: 4,
                py: "37px",
                overflowY: "auto",
                [theme.breakpoints.down("sm")]: {
                  ml: 0,
                  fontSize: "14px",
                  px: 1,
                },
              }}
            >
              {checkedCheckboxes.length === 0 && <>No data to display</>}
              {checkedCheckboxes.map((checkedValue) => (
                <Grid key={checkedValue.label} item xs={6}>
                  <>
                    {/* Check if this is a currency value */}
                    {fourthCheckboxData.find(
                      (checkbox) => checkbox.value === checkedValue.value
                    ) ? (
                      <>
                        {checkedValue.label}
                        <Item>
                          {kpis?.data?.[checkedValue.value] !== 0
                            ? formatCurrency(
                                kpis?.data?.[checkedValue.value],
                                currency
                              )
                            : kpis?.data?.[checkedValue.value]}
                        </Item>
                      </>
                    ) : (
                      <>
                        {checkedValue.label}
                        <Item>{kpis?.data?.[checkedValue.value]}</Item>
                      </>
                    )}
                  </>
                </Grid>
              ))}

              {/* Export buttons section */}
              {checkedCheckboxes.length > 0 && (
                <Grid item xs={12} sx={{ mt: 4 }}>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      Export KPI Data
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                      {allCheckboxCategories.map((category) => {
                        const selectedCount = getSelectedCheckboxesForCategory(
                          category.data
                        ).length;
                        if (selectedCount === 0) return null;

                        return (
                          <Button
                            key={category.title}
                            variant="contained"
                            onClick={() =>
                              exportToExcel(category.data, category.title)
                            }
                            sx={{
                              backgroundColor: "#8135F9",
                              "&:hover": { backgroundColor: "#6025B8" },
                            }}
                          >
                            Export {category.title.replace("_", " ")} (
                            {selectedCount})
                          </Button>
                        );
                      })}
                    </Box>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography
              sx={{
                color: "#282424",
                fontSize: "14px",
              }}
            >
              Key performance indicators (KPI)
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                maxHeight: "600px",
                gap: 4,
                background: "#F4F4F4",
                overflowY: "auto",
                border: "1px solid #E6E6E6",
                borderRadius: 1,
                p: 3,
                [theme.breakpoints.down("sm")]: {
                  p: 1,
                  maxHeight: "400px",
                  fontSize: "14px",
                },
              }}
            >
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, p: 3 }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  User Statistics
                </Typography>
                {firstCheckboxData.map((checkbox) => (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    key={checkbox.id}
                  >
                    <label>{checkbox.label}</label>
                    <Checkbox
                      value={checkbox.value}
                      id={checkbox.label}
                      checked={checkedCheckboxes.some(
                        (checkedValue) => checkedValue.value === checkbox.value
                      )}
                      onChange={handleCheckboxChange}
                    />
                  </Box>
                ))}
              </Box>
              <Box sx={{ border: "1px solid #E6E6E6", width: "100%" }}></Box>
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, p: 3 }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Place Types
                </Typography>
                {secondCheckboxData.map((checkbox) => (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    key={checkbox.id}
                  >
                    <label>{checkbox.label}</label>
                    <Checkbox
                      value={checkbox.value}
                      id={checkbox.label}
                      checked={checkedCheckboxes.some(
                        (checkedValue) => checkedValue.value === checkbox.value
                      )}
                      onChange={handleCheckboxChange}
                    />
                  </Box>
                ))}
              </Box>
              <Box sx={{ border: "1px solid #E6E6E6", width: "100%" }}></Box>
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, p: 3 }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Post Types
                </Typography>
                {thirdCheckboxData.map((checkbox) => (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    key={checkbox.id}
                  >
                    <label>{checkbox.label}</label>
                    <Checkbox
                      value={checkbox.value}
                      id={checkbox.label}
                      checked={checkedCheckboxes.some(
                        (checkedValue) => checkedValue.value === checkbox.value
                      )}
                      onChange={handleCheckboxChange}
                    />
                  </Box>
                ))}
              </Box>
              <Box sx={{ border: "1px solid #E6E6E6", width: "100%" }}></Box>
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, p: 3 }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Revenue
                </Typography>
                {fourthCheckboxData.map((checkbox) => (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    key={checkbox.id}
                  >
                    <label>{checkbox.label}</label>
                    <Checkbox
                      value={checkbox.value}
                      id={checkbox.label}
                      checked={checkedCheckboxes.some(
                        (checkedValue) => checkedValue.value === checkbox.value
                      )}
                      onChange={handleCheckboxChange}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Card>
    </>
  );
};

export default KPI;
