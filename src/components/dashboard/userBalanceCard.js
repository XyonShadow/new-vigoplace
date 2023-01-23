import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import MoneyIcon from "@mui/icons-material/Money";
import { BorderColor } from "@mui/icons-material";

export const UserBalanceCard = ({ usersBalance = [], ...props }) => (
  <Card
    // sx={{ height: '100%' }}
    {...props}
  >
    <CardContent>
      <Grid item>
        <Typography color="textSecondary" gutterBottom variant="h4">
          User Wallet Balances
        </Typography>
        {usersBalance
          ? usersBalance.map((balance) => (
              <>
                <Typography color="green" variant="h2" align="center">
                  {`${balance?.SCSymbol}${balance?.amount}`}
                </Typography>
                <Divider />
              </>
            ))
          : null}
      </Grid>
    </CardContent>
  </Card>
);
