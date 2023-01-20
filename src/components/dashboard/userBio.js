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

export const UserBio = ({ usersBio, ...props }) => (
  <Card
    // sx={{ height: '100%' }}
    {...props}
  >
    <CardContent>
      <Grid sx={{ width: "200px", maxHeight: "150px" }} item>
        <Typography align="center" color="textSecondary" variant="h2">
          Bio
        </Typography>
        <Typography align="center" variant="h5">
          {usersBio}
        </Typography>
      </Grid>
    </CardContent>
  </Card>
);
