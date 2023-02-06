import { Avatar, Box, Card, CardContent, Grid, Typography } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import MoneyIcon from '@mui/icons-material/Money';

export const BalanceCard = ({ balance, nairaPayoutBalance, ...props }) => (
  <Card
    // sx={{ height: '100%' }}
    {...props}
  >
    <CardContent>
      <Grid
        container
        spacing={3}
        sx={{ justifyContent: 'space-between' }}
      >
        <Grid item>
          <Typography
            color="textSecondary"
            gutterBottom
            variant="h4"
          >
            PayStack Balance
          </Typography>
          <Typography
            // color="textPrimary"
            variant="h3"
            align='center'
            color='green'
          >
            ₦{balance?.balance.toLocaleString("en-US")}
          </Typography>
        </Grid>
      </Grid>
      <Box
        sx={{
          pt: 2,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {
          nairaPayoutBalance > balance?.balance ? (<Typography
            color="error"
            variant="h6"
            align='center'
          >
            available balance too low for total Naira payout Requests
          </Typography>) : null
        }
      </Box>
    </CardContent>
  </Card>
);
