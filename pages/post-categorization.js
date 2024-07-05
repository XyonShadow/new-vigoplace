import { Postcategorization1 } from "../src/components/dashboard/Postcategorization1";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";

const API_BASE_URL = "https://vigoplace.com/server";
//const API_BASE_URL = "http://localhost:4000";
const PostCategorization = () => {
  const currentPage = useRef(1);
  const pageSize = useRef(50);
  const [categorizedData, setCategorizedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(null);
  const currentPage2 = useRef(1);
  const pageSize2 = useRef(10);
  const [unCategorizedData, setUncategorizedData] = useState([]);
  // const [uncategorizedDataLoading, setUncategorizedDataLoading] = useState(true);
  // const [uncategorizedDataError, setaUncategorizedDataError] = useState(true);

  // fetch categorized data
  const fetchCatgorizedData = async () => {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/categorized?page=${currentPage.current}&itemsPerPage=${pageSize.current}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    setCategorizedData((prev) => [...prev, ...data?.data]);
    setLoading(false);
  };

  useEffect(() => {
    fetchCatgorizedData();
  }, []);

  const fetchUnCategorizedData = async () => {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/uncategorized?page=${currentPage2.current}&PerPage=${pageSize2.current}`
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    setUncategorizedData((prev) => [...prev, ...data?.data]);
    return data.data;
  };

  const {
    data: unCatgorizedData,
    isLoading: uncategorizedDataLoading,
    error: uncategorizedDataError,
  } = useQuery(["uncategorizedData"], fetchUnCategorizedData, {});

  return (
    <div>
      <ToastContainer position="top-center" />
      <Postcategorization1
        categorizedData={categorizedData}
        isLoading={loading}
        isError={isError}
        currentPage={currentPage}
        fetchCatgorizedData={fetchCatgorizedData}
        setCategorizedData={setCategorizedData}
        unCategorizedData={unCategorizedData}
        uncategorizedDataLoading={uncategorizedDataLoading}
        uncategorizedDataError={uncategorizedDataError}
        currentPage2={currentPage2}
        fetchUnCategorizedData={fetchUnCategorizedData}
        setUncategorizedData={setUncategorizedData}
      />
    </div>
  );
};

PostCategorization.auth = true;
export default PostCategorization;
