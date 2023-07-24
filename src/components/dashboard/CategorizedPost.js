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

export const CategorizedPost = ({
  images,
  categoryResults,
  handleCategorizePost,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [categorizedData, setCategorizedData] = useState([]);

  // const HLSVideoPlayer = ({ videoUrl, posterUrl, width, height }) => {
  //   const videoRef = useRef(null);
  //   const playerRef = useRef(null);

  //   useEffect(() => {
  //     const videoElement = videoRef.current;

  //     if (!videoElement) return;
  //     const playerOptions = {
  //       sources: [{ src: videoUrl, type: "application/x-mpegURL" }],
  //       controls: true,
  //       autoplay: true,
  //       preload: "auto",
  //       poster: posterUrl,
  //       width: width,
  //       height: height,
  //     };

  //     const hls = new Hls();
  //     const player = videojs(videoElement, playerOptions);

  //     if (Hls.isSupported()) {
  //       hls.loadSource(videoUrl);
  //       hls.attachMedia(videoElement);
  //       hls.on(Hls.Events.MANIFEST_PARSED, () => {
  //         videoElement.play();
  //       });
  //     } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
  //       videoElement.src = videoUrl;
  //       videoElement.addEventListener("loadedmetadata", () => {
  //         videoElement.play();
  //       });
  //     }

  //     playerRef.current = player;

  //     return () => {
  //       if (hls) {
  //         hls.destroy();
  //       }
  //       if (player) {
  //         player.dispose();
  //       }
  //     };
  //   }, [videoUrl, posterUrl, width, height]);

  //   return (
  //     <div data-vjs-player>
  //       <video
  //         ref={videoRef}
  //         className="video-js vjs-big-play-centered"
  //         controls
  //         poster={posterUrl} // Add the poster image URL if you have one
  //       >
  //         <LazyLoadComponent>
  //           <source src={videoUrl} type="application/x-mpegURL" />
  //         </LazyLoadComponent>
  //         Your browser does not support the video tag.
  //       </video>
  //     </div>
  //   );
  // };

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

      // queryClient.invalidateQueries("categorizedPost");
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

  // const isAtBeginning = currentIndex === 0;
  // // Check if carousel is at the end (last image)
  // const isAtEnd =
  //   (categoryResults && currentIndex === categoryResults.length - 1) ||
  //   (images && currentIndex === images.length - 1);

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
    // console.log(data);
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

  return (
    //
    <div>
      <div className="sm:flex-row sm:justify-evenly flex-col flex justify-center items-center">
        <div className={`2xl:pl-7 xl:pl-7 lg:pl-7 md:pl-3 Styles.fade-In`}>
          <div className="pt-10">
            <div className="2xl:w-[390px] xl:w-[380px] lg:w-[360px] md:w-[255px] w-[270px] 2xl:h-[335px] h-[300px] xl:h-[335px] lg:h-[335px] md:h-[310px] bg-[#f4f4f4] rounded-md">
              <div className="text-center text-base text-[#706464] capitalize font-bold">
                {categoryResults && categoryResults.length > 0 ? (
                  <div key={categoryResults[currentIndex].POId}>
                    {categoryResults[currentIndex]?.PMMedia[0]?.type ===
                    "video" ? (
                      <ReactPlayer
                        url={categoryResults[currentIndex]?.PMMedia[0]?.media}
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
                        src={categoryResults[currentIndex].PMMedia[0].media}
                        alt=""
                        className="2xl:w-[390px] xl:w-[380px] lg:w-[360px] md:w-[255px] w-[250px] 2xl:h-[382px] xl:h-[335px] lg:h-[335px] h-[300px] md:h-[310px]"
                        effect="blur"
                      />
                    )}
                  </div>
                ) : images && images.length > 0 ? (
                  // Display images if categoryResults is empty
                  <div key={images[currentIndex].POId}>
                    {images[currentIndex]?.PMMedia[0].type === "video" ? (
                      <ReactPlayer
                        url={images[currentIndex]?.PMMedia[0]?.media}
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
                        src={images[currentIndex].PMMedia[0].media}
                        alt=""
                        className="2xl:w-[390px] xl:w-[380px] lg:w-[360px] md:w-[255px] w-[270px] h-[300px] 2xl:h-[382px] xl:h-[335px] lg:h-[335px] md:h-[310px]"
                        effect="blur"
                      />
                    )}
                  </div>
                ) : (
                  // Handle the case when images or categoryResults are not available
                  <div className="pt-80"></div>
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
                Post Type: {categorizedData[currentIndex]?.postType}
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
                  {categorizedData[currentIndex]?.description}
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
                {categorizedData[currentIndex]?.OPCCategory?.map(
                  (item, index) => {
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
                            categoryDelete(categorizedData[currentIndex]?.POId)
                          }
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
          className={`rounded-xl bg-[#8135F9] p-1 cursor-pointer absolute sm:-top-[430px] -top-[720px] left-3`}
          // onClick={ }
        />

        <MdOutlineKeyboardArrowRight
          size={18}
          className={`rounded-xl bg-[#8135F9] p-1 cursor-pointer absolute sm:-top-[430px] -top-[720px] lg:right-[300px] xl:right-[310px] 2xl:right[310px] md:right-[240px] right-[15px]`}
          // onClick={}
        />
      </div>

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
