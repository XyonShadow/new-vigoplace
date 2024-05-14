import ky from "ky-universal";
import { useQuery } from "@tanstack/react-query";
import { getSession } from "next-auth/react";

const getToken = async () => {
  const session = await getSession();
  return session?.user?.token;
};

const fetchSinglePayoutRequest = async (id) => {
  try {
    const token = await getToken();

    // const parsed = await ky(`http://localhost:3001/api/admin/console/payouts/${id}`, {
    //   headers:{
    //       'Authorization': token
    //   },
    // }).json()

    const parsed = await ky(
      `https://api.vigoplace.com/api/admin/console/payouts/${id}`,
      //`http://localhost:4000/api/admin/console/payouts/${id}`,
      {
        headers: {
          Authorization: token,
        },
      }
    ).json();
    //console.log(parsed)
    return parsed;
  } catch (error) {
    console.log(error, "parsed error");
    return {};
  }
};

const useSinglePayoutRequest = (id) => {
  return useQuery({
    queryKey: ["payoutRequest", id],
    queryFn: () => fetchSinglePayoutRequest(id),
    enabled: !!id,
  });
};

export { useSinglePayoutRequest, fetchSinglePayoutRequest };
