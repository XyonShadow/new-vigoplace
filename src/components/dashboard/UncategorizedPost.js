import React, { useState, useEffect, useRef } from "react";
import { Postmodal } from "./Postmodal";
import { MdOutlineArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import {
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowLeft,
} from "react-icons/md";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  LazyLoadImage,
  LazyLoadComponent,
} from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { GrFormClose } from "react-icons/gr";
import "video.js/dist/video-js.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactPlayer from "react-player";

export const UncategorizedPost = ({
  currentPostId,
  updateCurrentPost,
  // category,
  images,
  filteredResults,
  selectedCategories,
  handleCategorySelection,
  handlePostClick,
}) => {
  console.log(selectedCategories);
  const [openModal, setOpenModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [deletedIndex, setDeletedIndex] = useState(null);
  const [categorizedData, setCategorizedData] = useState([]);
  const [showIcon, setShowIcon] = useState(false);
  const [nextIndex, setNextIndex] = useState(0);
  const hasMedia = filteredResults[currentIndex]?.PMMedia.length > 0;
  const maxIndex = filteredResults[nextIndex]?.PMMedia.length - 1;

  const handleCategoryChange = (category) => {
    handleCategorySelection((prevSelectedCategories) => {
      const currentCategories = prevSelectedCategories[currentPostId];

      if (!currentCategories) {
        return prevSelectedCategories;
      }

      const updatedCategories = currentCategories.filter(
        (c) => c.OCId !== category.OCId
      );

      return {
        ...prevSelectedCategories,
        [currentPostId]: updatedCategories,
      };
    });
  };

  useEffect(() => {
    // update the current image
    updateCurrentPost(images[currentIndex]?.POId);
  }, [currentIndex]);

  const API_BASE_URL = "https://vigoplace.com/server/";

  const fetchData = async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/uncategorized`);
    const data = await response.json();
    // console.log(data);
    return data;
  };

  const { data, isLoading, error } = useQuery(["uncategorizedData"], fetchData);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // const fetchCategory = async () => {
  //   const response = await fetch(`${API_BASE_URL}/api/admin/categorized`);
  //   const data = await response.json();
  //   return data;
  // };

  // const {
  //   data: categorizedItem,
  //   categorizedItemisLoading,
  //   categorizedItemisError,
  // } = useQuery(["categorizedPost"], fetchCategory, {
  //   onSuccess: (data) => {
  //     setCategorizedData(data?.data || []);
  //   },
  // });

  // if (categorizedItemisLoading) {
  //   return <div>Loading...</div>;
  // }

  // if (categorizedItemisError) {
  //   return <div>Error: {categoryListError?.message?.message}</div>;
  // }

  const handleDelete = () => {
    setDeletedIndex(currentIndex);
    setOpenModal(false);
  };

  const deletePost = async (postId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/categorization/${postId}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      throw new Error(`Error deleting post: ${error.message}`);
    }
  };

  const queryClient = useQueryClient();

  const mutation = useMutation(deletePost, {
    onSuccess: (data, postId) => {
      console.log("Mutation onSuccess called");
      console.log("Data:", data);
      console.log("postId:", postId);

      queryClient.invalidateQueries("categorizedPost");
      setCategorizedData((prevData) =>
        prevData.filter((post) => post.OPCPostId !== postId)
      );
      toast.success("Successfully deleted the category!");
    },
    onError: (error) => {
      console.error("Error deleting post:", error);
      toast.error("Error deleting the category!");
    },
  });

  // const categoryDelete = async (postId) => {
  //   try {
  //     console.log("Calling categoryDelete with postId:", postId);
  //     await mutation.mutateAsync(postId);
  //     setSelectedCategories((prevSelectedCategories) =>
  //       prevSelectedCategories.filter((category) => category.OCId !== postId)
  //     );
  //     setCategorizedData((prevData) =>
  //       prevData.map((post) =>
  //         post.POId === postId ? { ...post, OPCCategory: [] } : post
  //       )
  //     );
  //   } catch (error) {
  //     console.error("Error deleting post:", error);
  //     toast.error("Error deleting the category!");
  //   }
  // };
  // const currentImage = data.data[currentIndex];

  // const category = currentImage.category;
  const prevSlide = () => {
    updateCurrentPost();
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    console.log(data.data[currentIndex]);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    console.log(data.data[currentIndex]);
    // const currentImage = data.data[currentIndex];
    // const category = currentImage.category;
    handlePostClick(
      selectedCategories[currentPostId]?.map((category) => category.OCName)
    );
  };

  const Carousel = () => {
    if (filteredResults && filteredResults.length > 1) {
      setShowIcon(true);
    } else {
      setShowIcon(false);
    }
  };

  const leftSlide = () => {
    if (hasMedia && nextIndex > 0) {
      setNextIndex((prevIndex) => prevIndex - 1);
    }
  };

  useEffect(() => {
    updateCurrentPost(images[currentIndex]?.POId);
    Carousel();
  }, [currentIndex]);

  const rightSlide = () => {
    if (hasMedia && nextIndex < maxIndex) {
      setNextIndex((prevIndex) => prevIndex + 1);
    }
  };

  console.log("media" + images[currentIndex]?.PMMedia[0]?.media);
  console.log(currentPostId);

  return (
    <div>
      <div className="sm:flex-row sm:justify-evenly large:justify-around flex-col flex justify-center items-center">
        <div className={`2xl:pl-7 xl:pl-7 lg:pl-7 md:pl-3 Styles.fade-In`}>
          <div className=" pt-10">
            <div className="2xl:w-[390px] xl:w-[380px] lg:w-[360px] md:w-[255px] w-[270px] 2xl:h-[335px] h-[300px] xl:h-[335px] lg:h-[335px] md:h-[310px] bg-[#f4f4f4] rounded-md">
              <div className="text-center text-base text-[#706464] capitalize font-bold">
                {filteredResults && filteredResults.length > 0 ? (
                  <div key={filteredResults[currentIndex]?.POId}>
                    {/* {filteredResults[currentIndex]?.PMMedia?.length > 1 ? (
                      
                    )} */}
                    {filteredResults[currentIndex]?.PMMedia[0]?.type ===
                    "video" ? (
                      <ReactPlayer
                        url={filteredResults[currentIndex]?.PMMedia[0]?.media}
                        config={{
                          file: { forceHLS: true },
                        }}
                        autoPlay={false}
                        controls={true}
                        width={370}
                        height={335}
                        style={{ width: "380px", height: "335px" }}
                        className="2xl:w-[390px] xl:w-[380px] lg:w-[360px] md:w-[255px] w-[250px] 2xl:h-[382px] xl:h-[335px] lg:h-[335px] h-[300px] md:h-[310px]"
                      />
                    ) : (
                      <LazyLoadImage
                        src={filteredResults[currentIndex]?.PMMedia[0]?.media}
                        alt=""
                        className="2xl:w-[390px] xl:w-[380px] lg:w-[360px] md:w-[255px] w-[250px] 2xl:h-[382px] xl:h-[335px] lg:h-[335px] h-[300px] md:h-[310px]"
                        effect="blur"
                      />
                    )}
                  </div>
                ) : images && images.length > 0 ? (
                  // Display images if filteredResults is empty
                  <div key={images[currentIndex]?.POId}>
                    {images[currentIndex]?.PMMedia[0]?.type === "video" ? (
                      <ReactPlayer
                        url={images[currentIndex]?.PMMedia[0]?.media}
                        config={{
                          file: { forceHLS: true },
                        }}
                        autoPlay={false}
                        controls={true}
                        width={380}
                        height={335}
                        className="2xl:w-[390px] xl:w-[380px] lg:w-[360px] md:w-[255px] w-[250px] 2xl:h-[382px] xl:h-[335px] lg:h-[335px] h-[300px] md:h-[310px]"
                      />
                    ) : (
                      <LazyLoadImage
                        src={images[currentIndex]?.PMMedia[0]?.media}
                        alt=""
                        className="2xl:w-[390px] xl:w-[380px] lg:w-[360px] md:w-[255px] w-[270px] h-[300px] 2xl:h-[382px] xl:h-[335px] lg:h-[335px] md:h-[310px]"
                        effect="blur"
                      />
                    )}
                  </div>
                ) : (
                  // Handle the case when images or filteredResults are not available
                  <div className="text-center">Not Found</div>
                )}
              </div>
              {/* {filteredResults[newIndex]?.PMMedia.media((item, index) => {
                      <div key={index}>
                        {filteredResults[newIndex]?.PMMedia.media.type === "video" ? (
                          
                        )}
                      </div>;
                    })} */}

              {/* {filteredResults && filteredResults.length > 0 ? (    
                  <div key={filteredResults[currentIndex]?.POId}>
                    {filteredResults[currentIndex]?.PMMedia[0]?.type ===
                    "video" ? (   
                    <LazyLoadImage
                    src={filteredResults[currentIndex]?.PMMedia[0]?.media}
                    alt=""
                    className="2xl:w-[390px] xl:w-[380px] lg:w-[360px] md:w-[255px] w-[250px] 2xl:h-[382px] xl:h-[335px] lg:h-[335px] h-[300px] md:h-[310px]"
                    effect="blur"
                  />
</div>
)} */}

              <div className="relative">
                <button
                  className="bg-[#F93636] py-3 px-5 rounded-md text-white text-sm absolute right-5 -top-16 z-20"
                  onClick={() => setOpenModal(true)}
                >
                  Delete Post
                </button>
              </div>
            </div>
            <div>
              <h2 className="text-[#706464] 2xl:pt-7 xl:pt-7 lg:pt-7 text-start text-base md:pt-8 pt-7">
                Post Type: {data.data[currentIndex]?.postType}
              </h2>
            </div>
          </div>
          <div>
            <h2 className="text-[#706464] pt-7 text-start text-xl sm:pb-5 pb-5">
              Description
            </h2>
            <div className={`${data.data[currentIndex]}`}>
              <div className="2xl:w-[380px] xl:w-[380px] lg:w-[360px] md:w-[245px] w-[270px] h-[100px] 2xl:h-[150px] xl:h-[150px] lg:h-[150px] md:h-[177px] bg-[#f4f4f4] rounded-md overflow-auto">
                <div className="text-center text-sm text-[#706464] mt-2 p-3">
                  <p>{data.data[currentIndex]?.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-12">
          <div className="2xl:w-[290px] xl:w-[290px] lg:w-[290px] md:w-[230px] w-[270px] sm:h-[620px] h-[300px] bg-[#f4f4f4]  rounded-xl overflow-auto">
            <p className="text-start p-2 pl-10 font-bold text-[#706464] text-lg">
              Post category
            </p>

            {selectedCategories[currentPostId]?.length > 0 &&
              selectedCategories[currentPostId][0] !== null && (
                <div className="flex flex-col items-center justify-center">
                  <div className="space-y-3 py-3 rounded-xl flex flex-col items-center">
                    <div className="2xl:w-[240px] xl:w-[240px] lg:w-[240px] md:w-[190px] w-[200px] rounded-md">
                      <ul className="space-y-5">
                        {selectedCategories[currentPostId]?.map((category) => {
                          console.log(category);
                          return (
                            <li
                              key={category.OCId}
                              className="bg-white flex justify-between p-3 pl-3 rounded-md"
                            >
                              <span>{category.OCName}</span>
                              <GrFormClose
                                size={20}
                                className="cursor-pointer"
                                onClick={() =>
                                  handleCategoryChange(category, currentIndex)
                                }
                              />
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>

      <Postmodal
        open={openModal}
        onClose={() => setOpenModal(false)}
        postId={data.data[currentIndex]?.POId}
        onDelete={handleDelete}
      />
      {showIcon && (
        <div className="flex items-center justify-center text-white">
          <MdOutlineKeyboardArrowLeft
            className="rounded-xl bg-[#8135F9] p-1 cursor-pointer"
            onClick={leftSlide}
          />

          <MdOutlineKeyboardArrowRight
            className="rounded-xl bg-[#8135F9] p-1 cursor-pointer"
            onClick={rightSlide}
          />
        </div>
      )}
      <div className="flex justify-between items-center sm:-mt-80 -mt-[570px] sm:p-3 p-1 text-white">
        <div>
          <MdOutlineArrowBackIosNew
            // size={25}
            className="rounded-xl bg-[#8135F9] p-1 cursor-pointer lg:text-xl md:text-base xl:text-2xl"
            onClick={prevSlide}
          />
        </div>
        <div>
          <MdArrowForwardIos
            // size={25}
            className="rounded-xl bg-[#8135F9] p-1 cursor-pointer lg:text-xl md:text-base xl:text-2xl"
            onClick={nextSlide}
          />
        </div>
      </div>
    </div>
  );
};
