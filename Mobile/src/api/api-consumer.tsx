import { AxiosInstance } from 'axios';
import { Buffer } from 'buffer';
import {
  OccurrenceListResponse,
  OccurrenceResponse,
  OccurrenceStatsResponse,
  NotResolvedOccurrencesResponse,
  LoginResponse,
  SignupCredentials,
  UserProfile,
  PreSubmitOccurrenceResponse,
  OccurrenceSuggestionsResponse,
  SubmitOccurrence,
  ConfirmationCode,
  LoginCredentials,
  NewPasswordRequest,
  LLMResponse,
} from '@/api';
import Constants from 'expo-constants';

const WEBSOCKET_BASE_URL = Constants.expoConfig?.extra?.WEBSOCKET_BASE_URL

const logInAPI = async (
  axiosInstance: AxiosInstance,
  formData: URLSearchParams
) => {
  const response = await axiosInstance.post<LoginResponse>(
    '/auth/log-in?is_user=true',
    formData.toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return response;
};

const signUpAPI = async (axiosInstance: AxiosInstance, email: string) => {
  try {
    console.log('signup email:', email);
    const response = await axiosInstance.post<void>(
      '/auth/sign-up',
      { email },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response;
  } catch (error) {
    console.log('Signup error:', error);
    throw error;
  }
};

const confirmCode = async (
  axiosInstance: AxiosInstance,
  confirmation_code_data: ConfirmationCode,
  recover_password: boolean = false
) => {
  try {
    console.log('confirmation_code_data:', confirmation_code_data);
    const response = await axiosInstance.post(
      '/auth/code-confirmation?forgotten_password=' + recover_password,
      confirmation_code_data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response;
  } catch (error) {
    console.log('Error confirming code:', error);
    throw error;
  }
};

const confirmNewPassword = async (
  axiosInstance: AxiosInstance,
  new_password_request: NewPasswordRequest
) => {
  try {
    const response = await axiosInstance.post<void>(
      '/auth/new-password',
      new_password_request,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response;
  } catch (error) {
    console.log('Error confirming code:', error);
    throw error;
  }
}

const resendCode = async (
  axiosInstance: AxiosInstance,
  email: string
) => {
  try {
    const response = await axiosInstance.post<void>(
      '/auth/resend-code',
      { email },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response;
  } catch (error) {
    console.log('Error confirming code:', error);
    throw error;
  }
}

const confirmCodeUpdate = async (
  axiosInstance: AxiosInstance,
  confirmation_code_data: ConfirmationCode
) => {
  try {
    console.log('confirmation_code_data:', confirmation_code_data);
    const response = await axiosInstance.post<LoginResponse>(
      '/auth/update-code-confirmation',
      confirmation_code_data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response;
  } catch (error) {
    console.log('Error confirming code:', error);
    throw error;
  }
};

const getPhoto = async (
  axiosInstance: AxiosInstance,
  photo_id: string,
  setImageUrl: (url: string) => void
) => {
  console.log('Fetching photo with ID:', photo_id);
  axiosInstance
    .get(`/photos/${photo_id}`, {
      responseType: 'blob',
    })
    .then((response) => {
      const reader = new FileReader();
      // add trigger
      reader.onloadend = () => {
        const base64Str = Buffer.from(reader.result as ArrayBuffer).toString(
          'base64'
        );
        const dataUrl = `data:image/webp;base64,${base64Str}`;
        setImageUrl(dataUrl);
      };
      reader.readAsArrayBuffer(response.data);
    })
    .catch((error: any) => {
      console.error('Error fetching photo:', error);
      throw error;
    });
};

const getUserDetails = async (axiosInstance: AxiosInstance) => {
  try {
    const response = await axiosInstance.get<UserProfile>('/auth/users/me');
    return response.data;
  } catch (error: any) {
    console.log('Error fetching user details:', error);
    throw error;
  }
};

const putUserProfile = async (
  axiosInstance: AxiosInstance,
  userProfile: UserProfile,
  update: boolean = false
) => {
  try {
    const response = await axiosInstance.put<LoginResponse>(
      '/auth/user-profile?update=' + update,
      userProfile,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response;
  } catch (error: any) {
    console.log('Error updating user profile:', error);
    throw error;
  }
};

const forgottenPassword = async (
  axiosInstance: AxiosInstance,
  email: string
) => {
    return await axiosInstance.post<void>(
      '/auth/forgotten-password',
      { email },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
}

const deleteUserAccount = async (
  axiosInstance: AxiosInstance,
  userProfile: UserProfile
) => {
  try {
    const response = await axiosInstance.delete<void>('/auth/user-profile', {
      headers: {
        'Content-Type': 'application/json',
      },
      data: userProfile,
    });
    console.log(response.data);
  } catch (error: any) {
    console.log('Error deleting user account:', error);
    throw error;
  }
};

const getUserOccurrenceDetails = async (axiosInstance: AxiosInstance) => {
  try {
    const response = await axiosInstance.get<OccurrenceStatsResponse>(
      '/users/stats'
    );
    return response.data;
  } catch (error: any) {
    console.log('Error fetching user occurrence details:', error);
    throw error;
  }
};

const getUserOccurrences = async (
  axiosInstance: AxiosInstance,
  status: string,
  max_time_ud: string
) => {
  try {
    const response = await axiosInstance.get<OccurrenceListResponse[]>(
      '/users/occurrences-by-time',
      {
        params: {
          status,
          max_time_ud,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.log('Error fetching user occurrences:', error);
    throw error;
  }
};

const getOccurrence = async (
  axiosInstance: AxiosInstance,
  occurrence_id: string
) => {
  try {
    const response = await axiosInstance.get<OccurrenceResponse>(
      `/occurrences/${occurrence_id}`
    );
    return response.data;
  } catch (error: any) {
    console.log('Error fetching occurrence:', error);
    throw error;
  }
};

const getNotResolvedOccurrences = async (axiosInstance: AxiosInstance) => {
  try {
    const response = await axiosInstance.get<NotResolvedOccurrencesResponse[]>(
      '/users/occurrences-not-resolved'
    );
    return response.data;
  } catch (error: any) {
    console.log('Error fetching not resolved occurrences:', error);
    throw error;
  }
};

const preSubmitOccurrence = async (
  axiosInstance: AxiosInstance,
  latitude: number,
  longitude: number,
  photoUri: string
) => {
  try {
    const formData = new FormData();
    formData.append('photo', {
      uri: photoUri,
      type: 'image/png',
      name: 'photo.png',
    } as any);

    const response = await axiosInstance.post<PreSubmitOccurrenceResponse>(
      '/occurrences/pre-submission',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        params: {
          latitude,
          longitude,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.log('Error pre-submitting occurrence:', error);
    throw error;
  }
};


const connectIncidentWebSocket = async (
  incidentId: string,
  onMessage: (data: LLMResponse) => void,
  onTimeout?: () => void
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(
      `${WEBSOCKET_BASE_URL}/ws/llm/${incidentId}`
    );

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log('\n\nWebSocket message received:', message, '\n\n');
        if (!message.type || message.type === 'llm_response') {
          onMessage(message);
          socket.close();
          resolve(); // Resolve the promise when the message is handled
        }
      } catch (error) {
        reject(error instanceof Error ? error : new Error(String(error))); // Reject the promise if JSON parsing fails
      }
    };

    socket.onerror = (error) => {
      console.log('WebSocket error:', error);
      reject(error instanceof Error ? error : new Error(JSON.stringify(error))); // Reject the promise on WebSocket error
    };

    // Optional: Timeout fallback
    if (onTimeout) {
      setTimeout(() => {
        if (socket.readyState !== WebSocket.CLOSED) {
          console.log('LLM timeout fallback triggered.');
          onTimeout();
          socket.close();
          resolve(); // Resolve the promise after timeout
        }
      }, 10000); // 10 seconds timeout
    }
  });
};

const getOccurrenceSuggestions = async (
  axiosInstance: AxiosInstance,
  incident_id: string
) => {
  try {
    const response = await axiosInstance.get<OccurrenceSuggestionsResponse>(
      `/incidents/${incident_id}/suggestions`
    );
    return response.data;
  } catch (error: any) {
    console.log('Error fetching occurrence suggestions:', error);
    // Check if the error is a 404 (not found) or similar "expected" error
    if (error.response && error.response.status === 404) {
      // Return an empty response instead of throwing
      return { main_category: '', main_description: '' };
    }

    // For other errors (e.g., network issues, 500 errors), re-throw the error
    throw error;
  }
};

const submitOccurrence = async (
  axiosInstance: AxiosInstance,
  submitOccurrence: SubmitOccurrence
) => {
  try {
    const response = await axiosInstance.post<void>(
      '/occurrences',
      submitOccurrence,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response;
  } catch (error: any) {
    console.log('Error submitting occurrence:', error);
    // I want to know more about the error
    console.log('Error details:', error.response?.data);
    throw error;
  }
};

const getEmailNotifications = async (axiosInstance: AxiosInstance) => {
  try {
    const response = await axiosInstance.get<boolean>(
      '/users/email-notifications'
    );
    return response.data;
  } catch (error: any) {
    console.log('Error fetching email notifications:', error);
    throw error;
  }
};

const putEmailNotifications = async (
  axiosInstance: AxiosInstance,
  email_notifications: boolean
) => {
  try {
    const response = await axiosInstance.patch<void>(
      '/users/email-notifications',
      null,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          email_notifications,
        },
      }
    );
    console.log(response.data);
    return response;
  } catch (error: any) {
    console.log('Error updating email notifications:', error);
    throw error;
  }
};

const refreshToken = async (
  axiosInstance: AxiosInstance
) => {
  try {
    const response = await axiosInstance.get<LoginResponse>(
      '/auth/refresh-token'
    );
    return response;
  } catch (error) {
    console.log('Error refreshing token:', error);
    throw error;
  }
};

export {
  getUserOccurrenceDetails,
  getUserOccurrences,
  getOccurrence,
  getNotResolvedOccurrences,
  logInAPI,
  signUpAPI,
  getUserDetails,
  putUserProfile,
  deleteUserAccount,
  preSubmitOccurrence,
  getOccurrenceSuggestions,
  submitOccurrence,
  getPhoto,
  confirmCode,
  confirmCodeUpdate,
  getEmailNotifications,
  putEmailNotifications,
  refreshToken,
  resendCode,
  forgottenPassword,
  confirmNewPassword,
  connectIncidentWebSocket,
};
