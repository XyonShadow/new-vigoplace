import React, {useState} from 'react'
import { MdOutlineArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";


export const CategorizedPost = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const contentData = [
        { id: 1, title: "category 1" },
        { id: 2, title: "category 2" },
        { id: 3, title: "category 3" },
        { id: 4, title: "category 4" },
        { id: 5, title: "category 5" },
        { id: 6, title: "category 6" },
        { id: 7, title: "category 7" },
        { id: 8, title: "category 8" },
      ];
    

      const prevSlide1 = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? contentData.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
      };
    
      const nextSlide1 = () => {
        const isLastSlide = currentIndex === contentData.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
      };

  return (
    <div><div className="flex justify-center pt-10">
    <div className="w-[420px] h-[620px] bg-[#f4f4f4]  rounded-xl">
      <p className="text-start p-2 pl-10 font-bold text-[#706464] text-lg">
        Post category
      </p>
      <div className="flex flex-col items-center justify-center">
        <div className="bg-white w-[350px] h-[550px] rounded-md">
          <p className="text-center text-2xl pt-60 capitalize">
            {contentData[currentIndex].title}
          </p>
        </div>
      </div>
    </div>
  </div>
  <div className="flex justify-between p-7 -mt-80 text-white">
    <div>
      <MdOutlineArrowBackIosNew
        size={25}
        className="rounded-xl bg-blue-500 p-1 cursor-pointer "
        onClick={prevSlide1}
      />
    </div>
    <div>
      <MdArrowForwardIos
        size={25}
        className="rounded-xl bg-blue-500 p-1 cursor-pointer "
        onClick={nextSlide1}
      />
    </div>
  </div></div>
  )
}
