import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat";
import { useLanguage } from "../../contexts/LanguageContext";
import { getPhoto } from "../../api"; 
import { useAuth } from "../../contexts/AuthContext"; 
import { getFormattedAddress } from "../../utils/geocode";

interface CustomMarker {
  latlng: {
    latitude: number;
    longitude: number;
  };
  title: string;
  photoID: string;
  callable: () => void;
}

interface MapComponentProps {
  markers: CustomMarker[];
  startPosition: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
  viewMode: "markers" | "heatmap";
}

// Component to add the heatmap layer to the map
const HeatmapLayer: React.FC<{ markers: CustomMarker[] }> = ({ markers }) => {
  const map = useMap();

  useEffect(() => {
    const heatPoints = markers.map(marker => [
      marker.latlng.latitude,
      marker.latlng.longitude,
      1.0,
    ]) as [number, number, number][];

    const heatLayer = L.heatLayer(heatPoints, {
        radius: 25,
        blur: 18,
        maxZoom: 15,          // Cap when heat fades
        gradient: {           // Custom color ramp
          0.2: 'blue',
          0.6: 'lime',
          0.8: 'orange',
          1.0: 'red',
        },
      }
    );
    heatLayer.addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [markers, map]);

  return null;
};


const defaultBlueMarker = L.icon({
  iconUrl: new URL("https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png").toString(),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: new URL("https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png").toString(),
  shadowSize: [41, 41],
});

const MapComponent: React.FC<MapComponentProps> = ({ markers, startPosition, viewMode }) => {
  const { traduction } = useLanguage();
  const { axiosInstance } = useAuth();
  const [ markerIcons, setMarkerIcons ] = useState<Record<string, L.Icon>>({});
  const [ markerAddresses, setMarkerAddresses] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchIcons = async () => {
      const updatedIcons: Record<string, L.Icon> = {};
  
      await Promise.all(
        markers.map(async (marker) => {
          try {
            const photoUrl = await new Promise<string>((resolve, reject) => {
              getPhoto(axiosInstance, marker.photoID, resolve).catch(reject);
            });
  
            updatedIcons[marker.photoID] = L.icon({
              iconUrl: photoUrl,
              iconSize: [50, 50],
              iconAnchor: [25, 50],
              popupAnchor: [0, -40],
              className: "rounded-lg",
            });
          } catch (error) {
            console.error("Error fetching photo:", error);
            updatedIcons[marker.photoID] = defaultBlueMarker;
          }
        })
      );
  
      setMarkerIcons(updatedIcons);
    };
  
    fetchIcons();
  }, [markers, axiosInstance]);

  const handlePopupOpen = async (marker: CustomMarker) => {
    const alreadyLoaded = markerAddresses[marker.photoID];
    if (alreadyLoaded !== undefined) return; // Do nothing if already cached
  
    try {
      const address = await getFormattedAddress(
        marker.latlng.latitude,
        marker.latlng.longitude
      );
      setMarkerAddresses((prev) => ({
        ...prev,
        [marker.photoID]: address || "",
      }));
      console.log("photoID", marker.photoID, "address", address);
    } catch (err) {
      console.error("Error fetching address:", err);
      setMarkerAddresses((prev) => ({
        ...prev,
        [marker.photoID]: "",
      }));
    }
  };

  const MapMemoryWrapper: React.FC = () => {
    const map = useMap();

    useEffect(() => {
      const handleMove = () => {
        localStorage.setItem("latitude", map.getCenter().lat.toString());
        localStorage.setItem("longitude", map.getCenter().lng.toString());
      };

      map.on("moveend", handleMove);

      const handleZoomEnd = () => {
        localStorage.setItem("zoom", map.getZoom().toString());
      };

      map.on("zoomend", handleZoomEnd);

      return () => {
        map.off("moveend", handleMove);
        map.off("zoomend", handleZoomEnd);
      };
    }, [map]);

    return null;   
  }
  

  return (
    <MapContainer
      center={[startPosition.latitude, startPosition.longitude]}
      zoom={startPosition.zoom}
      scrollWheelZoom={true}
      className="w-full h-full rounded-lg shadow-md"
    >
      <MapMemoryWrapper></MapMemoryWrapper>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {viewMode === "heatmap" && <HeatmapLayer markers={markers} />}

      {viewMode === "markers" &&
        
        markers.map((marker, index) => (
          <Marker
            key={index}
            position={[marker.latlng.latitude, marker.latlng.longitude]}
            icon={markerIcons[marker.photoID] || defaultBlueMarker}
            eventHandlers={{
              popupopen: () => handlePopupOpen(marker),
            }}
          >
            <Popup>
              <div className="text-center">
                <h2 className="font-bold">{marker.title}</h2>
                <p>
                  {markerAddresses[marker.photoID]}
                </p>
                <button
                  className="mt-1 px-3 py-1 bg-blue-800 text-white hover:bg-blue-700 rounded-md"
                  onClick={marker.callable}
                >
                  {traduction("view_details")}
                </button>
              </div>
            </Popup>
          </Marker>
        ))
      }
    
    </MapContainer>
  );
};

export default MapComponent;