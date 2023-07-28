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

  const [rerender, setRerender] = useState(true);
  const [categorizedPost, setCategorizedPost] = useState([]);
  const [categorizedIndex, setCategorizedIndex] = useState(0);
  const updateCategorizedIndex = (index) => setCategorizedIndex(index);
  const updateCategorizedPost = (post) => setCategorizedPost(post);

  const updateCurrentPost = (postId) => setCurrentPostId(postId);


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
    if(value === "") {
      setFilteredCategoryResults(categoryList.data);
    }
    setSearchTerm(value);

    const filtered = categoryList.data.filter((item) => {
      return item.OCName.toUpperCase().includes(value.toUpperCase());
    });
    setFilteredCategoryResults(filtered);
  };

  const handleSearchChange = () => {
    if (searchInput === "") {
      return
    }
    handleUncategorizedSearch(searchInput);
    handleCategorizedSearch(searchInput);
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
      (post) => post.POId === searchInput
    );
    updateCurrentPost(filteredPosts);
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
    <section className="flex items-center text-sm lg:text-base flex-col lg:flex-row justify-center">
      <div className="lg:w-[60vw] w-full bg-white h-[200vh] lg:h-screen">
        <div className=" px-[4vw] py-4">
          <div className="bg-[#F4F4F4] gap-2.5 rounded-lg w-[50%] py-3 flex px-6">
            <AiOutlineSearch onClick={handleSearchChange} size={20} />

            <input
              type="number"
              placeholder="Post id:"
              className="bg-[#F4F4F4] w-full outline-none"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
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
      <div className="lg:w-[30vw] w-full flex flex-col pl-9 pr-16 h-screen py-[13vh] bg-[#DFDCDC]">
        <input
          type="text"
          className="p-1 rounded-lg focus:outline-blue-500 w-full"
          placeholder="Search category..."
          value={searchTerm}
          onChange={handleSearch}
        />

        <div className="flex flex-col h-[40%] overflow-y-auto rounded-lg gap-2.5 mt-4 p-2 bg-[#F1F0F0]">
          {searchTerm !== "" ? (
            filteredCategoryResults.length > 0 ? (
              filteredCategoryResults.map((item) => (
                <div
                  key={item.OCId}
                  className="bg-white py-2.5 text-[#706464] cursor-pointer px-4 rounded-md"
                  onClick={() => {
                    handleCategoryChange(item);
                  }}
                >
                  <p>{item.OCName}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-[#706464]">Not found</p>
            )
          ) : (
            categoryList?.data.map((category) => (
              <div
                key={category.OCId}
                className="bg-white py-2.5 text-[#706464] cursor-pointer px-4 rounded-md"
                onClick={() => {
                  handleCategoryChange(category);
                }}
              >
                <p>{category.OCName}</p>
              </div>
            ))
          )}
        </div>
        <div className="flex flex-col mt-20 gap-4">
          <p className="text-[#706464] font-bold">Create a new category</p>
          <div className="flex ">
            <input
              type="text"
              className="p-1 px-3 rounded-l-lg outline-none max-w-[65%]"
              placeholder="New category..."
              value={newCategories}
              onChange={(e) => {
                setNewCategories(e.target.value);
              }}
            />
            <button className="bg-[#8135F9] py-3 px-6 text-white rounded-r-lg" onClick={handleClick}>
              Save
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
