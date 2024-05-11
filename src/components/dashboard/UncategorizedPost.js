import React, { useState, useEffect, useRef } from "react";
import { Postmodal } from "./Postmodal";
import { MdOutlineArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import "react-lazy-load-image-component/src/effects/blur.css";
import { GrFormClose } from "react-icons/gr";
import "video.js/dist/video-js.css";
import "react-toastify/dist/ReactToastify.css";
import ReactPlayer from "react-player";
import CarouselMini from "./Carousel";
import Image from "next/image";

export const UncategorizedPost = ({
  currentPostId,
  updateCurrentPost,
  setSelectedCategories,
  categorizedPost,
  fetchUnCategorizedData,
  images,
  filteredResults,
  selectedCategories,
  handleCategorySelection,
  currentIndex,
  setCurrentIndex,
  handlePostClick,
  filteredPost,
  setFilteredPost,
  currentPage2,
  originalIndex2,
  setOriginalIndex2,
  postFetched2,
  setPostFetched2,
  setUncategorizedData,
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

  const handleDelete = () => {
    setOpenModal(false);
  };

  const prevSlide = () => {
    setFilteredPost([]);
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images?.length) % images?.length
    );
    const newPostId = images[newIndex]?.POId;
    updateCurrentPost(newPostId);
  };

  const nextSlide = async () => {
    setFilteredPost([]);
    // //console.log(currentIndex)
    // const isLastSlide = currentIndex === images.length - 1;

    // const newIndex = isLastSlide ? 0 : currentIndex + 1;
    // // const currentImage = data.data[currentIndex];
    // // const category = currentImage.category;
    // if (selectedCategories[currentPostId]?.length > 0) {
    //   const data = await selectedCategories[currentPostId]?.map(
    //     (category) => category.OCName
    //   );

    //   await handlePostClick(data);
    // } else {
    //   setCurrentIndex((prevIndex) => (prevIndex + 1) % images?.length);
    //   const newPostId = images[newIndex]?.POId;
    //   updateCurrentPost(newPostId);
    // }

    // Check if a post was fetched
    if (postFetched2) {
      setOriginalIndex2(0);
      setPostFetched2(false);
      // Remove foundPost from uncategorizedData
      setUncategorizedData((prev) =>
        prev.filter((post) => post.POId !== currentPostId.POId)
      );
      if (selectedCategories[currentPostId]?.length > 0) {
        const data = await selectedCategories[currentPostId]?.map(
          (category) => category.OCName
        );

        await handlePostClick(data);
      }
    } else {
      if (images?.[currentIndex]?.POId === images[images.length - 11]?.POId) {
        currentPage2.current += 1;
        fetchUnCategorizedData();
      }
    }
    // Increment the index and ensure it wraps around correctly
    const newIndex = currentIndex >= images.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    setOriginalIndex2(newIndex);
    const newPostId = images[newIndex]?.POId;
    updateCurrentPost(newPostId);

    if (selectedCategories[currentPostId]?.length > 0) {
      const data = await selectedCategories[currentPostId]?.map(
        (category) => category.OCName
      );

      await handlePostClick(data);
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
                      <CarouselMini autoSlide={false} autoSlideInterval={3000}>
                        {filteredPost[0]?.PMMedia?.map((media) => {
                          if (media.type === "video") {
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
                          } else {
                            return (
                              <Image
                                width={400}
                                height={400}
                                src={media.media}
                                key={media.media}
                                alt=""
                                priority
                                className={`${
                                  filteredPost[0]?.PMMedia?.length === 1
                                    ? "max-h-[35vh]"
                                    : ""
                                } w-full h-auto rounded-xl`}
                              />
                            );
                          }
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
                                className={`${
                                  images[currentIndex]?.PMMedia.length === 1
                                    ? "max-h-[35vh]"
                                    : ""
                                } w-full h-auto rounded-xl`}
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
                <span className=" font-semibold">Post Type:</span>{" "}
                {filteredPost.length
                  ? filteredPost[0].postType
                  : images[currentIndex]?.postType}
              </h2>
              <h2 className="">
                <span className=" font-semibold">Post Id:</span>{" "}
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
