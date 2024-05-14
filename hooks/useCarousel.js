import { useState, useCallback } from "react";

//const API_BASE_URL = "http://localhost:4000";
const API_BASE_URL = "https://api.vigoplace.com"

const useCarousel = () => {
  const [categorizedData, setCategorizedData] = useState()
   const fetchUncatgorizedData = useCallback(()=> {}, [])
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);

  // fetch categorized data
  const fetchCatgorizedData = useCallback(async () => {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/categorized?page=${currentPage}&itemsPerPage=${pageSize}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    setCategorizedData(data);
  }, [])




  return {
    categorizedData,
    fetchCatgorizedData,
  };
};

export default useCarousel;
