import { Card } from '@mui/material';
import RecentEarningsTable from './RecentEarningsTable';
import { subDays } from 'date-fns';

function RecentOrders({payouts, userPayouts}) {

  return (
    <Card>
      <RecentEarningsTable payouts={payouts} userPayouts={userPayouts} />
    </Card>
  );
}

export default RecentOrders;
