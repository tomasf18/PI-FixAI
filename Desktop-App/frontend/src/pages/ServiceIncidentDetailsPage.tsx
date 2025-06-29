import { useEffect, useState } from "react";
import {
  CustomCard,
  DetailsCard,
  LocationInfo,
  MainLayout,
  PersonalizedCarrousel,
  StatusLabel,
  FilterStateButton,
  ConfirmationModal,
  DescriptionText,
} from "../components";

import { Carousel } from "flowbite-react";

import { useLanguage } from "../contexts/LanguageContext";
import {
  getIncident,
  getOccurrencesIds,
  getOccurrenceDetailsResponse,
  OccurrenceDetailsResponse,
  IncidentResponse,
  OccurrenceIdResponse,
  updateIncidentStatus,
  IncidentVideosResponse,
  getIncidentVideos,
} from "../api";
import { useAuth } from "../contexts/AuthContext";
import { useParams } from "react-router-dom";
import { getFormattedAddress } from "../utils/geocode";

export default function ServiceIncidentDetailsPage() {
  const { traduction } = useLanguage();
  const { axiosInstance } = useAuth();
  const [incidentDetails, setIncidentDetails] =
    useState<IncidentResponse | null>(null);
  const [listOfOccurrences, setListOfOccurrences] = useState<string[]>([]);
  const [activeOccurrenceDetails, setActiveOccurrenceDetails] =
    useState<OccurrenceDetailsResponse | null>(null);
  const [numberOfActiveOccurrence, setNumberOfActiveOccurrence] =
    useState<number>(0);
  const { incidentId } = useParams();
  const [activeStatus, setActiveStatus] = useState<string>("pending");
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("pending");
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [temporarySelectedStatus, setTemporarySelectedStatus] = useState<
    string | null
  >(null);
  const [address, setAddress] = useState("");

  const host_protocol = import.meta.env.VITE_BACKEND_PROTOCOL || "https";
  const host_name = import.meta.env.VITE_BACKEND_HOST || "localhost";
  const host_port = import.meta.env.VITE_BACKEND_PORT || "443";
  const endpoints_prefix = import.meta.env.ENDPOINTS_PREFIX || "/api/v1";
  const host_url = `${host_protocol}://${host_name}:${host_port}${endpoints_prefix}`;

  const [incidentVideosResponse, setIncidentVideosResponse] = useState<
    IncidentVideosResponse[]
  >([]);
  const [activeVideoIndex, setActiveVideoIndex] = useState<number>(0);
  const [alreadyLoadedVideos, setAlreadyLoadedVideos] = useState<number[]>([0]);

  // Fetch Incident Videos
  useEffect(() => {
    if (!incidentId) return;
    getIncidentVideos(axiosInstance, incidentId)
      .then((response) => {
        console.log("Incident videos fetched successfully:", response);
        setIncidentVideosResponse(response);
      })
      .catch(console.error);
  }, [incidentId]);

  // Fetch Incident Details
  useEffect(() => {
    if (!incidentId) return;
    getIncident(axiosInstance, incidentId)
      .then((response) => {
        console.log("Incident details fetched successfully:", response);
        setIncidentDetails(response);
        if (response.status) {
          setActiveStatus(response.status);
          setSelectedStatus(response.status);
        }
      })
      .catch(console.error);
  }, [incidentId]);

  // Fetch List of Occurrence IDs
  useEffect(() => {
    if (!incidentId) return;
    getOccurrencesIds(axiosInstance, incidentId)
      .then((response) => {
        console.log("Occurrences ids fetched successfully:", response);
        setListOfOccurrences(
          response.map(
            (occurrence: OccurrenceIdResponse) => occurrence.occurrence_id
          )
        );
      })
      .catch(console.error);
  }, []);

  // Fetch Active Occurrence Details
  useEffect(() => {
    if (
      listOfOccurrences.length === 0 ||
      numberOfActiveOccurrence >= listOfOccurrences.length
    )
      return;
    const activeId = listOfOccurrences[numberOfActiveOccurrence];
    getOccurrenceDetailsResponse(axiosInstance, activeId)
      .then(setActiveOccurrenceDetails)
      .catch(console.error);
    console.log("Fetching occurrence details for occurrence: ", activeId);
    console.log("Details: ", activeOccurrenceDetails);
  }, [numberOfActiveOccurrence, listOfOccurrences]);

  // Fetch Address from Coordinates using getFormattedAddress(lat, lon) and set it to address
  useEffect(() => {
    if (
      incidentDetails?.centroid_latitude &&
      incidentDetails?.centroid_longitude
    ) {
      getFormattedAddress(
        incidentDetails.centroid_latitude as number,
        incidentDetails.centroid_longitude as number
      )
        .then((address: string) => {
          setAddress(address);
          console.log("Address: ", address);
        })
        .catch((error: unknown) => console.error(error));
    }
  }, [incidentDetails]);

  // Handle Status Change
  const handleStatusClick = (status: string) => {
    console.log("Status clicked: ", status);
    if (status === selectedStatus) {
      setIsWarningModalOpen(true);
      return;
    }
    setTemporarySelectedStatus(status);
    setIsConfirmationModalOpen(true);
  };

  const confirmStatusChange = () => {
    if (temporarySelectedStatus) {
      setSelectedStatus(temporarySelectedStatus);
      setActiveStatus(temporarySelectedStatus);
    }

    if (incidentId !== undefined && temporarySelectedStatus !== null) {
      updateIncidentStatus(axiosInstance, incidentId, temporarySelectedStatus)
        .then(() => {
          console.log("Incident status updated successfully");
          return getIncident(axiosInstance, incidentId);
        })
        .then((updatedIncident) => {
          console.log("Updated incident details:", updatedIncident);
          setIncidentDetails(updatedIncident);
        })
        .catch((error) =>
          console.error("Error updating incident status:", error)
        );
    } else {
      console.error("Error: incidentId is undefined.");
    }

    setTemporarySelectedStatus(null);
    setIsConfirmationModalOpen(false);
  };

  const cancelStatusChange = () => {
    setTemporarySelectedStatus(null);
    setIsConfirmationModalOpen(false);
  };

  const handleSolveIncident = () => {
    handleStatusClick("resolved");
  };

  // Handle carousel slide change
  const handleVideoSlideChange = (index: number) => {
    setActiveVideoIndex(index);
    if (!alreadyLoadedVideos.includes(index)) {
      setAlreadyLoadedVideos((prev) => [...prev, index]);
    }
    console.log("Active video index changed to:", index);
  };

  return (
    <MainLayout>
      <div className="relative items-center min-h-screen p-8">
        <ConfirmationModal
          isOpen={isConfirmationModalOpen}
          message={traduction("confirmation_message")}
          onConfirm={confirmStatusChange}
          onCancel={cancelStatusChange}
        />

        {/* Warning Modal for when the user tries to select the same status */}
        {isWarningModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-md shadow-lg max-w-sm w-full text-center">
              <p className="mb-4">{traduction("warning_message")}</p>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => setIsWarningModalOpen(false)}
              >
                Ok
              </button>
            </div>
          </div>
        )}

        <div className="absolute top-4 right-4 w-1/6 ">
          <CustomCard
            icon={
              <svg
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="#283FB1"
                className="w-6 h-6"
                fill="#283FB1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z"
                />
              </svg>
            }
            text={traduction("incident_custom_card")}
            borderColor="#283FB1"
          />
        </div>

        <div className="grid grid-cols-12 gap-4 w-full items-center">
          <div className="col-span-1"></div>

          <div className="col-span-6 mt-20 w-full items-center">
            <div className="grid grid-cols-4 w-full items-center justify-center mx-auto">
              <div className="col-span-2 pl-10 pr-5">
                <StatusLabel
                  text={traduction("occurrence")}
                  number={numberOfActiveOccurrence + 1}
                  color1="#283FB1"
                  color2="#F1F5F9"
                />
              </div>
              <div className="col-span-2 pl-2">
                <LocationInfo
                  location={address}
                  icon={
                    <svg width="34" height="33" viewBox="0 0 34 33" fill="none">
                      <path
                        d="M17.1615 29.6279C16.8346 29.6276 16.5543 29.5387 16.3206 29.3612C16.0869 29.1837 15.9115 28.9509 15.7944 28.6627C15.3493 27.4211 14.7875 26.257 14.1091 25.1705C13.4541 24.0839 12.5303 22.8087 11.3377 21.3449C10.1452 19.8812 9.17454 18.4841 8.42579 17.1536C7.70039 15.8232 7.33657 14.216 7.33433 12.332C7.33124 9.73876 8.27426 7.54522 10.1634 5.75138C12.0758 3.93539 14.398 3.02845 17.1298 3.03058C19.8616 3.0327 22.1742 3.94324 24.0677 5.76219C25.9844 7.559 26.9443 9.75402 26.9474 12.3473C26.9498 14.3642 26.5432 16.0484 25.7276 17.3998C24.9353 18.729 24.0146 20.0471 22.9655 21.354C21.7065 22.9488 20.7508 24.278 20.0983 25.3413C19.4691 26.3826 18.9451 27.4904 18.5262 28.6648C18.4098 28.975 18.2233 29.2187 17.9667 29.3958C17.7334 29.5507 17.465 29.6281 17.1615 29.6279ZM17.1448 15.6643C18.1255 15.6651 18.954 15.3443 19.6303 14.7021C20.3067 14.0598 20.6443 13.2733 20.6432 12.3424C20.6421 11.4114 20.3026 10.6243 19.6247 9.98105C18.9468 9.33776 18.1176 9.01573 17.1369 9.01497C16.1563 9.01421 15.3278 9.33494 14.6514 9.97718C13.975 10.6194 13.6374 11.406 13.6385 12.3369C13.6396 13.2678 13.9791 14.0549 14.657 14.6982C15.3349 15.3415 16.1642 15.6635 17.1448 15.6643Z"
                        fill="#1D1B20"
                      />
                    </svg>
                  }
                />
              </div>
            </div>
            {activeOccurrenceDetails && (
              <PersonalizedCarrousel
                getItem={() => ({
                  photoID: activeOccurrenceDetails.photo_id,
                  description: activeOccurrenceDetails.description,
                  submissionDate: activeOccurrenceDetails.date,
                })}
                numberOfItems={listOfOccurrences.length}
                activeIndex={numberOfActiveOccurrence}
                setActiveIndex={setNumberOfActiveOccurrence}
              />
            )}
          </div>

          <div className="col-span-4 flex flex-col w-full items-center">
            <div className="w-3/5 justify-center mx-auto">
              <DetailsCard
                category={
                  incidentDetails?.main_category
                    ? traduction(incidentDetails.main_category)
                    : "unknown_category"
                }
                severity={
                  incidentDetails?.severity
                    ? traduction(incidentDetails.severity)
                    : "unknown_severity"
                }
                occurrences={
                  incidentDetails?.occurrences ? incidentDetails.occurrences : 0
                }
                status={
                  incidentDetails?.status
                    ? traduction(incidentDetails.status)
                    : "unknown_status"
                }
                icon={
                  <svg width="18" height="18" viewBox="0 0 34 34" fill="none">
                    <path
                      d="M17.0308 22.5189L17.0241 16.8523M17.0173 11.1856L17.0319 11.1856M31.6075 16.8636C31.6168 24.6876 25.0951 31.0251 17.041 31.0188C8.98677 31.0126 2.45001 24.6649 2.4407 16.8409C2.43138 9.01692 8.95304 2.67939 17.0072 2.68566C25.0614 2.69192 31.5982 9.0396 31.6075 16.8636Z"
                      stroke="#1E1E1E"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
                borderColor="#283FB1"
              />
            </div>

            <div className="w-4/5 justify-center mx-auto">
              <div className="flex justify-center w-full py-4 mt-4 space-x-4">
                <FilterStateButton
                  text={traduction("pending")}
                  active={activeStatus == "pending"}
                  onClick={() => handleStatusClick("pending")}
                />
                <FilterStateButton
                  text={traduction("in_progress")}
                  active={activeStatus == "in_progress"}
                  onClick={() => handleStatusClick("in_progress")}
                />
                <FilterStateButton
                  text={traduction("resolved")}
                  active={activeStatus == "resolved"}
                  onClick={() => handleStatusClick("resolved")}
                />
              </div>
            </div>

            <div className="w-11/12 bg-white shadow-lg rounded-lg px-4 py-2 border border-gray-200 mt-4 max-h-80 overflow-y-auto">
              <DescriptionText
                title={traduction("main_description")}
                description={
                  incidentDetails?.main_description
                    ? incidentDetails.main_description
                    : "No description available."
                }
              />
            </div>
          </div>

          <div className="col-span-1"></div>
        </div>

        {activeStatus != "resolved" && incidentVideosResponse.length > 0 && (
          <div className="w-8/12 mt-10 flex justify-center items-center mx-auto">
            <div className="flex w-full">
              <div className="w-3/12 border-2 border-gray-300 m-4 rounded-lg">
                <div className="h-96 m-2">
                  {incidentVideosResponse.length === 1 ? (
                    <video
                      key={incidentVideosResponse[0].video_id}
                      controls
                      className="h-full object-cover"
                    >
                      <source
                        src={
                          host_url +
                          "/videos/" +
                          incidentVideosResponse[0].video_id
                        }
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <Carousel
                      slide={false}
                      indicators={false}
                      onSlideChange={handleVideoSlideChange}
                    >
                      {incidentVideosResponse.map((video, index) =>
                      index === activeVideoIndex || alreadyLoadedVideos.includes(index) ? (
                        <video
                        key={video.video_id}
                        controls
                        className="h-full object-cover"
                        >
                        <source
                          src={host_url + "/videos/" + video.video_id}
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                        </video>
                      ) : (
                        <div key={video.video_id} className="h-full object-cover"></div>
                      )
                      )}
                    </Carousel>
                  )}
                </div>
              </div>
              <div className="w-9/12 border-2 border-gray-300 m-4 rounded-lg">
                <div className="p-10 flex flex-col justify-between h-full">
                  <div>
                    <h2
                      style={{ lineHeight: 1.4 }}
                      className="text-4xl font-extrabold mb-10"
                    >
                      Problem Already Solved <br /> Detected
                    </h2>
                    <div className="mb-4">
                      <p className="text-2xl inline">
                        Detected Time:&nbsp;&nbsp;&nbsp;
                      </p>
                      <p className="text-2xl font-medium inline">
                        {incidentVideosResponse[activeVideoIndex]?.created_at
                          ? new Date(
                              incidentVideosResponse[
                                activeVideoIndex
                              ].created_at
                            ).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-2xl inline">
                        Edge Data ID:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      </p>
                      <p className="text-2xl font-medium inline">
                        {incidentVideosResponse[activeVideoIndex]?.edge_data_id
                          ? incidentVideosResponse[
                              activeVideoIndex
                            ].edge_data_id.split("-")[0]
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end mt-auto">
                    <button
                      className="border-2 border-gray-300 text-gray-700 font-semibold text-xl px-6 py-3 rounded-xl hover:bg-blue-800 hover:text-gray-50 transition duration-100"
                      onClick={handleSolveIncident}
                    >
                      Confirm Resolution
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
