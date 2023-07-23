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
import videojs from "video.js";
import "video.js/dist/video-js.css";
import Hls from "hls.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const UncategorizedPost = ({
  currentPostId,
  updateCurrentPost,
  images,
  filteredImages,
  selectedCategories,
  handleCategorySelection,
}) => {
  console.log(selectedCategories);
  const [openModal, setOpenModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [deletedIndex, setDeletedIndex] = useState(null);
  const [categorizedData, setCategorizedData] = useState([]);
  const [showIcon, setShowIcon] = useState(false);
  const [newIndex, setNewIndex] = useState(0);
  const [selectedCategoryIndexes, setSelectedCategoryIndexes] = useState({});
  const hasMedia = filteredImages[currentIndex]?.PMMedia.length > 0;
  const maxIndex = filteredImages[newIndex]?.PMMedia.length - 1;

  const HLSVideoPlayer = ({ videoUrl, posterUrl, width, height }) => {
    const videoRef = useRef(null);
    const playerRef = useRef(null);

    useEffect(() => {
      const videoElement = videoRef.current;

      if (!videoElement) return;
      const playerOptions = {
        sources: [{ src: videoUrl, type: "application/x-mpegURL" }],
        controls: true,
        autoplay: true,
        preload: "auto",
        poster: posterUrl,
        width: width,
        height: height,
      };

      const hls = new Hls();
      const player = videojs(videoElement, playerOptions);

      const HLSVideoPlayer = ({ videoUrl, posterUrl, width, height }) => {
        const videoRef = useRef(null);
        const playerRef = useRef(null);

        useEffect(() => {
          const videoElement = videoRef.current;

          if (!videoElement) return;

          const playerOptions = {
            sources: [{ src: videoUrl, type: "application/x-mpegURL" }],
            controls: true,
            autoplay: true,
            preload: "auto",
            poster: posterUrl,
            width: width,
            height: height,
          };

          console.log("videoUrl:", videoUrl); // Check videoUrl value

          const hls = new Hls();
          const player = videojs(videoElement, playerOptions);

          if (typeof videoUrl === "string" && videoUrl.trim() !== "") {
            if (Hls.isSupported()) {
              hls.loadSource(videoUrl);
              hls.attachMedia(videoElement);
              hls.on(Hls.Events.MANIFEST_PARSED, () => {
                videoElement.play();
              });
            } else if (
              videoElement.canPlayType("application/vnd.apple.mpegurl")
            ) {
              videoElement.src = videoUrl;
              videoElement.addEventListener("loadedmetadata", () => {
                videoElement.play();
              });
            }
          } else {
            // console.error("Invalid videoUrl:", videoUrl);
          }

          //       const currentPost = data?.data[currentIndex]?.PMMedia;
          // console.log(currentPost);

          playerRef.current = player;

          return () => {
            if (hls) {
              hls.destroy();
            }
            if (player) {
              player.dispose();
            }
          };
        }, [videoUrl, posterUrl, width, height]);

        return (
          <div data-vjs-player>
            <video
              ref={videoRef}
              className="video-js vjs-big-play-centered"
              controls
              poster={posterUrl} // Add the poster image URL if you have one
            >
              <LazyLoadComponent>
                <source src={videoUrl} type="application/x-mpegURL" />
              </LazyLoadComponent>
              Your browser does not support the video tag.
            </video>
          </div>
        );
      };

      playerRef.current = player;

      return () => {
        if (hls) {
          hls.destroy();
        }
        if (player) {
          player.dispose();
        }
      };
    }, [videoUrl, posterUrl, width, height]);

    return (
      <div data-vjs-player>
        <video
          ref={videoRef}
          className="video-js vjs-big-play-centered"
          controls
          poster={posterUrl} // Add the poster image URL if you have one
        >
          <LazyLoadComponent>
            <source src={videoUrl} type="application/x-mpegURL" />
          </LazyLoadComponent>
          Your browser does not support the video tag.
        </video>
      </div>
    );
  };

  const handleCategoryChange = (category) => {};

  useEffect(() => {
    // update the current image
    updateCurrentPost(images[currentIndex].POId);
  }, [currentIndex]);

  const API_BASE_URL = "https://vigoplace.com/server/";

  const fetchData = async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/uncategorized`);
    const data = await response.json();
    console.log(data);
    return data;
  };

  const { data, isLoading, error } = useQuery(["uncategorizedData"], fetchData);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const fetchCategory = async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/categorized`);
    const data = await response.json();
    return data;
  };

  const {
    data: categorizedItem,
    categorizedItemisLoading,
    categorizedItemisError,
  } = useQuery(["categorizedPost"], fetchCategory, {
    onSuccess: (data) => {
      setCategorizedData(data?.data || []);
    },
  });

  if (categorizedItemisLoading) {
    return <div>Loading...</div>;
  }

  if (categorizedItemisError) {
    return <div>Error: {categoryListError?.message?.message}</div>;
  }

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

  const categoryDelete = async (postId) => {
    try {
      console.log("Calling categoryDelete with postId:", postId);
      await mutation.mutateAsync(postId);
      setSelectedCategories((prevSelectedCategories) =>
        prevSelectedCategories.filter((category) => category.OCId !== postId)
      );
      setCategorizedData((prevData) =>
        prevData.map((post) =>
          post.POId === postId ? { ...post, OPCCategory: [] } : post
        )
      );
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Error deleting the category!");
    }
  };

  const prevSlide = () => {
    updateCurrentPost();
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? data.data.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === data.data.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    handleCategorySelection((prevSelectedCategories) => {
      const updatedCategories = { ...prevSelectedCategories };

      // If there are no selected categories for the new post, initialize an empty array
      if (!updatedCategories.hasOwnProperty(newIndex)) {
        updatedCategories[newIndex] = [];
      }

      return updatedCategories;
    });

    setSelectedCategoryIndexes((prevSelectedIndexes) => {
      const updatedIndexes = { ...prevSelectedIndexes };

      // Set the currentIndex as the selected index for the current post
      updatedIndexes[currentIndex] = newIndex;

      return updatedIndexes;
    });

    setCurrentIndex(newIndex);
  };

  // const prevSlide1 = () => {
  //   let newIndex = currentIndex - 1;

  //   while (newIndex !== currentIndex) {
  //     if (newIndex < 0) {
  //       newIndex = data.data.length - 1;
  //     }

  //     if (
  //       (filteredImages && hasMultipleImages(filteredImages[newIndex])) ||
  //       (images && hasMultipleImages(images[newIndex]))
  //     ) {
  //       setCurrentIndex(newIndex);
  //       break;
  //     }

  //     newIndex = newIndex - 1;
  //   }
  // };

  // const nextSlide1 = () => {
  //   let newIndex = currentIndex + 1;

  //   while (newIndex !== currentIndex) {
  //     if (newIndex >= data.data.length) {
  //       newIndex = 0;
  //     }

  //     if (
  //       (filteredImages && hasMultipleImages(filteredImages[newIndex])) ||
  //       (images && hasMultipleImages(images[newIndex]))
  //     ) {
  //       setCurrentIndex(newIndex);
  //       break;
  //     }

  //     newIndex = newIndex + 1;
  //   }
  // };

  const Carousel = () => {
    if (hasMedia) {
      setShowIcon(true);
    }
  };

  const leftSlide = () => {
    if (hasMedia && newIndex > 0) {
      setNewIndex((prevIndex) => prevIndex - 1);
    }
  };

  const rightSlide = () => {
    if (hasMedia && newIndex < maxIndex) {
      setNewIndex((prevIndex) => prevIndex + 1);
    }
  };

  // const hasMultipleImages = (post) => {
  //   return post?.PMMedia?.length > 1;
  // };

  // const isAtBeginning = currentIndex === 0;
  // // Check if carousel is at the end (last image)
  // const isAtEnd =
  //   (filteredImages && currentIndex === filteredImages.length - 1) ||
  //   (images && currentIndex === images.length - 1);

  return (
    <div>
      <div className="sm:flex-row sm:justify-evenly flex-col flex justify-center items-center">
        <div className={`2xl:pl-7 xl:pl-7 lg:pl-7 md:pl-3 Styles.fade-In`}>
          <div className=" pt-10">
            <div className="2xl:w-[390px] xl:w-[380px] lg:w-[360px] md:w-[255px] w-[270px] 2xl:h-[335px] h-[300px] xl:h-[335px] lg:h-[335px] md:h-[310px] bg-[#f4f4f4] rounded-md">
              <div className="text-center text-base text-[#706464] capitalize font-bold">
                {filteredImages && filteredImages.length > 0 ? (
                  <div key={filteredImages[currentIndex]?.POId}>
                    {filteredImages[newIndex]?.PMMedia.media((item, index) => {
                      <div key={index}>
                        {/* {filteredImages[newIndex]?.PMMedia.media.type === "video" ? } */}
                      </div>;
                    })}
                    {filteredImages[currentIndex]?.PMMedia[0]?.type ===
                    "video" ? (
                      <HLSVideoPlayer
                        videoUrl={
                          filteredImages[currentIndex]?.PMMedia[0]?.media
                        }
                        width={390}
                        height={382}
                        posterUrl={filteredImages[currentIndex].posterImage}
                      />
                    ) : (
                      <LazyLoadImage
                        src={filteredImages[currentIndex]?.PMMedia[0]?.media}
                        alt=""
                        className="2xl:w-[390px] xl:w-[380px] lg:w-[360px] md:w-[255px] w-[250px] 2xl:h-[382px] xl:h-[335px] lg:h-[335px] h-[300px] md:h-[310px]"
                        effect="blur"
                      />
                    )}
                  </div>
                ) : images && images.length > 0 ? (
                  // Display images if filteredImages is empty
                  <div key={images[currentIndex].POId}>
                    {images[currentIndex].PMMedia[0]?.type === "video" ? (
                      <HLSVideoPlayer
                        videoUrl={
                          filteredImages[currentIndex]?.PMMedia[0]?.media
                        }
                        posterUrl={images[currentIndex].posterImage}
                        width={390}
                        height={382}
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
                  // Handle the case when images or filteredImages are not available
                  <div>Not Found</div>
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
                Post Type: {data.data[currentIndex].postType}
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
                  <p>{data.data[currentIndex].description}</p>
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

            {selectedCategories[currentPostId]?.length > 0 && (
              <div className="flex flex-col items-center justify-center">
                <div className="space-y-3 py-3 rounded-xl flex flex-col items-center">
                  <div className="2xl:w-[240px] xl:w-[240px] lg:w-[240px] md:w-[190px] w-[200px] rounded-md">
                    <ul className="space-y-5">
                      {selectedCategories[currentPostId]?.map((category) => (
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
                      ))}
                    </ul>
                  </div>
                  {/* {categorizedData[currentIndex]?.OPCCategory?.map(
                  (item, index) => {
                    console.log(item);
                    return (
                      <div
                        key={index}
                        className="bg-white 2xl:w-[240px] xl:w-[240px] lg:w-[240px] md:w-[190px] w-[200px] rounded-md h-12 p-3 pl-3 flex justify-between"
                      >
                        <p className="text-[#706464]">{item}</p>
                        <GrFormClose
                          size={20}
                          className="cursor-pointer"
                          onClick={() =>  categoryDelete(categorizedData[currentIndex]?.POId)}
                        />
                      </div>
                    );
                  }
                )} */}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Postmodal
        open={openModal}
        onClose={() => setOpenModal(false)}
        postId={data.data[currentIndex].POId}
        onDelete={handleDelete}
      />
      {showIcon && (
        <div className="relative  text-white">
          <div>
            <MdOutlineKeyboardArrowLeft
              // size={18}
              className={`rounded-xl bg-[#8135F9] sm:text-sm text-[15px] p-1 cursor-pointer absolute sm:-top-[430px] -top-[720px] left-3`}
              onClick={leftSlide}
            />
          </div>

          <div>
            <MdOutlineKeyboardArrowRight
              // size={18}
              className={`rounded-xl bg-[#8135F9] sm:text-sm text-[15px] p-1 cursor-pointer absolute sm:-top-[430px] -top-[720px] lg:right-[300px] xl:right-[310px] 2xl:right[310px] md:right-[240px] right-[15px]`}
              onClick={rightSlide}
            />
          </div>
        </div>
      )}
      <div className="flex justify-between items-center sm:-mt-80 -mt-[570px] sm:p-3 p-1 text-white">
        <div>
          <MdOutlineArrowBackIosNew
            // size={25}
            className="rounded-xl bg-[#8135F9] p-1 cursor-pointer text-xl sm:text-2xl"
            onClick={prevSlide}
          />
        </div>
        <div>
          <MdArrowForwardIos
            // size={25}
            className="rounded-xl bg-[#8135F9] p-1 cursor-pointer text-xl sm:text-2xl"
            onClick={nextSlide}
          />
        </div>
      </div>
    </div>
  );
};
