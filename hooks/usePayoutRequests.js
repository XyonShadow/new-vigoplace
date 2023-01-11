import ky from 'ky-universal'
import { useQuery } from '@tanstack/react-query'
import {getSession} from 'next-auth/react'


const getToken = async() => {
  const session = await getSession()
  return session?.user?.token
}

const fetchPayoutRequests = async (limit, offset, status) => {

try {
      const token = await getToken()

      // const parsed = await ky(`http://localhost:3001/api/admin/console/payouts?limit=${limit}&offset=${offset}${status !== undefined && status !== null ? `&status=${status}` : '' }`, {
      //   headers:{
      //       'Authorization': token
      //   },
      // }).json()

      const parsed = await ky(`https://vigoplace.com/server/api/admin/console/payouts?limit=${limit}&offset=${offset}${status !== undefined && status !== null ? `&status=${status}` : '' }`, {
        headers:{
            'Authorization': token
        },
      }).json()

  
      return parsed
  } catch (error) {
    console.log(error, 'parsed error')
    return []
  }
}

const usePayoutRequests = (limit, offset, status) => {
  return useQuery({
    queryKey: ['payoutRequests'],
    queryFn: () => fetchPayoutRequests(limit, offset, status),
    // refetchInterval: 15000
  })
}

export { usePayoutRequests, fetchPayoutRequests }
