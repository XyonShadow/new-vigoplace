import { useEffect, useState } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

export default function CarouselMini({
  children: slides,
  autoSlide = false,
  autoSlideInterval = 3000,
}) {
  const [curr, setCurr] = useState(0);

  const prev = () =>
    setCurr((curr) => (curr === 0 ? slides.length - 1 : curr - 1));

  const next = () =>
    setCurr((curr) => (curr === slides.length - 1 ? 0 : curr + 1));

  useEffect(() => {
    if (!autoSlide) return;
    const slideInterval = setInterval(next, autoSlideInterval);
    return () => clearInterval(slideInterval);
  });

  return (
    <div className="relative overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${curr * 100}%)` }}
      >
        {slides}
      </div>
      <div
        className={`${
          slides.length > 1 ? "flex" : "hidden"
        } absolute inset-0 h-[80%] items-center justify-between p-4`}
      >
        <button
          title="arrow"
          onClick={prev}
          className="p-1 text-white rounded-full shadow bg-black/50 hover:bg-black"
        >
          <BiChevronLeft size={40} />
        </button>
        <button
          onClick={next}
          title="arrow"
          className="p-1 text-white rounded-full shadow bg-black/50 hover:bg-black"
        >
          <BiChevronRight size={40} />
        </button>
      </div>
      <div
        className={`${
          slides.length > 1 ? "block" : "hidden"
        } absolute left-0 right-0 bottom-4`}
      >
        <div className="flex items-center justify-center gap-2">
          {slides?.map((_, i) => (
            <div
              key={_}
              className={`transition-all w-2 h-2 rounded-full ${
                curr === i ? "px-3 bg-[#9657FA]" : "bg-[#C4BFBF]"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
