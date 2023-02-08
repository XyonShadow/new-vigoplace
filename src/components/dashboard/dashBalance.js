import { Avatar, Card, Box, CardContent, Grid, Typography, Divider, useMediaQuery} from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CircularProgress from '@mui/material/CircularProgress';
import { Height } from '@mui/icons-material';



export const DashBalance = ({vigo, paystack, vigoLoading, paystackLoading, header='', ...props}) =>{
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  console.log({vigo, paystack})

 return(
  <Card {...props} sx={{...(lgUp &&{minWidth: "300px"})}}>
    <CardContent>
      <Grid
        container
        spacing={3}
        // sx={{ justifyContent: 'space-between' }}
      >
        <Grid item display={"block"}>
          <Typography
            color="textSecondary"
            gutterBottom
            variant="overline"
          >
            Vigoplace
          </Typography>
          <Typography
            color="textPrimary"
            variant="h4"
          >
            {
              vigoLoading ?  (<CircularProgress size={20} />)  : ("₦"+Number(vigo).toLocaleString("en-US"))
            }
            {/* {balance} */}
          </Typography>
          {/* <Divider sx={{width: "20px", color: "red"}} orientation="vertical" variant="inset"  /> */}
        </Grid>


          {/* <hr/> */}
        <Grid item>
          <Typography
            color="textSecondary"
            gutterBottom
            variant="overline"
          >
            Paystack
          </Typography>
          <Typography
            color="textPrimary"
            variant="h4"
          >
            {
              paystackLoading ?  (<CircularProgress size={20} />)  : ("₦"+Number(paystack).toLocaleString("en-US"))
            }
            {/* {balance} */}
          </Typography>
        </Grid>

        {/* <Grid item>
          <Avatar
            sx={{
              backgroundColor: 'primary.main',
              height: 56,
              width: 56
            }}
          >
            ₦
          </Avatar>
        </Grid> */}
      </Grid>

      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          pt: 2
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
)};
