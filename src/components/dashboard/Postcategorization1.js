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
  const [currentPostId, setCurrentPostId] = useState(data?.data[0]?.POId);
  const updateCurrentPost = (postId) => setCurrentPostId(postId);
  const [rerender, setRerender] = useState(true);
  const [categorizedPost, setCategorizedPost] = useState([]);
  const [categorizedIndex, setCategorizedIndex] = useState(0);
  const updateCategorizedIndex = (index) => setCategorizedIndex(index);
  const updateCategorizedPost = (post) => setCategorizedPost(post);
  const API_BASE_URL = "https://vigoplace.com/server/";

  const fetchCategory = async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/categorized`);
    const data = await response.json();
    // console.log(data);
    return data;
  };

  const {
    data: categorizedItem,
    isLoading,
    isError,
  } = useQuery(["categorizedPost"], fetchCategory, {
    onSuccess: (data) => {
      setCategorizedPost(data?.data || []);
      queryClient.invalidateQueries("categorizedPost");
    },
  });

  const localCategory = useRef(false);
  useEffect(() => {
    if (data && !currentPostId) {
      setCurrentPostId(data?.data[0]?.POId);
    }
    if (!localCategory.current) {
      const category = localStorage.getItem("categoryData");
      if (category) {
        setSelectedCategories(JSON.parse(category));
        localCategory.current = true;
      }
    }

    if (localCategory.current && Object.keys(selectedCategories).length > 0) {
      localStorage.setItem("categoryData", JSON.stringify(selectedCategories));
    }
  }, [selectedCategories, data]);

  const handleCategoryChange = (category) => {
    if (tab === 0) {
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
    } else {
      const findPost = categorizedPost[categorizedIndex];
      const categoryExist = findPost.OPCCategory.findIndex(
        (c) => c === category.OCName
      );
      if (categoryExist >= 0) return;

      const newPost = [...categorizedPost];
      newPost.splice(categorizedIndex, 1, {
        ...findPost,
        OPCCategory: [...findPost.OPCCategory, category.OCName],
      });
      handlePostClick(
        [...findPost.OPCCategory, category.OCName],
        findPost.POId
      );
      setCategorizedPost(newPost);
    }
    setRerender((prev) => !prev);
  };

  const handleCategorySelection = (selectedCategories) => {
    setSelectedCategories(selectedCategories);
  };

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
        setNewCategories("");
        return true;
      })
      .catch((error) => {
        console.error("Error creating category:", error);
        return false;
      });
  };

  const handlePostClick = (category, id) => {
    const postId = uncategorizedData?.data[currentIndex]?.POId;
    setSelectedCategory(category);
    if (category.length === 0) {
      toast.warning("No category added to post");
      return;
    }

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
    //       className="flex justify-between p-3 pl-3 bg-white rounded-md"
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
        category,
        postId: id ? id : postId,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to create category");
        }
        return response.json();
      })
      .then((data) => {
        // setData((prevData) => {
        //   const updatedData = [...prevData];
        //   updatedData[currentIndex] = {
        //     ...updatedData[currentIndex],
        //     category: category,
        //   };
        //   return updatedData;
        // });
        toast.success("Post successfully categorized!");
      })
      .catch((error) => {
        console.error("Error creating category:", error);
        toast.error("Error categorizing post!");
      });
  };

  return (
    <section className="flex items-center justify-center">
      <div className="w-[60vw] bg-white h-screen">
        <div className=" px-[4vw] py-4">
          <div className="bg-[#F4F4F4] gap-2.5 rounded-lg w-[50%] py-3 flex px-6">
            <AiOutlineSearch size={20} />

            <input
              type="text"
              placeholder="Post id:"
              className="bg-[#F4F4F4] w-full"
              value={searchInput}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <div className="font-bold px-[4vw] border-y flex justify-between border-[#f4f4f4] pt-3">
          <div className="py-3 px-5">
            <button
              className={` py-3 px-5 ${
                tab === 0
                  ? "border-b-[#8135F9] border-b transition-all duration-300 "
                  : ""
              } pb-2 cursor-pointer 2xl:text-lg xl:text-base md:text-sm text-xs focus:outline-none`}
              onClick={() => handleTabChange(0)}
            >
              Uncategorized Post
            </button>
          </div>
          <div className="py-3 px-5">
            <button
              className={` py-3 px-5 ${
                tab === 1
                  ? "border-b-[#8135F9] border-b transition-all duration-300 "
                  : ""
              } pb-2 cursor-pointer 2xl:text-lg xl:text-base md:text-sm text-xs focus:outline-none`}
              onClick={() => handleTabChange(1)}
            >
              Categorized Post
            </button>
          </div>
        </div>
        {tab === 0 && (
          <UncategorizedPost
            categorizedPost={categorizedPost}
            currentPostId={currentPostId}
            updateCurrentPost={updateCurrentPost}
            setSelectedCategories={setSelectedCategories}
            // category={category}
            images={data?.data}
            filteredResults={filteredResults}
            selectedCategories={selectedCategories}
            handleCategorySelection={handleCategorySelection}
            handlePostClick={handlePostClick}
          />
        )}

        {tab === 1 && (
          <CategorizedPost
            categorizedIndex={categorizedIndex}
            updateCategorizedIndex={updateCategorizedIndex}
            updateCategorizedPost={updateCategorizedPost}
            isLoading={isLoading}
            isError={isError}
            data={categorizedPost}
            selectedCategories={selectedCategories}
            handlePostClick={handlePostClick}
            images={categorizedData}
            categoryResults={categoryResults}
          />
        )}
      </div>
      <div className="w-[30vw] h-screen bg-[#DFDCDC]">
        <p className="text-lg sm:pt-12 pt-5 pl-7 text-[#706464]">
          Search categories
        </p>
        <div className="relative pt-5 pl-7 sm:pt-10">
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

        <div className="flex flex-col items-center justify-center mt-10">
          <div className="bg-[#F4F4F4] 2xl:w-[238px] xl:w-[220px] lg:w-[210px] md:w-[180px] w-[220px] h-[400px] py-3 rounded-xl overflow-auto">
            <div
              key={Date.now()}
              className="flex flex-col items-center py-3 space-y-5 overflow-auto"
            >
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
        <div className="flex pb-5 pl-5 mt-5 lg:pl-5 xl:pl-5 large:pl-5 2xl:pl-5 md:pl-7 2xl:flex-row xl:flex-row lg:flex-row lg:gap-0 2xl:gap-0 xl:gap-0 md:flex-col md:gap-4">
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
    </section>
  );
}
