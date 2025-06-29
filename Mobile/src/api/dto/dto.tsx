interface OccurrenceStatsResponse {
  name: string;
  pendingOccurrences: number;
  inProgressOccurrences: number;
  resolvedOccurrences: number;
}

interface OccurrenceListResponse {
  occurrence_id: string;
  category: string;
  status: string;
  photo_id: string;
  date: string;
  time_id: string;
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

interface NotResolvedOccurrencesResponse {
  occurrence_id: string;
  category: string;
  photo_id: string;
  photo_latitude: number;
  photo_longitude: number;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}

interface ConfirmationCode {
  code: string;
  name: string;
  email: string;
  password: string;
}

interface UserProfile {
  name: string;
  email: string;
  password: string;
}

interface PreSubmitOccurrenceResponse {
  incident_id: string;
  max_time_to_submit: number;
  allowed_categories: string[];
  photo_id: string;
}

interface OccurrenceSuggestionsResponse {
  main_category: string;
  main_description: string;
}

interface SubmitOccurrence {
  incident_id: string;
  photo_id: string;
  category: string;
  date: string;
  photo_latitude: number;
  photo_longitude: number;
  description: string;
  severity: string;
}
interface LocationCoords {
  photo_latitude: number;
  photo_longitude: number;
};

interface NewPasswordRequest {
  code: string;
  email: string;
  new_password: string;
} 

interface LLMResponse {
  description: string;
  category: string;
  severity: string;
}

export type {
  OccurrenceStatsResponse,
  OccurrenceListResponse,
  OccurrenceResponse,
  NotResolvedOccurrencesResponse,
  LoginCredentials,
  LoginResponse,
  SignupCredentials,
  UserProfile,
  PreSubmitOccurrenceResponse,
  OccurrenceSuggestionsResponse,
  SubmitOccurrence,
  LocationCoords,
  ConfirmationCode,
  NewPasswordRequest,
  LLMResponse,
}


  