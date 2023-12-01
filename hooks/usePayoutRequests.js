import ky from "ky-universal";
import { useQuery } from "@tanstack/react-query";
import { getSession } from "next-auth/react";

const getToken = async () => {
  const session = await getSession();
  return session?.user?.token;
};

//const API_BASE_URL = "https://vigoplace.com/server";
const API_BASE_URL = "http://localhost:4000";
const fetchPayoutRequests = async (limit, offset, status) => {
  try {
    const token = await getToken();

    // const parsed = await ky(`http://localhost:3001/api/admin/console/payouts?limit=${limit}&offset=${offset}${status !== undefined && status !== null ? `&status=${status}` : '' }`, {
    //   headers:{
    //       'Authorization': token
    //   },
    // }).json()

    const parsed = await ky(
      `${API_BASE_URL}/api/admin/console/payouts?limit=${limit}&offset=${offset}${
        status !== undefined && status !== null ? `&status=${status}` : ""
      }`,
      {
        headers: {
          Authorization: token,
        },
      }
    ).json();
    
    //console.log(parsed);

    return parsed;
  } catch (error) {
    console.log(error, "parsed error");
    return [];
  }
};

const usePayoutRequests = (limit, offset, status) => {
  return useQuery({
    queryKey: ["payoutRequests"],
    queryFn: () => fetchPayoutRequests(limit, offset, status),
    // refetchInterval: 15000
  });
};

//8143
export { usePayoutRequests, fetchPayoutRequests };
