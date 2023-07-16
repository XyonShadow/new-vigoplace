import React, { useState } from "react";
import { MdOutlineArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Postmodal } from "./Postmodal";
import { GrFormClose } from "react-icons/gr";
import {
  LazyLoadImage,
  LazyLoadComponent,
} from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

export const CategorizedPost = () => {
  const [openModal, setOpenModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [deletedIndex, setDeletedIndex] = useState(null);

  const API_BASE_URL = "https://vigoplace.com/server/";

const deletePost = async (OPCPostId) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/categorization/${OPCPostId}`, {
    method: 'DELETE',
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error); 
  }
  return data;
};

const { mutate } = useMutation(deletePost);

const categoryDelete = async (OPCPostId) => {
  try {
    // Mutate the data (perform the actual deletion)
    await mutate(OPCPostId);

    // Manually invalidate the "categorizedData" query to trigger a refetch
    const queryClient = useQueryClient();
    queryClient.invalidateQueries("categorizedData");
  } catch (error) {
    console.error('Error deleting post:', error);
  }
};

  



  const fetchCategory = async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/categorized`);
    const data = await response.json();
    return data;
  };

  const {
    data: categorizedItem,
    isFetching,
    isError,
  } = useQuery(["categorizedPost"], fetchCategory);

  if (isFetching) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  const handleDelete = () => {
    setDeletedIndex(currentIndex);
    setOpenModal(false);
  };

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? categorizedItem?.data.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === categorizedItem?.data.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  
  return (
    <div>
      <div className="flex justify-evenly">
        <div className={`pl-5 Styles.fade-In`}>
          <div className=" pt-14">
            <div className="w-[370px] h-[370px] bg-[#f4f4f4] rounded-md">
              <div className="text-center text-base text-[#706464] capitalize font-bold">
                {categorizedItem?.data && (
                  <div key={categorizedItem?.data[currentIndex].PMPOId}>
                    {categorizedItem?.data[currentIndex].PMType === "video" ? (
                      <LazyLoadComponent>
                        <video
                          src={data.data[currentIndex].PMMedia}
                          className="w-[370px] h-[370px]"
                          controls
                        />
                      </LazyLoadComponent>
                    ) : (
                      <LazyLoadImage
                        src={categorizedItem?.data[currentIndex].PMMedia}
                        alt=""
                        className="w-[370px] h-[370px]"
                        effect="blur"
                      />
                    )}
                  </div>
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
                Post Type: {categorizedItem?.data[currentIndex].postType}
              </h2>
            </div>
          </div>
          <div>
            <h2 className="text-[#706464] pt-7 text-start text-xl pb-3">
              Description
            </h2>
            <div className={`${categorizedItem?.data[currentIndex]}`}>
              <div className="w-[370px] h-[120px] bg-[#f4f4f4] rounded-md overflow-auto">
                <div className="text-center text-sm text-[#706464] mt-4 p-3">
                  {categorizedItem?.data && (
                    <div key={categorizedItem?.data[currentIndex].PMPOId}>
                      {categorizedItem?.data.length > 0
                        ? categorizedItem?.data[currentIndex].description
                        : ""}
                    </div>
                  )}
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
                {categorizedItem?.data.map((item, index) => (
                  <div
                    className="bg-white w-[220px] rounded-md h-12 p-3 pl-3 flex justify-between"
                    key={index}
                  >
                    <p className="text-[#706464]">{item.OPCCategory}</p>
                    <GrFormClose className="cursor-pointer" onClick={() => categoryDelete(item.OPCPostId)} />
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
        postId={categorizedItem?.data[currentIndex].POId}
        onDelete={handleDelete}
      />

      <div className="relative  text-white">
        <div>
          <MdOutlineArrowBackIosNew
            size={18}
            className="rounded-xl bg-[#8135F9] p-1 cursor-pointer absolute -top-[420px] left-3"
            onClick={prevSlide}
          />
        </div>
        <div>
          <MdArrowForwardIos
            size={18}
            className="rounded-xl bg-[#8135F9] p-1 cursor-pointer absolute -top-[420px] right-[325px]"
            onClick={nextSlide}
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
