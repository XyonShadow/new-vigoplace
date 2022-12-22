import React, { useState } from 'react'
import { dehydrate, QueryClient } from '@tanstack/react-query'

import { Grid, Container } from '@mui/material';
import RecentOrders from '../src/components/RecentOrders';
import { usePayoutRequests, fetchPayoutRequests } from '../hooks/usePayoutRequests'



function Payouts() {
  const [fetchParams, setFetchParams] = useState({
    limit: 20,
    offset: 0,
    status: undefined
  })
  const { data, isLoading, isFetching } = usePayoutRequests(fetchParams.limit, fetchParams.offset, fetchParams.status)
  // if (isLoading || isLoading) return <div>Loading...........</div>


  return (
    <div>

      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <RecentOrders payouts={data.data} />
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}

// export async function getStaticProps() {
//   const queryClient = new QueryClient()

//   await queryClient.prefetchQuery({
//     queryKey: ['posts', 10],
//     queryFn: () => fetchPayoutRequests(fetchParams.limit, fetchParams.offset, fetchParams.status),
//   })

//   return {
//     props: {
//       dehydratedState: dehydrate(queryClient),
//     },
//   }
// }

Payouts.auth = true

export default Payouts
