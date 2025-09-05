import {
  Avatar,
  Card,
  Box,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import CircularProgress from "@mui/material/CircularProgress";

export const TotalProfit = ({
  balance,
  isLoading,
  header = "",
  currency = "NGN",
  ...props
}) => (
  <Card {...props}>
    <CardContent>
      <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
        <Grid item>
          <Typography color="textSecondary" gutterBottom variant="overline">
            {header}
          </Typography>
          <Typography color="textPrimary" variant="h4">
            {isLoading ? (
              <CircularProgress size={20} />
            ) : (
              `${currency === "usd" ? "$" : "₦"}` +
              Number(balance).toLocaleString("en-US")
            )}
            {/* {balance} */}
          </Typography>
        </Grid>

        <Grid item>
          <Avatar
            sx={{
              backgroundColor: "primary.main",
              height: 56,
              width: 56,
            }}
          >
            {currency === "usd" ? <AttachMoneyIcon /> : "₦"}
            {/* ₦ */}
          </Avatar>
        </Grid>
      </Grid>
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          pt: 2,
        }}
      >
        {/* <ArrowUpwardIcon color="success" />
        <Typography
          variant="body2"
          sx={{
            mr: 1
          }}
        >
          16%
        </Typography>
        <Typography
          color="textSecondary"
          variant="caption"
        >
          Since last month
        </Typography> */}
      </Box>
    </CardContent>
  </Card>
);
