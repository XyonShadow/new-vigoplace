// import { Postcategorization1 } from "../src/components/dashboard/Postcategorization1";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useQuery } from "@tanstack/react-query";
// import { useState, useEffect, useRef } from "react";

// const API_BASE_URL = "https://vigoplace.com/server";
// //const API_BASE_URL = "http://localhost:4000";
// const PostCategorization = () => {
//   const currentPage = useRef(1);
//   const pageSize = useRef(50);
//   const [categorizedData, setCategorizedData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isError, setIsError] = useState(null);


//   // fetch categorized data
//   const fetchCatgorizedData = async () => {
//     const response = await fetch(
//       `${API_BASE_URL}/api/admin/categorized?page=${currentPage.current}&itemsPerPage=${pageSize.current}`
//     );
//     if (!response.ok) {
//       throw new Error("Failed to fetch data");
//     }
//     const data = await response.json();
//     //console.log(...data?.data);
//     //setCategorizedData((prev) => [...prev, ...data?.data?.[0]]);
//     setCategorizedData((prev) => [...prev, ...data?.data]);
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchCatgorizedData();
//   }, []);

//   return (
//     <div>
//       <ToastContainer position="top-center" />
//       <Postcategorization1
//         categorizedData={categorizedData}
//         isLoading={loading}
//         isError={isError}
//         currentPage={currentPage}
//         fetchCatgorizedData={fetchCatgorizedData}
//         setCategorizedData={setCategorizedData}
//       />
//     </div>
//   );
// };

// PostCategorization.auth = true;
// export default PostCategorization;
