import React, { useState } from "react";

export function Postcategorization1() {
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [content, setContent] = useState("Initial content");
  const [tab, setTab] = useState(0);

  const handleContentChange = () => {
    if (content === "Initial content") {
      setContent("New content");
    } else {
      setContent("Initial content");
    }
  };

  const handleTabChange = (newTab) => {
    setTab(newTab);
  };

  return (
    <section className="flex justify-center pt-14">
      <div className="pt-2 w-[700px] h-[850px] bg-white rounded-l-3xl">
        <div className="p-5 pl-10 border-b-2 border-[#f4f4f4]">
          <input
            type="text"
            placeholder="Post id:"
            className="pl-3 focus:outline-blue-400 w-[350px] h-[40px] rounded-md bg-[#F4F4F4]"
          />
        </div>

        <article className="mt-5">
          <div className="border-b-2 font-bold border-[#f4f4f4] flex space-x-56 pl-14">
            <div className="">
              <h2
                className={`border-b-2 ${
                  tab === 0 ? "border-blue-500 transition-all duration-300" : ""
                } pb-2 cursor-pointer text-lg`}
                onClick={() => handleTabChange(0)}
              >
                Uncategorized Post
              </h2>
            </div>
            <div>
              <h2
                className={`cursor-pointer text-lg ${
                  tab === 1
                    ? "border-b-2 border-blue-500 pb-2 transition-all duration-300"
                    : ""
                }`}
                onClick={() => handleTabChange(1)}
              >
                Categorized Post
              </h2>
            </div>
          </div>
          {tab === 0 && (
            <div className="flex flex-col justify-center items-center">
              <div className=" pt-14">
                <div className="w-[450px] h-[300px] bg-[#f4f4f4]"></div>
              </div>
              <div>
                <h2 className="text-[#706464] pt-14 text-start text-2xl pb-5">
                  Description
                </h2>
                <div className="">
                <div className="w-[450px] h-[150px] bg-[#f4f4f4]">
                  <p className="text-sm p-5">
                    Lorem ipsum dolor sit amet consectetur. Maecenas mattis
                    tortor nunc et massa. Nunc elementum quam id nulla dignissim
                    pellentesque. Lorem ipsum dolor sit amet consectetur.
                    Maecenas mattis tortor nunc et massa. Nunc elementum quam id
                    nulla dignissim pellentesque.{" "}
                  </p>
                </div>
                </div>
              </div>
            </div>
          )}

          {tab === 1 && 
          <div className="flex justify-center pt-10">
            <div className="w-[420px] h-[620px] bg-[#f4f4f4]  rounded-xl">  
                <p className="text-start p-2 pl-10 font-bold text-[#706464] text-lg">Post category</p>
              <div className="flex flex-col items-center justify-center">
              <div className="bg-white w-[350px] h-[550px] rounded-md"></div>
            </div>
            </div>
            </div>}
        </article>
      </div>
      <div className="w-[380px] h-[850px] bg-[#DFDCDC]">
        <div className="pl-12 pt-20">
          <input type="text" className="w-[290px] h-[40px] pl-5 rounded-md focus:outline-blue-500" placeholder="Search category..."/>
        </div>
      </div>
    </section>
  );
}
