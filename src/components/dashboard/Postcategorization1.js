import React, { useState, useEffect } from "react";
// import { MdOutlineArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import { useQuery } from "@tanstack/react-query";
import { UncategorizedPost } from "./UncategorizedPost";
import { CategorizedPost } from "./CategorizedPost";

// import "./Styles.module.css";

export function Postcategorization1() {

  const [tab, setTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [newCategories, setNewCategories] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [uncategorizedDataState, setUncategorizedDataState] = useState(null);


  const API_BASE_URL = "https://vigoplace.com/server/";

  const fetchData = async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/categories`);
    const data = await response.json();
    return data;
  };

  const { data: categoryList, isLoading: categoryListLoading, error: categoryListError } = useQuery(
    ["categorizedData"],
    fetchData
  );


  const fetchUncategorizedData = async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/uncategorized`);
    const data = await response.json();
    return data;
  };

  const { data: uncategorizedData, isLoading: uncategorizedDataLoading, error: uncategorizedDataError } = useQuery(
    ["uncategorizedData"],
    fetchUncategorizedData
  );

  useEffect(() => {
    if (uncategorizedData) {
      // Update currentIndex based on the uncategorized data length
      setCurrentIndex(0);
    }
  }, [uncategorizedData]);

  if (categoryListLoading || uncategorizedDataLoading) {
    return <div>Loading...</div>;
  }

  if (categoryListError || uncategorizedDataError) {
    return <div>Error: {categoryListError?.message || uncategorizedDataError?.message}</div>;
  }



  const handleTabChange = (newTab) => {
    setTab(newTab);
  };

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    const filtered = categoryList.data.filter((item) => {
      return item.OCName.toUpperCase().includes(searchTerm?.toUpperCase());
    });

    setFilteredResults(filtered);
    setSearchTerm(value);
    // console.log(filtered)
  };


  const handleClick = () => {
    console.log(newCategories)
    fetch("https://vigoplace.com/server/api/admin/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        categories: [newCategories]
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to create category");
        }
        return response.json(); // Parse the response as JSON
      })
      .then((data) => {
        console.log(data);
        setNewCategories("")
      })
      .catch((error) => {
        console.error("Error creating category:", error);
        // Display an error message to the user or handle the error appropriately
      });
  };

   const handlePostClick = (category) => {
    const postId = uncategorizedData?.data[currentIndex]?.POId;
    setSelectedCategory(category);

    fetch("https://vigoplace.com/server/api/admin/categorization", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        category: [category],
        postId: postId,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to create category");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        console.log(category)
      })
      .catch((error) => {
        console.error("Error creating category:", error);
      });
  };




  return (
    <section className="flex justify-center pt-14">
      <div className="pt-2 w-[770px] h-[850px] bg-white rounded-l-3xl">
        <div className="p-5 pl-10 border-b-2 border-[#f4f4f4] relative">
          <div className="absolute left-12 top-9">
            <AiOutlineSearch size={20} />
          </div>
          <input
            type="text"
            placeholder="Post id:"
            className="pl-10 focus:outline-blue-400 w-[350px] h-[50px] rounded-md bg-[#F4F4F4]"
          />
        </div>

        <article className="mt-5">
          <div className="border-b-2 font-bold border-[#f4f4f4] flex space-x-56 pl-14">
            <div>
  <button
    className={`border-b-2 ${
      tab === 0 ? "border-b-[#8135F9] transition-all duration-300" : ""
    } pb-2 cursor-pointer text-lg focus:outline-none`}
    onClick={() => handleTabChange(0)}
  >
    Uncategorized Post
  </button>
</div>
<div>
  <button
    className={`cursor-pointer text-lg ${
      tab === 1
        ? "border-b-2 border-b-[#8135F9] pb-2 transition-all duration-300"
        : ""
    } focus:outline-none`}
    onClick={() => handleTabChange(1)}
  >
    Categorized Post
  </button>
</div>
          </div>
          {tab === 0 && (
            <>
              <UncategorizedPost category={selectedCategory}/>
            </>
          )}

          {tab === 1 && (
            <>
              <CategorizedPost />
            </>
          )}
        </article>
      </div>
      <div className="w-[300px] h-[850px] bg-[#DFDCDC]">
        <div className="pl-5 pt-24 relative">
          <div className="absolute right-10 top-28">
            <AiOutlineSearch size={20} onClick={handleSearch} />
          </div>
          <input
            type="text"
            className="w-[260px] h-[50px] pl-5 rounded-md focus:outline-blue-500"
            placeholder="Search category..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <div className="mt-10 justify-center flex">
          <div className="bg-[#F4F4F4] w-[248px] h-[400px] py-3 rounded-xl overflow-auto flex items-center">
            <div className="space-y-5 mx-auto my-auto">
              {searchTerm !== "" ? (
                filteredResults.length > 0 ? (
                  filteredResults.map((item) => (
                    <div
                      key={item.OCId}
                      className="bg-white w-[220px] rounded-md h-10 p-2"
                    >
                      <p className="text-center text-base text-[#706464] capitalize">
                        {item.OCName}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-base text-[#706464]">
                    Not found
                  </p>
                )
              ) : (
                categoryList?.data.map((item) => (
                  <div
                    key={item.OCId}
                    className="bg-white w-[200px] rounded-md h-10 p-2"
                    onClick={() => {handlePostClick(item.OCName)}}
                  >
                    <p className="text-center text-base text-[#706464] capitalize">
                      {item.OCName}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <p className="pl-7 pt-32 text-[#706464]">Create a new categories</p>
        <div className="mt-5 pl-5">
          <input
            type="text"
            className="w-[190px] h-[50px] pl-5 rounded-l-md focus:outline-blue-500"
            placeholder="New category..."
            value={newCategories}
            onChange={(e) => {setNewCategories(e.target.value)}}
          />
          <button
            className="p-[14px] rounded-r-lg bg-[#8135F9] text-white"
            onClick={handleClick}
          >
            Save
          </button>
        </div>
      </div>
    </section>
  );
}
