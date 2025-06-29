import React from "react";

interface PaginationBarProps {
  activeIndex: number;
  numberOfItems: number;
  onSelect: (index: number) => void;
}

const PaginationBar: React.FC<PaginationBarProps> = ({
  activeIndex,
  numberOfItems,
  onSelect,
}) => {
  const maxVisibleButtons = 5;
  let pages: (number | string)[] = [];

  if (numberOfItems <= maxVisibleButtons) {
    pages = Array.from({ length: numberOfItems }, (_, i) => i);
  } else {
    const left = Math.max(1, activeIndex - 1);
    const right = Math.min(numberOfItems - 2, activeIndex + 1);

    pages.push(0);

    if (left > 1) {
      pages.push("...");
    }

    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    if (right < numberOfItems - 2) {
      pages.push("...");
    }

    pages.push(numberOfItems - 1);
  }

  let optimizedPages: (number | string)[] = [];
  for (let i = 0; i < pages.length; i++) {
    if (pages[i] === "..." && pages[i - 1] === "...") {
      continue;
    }
    optimizedPages.push(pages[i]);
  }

  return (
    <div className="flex space-x-2 mt-2">
      {optimizedPages.map((page, index) =>
        typeof page === "number" ? (
          <button
            key={index}
            onClick={() => onSelect(page)}
            className={`px-3 py-1 text-sm font-semibold rounded-md ${
              activeIndex === page
                ? "bg-gray-800 text-white"
                : "bg-gray-300 text-gray-800"
            }`}
          >
            {page + 1}
          </button>
        ) : (
          <span
            key={index}
            className="px-2 py-1 text-sm font-semibold text-gray-500"
          >
            ...
          </span>
        )
      )}
    </div>
  );
};

export default PaginationBar;
