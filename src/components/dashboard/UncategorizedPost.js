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
  currentIndex,
  setCurrentIndex,
  handlePostClick,
  filteredPost,
  setFilteredPost,
}) => {
  const [openModal, setOpenModal] = useState(false);

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
  //console.log(images);
  // useEffect(() => {
  //   //fix rerendering issue
  //   if (categorizedPost[0].POId === images[currentIndex]?.POId) {
  //     setCurrentIndex(currentIndex + 1);
  //     console.log(images[nextIndex]?.PMMedia);
  //   }

  //   // update the current image
  //   const alreadyAdded = selectedCategories[currentPostId];
  //   if (alreadyAdded) return;
  //   setSelectedCategories((prev) => ({
  //     ...prev,
  //     [currentPostId]: [],
  //   }));
  // }, [currentPostId]);

  const API_BASE_URL = "https://vigoplace.com/server/";

  // const fetchData = async () => {
  //   const response = await fetch(`${API_BASE_URL}/api/admin/uncategorized`);
  //   const data = await response.json();
  //   console.log(data.data.length, "Yh I dey");
  //   return data;
  // };

  // const { data, isLoading, error } = useQuery(["uncategorizedData"], fetchData);

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <div>Error: {error.message}</div>;
  // }

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
    // setDeletedIndex(currentIndex);
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

  // const queryClient = useQueryClient();

  const mutation = useMutation(deletePost, {
    onSuccess: (data, postId) => {
      console.log("Mutation onSuccess called");
      console.log("Data:", data);
      console.log("postId:", postId);
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
    setFilteredPost([]);
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images?.length) % images?.length);
    const newPostId = images[newIndex]?.POId;
    updateCurrentPost(newPostId);
  };

  const nextSlide = async () => {
    setFilteredPost([]);
    //console.log(currentIndex)
    const isLastSlide = currentIndex === images.length - 1;

    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    // const currentImage = data.data[currentIndex];
    // const category = currentImage.category;
    if (selectedCategories[currentPostId]?.length > 0) {
      const data = await selectedCategories[currentPostId]?.map(
        (category) => category.OCName
      );
  
      await handlePostClick(data);
    } else {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images?.length);
      const newPostId = images[newIndex]?.POId;
      updateCurrentPost(newPostId)
    }
  };

  return (
    <>
      <div className="flex flex-col gap-5 mt-5 items-center text-sm lg-text-base lg:items-start justify-center px-[4vw] lg:flex-row lg:gap-5">
        <div className="w-full max-w-[60%]">
          <>
            <div className="">
              <div className="">
                {images && images.length > 0 ? (
                  // Display images if filteredResults is empty
                  <div className="relative object-contain">
                    {filteredPost.length > 0 ? (
                      //console.log(filteredPost)
                      <CarouselMini autoSlide={false} autoSlideInterval={3000}>
                        {images[0]?.PMMedia?.map((media) => {
                          //console.log(currentIndex)
                          //console.log(media);
                          // console.log(data.data[currentIndex]);
                          if (media.type === "video")
                          return (
                            <ReactPlayer
                            width={300}
                            height={300}
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
                            // <div
                            //   key={media.media}
                            //   className="lg:w-[30vw] w-full h-[50vh] lg:h-[35vh] object-contain relative"
                            // >
                            //   {" "}
                            <Image
                              width={400}
                              height={400}
                              src={media?.media}
                              key={media.media}
                              alt=""
                              priority
                              className={`${filteredPost[0]?.PMMedia?.length === 1 ? "max-h-[35vh]" : ""} w-full h-auto rounded-xl`}
                              // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            // </div>
                          );
                        })}
                      </CarouselMini>
                    ) : (
                      <CarouselMini autoSlide={false} autoSlideInterval={3000}>
                        {images[currentIndex]?.PMMedia?.map((media) => {
                          //  console.log(currentIndex)
                          //  console.log(images)
                          //  console.log(media)
                          //  console.log(data.data)
                          if (media.type === "video")
                            return (
                              <ReactPlayer
                              width={300}
                              height={300}
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
                              // <div
                              //   key={media.media}
                              //   className="lg:w-[30vw] w-full h-[50vh] lg:h-[35vh] object-contain relative"
                              // >
                              //   {" "}
                              <Image
                                width={400}
                                height={400}
                                src={media?.media}
                                key={media.media}
                                alt=""
                                priority
                                className={`${images[currentIndex]?.PMMedia.length === 1 ? "max-h-[35vh]" : ""} w-full h-auto rounded-xl`}
                                // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                              // </div>
                            );
                        })}
                      </CarouselMini>
                    )}

                    <button
                      className="bg-[#F93636] py-3 px-5 rounded-md text-white text-sm mt-5 z-20"
                      onClick={() => setOpenModal(true)}
                    >
                      Delete Post
                    </button>
                  </div>
                ) : (
                  // Handle the case when images or filteredResults are not available
                  <div className="text-center">Not Found</div>
                )}
              </div>
            </div>
            <div className="flex text-[#706464] text-start text-base mt-8 gap-3">
              <h2 className="">
                <span className=" font-semibold">
                Post Type:
                </span>
                {" "}
                {filteredPost.length
                  ? filteredPost[0].postType
                  : images[currentIndex]?.postType}
              </h2>
              <h2 className="">
              <span className=" font-semibold">
                Post Id:
                </span>
                {" "}
                {filteredPost.length
                  ? filteredPost[0].POId
                  : images[currentIndex]?.POId}
              </h2>
            </div>
          </>
          <div>
            <h2 className="text-[#706464] text-start mt-3.5">Description</h2>
            <div
              className={`${
                filteredPost.length ? filteredPost[0] : images[currentIndex]
              } mt-[18px] py-4 text-sm px-3 bg-[#F1F0F0] rounded-lg overflow-y-auto h-28`}
            >
              <p>
                {filteredPost.length
                  ? filteredPost[0].description
                  : images[currentIndex]?.description}
              </p>
            </div>
          </div>
        </div>

        <div className="h-[65vh] w-full bg-[#F1F0F0] px-6 py-4 rounded-xl overflow-auto">
          <p className="text-start p-2 font-bold text-[#706464]">
            Post category
          </p>

          {selectedCategories[currentPostId]?.length > 0 &&
            selectedCategories[currentPostId][0] !== null && (
              <ul className="flex flex-col items-center justify-center gap-4">
                {selectedCategories[currentPostId]?.map((category) => {
                  return (
                    <li
                      key={category.OCId}
                      className="flex justify-between py-2 px-6  w-full bg-white rounded-lg"
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
            )}

          {selectedCategories[currentPostId]?.length === 0 && (
            <div className="h-[80%] text-[#887E7E] rounded-lg bg-white flex items-center justify-center">
              <p>Add a post category</p>
            </div>
          )}
        </div>
      </div>

      <Postmodal
        open={openModal}
        onClose={() => setOpenModal(false)}
        postId={
          filteredPost.length
            ? filteredPost[0].POId
            : images[currentIndex]?.POId
        }
        onDelete={handleDelete}
      />

      <div className="flex justify-between items-center -mt-[120vh] lg:-mt-[40vh] px-[1.7vw] text-white z-20">
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
    </>
  );
};
