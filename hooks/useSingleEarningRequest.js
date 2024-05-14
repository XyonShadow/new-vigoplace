import ky from "ky-universal";
import { useQuery } from "@tanstack/react-query";
import { getSession } from "next-auth/react";

const getToken = async () => {
  const session = await getSession();
  return session?.user?.token;
};

const fetchSingleEarningRequest = async (id) => {
  try {
    const token = await getToken();

    const parsed = await ky(
      `https://api.vigoplace.com/api/admin/console/earnings/${id}`,
      //`http://localhost:4000/api/admin/console/earnings/${id}`,
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
    return {};
  }
};

const useSingleEarningRequest = (id) => {
  return useQuery({
    queryKey: ["earningRequest", id],
    queryFn: () => fetchSingleEarningRequest(id),
    enabled: !!id,
  });
};

export { useSingleEarningRequest, fetchSingleEarningRequest };
