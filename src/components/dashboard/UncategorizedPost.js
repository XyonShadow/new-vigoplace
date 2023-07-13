import React, {useState} from 'react';
import { Postmodal } from './Postmodal';
import { MdOutlineArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";



export const UncategorizedPost = () => {
    const [openModal, setOpenModal] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
  const [deletedIndex, setDeletedIndex] = useState(null);

  const API_BASE_URL = "https://vigoplace.com/server/";

  const fetchData = async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/uncategorized`);
    const data = await response.json();
    return data;
  };

  const { data, isLoading, error } = useQuery(["uncategorizedData"], fetchData);


  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
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
  return (
    <div><div className="flex justify-evenly">
    <div className={`pl-12 Styles.fade-In`}>
      <div className=" pt-14">
        <div className="w-[290px] h-[280px] bg-[#f4f4f4] rounded-md">
          <div className="text-center text-base text-[#706464] capitalize font-bold">
            {data && data.data && (
              <div key={data.data[currentIndex].POId}>
                {data.data[currentIndex].PMMedia.includes(
                  ".mp4"
                ) ? (
                  <video
                    src={data.data[currentIndex].PMMedia}
                    controls
                    className="w-[290px] h-[280px]"
                  />
                ) : (
                  <img
                    src={data.data[currentIndex].PMMedia}
                    alt=""
                    className="w-[290px] h-[280px]"
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
          <h2 className='text-[#706464] pt-7 text-start text-base'>Post Type: {data.data[currentIndex].postType}</h2>
        </div>
      </div>
      <div>
        <h2 className="text-[#706464] pt-7 text-start text-xl pb-3">
          Description
        </h2>
        <div className={`${data.data[currentIndex]}`}>
          <div className="w-[300px] h-[200px] bg-[#f4f4f4] rounded-md overflow-auto">
            <div className="text-center text-sm text-[#706464] mt-4 p-3">
              {data && data.data && (
                <div key={data.data[currentIndex].POId}>
                  {data.data.length > 0
                    ? data.data[currentIndex].description
                    : ""}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="flex justify-center pt-10">
      <div className="w-[290px] h-[620px] bg-[#f4f4f4]  rounded-xl">
        <p className="text-start p-2 pl-10 font-bold text-[#706464] text-lg">
          Post category
        </p>
        <div className="flex flex-col items-center justify-center">
          <div className="bg-white w-[250px] h-[550px] rounded-md"></div>
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
              </div></div>
  )
}
