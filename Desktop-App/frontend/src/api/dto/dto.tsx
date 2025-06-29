interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
}

interface OccurrenceResponse {
  occurrence_id: string;
  photo_id: string;
  category: string;
  date: string;
  status: string;
  photo_latitude: number;
  photo_longitude: number;
  description: string;
}

interface IncidentResponse {
incident_id: string;
main_category: string;
severity: string;
occurrences: number;
status: string;
main_description: string;
centroid_latitude: number;
centroid_longitude: number;
}

interface IncidentSummaryResponse {
incident_id: string;
main_category: string;
severity: string;
status: string;
date: string;
num_occurrences: number;
time_id: string;
}

interface IncidentMapResponse {
incident_id: string;
photo_id: string;
centroid_latitude: number; 
centroid_longitude: number;
main_category: string;
}

interface OrganizationCategoriesResponse {
category: string;
description: string;
num_pending: number;
num_in_progress: number;
num_resolved: number;
}

interface OccurrenceIdResponse {
occurrence_id: string;
}

interface OccurrenceDetailsResponse {
occurrence_id: string;
photo_id: string;
description: string;
date: string;
}

interface IncidentVideosResponse {
  video_id: string;
  incident_id: string;
  created_at: string;
  edge_data_id: string;
}

export type {
  OccurrenceResponse,
  IncidentResponse,
  IncidentSummaryResponse,
  IncidentMapResponse,
  LoginCredentials,
  LoginResponse,
  OrganizationCategoriesResponse,
  OccurrenceIdResponse,
  OccurrenceDetailsResponse,
  IncidentVideosResponse,
};