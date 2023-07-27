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
  categorizedIndex,
  updateCategorizedIndex,
  updateCategorizedPost,
  handleCategorizePost,
}) => {
  const [openModal, setOpenModal] = useState(false);

  const API_BASE_URL = "https://vigoplace.com/server/";
  if (categoryResults.length > 1) {
    console.log(categoryResults);
  }

  const deletePost = async (postId) => {
    console.log(postId)
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
    toast.success("Removing category from post")
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/uncategorize/${postId}/${category}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        toast.error("Fails to remove category")
        throw new Error(data.error);
       
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(`Error deleting post: ${error.message}`);
    }
  };

  const queryClient = useQueryClient();

  const mutateDelete = useMutation(deletePostCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries("categorizedPost")
    }
  })

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
      console.log("Calling categoryDelete with postId:", postId );
      await mutate(postId);
      updateCategorizedPost((prevData) =>
        prevData.map((post) =>
          post.POId === postId ? { ...post, OPCCategory: [] } : post
        )
      );
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
    updateCategorizedIndex(
      (prevIndex) => (prevIndex - 1 + data?.length) % data?.length
    );
  };

  const nextSlide = () => {
    updateCategorizedIndex((prevIndex) => (prevIndex + 1) % data?.length);
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center sm:flex-row sm:justify-evenly">
        <div className={`2xl:pl-7 xl:pl-7 lg:pl-7 md:pl-3 Styles.fade-In`}>
          <div className="pt-10">
            <div className="2xl:w-[390px] xl:w-[380px] lg:w-[360px] md:w-[255px] w-[270px] 2xl:h-[335px] h-[300px] xl:h-[335px] lg:h-[335px] md:h-[310px] bg-[#f4f4f4] rounded-md">
              <div className="text-center text-base text-[rgb(112,100,100)] capitalize font-bold">
                {images && images.length > 0 ? (
                  // Display images if categoryResults is empty
                  <div key={images[categorizedIndex].POId}>
                    <CarouselMini autoSlide={false} autoSlideInterval={3000}>
                      {images[categorizedIndex]?.PMMedia?.map((media) => {
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
                  // Handle the case when images or categoryResults are not available
                  <div className="pt-80">No Categorized Post Found</div>
                )}
              </div>

              <div className="relative">
                <button
                  className="bg-[#F93636] py-3 px-5 rounded-md text-white text-sm absolute right-3 -top-16 z-20"
                  onClick={() => setOpenModal(true)}
                >
                  Delete Post
                </button>
              </div>
            </div>
            <div>
              <h2 className="text-[#706464] 2xl:pt-7 xl:pt-7 lg:pt-7 text-start text-base md:pt-8 pt-7">
                Post Type: {data[categorizedIndex]?.postType}
              </h2>
            </div>
          </div>
          <div>
            <h2 className="text-[#706464] pt-7 text-start text-xl sm:pb-5 pb-5">
              Description
            </h2>
            <div>
              <div className="2xl:w-[380px] xl:w-[380px] lg:w-[360px] md:w-[245px] w-[270px] h-[100px] 2xl:h-[150px] xl:h-[150px] lg:h-[150px] md:h-[177px] bg-[#f4f4f4] rounded-md overflow-auto">
                <div className="text-center text-sm text-[#706464] mt-2 p-3">
                  {data[categorizedIndex]?.description}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-14">
          <div className="2xl:w-[290px] xl:w-[290px] lg:w-[290px] md:w-[230px] w-[270px] sm:h-[620px] h-[300px] bg-[#f4f4f4]  rounded-xl overflow-auto">
            <p className="text-start p-2 pl-10 font-bold text-[#706464] text-lg">
              Post category
            </p>
            <div className="flex flex-col items-center justify-center">
              <div className="space-y-3">
                {data[categorizedIndex]?.OPCCategory?.map((item, index) => {
                  // console.log(item);
                  return (
                    <div
                      key={index}
                      className="bg-white 2xl:w-[240px] xl:w-[240px] lg:w-[240px] md:w-[190px] w-[200px] rounded-md h-12 p-3 pl-3 flex justify-between"
                    >
                      <p className="text-[#706464]">{item}</p>
                      <GrFormClose
                        size={20}
                        className="cursor-pointer"
                        onClick={() =>
                          deletePostCategory(data[categorizedIndex]?.POId, item)
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Postmodal
        open={openModal}
        onClose={() => setOpenModal(false)}
        postId={data[categorizedIndex]?.POId}
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

      <div className="flex justify-between items-center sm:-mt-80 -mt-[590px] p-3 text-white">
        <MdOutlineArrowBackIosNew
          // size={25}
          className="rounded-xl bg-[#8135F9] p-1 cursor-pointer text-xl sm:text-2xl"
          onClick={prevSlide}
        />
        <MdArrowForwardIos
          size={25}
          className="rounded-xl bg-[#8135F9] p-1 cursor-pointer text-xl sm:text-2xl"
          onClick={nextSlide}
        />
      </div>
    </div>
  );
};
