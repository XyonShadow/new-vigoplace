import ky from "ky-universal";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { getSession } from "next-auth/react";

const getToken = async () => {
  const session = await getSession();
  return session?.user?.token;
};

const fetchRouteRoles = async () => {
  try {
    const token = await getToken();
    //console.log(token);
    //   const parsed = await ky('http://localhost:3001/api/admin/console/routeroles', {
    //     headers:{
    //         'Authorization': token
    //     },
    //   }).json()

    const parsed = await ky(
      "https://vigoplace.com/server/api/admin/console/routeroles",
      //"http://localhost:4000/api/admin/console/routeroles",
      {
        headers: {
          Authorization: token,
        },
      }
    ).json();
    localStorage.setItem('parsed', JSON.stringify(parsed));
    //console.log(parsed);

    return parsed;
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

const useRouteRoles = () => {
  return useQuery({
    queryKey: ["routeRoles"],
    queryFn: () => fetchRouteRoles(),
  });
};

export { useRouteRoles, fetchRouteRoles };
