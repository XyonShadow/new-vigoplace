import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const TransactionReference = () => {
  const router = useRouter();
  const { reference, type } = router.query;
  const { data: session } = useSession();
  const user = session?.user;
  const [redirecting, setRedirecting] = useState(false);

  const {
    data: transaction,
    isError,
    isFetching,
    isLoading,
  } = useQuery(
    ["reference", reference],
    async () => {
      const { data } = await axios.get(
        `https://api.vigoplace.com/api/admin/console/transaction/reference?reference=${reference}&type=${type}`,
        {
          headers: {
            Authorization: user?.token,
          },
        }
      );
      return data;
    },
    {
      enabled: !!user?.token && !!reference,
      onError: (err) => console.error("Error fetching transaction", err),
    }
  );

  useEffect(() => {
    if (transaction?.data[0]?.userid) {
      console.log(transaction?.data)
      setRedirecting(true);
      const timeout = setTimeout(() => {
        router.push(`/user/${transaction.data[0].userid}`);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [transaction, router]);

  if (isLoading || isFetching) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!transaction?.data[0]?.userid) {
    return (
      <div className="flex items-center justify-center h-[70vh] px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader className="text-lg font-semibold">
            No Transaction Found
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              {`No ${
                type === "credit" ? "credit" : "debit"
              } transaction was found for reference:`}
              <strong>{reference}</strong>
            </p>
            <Separator className="my-4" />
            <Button variant="outline" onClick={() => router.back()}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-[70vh] px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="text-lg font-semibold">
          Transaction Found
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-2">
            Redirecting to the user page...
          </p>
          <Loader2 className="h-5 w-5 mx-auto animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    </div>
  );
};

TransactionReference.auth = true;
export default TransactionReference;
