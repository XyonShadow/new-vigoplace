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
import videojs from "video.js";
import "video.js/dist/video-js.css";
import Hls from "hls.js";




export const CategorizedPost = ({ images, categoryResults }) => {
  const [openModal, setOpenModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [categorizedData, setCategorizedData] = useState([]);



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

      if (Hls.isSupported()) {
        hls.loadSource(videoUrl);
        hls.attachMedia(videoElement);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoElement.play();
        });
      } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
        videoElement.src = videoUrl;
        videoElement.addEventListener("loadedmetadata", () => {
          videoElement.play();
        });
      }

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



  const API_BASE_URL = "https://vigoplace.com/server/";
  if (categoryResults.length > 1) {
    console.log(categoryResults);
  }

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
      const response = await mutation.mutateAsync(postId);
      console.log("Delete Response:", response);
      toast.success("Successfully deleted the category!");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Error deleting the category!");
    }
  };
  

  const isAtBeginning = currentIndex === 0;
  // Check if carousel is at the end (last image)
  const isAtEnd =
    (categoryResults && currentIndex === categoryResults.length - 1) ||
    (images && currentIndex === images.length - 1);

  // const categoryDelete = async (postId) => {
  //   try {
  //     console.log("Calling categoryDelete with postId:", postId);
  //     await mutation.mutateAsync(postId);
  //   } catch (error) {
  //     console.error("Error deleting post:", error);
  //     toast.error("Error deleting the category!");
  //   }
  // };

  const fetchCategory = async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/categorized`);
    const data = await response.json();
    return data;
  };

  const {
    data: categorizedItem,
    isLoading,
    isError,
  } = useQuery(["categorizedPost"], fetchCategory, {
    onSuccess: (data) => {
      setCategorizedData(data?.data || []);
      queryClient.invalidateQueries("categorizedPost");
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: </div>;
  }

  const handleDelete = () => {
    setOpenModal(false);
    if (
      categorizedData &&
      categorizedData.length > 0 &&
      categoryResults &&
      categoryResults.length > 0
    ) {
      const postId = categoryResults[currentIndex]?.POId;
      if (postId !== undefined) {
        categoryDelete(postId);
      } else {
        console.error("postId is undefined.");
      }
    } else {
      console.error("categorizedData or categoryResults is empty or null.");
    }
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + categorizedData?.length) % categorizedData?.length
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % categorizedData?.length);
  };

  const prevSlide1 = () => {
    let newIndex = currentIndex - 1;

    while (newIndex !== currentIndex) {
      if (newIndex < 0) {
        newIndex = categorizedData.length - 1;
      }

      if (
        (categoryResults && hasMultipleImages(categoryResults[newIndex])) ||
        (images && hasMultipleImages(images[newIndex]))
      ) {
        setCurrentIndex(newIndex);
        break;
      }

      newIndex = newIndex - 1;
    }
  };

  const nextSlide1 = () => {
    let newIndex = currentIndex + 1;

    while (newIndex !== currentIndex) {
      if (newIndex >= categorizedData.length) {
        newIndex = 0;
      }

      if (
        (categoryResults && hasMultipleImages(categoryResults[newIndex])) ||
        (images && hasMultipleImages(images[newIndex]))
      ) {
        setCurrentIndex(newIndex);
        break;
      }

      newIndex = newIndex + 1;
    }
  };

  const hasMultipleImages = (post) => {
    return post?.PMMedia?.length > 1;
  };

  return (
    //
    <div>
      <div className="flex justify-evenly">
        <div className={`pl-5 Styles.fade-In`}>
          <div className="pt-14">
            <div className="w-[370px] h-[370px] bg-[#f4f4f4] rounded-md">
              <div className="text-center text-base text-[#706464] capitalize font-bold">
                {categoryResults && categoryResults.length > 0 ? (
                  <div key={categoryResults[currentIndex].POId}>
                    {categoryResults[currentIndex]?.PMMedia[0]?.type ===
                    "video" ? (
                      <HLSVideoPlayer
                        videoUrl={categoryResults[currentIndex].PMMedia[0].media}
                        width={390}
                        height={382}
                        posterUrl={categoryResults[currentIndex].posterImage}
                      />
                    ) : (
                      <LazyLoadImage
                        src={categoryResults[currentIndex].PMMedia[0].media}
                        alt=""
                        className="w-[390px] h-[382px]"
                        effect="blur"
                      />
                    )}
                  </div>
                ) : images && images.length > 0 ? (
                  // Display images if categoryResults is empty
                  <div key={images[currentIndex].POId}>
                    {images[currentIndex].PMMedia[0].type === "video" ? (
                      <HLSVideoPlayer
                        videoUrl={categoryResults[currentIndex].PMMedia[0].media}
                        posterUrl={images[currentIndex].posterImage}
                        width={390}
                        height={382}
                      />
                    ) : (
                      <LazyLoadImage
                        src={images[currentIndex].PMMedia[0].media}
                        alt=""
                        className="w-[390px] h-[382px]"
                        effect="blur"
                      />
                    )}
                  </div>
                ) : (
                  // Handle the case when images or categoryResults are not available
                  <div>Not Found</div>
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
              <h2 className="text-[#706464] pt-7 text-start text-base">
                Post Type: {categorizedData[currentIndex]?.postType}
              </h2>
            </div>
          </div>
          <div>
            <h2 className="text-[#706464] pt-7 text-start text-xl pb-3">
              Description
            </h2>
            <div>
              <div className="w-[370px] h-[120px] bg-[#f4f4f4] rounded-md overflow-auto">
                <div className="text-center text-sm text-[#706464] mt-2 p-3">
                  {categorizedData[currentIndex]?.description}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-10">
          <div className="w-[290px] h-[620px] bg-[#f4f4f4] rounded-xl overflow-auto pb-2">
            <p className="text-start p-2 pl-10 font-bold text-[#706464] text-lg">
              Post category
            </p>
            <div className="flex flex-col items-center justify-center">
              <div className="space-y-3">
                {categorizedData[currentIndex]?.OPCCategory?.map(
                  (item, index) => {
                    console.log(item);
                    return (
                      <div
                        key={index}
                        className="bg-white w-[220px] rounded-md h-12 p-3 pl-3 flex justify-between"
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
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Postmodal
        open={openModal}
        onClose={() => setOpenModal(false)}
        postId={categoryResults[currentIndex]?.POId}
        onDelete={handleDelete}
      />

      <div className="relative text-white">
        <MdOutlineKeyboardArrowLeft
          size={18}
          className={`rounded-xl bg-[#8135F9] p-1 cursor-pointer absolute -top-[420px] left-3 ${
            (!hasMultipleImages(categoryResults[currentIndex]) &&
              !hasMultipleImages(images[currentIndex])) ||
            isAtBeginning
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          onClick={
            (!hasMultipleImages(categoryResults[currentIndex]) &&
              !hasMultipleImages(images[currentIndex])) ||
            isAtBeginning
              ? null
              : prevSlide1
          }
          disabled={
            (!hasMultipleImages(categoryResults[currentIndex]) &&
              !hasMultipleImages(images[currentIndex])) ||
            isAtBeginning
          }
        />

        <MdOutlineKeyboardArrowRight
          size={18}
          className={`rounded-xl bg-[#8135F9] p-1 cursor-pointer absolute -top-[420px] right-[320px] ${
            (!hasMultipleImages(categoryResults[currentIndex]) &&
              !hasMultipleImages(images[currentIndex])) ||
            isAtEnd
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          onClick={
            (!hasMultipleImages(categoryResults[currentIndex]) &&
              !hasMultipleImages(images[currentIndex])) ||
            isAtEnd
              ? null
              : nextSlide1
          }
          disabled={
            (!hasMultipleImages(categoryResults[currentIndex]) &&
              !hasMultipleImages(images[currentIndex])) ||
            isAtEnd
          }
        />
      </div>

      <div className="flex justify-between items-center -mt-80 p-3 text-white">
        <MdOutlineArrowBackIosNew
          size={25}
          className="rounded-xl bg-[#8135F9] p-1 cursor-pointer"
          onClick={prevSlide}
        />
        <MdArrowForwardIos
          size={25}
          className="rounded-xl bg-[#8135F9] p-1 cursor-pointer"
          onClick={nextSlide}
        />
      </div>
    </div>
  );
};
