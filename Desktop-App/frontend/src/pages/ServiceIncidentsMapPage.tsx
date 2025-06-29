import { useNavigate } from "react-router-dom";
import { CheckboxFilter, MainLayout, MapComponent } from "../components";

import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import {
  getOrganizationsCategories,
  getIncidentsMap,
  OrganizationCategoriesResponse,
} from "../api";
import { useEffect, useState } from "react";

export default function ServiceIncidentsMapPage() {
  const navigate = useNavigate();
  const { traduction } = useLanguage();
  const { axiosInstance } = useAuth();
  const [categoriesTitles, setCategoriesTitles] = useState<string[]>([]);
  const [descriptions, setDescriptions] = useState<Record<string, string>>({});
  const [selectedCategoriesTitles, setSelectedCategoriesTitles] = useState<
    string[]
  >(
    localStorage.getItem("selectedCategories")
      ? JSON.parse(localStorage.getItem("selectedCategories") || "[]")
      : []
  );
  const [markersData, setMarkersData] = useState<
    {
      latlng: { latitude: number; longitude: number };
      title: string;
      photoID: string;
      callable: () => void;
    }[]
  >([]);
  const [viewMode, setViewMode] = useState<"markers" | "heatmap">(
    localStorage.getItem("viewMode") === "markers" ? "markers" : "heatmap"
  );

  // Fetch organization categories and descriptions to use in CheckboxFilter
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getOrganizationsCategories(axiosInstance);
        console.log("Organization categories data:", categoriesData);

        const categoryNames = categoriesData.map(
          (category: OrganizationCategoriesResponse) => category.category
        );
        setCategoriesTitles(categoryNames);

        setDescriptions(
          categoriesData.reduce(
            (
              acc: Record<string, string>,
              category: OrganizationCategoriesResponse
            ) => {
              acc[traduction(category.category)] = traduction(
                category.description
              );
              return acc;
            },
            {}
          )
        );

        console.log("Descriptions:", descriptions);
      } catch (error) {
        console.error("Error fetching organization categories:", error);
      }
    };
    fetchCategories();
  }, [axiosInstance]);

  // Fetch incidents map when selected categories change
  useEffect(() => {
    const fetchIncidentsMap = async () => {
      if (selectedCategoriesTitles.length === 0) {
        console.log("No categories selected, clearing markers data");
        setMarkersData([]);
        localStorage.setItem("selectedCategories", JSON.stringify([]));
        return;
      }
      try {
        console.log(
          "Fetching incidents for selected categories:",
          selectedCategoriesTitles
        );
        const incidentsMapData = await getIncidentsMap(
          axiosInstance,
          selectedCategoriesTitles
        );
        console.log("Incidents map data:", incidentsMapData); // [ {incident_id: "", photo_id: "", centroid_latitude: 10, centroid_longitude:10, incident_id: "", main_category: "urban_drainage", photo_id: ""} , {...} ]
        setMarkersData(
          incidentsMapData.map((incident) => ({
            latlng: {
              latitude: incident.centroid_latitude,
              longitude: incident.centroid_longitude,
            },
            title: traduction(incident.main_category),
            photoID: incident.photo_id,
            callable: () =>
              navigate(`/service/incident-details/${incident.incident_id}`),
          }))
        );
        console.log("Selected categories titles:", selectedCategoriesTitles);
        localStorage.setItem(
          "selectedCategories",
          JSON.stringify(selectedCategoriesTitles)
        );
      } catch (error) {
        console.error("Error fetching incidents map:", error);
      }
    };
    fetchIncidentsMap();
  }, [selectedCategoriesTitles]);

  const startPosition = {
    latitude: parseFloat(localStorage.getItem("latitude") ?? "40.643605"),
    longitude: parseFloat(localStorage.getItem("longitude") ?? "-8.647361"),
    zoom: parseInt(localStorage.getItem("zoom") ?? "13"),
  };

  const viewModeButton = (
    <button
      className={`w-full px-4 py-2 text-white rounded transition-colors duration-200 ${
        viewMode === "markers"
          ? "bg-blue-600 hover:bg-blue-700"
          : "bg-blue-800 hover:bg-blue-900"
      }`}
      onClick={() => {
        setViewMode(viewMode === "markers" ? "heatmap" : "markers");
        localStorage.setItem(
          "viewMode",
          viewMode === "markers" ? "heatmap" : "markers"
        );
      }}
    >
      {viewMode === "markers" ? "Show Heatmap" : "Show Markers"}
    </button>
  );

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 p-4 gap-4">
        <CheckboxFilter
          categories={categoriesTitles}
          descriptions={descriptions}
          selectedCategories={selectedCategoriesTitles} // pass selected categories
          setSelectedCategories={setSelectedCategoriesTitles} // allow updating selected categories
          viewModeButton={viewModeButton}
        />
        <div className="flex-grow bg-white shadow-md rounded-lg p-4">
          <MapComponent
            markers={markersData}
            startPosition={startPosition}
            viewMode={viewMode}
          />
        </div>
      </div>
    </MainLayout>
  );
}
