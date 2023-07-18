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
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const CategorizedPost = () => {
  const [openModal, setOpenModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [categorizedData, setCategorizedData] = useState([]);

  const API_BASE_URL = "https://vigoplace.com/server/";

  const deletePost = async (postId) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/categorization/${postId}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error);
    }
    return data;
  };

  const queryClient = useQueryClient();

  const mutation = useMutation(deletePost, {
    onSuccess: (data, postId) => {
      queryClient.invalidateQueries("categorizedPost");
      setCategorizedData((prevData) =>
        prevData.filter((post) => post.id !== postId)
      );
      toast.success('Successfully deleted the category!');
    },
  });

  const categoryDelete = async (postId) => {
    try {
      await mutation.mutateAsync(postId);
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error('Error deleting the category!');
    }
  };

  const fetchCategory = async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/categorized`);
    const data = await response.json();
    return data;
  };

  const { data: categorizedItem, isLoading, isError } = useQuery(
    ["categorizedPost"],
    fetchCategory,
    {
      onSuccess: (data) => {
        setCategorizedData(data?.data || []);
      },
    }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  const handleDelete = () => {
    setOpenModal(false);
    const postId = categorizedData[currentIndex]?.OPCPostId;
    categoryDelete(postId);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + categorizedData?.length) % categorizedData?.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % categorizedData?.length);
  };

  return (
    <div>
      <div className="flex justify-evenly">
        <div className={`pl-5 Styles.fade-In`}>
          <div className="pt-14">
            <div className="w-[370px] h-[370px] bg-[#f4f4f4] rounded-md">
              <div className="text-center text-base text-[#706464] capitalize font-bold">
                {categorizedData?.[currentIndex]?.PMMedia[0]?.type === "video" ? (
                  <LazyLoadComponent>
                    <video
                      src={categorizedData[currentIndex]?.PMMedia[0]?.media}
                      className="w-[370px] h-[370px]"
                      controls
                    />
                  </LazyLoadComponent>
                ) : (
                  <LazyLoadImage
                    src={categorizedData[currentIndex]?.PMMedia[0]?.media}
                    alt=""
                    className="w-[370px] h-[370px]"
                    effect="blur"
                  />
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
                <div className="text-center text-sm text-[#706464] mt-4 p-3">
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
                {categorizedData.map((item, index) => (
                  <div
                    className="bg-white w-[220px] rounded-md h-12 p-3 pl-3 flex justify-between"
                    key={index}
                  >
                    <p className="text-[#706464]">{item.OPCCategory}</p>
                    <GrFormClose size={20} className="cursor-pointer" onClick={() => categoryDelete(item.OPCPostId)} />
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
        postId={categorizedData[currentIndex]?.POId}
        onDelete={handleDelete}
      />

      <div className="relative text-white">
        <MdOutlineArrowBackIosNew
          size={18}
          className="rounded-xl bg-[#8135F9] p-1 cursor-pointer absolute -top-[420px] left-3"
          onClick={prevSlide}
        />
        <MdArrowForwardIos
          size={18}
          className="rounded-xl bg-[#8135F9] p-1 cursor-pointer absolute -top-[420px] right-[325px]"
          onClick={nextSlide}
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
