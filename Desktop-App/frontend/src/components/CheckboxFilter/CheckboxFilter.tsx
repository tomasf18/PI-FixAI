import { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { Tooltip } from "flowbite-react";
import { useLanguage } from "../../contexts/LanguageContext";

interface CheckboxFilterProps {
  categories: string[];
  descriptions: Record<string, string>;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  viewModeButton?: React.ReactNode;
}

const CheckboxFilter: React.FC<CheckboxFilterProps> = ({
  categories,
  descriptions,
  selectedCategories,
  setSelectedCategories,
  viewModeButton,
}) => {
  const { traduction } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(localStorage.getItem("FiltersExpanded") === "true");
  const [height, setHeight] = useState("auto");

  useEffect(() => {
    if (containerRef.current) {
      setHeight(`${containerRef.current.offsetHeight}px`);
    }
  }, []);

  const allSelected = selectedCategories.length === categories.length;

  const toggleAll = () => {
    if (allSelected) {
      setSelectedCategories([]); // Deselect all
    } else {
      setSelectedCategories(categories); // Select all
    }
  };

  const toggleCategory = (category: string) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category) // Remove category
      : [...selectedCategories, category]; // Add category

    setSelectedCategories(updatedCategories);
  };

  return (
    <div
      ref={containerRef}
      onClick={() => {
        if (!expanded) {
            setExpanded(true); // Only expand if currently collapsed
            localStorage.setItem("FiltersExpanded", "true");
          }
      }}      
      className={`border rounded-lg shadow-md p-4 bg-white transition-all duration-300
        ${expanded ? "w-full sm:w-64" : "w-min cursor-pointer"}`}
      style={{ height }}
    >
      <div className="flex justify-between items-center">
        {expanded && <span className="text-lg font-bold">{traduction("filter_by")}</span>}
        <button
          onClick={() => 
            {
              setExpanded(!expanded)
              localStorage.setItem("FiltersExpanded", (!expanded).toString());
            }
          } // Clicking arrow toggles expanded state
          className="p-2 focus:outline-none"
        >
          {expanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
      {expanded && (
        <div className="mt-2 space-y-4">
          {/* Select All Checkbox */}
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-5 h-5 border-gray-400 rounded-sm"
              checked={allSelected}
              onChange={toggleAll}
            />
            <span>{traduction("select_all")}</span>
          </label>

          {/* Individual Checkboxes */}
          {categories.map((category, index) => (
            <label key={index} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 border-gray-400 rounded-sm"
                checked={selectedCategories.includes(category)}
                onChange={() => toggleCategory(category)}
              />
              <span>{traduction(category)}</span>
              {descriptions[category] && (
                <Tooltip content={descriptions[category]}>
                  <Info size={16} className="text-gray-500 cursor-help" />
                </Tooltip>
              )}
            </label>
          ))}
        </div>
      )}

      {expanded && viewModeButton && (
        <div className="mt-10">{viewModeButton}</div>
      )}

    </div>
  );
};

export default CheckboxFilter;
