import { Postcategorization1 } from "../src/components/dashboard/Postcategorization1";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

const PostCategorization = () => {
  const [categorizedData, setCategorizedData] = useState([]);
  const [unCategorizedData, setUncategorizedData] = useState([]);
  const [pageSize, setPageSize] = useState(1); // Fetch one item at a time
  const [currentPage, setCurrentPage] = useState(1);
  const [prevCategorizedData, setPrevCategorizedData] = useState([]);

  //const API_BASE_URL = "https://vigoplace.com/server";
  const API_BASE_URL = "http://localhost:4000";

  const fetchData = async () => {
    // Make an API call to fetch data based on the page number
    const response = await fetch(
      `${API_BASE_URL}/api/admin/categorized?page=${currentPage}&itemsPerPage=${pageSize}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    //console.log(data);
    return data;
  };

  const queryKey = ['categorizedPost', currentPage, pageSize];

  const { data: categorizedItem, isLoading, isError, isSuccess } = useQuery(
    queryKey,
    () => fetchData(currentPage, pageSize),
    {
      enabled: !currentPage && !pageSize,
      onSuccess: (data) => {
        //It should be able to save all the 50 posts in the useState array
        //Check how you can call the api endpoint to fetch new posts
        //When the next button is clicked after the 50th posts, it should set the state to the prevState array plus the new returned data
        //The previous button does not need to call the api endpoint rather let it go back on the index from the array
        //After going back the previous button the next button supposed to know when to call the api endpoint i.e it should know whether to hit the endpoint if it has reached the 50th,100th,150th post
        //If it has not reached the 50th, 100th, 150th post it should next based on the index in the post array
        setCategorizedData(data?.data || []);
      },
    }
  );

  // const {
  //   data: categorizedItem,
  //   isLoading,
  //   isError,
  // } = useQuery(["categorizedPost"], fetchData, {
  //   onSuccess: (data) => {
  //     console.log(categorizedItem);
  //     setCategorizedData(data?.data || []);
  //     console.log(categorizedData.length);
  //   },
  // });

  // const fetchData = async () => {
  //   const data = await response.json();
  //   return data;
  // };

  // const fetchCategory = async () => {
  //   if (loading || !hasMore) return; // Don't fetch while loading or if there's no more data

  //   setLoading(true);
  //   try {
  //     const response = await fetch(
  //       `${API_BASE_URL}/api/admin/categorized?page=${currentPage}&itemsPerPage=${pageSize}`
  //     );
  //     const data = await response.json();
  //     if (!data) {
  //       setHasMore(false); // No more data available
  //     } else {
  //       // Update the data in your state
  //       setCategorizedData([...data, newItem]);
  //       setCurrentPage(currentPage + 1);
  //     }
  //     setLoading(false);
  //     return data;
  //   } catch (error) {

  //   }
  // };

  
  

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
