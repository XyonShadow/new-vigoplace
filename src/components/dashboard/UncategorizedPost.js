import React, { useState, useEffect, useRef } from "react";
import { Postmodal } from "./Postmodal";
import { MdOutlineArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import {
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowLeft,
} from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import {
  LazyLoadImage,
  LazyLoadComponent,
} from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { GrFormClose } from "react-icons/gr";
// import  HlsPlayer  from 'react-hls-player';
// import ReactPlayer from 'react-player';
import videojs from "video.js";
import "video.js/dist/video-js.css";
import Hls from "hls.js";

export const UncategorizedPost = ({ images, filteredImages }) => {
  const [openModal, setOpenModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [deletedIndex, setDeletedIndex] = useState(null);
  const [categorizedData, setCategorizedData] = useState([]);

  // const VideoPlayer = ({ media, type }) => {
  //   console.log('Video URL:', media);

  //   if (type === 'videos') {
  //     if (!media) {
  //       return <div>Video URL is undefined</div>;
  // }

  //     if (media.endsWith('.m3u8')) {
  //       // return (
  //     //     <div>
  //     //       <LazyLoadComponent>
  //     //         <HlsPlayer
  //     //           url={media}
  //     //           width="390px"
  //     //           height="382px"
  //     //           controls
  //     //         />
  //     //       </LazyLoadComponent>
  //     //     </div>
  //     //   );
  //     // } else {
  //       return (
  //         <div>
  //           <LazyLoadComponent>
  //             <ReactPlayer
  //             playing
  //               url={media}
  //               width="390px"
  //               height="382px"
  //               controls
  //             />
  //           </LazyLoadComponent>
  //         </div>
  //       );
  //     }
  //   } else {
  //     return (
  //       <div>
  //         <LazyLoadImage
  //           src={media}
  //           alt=""
  //           width={390}
  //           height={382}
  //           effect="blur"
  //         />
  //       </div>
  //     );
  //   }
  // };

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

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? data.data.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === data.data.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const prevSlide1 = () => {
    let newIndex = currentIndex - 1;

    while (newIndex !== currentIndex) {
      if (newIndex < 0) {
        newIndex = data.data.length - 1;
      }

      if (
        (filteredImages && hasMultipleImages(filteredImages[newIndex])) ||
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
      if (newIndex >= data.data.length) {
        newIndex = 0;
      }

      if (
        (filteredImages && hasMultipleImages(filteredImages[newIndex])) ||
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

  const isAtBeginning = currentIndex === 0;
  // Check if carousel is at the end (last image)
  const isAtEnd =
    (filteredImages && currentIndex === filteredImages.length - 1) ||
    (images && currentIndex === images.length - 1);

  return (
    <div>
      <div className="flex justify-evenly">
        <div className={`pl-4 Styles.fade-In`}>
          <div className=" pt-10">
            <div className="w-[390px] h-[382px] bg-[#f4f4f4] rounded-md">
              <div className="text-center text-base text-[#706464] capitalize font-bold">
                {filteredImages && filteredImages.length > 0 ? (
                  <div key={filteredImages[currentIndex].POId}>
                    {filteredImages[currentIndex]?.PMMedia[0]?.type ===
                    "video" ? (
                      <HLSVideoPlayer
                        videoUrl={filteredImages[currentIndex].PMMedia[0].media}
                        width={390}
                        height={382}
                        posterUrl={filteredImages[currentIndex].posterImage}
                      />
                    ) : (
                      <LazyLoadImage
                        src={filteredImages[currentIndex].PMMedia[0].media}
                        alt=""
                        className="w-[390px] h-[382px]"
                        effect="blur"
                      />
                    )}
                  </div>
                ) : images && images.length > 0 ? (
                  // Display images if filteredImages is empty
                  <div key={images[currentIndex].POId}>
                    {images[currentIndex].PMMedia[0].type === "video" ? (
                      <HLSVideoPlayer
                        videoUrl={filteredImages[currentIndex].PMMedia[0].media}
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
              <h2 className="text-[#706464] pt-7 text-start text-base">
                Post Type: {data.data[currentIndex].postType}
              </h2>
            </div>
          </div>
          <div>
            <h2 className="text-[#706464] pt-7 text-start text-xl pb-3">
              Description
            </h2>
            <div className={`${data.data[currentIndex]}`}>
              <div className="w-[390px] h-[120px] bg-[#f4f4f4] rounded-md overflow-auto">
                <div className="text-center text-sm text-[#706464] mt-2 p-3">
                  <p>{data.data[currentIndex].description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-10">
          <div className="w-[290px] h-[620px] bg-[#f4f4f4]  rounded-xl overflow-auto">
            <p className="text-start p-2 pl-10 font-bold text-[#706464] text-lg">
              Post category
            </p>
            <div className="flex flex-col items-center justify-center">
              <div className="space-y-3 py-3 rounded-xl flex flex-col items-center">
                {categorizedData.map((item, index) => (
                  <div key={index} className="flex flex-col space-y-3">
                    {item.OPCCategory.map((category, catIndex) => (
                      <div
                        key={catIndex}
                        className="bg-white w-[220px] rounded-md h-12 p-3 pl-3 flex justify-between"
                      >
                        <p className="text-[#706464]">{category}</p>
                        <GrFormClose
                          size={20}
                          className="cursor-pointer"
                          onClick={() => categoryDelete(item.OPCPostId)}
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Postmodal
        open={openModal}
        onClose={() => setOpenModal(false)}
        postId={data.data[currentIndex].POId}
        onDelete={handleDelete}
      />
      <div className="relative  text-white">
        <div>
          <MdOutlineKeyboardArrowLeft
            size={18}
            className={`rounded-xl bg-[#8135F9] p-1 cursor-pointer absolute -top-[420px] left-3 ${
              (!hasMultipleImages(filteredImages[currentIndex]) &&
                !hasMultipleImages(images[currentIndex])) ||
              isAtBeginning
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={
              (!hasMultipleImages(filteredImages[currentIndex]) &&
                !hasMultipleImages(images[currentIndex])) ||
              isAtBeginning
                ? null
                : prevSlide1
            }
            disabled={
              (!hasMultipleImages(filteredImages[currentIndex]) &&
                !hasMultipleImages(images[currentIndex])) ||
              isAtBeginning
            }
          />
        </div>

        <div>
          <MdOutlineKeyboardArrowRight
            size={18}
            className={`rounded-xl bg-[#8135F9] p-1 cursor-pointer absolute -top-[420px] right-[320px] ${
              (!hasMultipleImages(filteredImages[currentIndex]) &&
                !hasMultipleImages(images[currentIndex])) ||
              isAtEnd
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={
              (!hasMultipleImages(filteredImages[currentIndex]) &&
                !hasMultipleImages(images[currentIndex])) ||
              isAtEnd
                ? null
                : nextSlide1
            }
            disabled={
              (!hasMultipleImages(filteredImages[currentIndex]) &&
                !hasMultipleImages(images[currentIndex])) ||
              isAtEnd
            }
          />
        </div>
      </div>
      <div className="flex justify-between items-center -mt-80 p-3 text-white">
        <div>
          <MdOutlineArrowBackIosNew
            size={25}
            className="rounded-xl bg-[#8135F9] p-1 cursor-pointer"
            onClick={prevSlide}
          />
        </div>
        <div>
          <MdArrowForwardIos
            size={25}
            className="rounded-xl bg-[#8135F9] p-1 cursor-pointer"
            onClick={nextSlide}
          />
        </div>
      </div>
    </div>
  );
};
