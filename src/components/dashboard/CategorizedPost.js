import React, { useState, useEffect, useRef } from "react";
import { MdOutlineArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Postmodal } from "./Postmodal";
import { GrFormClose } from "react-icons/gr";
import {
  LazyLoadImage,
  LazyLoadComponent,
} from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowLeft,
} from "react-icons/md";
import "video.js/dist/video-js.css";
import ReactPlayer from "react-player";
import CarouselMini from "./Carousel";
import Image from "next/image";

export const CategorizedPost = ({
  data,
  isLoading,
  isError,
  images,
  categoryResults,
  setCategoryResults,
  categorizedIndex,
  updateCategorizedIndex,
  updateCategorizedPost,
  handleCategorizePost,
}) => {
  const [openModal, setOpenModal] = useState(false);

  const API_BASE_URL = "https://vigoplace.com/server/";
  if (categoryResults.length > 0) {
    console.log(categoryResults);
  }

  const deletePost = async (postId) => {
    console.log(postId);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/categorization/${postId}/post`,
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

  const deletePostCategory = async (postId, category) => {
    toast.success("Removing category from post");
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/uncategorize/${postId}/${category}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        toast.error("Fails to remove category");
        throw new Error(data.error);
      }
      const data = await response.json();
      queryClient.invalidateQueries("categorizedPost")
      return data;
    } catch (error) {
      throw new Error(`Error deleting post: ${error.message}`);
    }
  };

  const queryClient = useQueryClient();

  const mutateDelete = useMutation(deletePostCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries("categorizedPost");
    },
  });

  const mutation = useMutation(deletePost, {
    onSuccess: (data, postId) => {
      console.log("Mutation onSuccess called");
      console.log("Data:", data);
      console.log("postId:", postId);

      // queryClient.invalidateQueries("data");
      queryClient.invalidateQueries("categorizedPost");
      updateCategorizedPost((prevData) =>
        prevData.filter((post) => post.OPCPostId !== postId)
      );
      toast.success("Successfully deleted the post!");
    },
    onError: (error) => {
      console.error("Error deleting post:", error);
      toast.error("Error deleting the category!");
    },
  });

  const categoryDelete = async (postId) => {
    try {
      console.log("Calling categoryDelete with postId:", postId);
      await mutate(postId);
      updateCategorizedPost((prevData) =>
        prevData.map((post) =>
          post.POId === postId ? { ...post, OPCCategory: [] } : post
        )
      );
      console.log("Na me dey work")
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Error deleting the category!");
    }
  };

  // const isAtBeginning = categorizedIndex === 0;
  // // Check if carousel is at the end (last image)
  // const isAtEnd =
  //   (categoryResults && categorizedIndex === categoryResults.length - 1) ||
  //   (images && categorizedIndex === images.length - 1);

  // const categoryDelete = async (postId) => {
  //   try {
  //     console.log("Calling categoryDelete with postId:", postId);
  //     await mutation.mutateAsync(postId);
  //   } catch (error) {
  //     console.error("Error deleting post:", error);
  //     toast.error("Error deleting the category!");
  //   }
  // };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: </div>;
  }

  const handleDelete = () => {
    setOpenModal(false);
    if (
      data &&
      data.length > 0 &&
      categoryResults &&
      categoryResults.length > 0
    ) {
      const postId = categoryResults[categorizedIndex]?.POId;
      if (postId !== undefined) {
        categoryDelete(postId);
      } else {
        console.error("postId is undefined.");
      }
    } else {
      console.error("data or categoryResults is empty or null.");
    }
  };

  const prevSlide = () => {
    setCategoryResults([])
    updateCategorizedIndex(
      (prevIndex) => (prevIndex - 1 + data?.length) % data?.length
    );
  };

  const nextSlide = () => {
    setCategoryResults([])
    updateCategorizedIndex((prevIndex) => (prevIndex + 1) % data?.length);
  };

  return (
    <>
      <div className="flex flex-col gap-5 mt-10 items-center text-sm lg-text-base lg:items-start justify-center px-[4vw] lg:flex-row lg:gap-8">
        <div className={`w-full max-w-[60%]`}>
          <div className="">
            <div className="">
              <div className="">
                {images && images.length > 0 ? (
                  // Display images if categoryResults is empty
                  <div className="relative">
                    <CarouselMini autoSlide={false} autoSlideInterval={3000}>
                      {( categoryResults.length > 0 ? categoryResults[0] : images[categorizedIndex])?.PMMedia?.map((media) => {
                        console.log(categorizedIndex)
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
                            // <div
                            //   key={media.media}
                            //   className="lg:w-[30vw] w-full h-[50vh] lg:h-[35vh] object-contain relative"
                            // >
                            //   {" "}
                            <Image
                              width={400}
                              height={400}
                              src={media.media}
                              key={media.media}
                              alt=""
                              priority
                              className={`${( categoryResults.length > 0 ? categoryResults[0] : images[categorizedIndex])?.PMMedia.length === 1 ? "max-h-[35vh]" : ""} w-full h-auto rounded-xl`}
                              // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            // </div>
                          );
                      })}
                    </CarouselMini>
                    <button
                      className="bg-[#F93636] py-3 px-5 rounded-md text-white text-sm absolute bottom-4 right-5 z-20"
                      onClick={() => setOpenModal(true)}
                    >
                      Delete Post
                    </button>
                  </div>
                ) : (
                  // Handle the case when images or categoryResults are not available
                  <div className="text-center">No Categorized Post Found</div>
                )}
              </div>
            </div>
            <div className="text-[#706464] flex gap-3 text-start text-base mt-8">
              <h2 className="">
              <span className=" font-semibold">
                Post Type:
                </span>
                {" "}
                {(categoryResults.length > 0 ? categoryResults[0] : images[categorizedIndex])?.postType}
              </h2>
              <h2 className="">
              <span className=" font-semibold">
                Post Id:
                </span>
                {" "}
                {(categoryResults.length > 0 ? categoryResults[0] : images[categorizedIndex])?.POId}
              </h2>
            </div>
          </div>
          <div>
            <h2 className="text-[#706464] text-start mt-3.5">Description</h2>

            <div className="mt-[18px] py-4 text-sm px-3 bg-[#F1F0F0] rounded-lg overflow-y-auto h-28">
              <p>{(categoryResults.length > 0 ? categoryResults[0] : images[categorizedIndex])?.description}</p>
            </div>
          </div>
        </div>

        <div className="h-[65vh] w-full bg-[#F1F0F0] px-6 py-4 rounded-xl overflow-auto">
          <p className="text-start p-2 font-bold text-[#706464]">
            Post category
          </p>
          <div className="flex flex-col items-center justify-center gap-4">
            {(categoryResults.length > 0 ? categoryResults[0] : images[categorizedIndex])?.OPCCategory?.map((item, index) => {
              // console.log(item);
              if (item === "") return;
              return (
                <div
                  key={index}
                  className="flex justify-between py-2 px-6  w-full bg-white rounded-lg"
                >
                  <p>{item}</p>
                  <GrFormClose
                    size={20}
                    className="cursor-pointer"
                    onClick={() =>
                      deletePostCategory((categoryResults.length > 0 ? categoryResults[0] : images[categorizedIndex])?.POId, item)
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Postmodal
        open={openModal}
        onClose={() => setOpenModal(false)}
        postId={(categoryResults.length > 0 ? categoryResults[0] : images[categorizedIndex])?.POId}
        onDelete={handleDelete}
      />

      {/* <div className="relative text-white">
        <MdOutlineKeyboardArrowLeft
          size={18}
          className={`rounded-xl bg-[#8135F9] p-1 cursor-pointer absolute sm:-top-[430px] -top-[720px] left-3`}
          // onClick={ }
        />

        <MdOutlineKeyboardArrowRight
          size={18}
          className={`rounded-xl bg-[#8135F9] p-1 cursor-pointer absolute sm:-top-[430px] -top-[720px] lg:right-[300px] xl:right-[310px] 2xl:right[310px] md:right-[240px] right-[15px]`}
          // onClick={}
        />
      </div> */}

      <div className="flex justify-between items-center -mt-[120vh] lg:-mt-[40vh] px-[1vw] text-white z-20">
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
