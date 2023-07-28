import { Postcategorization1 } from "../src/components/dashboard/Postcategorization1";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const PostCategorization = () => {
  const [categorizedData, setCategorizedData] = useState([]);

  const API_BASE_URL = "https://vigoplace.com/server/";

  const fetchData = async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/uncategorized`);
    const data = await response.json();
    console.log(data);
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
      setCategorizedData(data?.data || []);
    },
  });

  const { data, error } = useQuery(["uncategorizedData"], fetchData);

  return (
    <div>
      <ToastContainer position="top-center" />
      <Postcategorization1 data={data} categorizedData={categorizedData} />
    </div>
  );
};

PostCategorization.auth = true;
export default PostCategorization;
