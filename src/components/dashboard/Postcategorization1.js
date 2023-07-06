import React, { useState } from "react";
import {MdOutlineArrowBackIosNew, MdArrowForwardIos} from "react-icons/md";

// import "./Styles.module.css"; 


export function Postcategorization1() {
 
  const [tab, setTab] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);

  const handleTabChange = (newTab) => {
    setTab(newTab);
  };

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? unCategorizedData.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === unCategorizedData.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    const filtered = contentData.filter((item) =>
  item.title.toLowerCase().includes(value.toLowerCase())
);
setFilteredResults(filtered);
setSearchTerm(value);
console.log(filtered)
  };;

 const contentData = [
    { id: 1, title: 'category 1' },
    { id: 2, title: 'category 2' },
    { id: 3, title: 'category 3' },
    { id: 4, title: 'category 4' },
    { id: 5, title: 'category 5' },
    { id: 6, title: 'category 6' },
    { id: 7, title: 'category 7' },
    { id: 8, title: 'category 8' }
  ];
    
  
  const unCategorizedData = [
    { id: 1, text: 'Uncategorized Post 1', Description: "Lorem ipsum dolor sit amet consectetur. Maecenas mattis,tortor nunc et massa. Nunc elementum quam id nulla dignissim pellentesque. Lorem ipsum dolor sit amet consectetur.  Maecenas mattis tortor nunc et massa. Nunc elementum quam idnulla dignissim pellentesque"},
    { id: 2, text: 'Uncategorized Post 2', Description: "Maecenas mattis,tortor nunc et massa. Nunc elementum quam id nulla dignissim pellentesque. Lorem ipsum dolor sit amet consectetur.  Maecenas mattis tortor nunc et massa. Nunc elementum quam idnulla dignissim pellentesque. Lorem ipsum dolor sit amet consectetur. " },
    { id: 3, text: 'Uncategorized Post 3', Description: "Lorem ipsum dolor sit amet consectetur. Maecenas mattis,tortor nunc et massa. Nunc elementum quam id nulla dignissim pellentesque. Lorem ipsum dolor sit amet consectetur.  Maecenas mattis tortor nunc et massa. Nunc elementum quam idnulla dignissim pellentesque" },
    { id: 4, text: 'Uncategorized Post 4', Description: "Maecenas mattis,tortor nunc et massa. Nunc elementum quam id nulla dignissim pellentesque. Lorem ipsum dolor sit amet consectetur.  Maecenas mattis tortor nunc et massa. Nunc elementum quam idnulla dignissim pellentesque Lorem ipsum dolor sit amet consectetur." },
    { id: 5, text: 'Uncategorized Post 5', Description: "Lorem ipsum dolor sit amet consectetur. Maecenas mattis,tortor nunc et massa. Nunc elementum quam id nulla dignissim pellentesque. Lorem ipsum dolor sit amet consectetur.  Maecenas mattis tortor nunc et massa. Nunc elementum quam idnulla dignissim pellentesque" },
    { id: 6, text: 'Uncategorized Post 6', Description: "Maecenas mattis,tortor nunc et massa. Nunc elementum quam id nulla dignissim pellentesque. Lorem ipsum dolor sit amet consectetur.  Maecenas mattis tortor nunc et massa. Nunc elementum quam idnulla dignissim pellentesque Lorem ipsum dolor sit amet consectetur." },
    { id: 7, text: 'Uncategorized Post 7', Description: "Lorem ipsum dolor sit amet consectetur. Maecenas mattis,tortor nunc et massa. Nunc elementum quam id nulla dignissim pellentesque. Lorem ipsum dolor sit amet consectetur.  Maecenas mattis tortor nunc et massa. Nunc elementum quam idnulla dignissim pellentesque" },
    { id: 8, text: 'Uncategorized Post 8', Description: "Maecenas mattis,tortor nunc et massa. Nunc elementum quam id nulla dignissim pellentesque. Lorem ipsum dolor sit amet consectetur.  Maecenas mattis tortor nunc et massa. Nunc elementum quam idnulla dignissim pellentesque Lorem ipsum dolor sit amet consectetur." }
  ];

  return (
    <section className="flex justify-center pt-14">
      <div className="pt-2 w-[770px] h-[850px] bg-white rounded-l-3xl">
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
            <>
            <div className="flex justify-evenly">  
              <div className={`pl-12 Styles.fade-In`}>  
              <div className=" pt-14">
                <div className="w-[290px] h-[280px] bg-[#f4f4f4] rounded-md">
                <div className="text-center text-base text-[#706464] capitalize font-bold p-10">
                        {unCategorizedData[currentIndex].text}
                      </div>

                </div>
              </div>
              <div>
                <h2 className="text-[#706464] pt-14 text-start text-2xl pb-5">
                  Description
                </h2>
                <div className={`${unCategorizedData[currentIndex]}`}>
                <div className="w-[300px] h-[200px] bg-[#f4f4f4] rounded-md overflow-auto">
                <div className="text-center text-sm text-[#706464] mt-4 p-3">
                        {unCategorizedData[currentIndex].Description}
                      </div>    
                </div>
                </div>
                </div>
              </div>
              
              <div className="flex justify-center pt-10">
            <div className="w-[290px] h-[620px] bg-[#f4f4f4]  rounded-xl">  
                <p className="text-start p-2 pl-10 font-bold text-[#706464] text-lg">Post category</p>
              <div className="flex flex-col items-center justify-center">
              <div className="bg-white w-[250px] h-[550px] rounded-md"></div>
            </div>
            </div>
            </div>
      </div>

              <div className="flex justify-between items-center -mt-80 p-3 text-white">
                <div><MdOutlineArrowBackIosNew size={25} className="rounded-xl bg-blue-500 p-1 cursor-pointer" onClick={prevSlide}/></div> 
                <div>
              <MdArrowForwardIos size={25} className="rounded-xl bg-blue-500 p-1 cursor-pointer" onClick={nextSlide} />
                </div>
              </div>
              </>
          )}

          {tab === 1 && 
          <>

          <div className="flex justify-center pt-10">
            <div className="w-[420px] h-[620px] bg-[#f4f4f4]  rounded-xl">  
                <p className="text-start p-2 pl-10 font-bold text-[#706464] text-lg">Post category</p>
              <div className="flex flex-col items-center justify-center">
              <div className="bg-white w-[350px] h-[550px] rounded-md"></div>
            </div>
            </div>
            </div>
            <div className="flex justify-between p-7 -mt-80 text-white">
                <div><MdOutlineArrowBackIosNew size={25} className="rounded-xl bg-blue-500 p-1"/></div> 
                <div>
              <MdArrowForwardIos size={25} className="rounded-xl bg-blue-500 p-1"/>
                </div>
              </div>
            </>}
        </article>
      </div>
      <div className="w-[320px] h-[850px] bg-[#DFDCDC]">
        <div className="pl-5 pt-24">
          <button className="bg-red-200 text-sm" onClick={handleSearch}>search</button>
        <input type="text" className="w-[270px] h-[50px] pl-5 rounded-md focus:outline-blue-500" placeholder="Search category..."/>
          </div>

            <div className="flex justify-center mt-10">
          <div className="bg-[#F4F4F4] w-[268px] rounded-md h-[390px] flex p-3 justify-center overflow-auto">

        <div className="space-y-5">
        {filteredResults.length > 0 ? (
  filteredResults.map((item) => (
    <div key={item.id} className="bg-white w-[220px] rounded-md h-10 p-2">
      <p className="text-center text-base text-[#706464] capitalize">{item.title}</p>
    </div>
  ))
) : (
  contentData.map((item) => (
    <div key={item.id} className="bg-white w-[220px] rounded-md h-10 p-2">
      <p className="text-center text-base text-[#706464] capitalize">{item.title}</p>
    </div>
  ))
)}
    </div>
    </div>
          </div>
       <p className="pl-7 pt-32 text-[#706464]">Create a new categories</p>
       <div className="mt-5 pl-5">
       <input type="text" className="w-[220px] h-[50px] pl-5 rounded-l-md focus:outline-blue-500" value={searchTerm} onChange={handleSearch} placeholder="New category..."/>
      <button className="p-[14px] rounded-r-lg bg-blue-500 text-white">Save</button>
       </div>
      </div>
    </section>
  );
}
