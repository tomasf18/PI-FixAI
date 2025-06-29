import { CollumnDefinition } from "../components/Tables/SimpleTable/SimpleTable";
import { IoDocumentOutline } from "react-icons/io5";
import { BiSolidCategory } from "react-icons/bi";
import { PiWarningDiamondFill, PiArrowsCounterClockwiseBold } from "react-icons/pi";
import { TbStatusChange } from "react-icons/tb";
import { BsCalendarDateFill } from "react-icons/bs";
import { LuFileSearch } from "react-icons/lu";
import {
  FilterStateButton,
  SeverityLabel,
  CustomCard,
  InfoCardGrid,
  FunctionalIcon,
  SimpleTable,
  MainLayout,
} from "../components";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from '../contexts/AuthContext';
import { getOrganizationsCategories, OrganizationCategoriesResponse, getIncidentsSummary, IncidentSummaryResponse } from '../api';
import { v1 as uuidv1 } from 'uuid';


export default function ServiceHomePage() {
  const { traduction, language } = useLanguage(); // get the traduction function from the context
  const navigate = useNavigate();
  const { axiosInstance } = useAuth();

  const widthClass = "w-full";
  const heightClass = "h-full";
  const [selectedCard, setSelectedCard] = useState<string>("");
  const [activeStatus, setActiveStatus] = useState<string>(localStorage.getItem("activeStatus") || "pending");
  const [categories, setCategories] = useState<OrganizationCategoriesResponse[]>([]);
  const [tableData, setTableData] = useState<IncidentSummaryResponse[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>(localStorage.getItem("categoryFilter") || "");
  const [cardDataList, setCardDataList] = useState<{ title: string; description: string; color1: string; color2: string; number: number }[]>([]);
  const [referenceTimeId, setReferenceTimeId] = useState<string>(uuidv1());
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  function formatDateSplit(dateString: string, language: string) {
    const date = new Date(dateString);
  
    const day = date.toLocaleDateString(language, { day: "numeric" });
    const month = date.toLocaleDateString(language, { month: "long" });
    const year = date.toLocaleDateString(language, { year: "numeric" });
  
    const time = date.toLocaleTimeString(language, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  
    return (
      <>
        <span className="font-semibold">
          {day}&nbsp;{month}
        </span>
        &nbsp;{year}, {time}
      </>
    );
  }
  
  
  
  // Fetch the organization categories - Grid of cards
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getOrganizationsCategories(axiosInstance);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching organization categories:", error);
      }
    };
    fetchCategories();
  }, [axiosInstance]);

  useEffect(() => {
    if (categories.length === 0) return;
    const selectedFilter = activeStatus; // Always one active filter
    const mappedData = categories.map((category) => ({
      title: category.category,
      description: category.description,
      color1: categoryFilter !== "" && category.category !== categoryFilter ? "#888888" : getCategoryColor(category.category).color1,
      color2: categoryFilter !== "" && category.category !== categoryFilter ? "#F1F1F1" : getCategoryColor(category.category).color2,
      number: getCategoryNumber(category, selectedFilter),
    }));
    console.log("Mapped data:", mappedData);
    setCardDataList(mappedData);
    console.log(categoryFilter !== "")
    console.log("categoryFilter:", categoryFilter);
  }, [activeStatus, categories, categoryFilter]);

  // Fetch the incidents summary - Table
  const fetchTableData = async (append = false) => {categoryFilter
    if (isFetchingMore || !hasMore) {
      console.log("Already fetching or no more data to fetch.");
      return;
    }
    try {
      setIsFetchingMore(true);
      const is_descendent = sortDirection === "desc";
      const status = activeStatus; 
      const category = categoryFilter || ""; 
      console.log("Fetching table data with filters:", is_descendent, status, referenceTimeId, category);

      const data = await getIncidentsSummary(
        axiosInstance,
        is_descendent,
        status,
        referenceTimeId,
        category
      );

      console.log("Fetched data:", data);
      if (append) {
        console.log("Appending data to table...");
        setTableData((prev) => [...prev, ...data]);        
      } else {
        setTableData(data);
      }
      setReferenceTimeId(data.length > 0 ? data[data.length - 1].time_id : referenceTimeId);
      setHasMore(data.length > 0);
    } catch (error) {
      console.error("Error fetching incident summary:", error);
    } finally {
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, [activeStatus, categoryFilter]); 

  // Fetch data on scroll
  useEffect(() => {
    fetchTableData();
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);
      setOffset(scrollPercent);
    };
    // clean up code
    window.removeEventListener('scroll', onScroll);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    console.log("Checking scroll offset:", offset);
    if (offset > 90) {
      console.log("Fetching more data on scroll...");
      fetchTableData(true);
    }
  }, [offset]);

  // Handle filter click
  const handleFilterClick = (filter: string) => {
    setIsFetchingMore(false);
    setHasMore(true);
    console.log("Filter clicked:", filter);
    setActiveStatus(filter);
    localStorage.setItem("activeStatus", filter);
    setReferenceTimeId(
      sortDirection === "desc"
        ? uuidv1()
        : "00000000-0000-1000-8000-000000000000" // earliest possible date in the UUIDv1 system
    );
  };

  const handleCategoryChange = (cFilter: string) => {
    setIsFetchingMore(false);
    setHasMore(true);
    console.log("Category filter changed to:", cFilter);
    setCategoryFilter(cFilter);
    // setSelectedCard(categoryFilter);
    if (cFilter === categoryFilter) {
      console.log("Removing category filter");
      setSelectedCard("");
      setCategoryFilter("");
      localStorage.setItem("categoryFilter", "");
    } else {
      localStorage.setItem("categoryFilter", cFilter);
    }
    
    setReferenceTimeId(
      sortDirection === "desc"
        ? uuidv1()
        : "00000000-0000-1000-8000-000000000000" // earliest possible date in the UUIDv1 system
    );
  };  

  const handleSort = (index: number, direction: "asc" | "desc") => {
    console.log(`Sort by column ${index} with direction ${direction}`);

    // If it's not the submission date column, ignore
    if (index !== 3) return;

    // Update the sort direction
    setSortDirection(direction);
    setReferenceTimeId(
      direction === "desc"
        ? uuidv1()
        : "00000000-0000-1000-8000-000000000000" // earliest possible date in the UUIDv1 system
    );
    setIsFetchingMore(false);
    setHasMore(true);    
  }

  useEffect(() => {
    fetchTableData();
  }, [sortDirection]);

  
  // Dynamically get the number based on the selected filter
  const getCategoryNumber = (category: OrganizationCategoriesResponse, filter: string) => {
    console.log("DEBUG: Filter: ", filter);
    console.log("DEBUG: Category: ", category);
    switch (filter) {
      case "pending":
        return category.num_pending;
      case "in_progress":
        return category.num_in_progress;
      case "resolved":
        return category.num_resolved;
      default:
        return 0;
    }
  };

  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, { color1: string; color2: string }> = {
      traffic_lights: { color1: "#c63232", color2: "#f9cbc4" },
      urban_drainage: { color1: "#B12853", color2: "#F3DEE5" },
      pavement: { color1: "#283FB1", color2: "#F6F4FF" },
      traffic_signs: { color1: "#1DA049", color2: "#F2FFF3" },
      infrastructure: { color1: "#D99241", color2: "#FFEBD5" },
      lighting: { color1: "#1A7FED", color2: "#F6F4FF" },
      others: { color1: "#56C2D1", color2: "#EFFDFF" },
    };
    return colorMap[category] || { color1: "#CCCCCC", color2: "#F0F0F0" }; // Default colors
  };

  // Table
  const columns: CollumnDefinition[] = [
    { name: traduction("category"), sortable: false, icon: <BiSolidCategory /> },
    { name: traduction("severity"), sortable: false, icon: <PiWarningDiamondFill /> },
    { name: traduction("status"), sortable: false, icon: <TbStatusChange /> },
    { name: traduction("submission_date"), sortable: true, initialSortDirection: "desc", icon: <BsCalendarDateFill /> },
    { name: traduction("occurrences"), sortable: false, icon: <PiArrowsCounterClockwiseBold /> },
    { name: traduction("details"), sortable: false, icon: <LuFileSearch /> },
  ];
  
  const rows = tableData.map((incident) => [
    <SeverityLabel
      text={traduction(incident.main_category)}
      textColor={getCategoryColor(incident.main_category).color1}
      bgColor={getCategoryColor(incident.main_category).color2}
    />,
    
    <SeverityLabel
      text={traduction(incident.severity)}
      textColor={
        incident.severity === "high"
          ? "#7f1d1d"
          : incident.severity === "medium"
          ? "#78350f"
          : "#14532d"
      }
      bgColor={
        incident.severity === "high"
          ? "#fecaca"
          : incident.severity === "medium"
          ? "#fde68a"
          : "#bbf7d0"
      }
    />,
    traduction(incident.status),
    formatDateSplit(incident.date, language),
    incident.num_occurrences.toString(),
    <FunctionalIcon icon={<IoDocumentOutline />} onClick={() => navigate("/service/incident-details/" + incident.incident_id)} />,
  ]);
  
  return (
    
    <MainLayout>
      <div className="p-4"> 
        <div className="flex justify-between items-center ">
          <div className="flex gap-4 p-4">
          <div className="flex gap-4 p-4">
            <FilterStateButton
              text={traduction("pending")}
              active={activeStatus == "pending"}
              onClick={() => handleFilterClick("pending")} 
            />
            <FilterStateButton
              text={traduction("in_progress")}
              active={activeStatus == "in_progress"}
              onClick={() => handleFilterClick("in_progress")}
             />
            <FilterStateButton
              text={traduction("resolved")}
              active={activeStatus == "resolved"}
              onClick={() => handleFilterClick("resolved")}
             />
          </div>
          </div>
          <div className="flex items-center px-4">
            <CustomCard
              icon={
                <svg viewBox="0 0 24 24" strokeWidth={2} stroke="#283FB1" className="w-6 h-6" fill="#283FB1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z"/>
                </svg>
              }
              text={traduction("control_panel")}
              borderColor="#283FB1"
            />
          </div>
          
        </div>
      </div>
      <div className="px-4">
        <div className="flex justify-center items-center">
          <InfoCardGrid cards={cardDataList} handleCategoryChange={handleCategoryChange} selectedCard={selectedCard} setSelectedCard={setSelectedCard}/>
        </div>
      </div>
      <div className="p-4">
        <div className=" justify-center items-center p-4">
          <div className={`overflow-x-auto ${widthClass} ${heightClass}`}>
            <SimpleTable columns={columns} rows={rows} onSort={handleSort} />
          </div>
        </div>
      </div> 
    </MainLayout>
  );
}

