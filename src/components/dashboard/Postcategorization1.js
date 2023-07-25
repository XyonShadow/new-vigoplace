import React, { useState, useEffect, useRef } from "react";
// import { MdOutlineArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UncategorizedPost } from "./UncategorizedPost";
import { CategorizedPost } from "./CategorizedPost";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function Postcategorization1({ data, categorizedData }) {
  const [tab, setTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [newCategories, setNewCategories] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredCategoryResults, setFilteredCategoryResults] = useState([]);
  // const [FilteredImages, setFilteredImages] = useState([])
  const [searchInput, setSearchInput] = useState("");
  const [categoryResults, setCategoryResults] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  // const [selectedCategoryIndexes, setSelectedCategoryIndexes] = useState({});
  const [currentPostId, setCurrentPostId] = useState(null);
  const updateCurrentPost = (postId) => setCurrentPostId(postId);
  const [rerender, setRerender] = useState(true);

  const localCategory = useRef(false);
  useEffect(() => {
    if (!localCategory.current) {
      const category = localStorage.getItem("categoryData");
      if (category) {
        setSelectedCategories(JSON.parse(category));
        console.log("fetched category");

        localCategory.current = true;
      }
    }

    if (localCategory.current && Object.keys(selectedCategories).length > 0) {
      localStorage.setItem("categoryData", JSON.stringify(selectedCategories));
      console.log("updated category");
    }
  }, [selectedCategories]);

  const handleCategoryChange = (category) => {
    const alreadyAdded = selectedCategories[currentPostId];

    if (alreadyAdded) {
      const categoryExist = alreadyAdded.findIndex(
        (c) => c.OCId === category.OCId
      );
      if (categoryExist >= 0) return;
      setSelectedCategories((prev) => ({
        ...prev,
        [currentPostId]: [...prev[currentPostId], category],
      }));
    } else {
      setSelectedCategories((prev) => ({
        ...prev,
        [currentPostId]: [category],
      }));
    }
    setRerender((prev) => !prev);
  };

  const handleCategorySelection = (selectedCategories) => {
    setSelectedCategories(selectedCategories);
  };

  const API_BASE_URL = "https://vigoplace.com/server/";

  const fetchData = async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/categories`);
    const data = await response.json();
    return data;
  };

  const {
    data: categoryList,
    isLoading: categoryListLoading,
    error: categoryListError,
    refetch: refetchcategoryList,
  } = useQuery(["categorizedData"], fetchData, {
    staleTime: 0,
    refetchInterval: 10000,
  });

  const fetchUncategorizedData = async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/uncategorized`);
    const data = await response.json();
    return data;
  };

  const {
    data: uncategorizedData,
    isLoading: uncategorizedDataLoading,
    error: uncategorizedDataError,
  } = useQuery(["uncategorizedData"], fetchUncategorizedData);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (uncategorizedData) {
      // Update currentIndex based on the uncategorized data length
      setCurrentIndex(0);
    }
  }, [uncategorizedData, categoryList, fetchData]);

  if (categoryListLoading || uncategorizedDataLoading) {
    return <div>Loading...</div>;
  }

  if (categoryListError || uncategorizedDataError) {
    return (
      <div>
        Error: {categoryListError?.message || uncategorizedDataError?.message}
      </div>
    );
  }

  const handleTabChange = (newTab) => {
    setTab(newTab);
  };

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    const filtered = categoryList.data.filter((item) => {
      return item.OCName.toUpperCase().includes(value.toUpperCase());
    });
    setFilteredCategoryResults(filtered);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchInput(value);
    handleUncategorizedSearch(value);
    handleCategorizedSearch(value);
  };

  // const handleUncategorizedSearch = (searchInput) => {
  //   const filtered = data.data.filter((value) => {
  //     const { POId } = value;
  //     // console.log(value, POId);
  //     console.log(searchInput);
  //     // const media = image.PMMedia[0]?.media;
  //     return searchInput === POId;
  //   });
  //   setFilteredResults(filtered);
  // };
  const handleUncategorizedSearch = (searchInput) => {
    const filteredPosts = uncategorizedData.data.filter(
      (post) => post.POId === Number(searchInput)
    );
    setFilteredResults(filteredPosts);
  };

  const handleCategorizedSearch = (searchInput) => {
    const categorizedFiltered = categorizedData.filter(
      (post) => post.POId === Number(searchInput)
    );
    setCategoryResults(categorizedFiltered);
  };

  const handleClick = () => {
    console.log(newCategories);
    fetch("https://vigoplace.com/server/api/admin/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        categories: [newCategories],
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
        setNewCategories("");
      })
      .catch((error) => {
        console.error("Error creating category:", error);
      });
  };

  const handlePostClick = (category) => {
    console.log(category);
    const postId = uncategorizedData?.data[currentIndex]?.POId;
    setSelectedCategory(category);

    // const currentImage = data[currentIndex];
    // if (currentImage.category) {
    //   toast.info("This image is already associated with a category!");
    //   return;
    // }

    // {selectedCategories[currentPostId]?.map((category) => {
    //   const sentCategory = category.OCname
    //   console.log(category);
    //   return (
    //     <li
    //       key={category.OCId}
    //       className="bg-white flex justify-between p-3 pl-3 rounded-md"
    //     >
    //       <span>{category.OCName}</span>
    //       <GrFormClose
    //         size={20}
    //         className="cursor-pointer"
    //         onClick={() =>
    //           handleCategoryChange(category, currentIndex)
    //         }
    //       />
    //     </li>
    //   );
    // })}
    fetch("https://vigoplace.com/server/api/admin/categorization", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        category: category,
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
        // setData((prevData) => {
        //   const updatedData = [...prevData];
        //   updatedData[currentIndex] = {
        //     ...updatedData[currentIndex],
        //     category: category,
        //   };
        //   return updatedData;
        // });
        toast.success("Sucessfully categorized this post!");
        queryClient.refetchQueries(["uncategorizedData"]);
        console.log(category);
      })
      .catch((error) => {
        console.error("Error creating category:", error);
        toast.error("Error categorizing this post!");
      });
  };

  return (
    <section className="">
      <div className="sm:flex-row justify-center flex flex-col items-center h-full bg-white sm:bg-transparent w-full  2xl:w-[900px] pt-3 sm:pt-0 large:w-[1220px]">
        <div className="pt-2 2xl:w-[770px] xl:w-[770px] lg:w-[770px] md:w-[550px] w-[350px] sm:h-[850px] large:w-[1100px]  bg-white rounded-l-3xl">
          <div className="p-5 2xl:pl-10 xl:pl-10 lg:pl-10 md:pl-6 border-[#f4f4f4] relative large:pl-20">
            <div className="absolute sm:left-12 left-10 top-9 large:left-24">
              <AiOutlineSearch size={20} />
            </div>
            <input
              type="text"
              placeholder="Post id:"
              className="2xl:pl-10 xl:pl-10 lg:pl-10 md:pl-12 pl-12 large:pl-14 focus:outline-blue-400 sm:w-[350px] w-[300px] h-[50px] rounded-md bg-[#F4F4F4]"
              value={searchInput}
              onChange={handleSearchChange}
            />
          </div>

          <article className="mt-3">
            <div className="font-bold border-[#f4f4f4] flex 2xl:pl-10 xl:pl-9 mac:pl-10 lg:pl-10 md:pl-6 pl-6 large:pl-20">
              <div>
                <button
                  className={`border-b-2 2xl:px-[110.6px] xl:px-[98.9px] mac:px-[110.6px] px-[20px] large:px-[130px] py-4 border-2 ${
                    tab === 0
                      ? "border-b-[#8135F9] hover:bg-[#8135F9]  hover:text-white transition-all duration-300 "
                      : ""
                  } pb-2 cursor-pointer 2xl:text-lg xl:text-base md:text-sm text-xs lg:px-[108.7px] md:px-[68.2px] focus:outline-none`}
                  onClick={() => handleTabChange(0)}
                >
                  Uncategorized Post
                </button>
              </div>
              <div>
                <button
                  className={`cursor-pointer 2xl:text-lg xl:text-base 2xl:px-[110.6px] px-[20px] large:px-[130px] text-xs md:text-sm xl:px-[98.9px] mac:px-[110.6px] lg:px-[108.7px] md:px-[68.2px] py-3 border-2 ${
                    tab === 1
                      ? "border-b-2  border-b-[#8135F9] pb-2 hover:bg-[#8135F9] py-4 hover:text-white transition-all duration-300"
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
                <UncategorizedPost
                  currentPostId={currentPostId}
                  updateCurrentPost={updateCurrentPost}
                  // category={category}
                  images={data?.data}
                  filteredResults={filteredResults}
                  selectedCategories={selectedCategories}
                  handleCategorySelection={handleCategorySelection}
                  handlePostClick={handlePostClick}
                />
              </>
            )}

            {tab === 1 && (
              <>
                <CategorizedPost
                  selectedCategories={selectedCategories}
                  handlePostClick={handlePostClick}
                  images={categorizedData}
                  categoryResults={categoryResults}
                />
              </>
            )}
          </article>
        </div>
        <div className="2xl:w-[283px] xl:w-[283px] lg:w-[283px] md:w-[230px] sm:h-[850px] w-[270px] bg-[#DFDCDC] sm:mt-0 mt-[620px] h-[600px] overflow-auto large:w-[350px]">
          <p className="text-lg sm:pt-12 pt-5 pl-7 text-[#706464]">
            Search categories
          </p>
          <div className="pl-7 sm:pt-10 pt-5 relative">
            <div className="absolute right-10 lg:right-10 2xl:right-10 mac:right-10 large:right-10 xl:right-10 md:right-8 sm:top-14 top-[35px]">
              <AiOutlineSearch size={20} onClick={handleSearch} />
            </div>
            <input
              type="text"
              className="2xl:w-[235px] xl:w-[220px] lg:w-[220px] md:w-[180px] h-[50px] pl-5 rounded-md focus:outline-blue-500"
              placeholder="Search category..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <div className="mt-10 justify-center flex flex-col items-center">
            <div className="bg-[#F4F4F4] 2xl:w-[238px] xl:w-[220px] lg:w-[210px] md:w-[180px] w-[220px] h-[400px] py-3 rounded-xl overflow-auto">
              <div className="space-y-5 py-3 overflow-auto flex flex-col items-center">
                {searchTerm !== "" ? (
                  filteredCategoryResults.length > 0 ? (
                    filteredCategoryResults.map((item) => (
                      <div
                        key={item.OCId}
                        className="bg-white 2xl:w-[170px] xl:w-[170px] md:w-[140px] rounded-md h-10 p-2"
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
                  categoryList?.data.map((category) => (
                    <div
                      key={category.OCId}
                      className="bg-white 2xl:w-[180px] xl:w-[170px] lg:w-[170px] md:w-[140px] w-[160px] rounded-md h-10 p-2 cursor-pointer"
                      onClick={() => {
                        handleCategoryChange(category);
                      }}
                    >
                      <p className="text-center 2xl:text-base xl:text-base lg:text-base md:text-sm text-[#706464] capitalize">
                        {category.OCName}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          <p className="pl-7 2xl:pt-24 xl:pt-24 lg:pt-24 pt-14 md:pt-14 text-[#706464]">
            Create a new categories
          </p>
          <div className="mt-5 pl-5 lg:pl-5 xl:pl-5 large:pl-5 2xl:pl-5 md:pl-7 flex 2xl:flex-row xl:flex-row lg:flex-row lg:gap-0 2xl:gap-0 xl:gap-0 md:flex-col md:gap-4 pb-5">
            <input
              type="text"
              className="2xl:w-[180px] xl:w-[160px] lg:w-[160px] md:w-[170px] w-[150px] h-[50px] pl-5 rounded-l-md focus:outline-blue-500"
              placeholder="New category..."
              value={newCategories}
              onChange={(e) => {
                setNewCategories(e.target.value);
              }}
            />
            <button
              className="md:w-[167px] 2xl:w-[60px] xl:w-[60px] lg:w-[60px]  p-3 md:h-12 xl:h-[50px] 2xl:h-[50px] lg:h-[50px] rounded-r-lg bg-[#8135F9] text-white"
              onClick={handleClick}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
