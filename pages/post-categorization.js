import { Postcategorization1 } from "../src/components/dashboard/Postcategorization1";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

const PostCategorization = () => {
  const [categorizedData, setCategorizedData] = useState([]);
  const [unCategorizedData, setUncategorizedData] = useState([]);

  const API_BASE_URL = "https://vigoplace.com/server";

  const fetchData = async () => {
  
    const data = await response.json();
    return data;
  };

  const fetchCategory = async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/categorized`);
    const data = await response.json();
    return data;
  };

  const {
    data: categorizedItem,
    isLoading,
    isError,
  } = useQuery(["categorizedPost"], fetchCategory, {
    onSuccess: (data) => {
      console.log(categorizedData.length);
      setCategorizedData(data?.data || []);
      console.log(categorizedData.length);
    },
  });

  // const unCategorizedPostsQuery = useQuery({ queryKey: ["uncategorizedData"], queryFn: fetchData, 
  //   refetchInterval: 10000,
  //   refetchOnMount: 'always'
  // });
  
  // useEffect(() =>  {
  //   if (unCategorizedPostsQuery.data) {
  //     setUncategorizedData(unCategorizedPostsQuery.data)
  //     console.log("This one na for ujseefect")
  //   }
  // }, [unCategorizedPostsQuery.data])


  return (
    <div>
      <ToastContainer position="top-center" />
      <Postcategorization1 categorizedData={categorizedData} />
    </div>
  );
};

PostCategorization.auth = true;
export default PostCategorization;
