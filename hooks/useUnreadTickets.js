import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

// Create the context
const UnreadTicketsContext = createContext();

// Create a provider component
export const UnreadTicketsProvider = ({ children }) => {
  const [unreadTicketsCount, setUnreadTicketsCount] = useState(0);
  const queryClient = useQueryClient();
  const getUser = useSession();
  const user = getUser?.data?.user;
  const router = useRouter();

  const { data: tickets } = useQuery(
    ["fetchTicketss"],
    async () => {
      const { data } = await axios.get(
        `https://vigoplace.com/server/api/admin/tickets/unassigned?limit=${1000}`,
        //`http://localhost:4000/api/admin/tickets/unassigned?limit=${1000}`,
        {
          headers: {
            Authorization: user?.token,
          },
        }
      );
      //console.log(data);

      const unRead = data?.data?.results?.filter(
        (ticket) => ticket.isRead === 0
      );
      //console.log(unRead.length);
      setUnreadTicketsCount(unRead.length);
      return data;
    },
    {
      onError: (err) => {
        console.log(err, "err fetching tickets");
      },
      enabled: !!user?.token,
    }
  );

  return (
    <UnreadTicketsContext.Provider
      value={{ unreadTicketsCount, setUnreadTicketsCount }}
    >
      {children}
    </UnreadTicketsContext.Provider>
  );
};

// Create a custom hook to use the context
export const useUnreadTickets = () => {
  const context = useContext(UnreadTicketsContext);
  if (!context) {
    throw new Error(
      "useUnreadTickets must be used within an UnreadTicketsProvider"
    );
  }
  return context;
};
