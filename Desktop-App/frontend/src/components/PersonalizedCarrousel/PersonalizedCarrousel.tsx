//import { useState } from "react";
import {
  DescriptionText,
  SubmissionDate,
  PaginationBar,
  ImageFromPhotoID
} from "../";
import { useLanguage } from "../../contexts/LanguageContext";

interface PersonalizedCarrouselProps {
  getItem: (index: number) => {
    photoID: string;
    description: string;
    submissionDate: string;
  };
  numberOfItems: number;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

const PersonalizedCarrousel: React.FC<PersonalizedCarrouselProps> = ({
  getItem,
  numberOfItems,
  activeIndex,
  setActiveIndex
}) => {
  const { traduction } = useLanguage(); // get the traduction function from the context

  const handleNext = () => {
    // setActiveIndex((prev) => (prev < numberOfItems - 1 ? prev + 1 : 0));
    if (activeIndex < numberOfItems - 1) {
      setActiveIndex(activeIndex + 1);
    } else {
      setActiveIndex(0);
    }
  };

  const handlePrev = () => {
    // setActiveIndex((prev) => (prev > 0 ? prev - 1 : numberOfItems - 1));
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    } else {
      setActiveIndex(numberOfItems - 1);
    }
  };

  const handleSelect = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="relative flex items-center p-10">
      {/* Left Button outside the carrousel */}
      <button
        onClick={handlePrev}
        className="absolute -left-2 p-2 z-10 bg-white rounded-full shadow-md hover:bg-gray-200 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="w-6 h-6 text-black"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Carousel */}
      <div className="w-full h-full relative rounded-2xl overflow-hidden flex flex-col items-center">
        <div className="relative w-full h-[500px]">
          {/* Slides */}
          <div
            className="w-full h-full flex transition-transform duration-500"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {[...Array(numberOfItems)].map((_, index) => {
              const item = getItem(index);
              return (
                <div
                  key={index}
                  className="w-full flex-shrink-0 flex h-full rounded-2xl overflow-hidden"
                >
                  {/* Image */}
                  <div className="w-1/2 h-full object-cover rounded-l-2xl">
                    <ImageFromPhotoID
                      photo_id={item.photoID}
                      type="medium"
                    />
                  </div>
                  {/* Informations */}
                  <div className="w-1/2 bg-gray-150 rounded-r-2xl border border-gray-300 p-6 flex flex-col justify-between">
                    <DescriptionText
                      title={traduction("description")}
                      description={item.description}
                      className="h-3/4"
                    />
                    <div className="flex flex-col gap-1 text-left">
                      <SubmissionDate date={item.submissionDate} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Bar */}
        <PaginationBar
          activeIndex={activeIndex}
          numberOfItems={numberOfItems}
          onSelect={handleSelect}
        />
      </div>


      {/* Right Button outside the carrousel */}
      <button
        onClick={handleNext}
        className="absolute -right-2 p-2 z-10 bg-white rounded-full shadow-md hover:bg-gray-200 transition "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="w-6 h-6 text-black"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

    </div>
  );
};

export default PersonalizedCarrousel;
