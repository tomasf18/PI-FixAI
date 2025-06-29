import { AxiosInstance } from "axios";
import {
  LoginResponse,
  OccurrenceResponse,
  IncidentResponse,
  IncidentSummaryResponse,
  IncidentMapResponse,
  OrganizationCategoriesResponse,
  OccurrenceIdResponse,
  OccurrenceDetailsResponse,
  IncidentVideosResponse,
} from "./";
import { Buffer } from "buffer";

const logInAPI = async (
  axiosInstance: AxiosInstance,
  formData: URLSearchParams
) => {
  try {
    const response = await axiosInstance.post<LoginResponse>(
      "/auth/log-in?is_user=false",
      formData.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response;
  } catch (error) {
    console.log("Error logging in:", error);
    throw error;
  }
};

const logOutAPI = async (axiosInstance: AxiosInstance) => {
  try {
    const response = await axiosInstance.post("/auth/sign-out");
    return response;
  } catch (error) {
    console.log("Error logging out:", error);
    throw error;
  }
};

const refreshToken = async (axiosInstance: AxiosInstance) => {
  try {
    const response = await axiosInstance.get("/auth/refresh-token", {
      headers: {
        "X-Token-Use": "refresh",
      },
    });
    return response;
  } catch (error) {
    console.log("Error refreshing token:", error);
    throw error;
  }
};

const getOccurrence = async (
  axiosInstance: AxiosInstance,
  occurrence_id: string
) => {
  try {
    const response = await axiosInstance.get<OccurrenceResponse>(
      `/occurrences/${occurrence_id}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error fetching occurrence:", error);
    throw error;
  }
};

const getIncident = async (
  axiosInstance: AxiosInstance,
  incident_id: string
) => {
  try {
    const response = await axiosInstance.get<IncidentResponse>(
      `/incidents/${incident_id}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error fetching incident:", error);
    throw error;
  }
};

const getOccurrencesIds = async (
  axiosInstance: AxiosInstance,
  incident_id: string
) => {
  try {
    const response = await axiosInstance.get<OccurrenceIdResponse[]>(
      `/incidents/${incident_id}/occurrences`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error fetching occurrence ids:", error);
    throw error;
  }
};

const getOccurrenceDetailsResponse = async (
  axiosInstance: AxiosInstance,
  occurrence_id: string
) => {
  try {
    const response = await axiosInstance.get<OccurrenceDetailsResponse>(
      `/occurrences/${occurrence_id}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error fetching occurence details:", error);
    throw error;
  }
};

const getIncidentsSummary = async (
  axiosInstance: AxiosInstance,
  is_descendent: boolean,
  status: string,
  reference_time_id: string,
  category: string
) => {
  try {
    const response = await axiosInstance.get<IncidentSummaryResponse[]>(
      `/incidents/list-by-time`,
      {
        headers: {
          Accept: "application/json",
        },
        params: {
          is_descendent,
          status,
          reference_time_id,
          category,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error fetching incident:", error);
    throw error;
  }
};

const getIncidentsMap = async (
  axiosInstance: AxiosInstance,
  category_list: string[]
) => {
  try {
    const params = new URLSearchParams();

    category_list.forEach((category) => {
      params.append("category_list", category);
    });

    const response = await axiosInstance.get<IncidentMapResponse[]>(
      `/incidents/map?${params.toString()}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error fetching incident:", error);
    throw error;
  }
};

const getOrganizationsCategories = async (axiosInstance: AxiosInstance) => {
  try {
    const response = await axiosInstance.get<OrganizationCategoriesResponse[]>(
      `/organizations/categories`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error fetching incident:", error);
    throw error;
  }
};

const getPhoto = async (
  axiosInstance: AxiosInstance,
  photo_id: string,
  setImageUrl: (url: string) => void
) => {
  console.log("Fetching photo with ID:", photo_id);
  axiosInstance
    .get(`/photos/${photo_id}`, {
      responseType: "blob",
    })
    .then((response) => {
      const reader = new FileReader();
      // add trigger
      reader.onloadend = () => {
        const base64Str = Buffer.from(reader.result as ArrayBuffer).toString(
          "base64"
        );
        const dataUrl = `data:image/webp;base64,${base64Str}`;
        setImageUrl(dataUrl);
      };
      reader.readAsArrayBuffer(response.data);
    })
    .catch((error) => {
      console.error("Error fetching photo:", error);
      throw error;
    });
};

const updateIncidentStatus = async (
  axiosInstance: AxiosInstance,
  incident_id: string,
  status: string
) => {
  try {
    const response = await axiosInstance.patch(
      `/incidents/${incident_id}/status`,
      status,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "text/plain",
        },
      }
    );
    if (response.status !== 200) {
      throw new Error(`Failed to update incident status: ${response.status}`);
    }
    return response.status;
  } catch (error) {
    console.log("Error updating incident status:", error);
    throw error;
  }
};

const getIncidentVideos = async (
  axiosInstance: AxiosInstance,
  incident_id: string
) => {
  try {
    const response = await axiosInstance.get<IncidentVideosResponse[]>(
      `/incidents/${incident_id}/videos`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching video:", error);
    throw error;
  }
};

export {
  getOccurrence,
  getIncident,
  getIncidentsSummary,
  getIncidentsMap,
  getOrganizationsCategories,
  getOccurrencesIds,
  getOccurrenceDetailsResponse,
  getPhoto,
  getIncidentVideos,
  updateIncidentStatus,
  logInAPI,
  logOutAPI,
  refreshToken,
};
