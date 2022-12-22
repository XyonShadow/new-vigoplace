import ky from 'ky-universal'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

const fetchRouteRoles = async () => {
//     const parsed2 = await axios.get('https://vigoplace.com/server/api/admin/console/routeroles')
try {
    //   const parsed = await ky('http://localhost:3001/api/admin/console/routeroles').json()
      const parsed = await ky('https://vigoplace.com/server/api/admin/console/routeroles').json()
  
      return parsed
  } catch (error) {
    console.log(error, 'parsed error')
    return []
  }
}

const useRouteRoles = () => {
  return useQuery({
    queryKey: ['routeRoles'],
    queryFn: () => fetchRouteRoles(),
  })
}

export { useRouteRoles, fetchRouteRoles }
