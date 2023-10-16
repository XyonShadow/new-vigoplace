import { Postcategorization1 } from "../src/components/dashboard/Postcategorization1";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";

const API_BASE_URL = "https://vigoplace.com/server";

const PostCategorization = () => {
  //const [categorizedData, setCategorizedData] = useState([]);
  //const [unCategorizedData, setUncategorizedData] = useState([]);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [pageSize, setPageSize] = useState(4); // Fetch 1 item at a time
  // //When fetching the next data, Change the currentPage to 2

  // const API_BASE_URL = "https://vigoplace.com/server";
  // //const API_BASE_URL = "http://localhost:4000";

  // const fetchData = async () => {
  //   const response = await fetch(
  //     `${API_BASE_URL}/api/admin/categorized?page=${currentPage}&itemsPerPage=${pageSize}`
  //   );
  //   if (!response.ok) {
  //     throw new Error("Failed to fetch data");
  //   }
  //   const data = await response.json();
  //   //console.log(data.data[0]);
  //   return data?.data?.[0];
  // };

  // const queryKey = ["categorizedPost", currentPage, pageSize];

  // const {
  //   data: categorizedItem,
  //   isLoading,
  //   isError,
  //   isSuccess,
  // } = useQuery(queryKey, () => fetchData(currentPage, pageSize), {

  //   onSuccess: (data) => {
  //     const newData = data || [];
  //     setCategorizedData((prevData) => [...prevData, ...newData]);
  //   },
  // });

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

  const currentPage = useRef(1);
  const pageSize = useRef(50);
  const [categorizedData, setCategorizedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(null);

  //const [currentPage, setCurrentPage] = useState(1);
  //const [pageSize, setPageSize] = useState(4); // Fetch 1 item at a time
  //When fetching the next data, Change the currentPage to 2

  // fetch categorized data
  const fetchCatgorizedData = async () => {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/categorized?page=${currentPage.current}&itemsPerPage=${pageSize.current}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    setCategorizedData((prev) => [...prev, ...data?.data?.[0]]);
    setLoading(false);
  };

  useEffect(() => {
    fetchCatgorizedData();
  }, []);

  return (
    <div>
      <ToastContainer position="top-center" />
      <Postcategorization1
        categorizedData={categorizedData}
        isLoading={loading}
        isError={isError}
        currentPage={currentPage}
        fetchCatgorizedData={fetchCatgorizedData}
      />
    </div>
  );
};

PostCategorization.auth = true;
export default PostCategorization;
