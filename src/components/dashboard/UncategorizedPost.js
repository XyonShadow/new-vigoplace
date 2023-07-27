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
import { Height } from "@mui/icons-material";
import CarouselMini from "./Carousel";
import Image from "next/image";

export const UncategorizedPost = ({
  currentPostId,
  updateCurrentPost,
  setSelectedCategories,
  categorizedPost,
  // category,
  images,
  filteredResults,
  selectedCategories,
  handleCategorySelection,
  handlePostClick,
}) => {
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
    //fix rerendering issue
    if (categorizedPost[0].POId === images[currentIndex]?.POId) {
      setCurrentIndex(currentIndex + 1);
      console.log(images[nextIndex]?.PMMedia);
    }

    // update the current image
    const alreadyAdded = selectedCategories[currentPostId];
    if (alreadyAdded) return;
    setSelectedCategories((prev) => ({
      ...prev,
      [currentPostId]: [],
    }));
  }, [currentPostId]);

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

      queryClient.invalidateQueries("uncategorizedData");
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

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    const newPostId = images[newIndex]?.POId;
    updateCurrentPost(newPostId);
  };

  const nextSlide = async () => {
    const isLastSlide = currentIndex === images.length - 1;

    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    // const currentImage = data.data[currentIndex];
    // const category = currentImage.category;
    const data = await selectedCategories[currentPostId]?.map(
      (category) => category.OCName
    );

    await handlePostClick(data);

    setCurrentIndex(newIndex);
    const newPostId = images[newIndex]?.POId;
    updateCurrentPost(newPostId);
  };

  const Carousel = () => {
    if (filteredResults && filteredResults.length > 1) {
      setShowIcon(true);
    } else {
      setShowIcon(false);
    }
  };

  const leftSlide = () => {
    const isPrevSlide = nextIndex === 0;
    const newIndex = isPrevSlide
      ? data.data[currentIndex]?.PMMedia?.length - 1
      : nextIndex - 1;
    setNextIndex(newIndex);
    console.log(images[nextIndex]?.PMMedia);
  };

  useEffect(() => {
    Carousel();
  }, [currentIndex]);

  const rightSlide = () => {
    const isNextSlide =
      nextIndex === data.data[currentIndex]?.PMMedia?.length - 1;
    const newIndex = isNextSlide ? 0 : nextIndex + 1;
    setNextIndex(newIndex);
    console.log(images[nextIndex]?.PMMedia);

    //     const isLastSlide = currentIndex === images.length - 1;

    // const newIndex = isLastSlide ? 0 : currentIndex + 1;
    // // const currentImage = data.data[currentIndex];
    // // const category = currentImage.category;
    // const data = await selectedCategories[currentPostId]?.map(
    //   (category) => category.OCName
    // );

    // await handlePostClick(data);

    // setCurrentIndex(newIndex);
    // const newPostId = images[newIndex]?.POId;
    // updateCurrentPost(newPostId);
  };

  return (
    <div>
      <div className="flex flex-col mt-10 items-center justify-center px-[4vw] sm:flex-row sm:gap-8">
        <div>
          <div className="">
            <div className="">
              <div className="">
                {data.data && data.data.length > 0 ? (
                  // Display images if filteredResults is empty
                  <div>
                    <CarouselMini autoSlide={false} autoSlideInterval={3000}>
                      {data.data[currentIndex]?.PMMedia?.map((media) => {
                        console.log(media);
                        console.log(data.data[currentIndex]);
                        if (media.type === "video")
                          return (
                            <ReactPlayer
                              url={media.media}
                              muted={true}
                              playsinline
                              autoPlay={false}
                              controls
                              key={media.media}
                            />
                          );
                        else
                          return (
                            <Image
                            width={360}
                            height={360}
                              src={media.media}
                              key={media.media}
                              alt=""
                              className="w-full h-auto mx-auto rounded-xl"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          );
                      })}
                    </CarouselMini>
                  </div>
                ) : (
                  // Handle the case when images or filteredResults are not available
                  <div className="text-center">Not Found</div>
                )}
              </div>

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

        <div className="">
          <div className="2xl:w-[290px] xl:w-[290px] lg:w-[290px] md:w-[230px] w-[270px] sm:h-[620px] h-[300px] bg-[#f4f4f4]  rounded-xl overflow-auto">
            <p className="text-start p-2 pl-10 font-bold text-[#706464] text-lg">
              Post category
            </p>

            {selectedCategories[currentPostId]?.length > 0 &&
              selectedCategories[currentPostId][0] !== null && (
                <div className="flex flex-col items-center justify-center">
                  <div className="flex flex-col items-center py-3 space-y-3 rounded-xl">
                    <div className="2xl:w-[240px] xl:w-[240px] lg:w-[240px] md:w-[190px] w-[200px] rounded-md">
                      <ul className="space-y-5">
                        {selectedCategories[currentPostId]?.map((category) => {
                          return (
                            <li
                              key={category.OCId}
                              className="flex justify-between p-3 pl-3 bg-white rounded-md"
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

      <div className="flex sm:p-3 justify-between items-center sm:-mt-80 -mt-[590px] p-1 text-white z-20">
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
