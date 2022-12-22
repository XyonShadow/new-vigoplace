import ky from 'ky-universal'
import { useQuery } from '@tanstack/react-query'

const fetchPayoutRequests = async (limit, offset, status) => {

try {
      // const parsed = await ky(`http://localhost:3001/api/admin/console/payouts?limit=${limit}&offset=${offset}${status !== undefined && status !== null ? `&status=${status}` : '' }`).json()
      const parsed = await ky(`https://vigoplace.com/server/api/admin/console/payouts?limit=${limit}&offset=${offset}${status !== undefined && status !== null ? `&status=${status}` : '' }`).json()
      // const parsed = await ky('https://vigoplace.com/server/api/admin/console/routeroles').json()
  
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
  })
}

export { usePayoutRequests, fetchPayoutRequests }
