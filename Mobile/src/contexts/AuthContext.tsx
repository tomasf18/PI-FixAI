import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { LoginCredentials, logInAPI, signUpAPI, refreshToken } from '@/api';
import Constants from 'expo-constants';

interface AuthContextType {
  token: string | null;
  axiosInstance: any;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (email: string) => Promise<void>;
  logout: () => void;
  addToken: (key: string, token: string, set_token: boolean, store: boolean) => Promise<void>;
  removeTokens: () => Promise<void>;
  // other methods like signup, reset password, etc.
}

const BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL; // The configuration of the base URL is in the app.json file
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: AuthProviderProps) => {
  // axios config
  const axiosInstance = axios.create({
    baseURL: BASE_URL,
  });

  const [token, setToken] = useState<string | null>(null);

  // load token when app starts
  useEffect(() => {
    const loadToken = async () => {
      const storedAccessToken = await SecureStore.getItemAsync(
        ACCESS_TOKEN_KEY
      );
      if (storedAccessToken) {
        setToken(storedAccessToken);
        axiosInstance.defaults.headers.common['Authorization'] =
          storedAccessToken;
      }
    };
    loadToken();
  }, []);

  const responseInterceptor = axiosInstance.interceptors.response.use(
    (response) => response, // Pass through successful responses
    async (error) => {
      const isUnauthorized = error.response?.status === 401;
      const isRefreshTokenEndpoint = error.config.url === '/auth/refresh-token';
      const tokenExpired = error.response?.data?.detail === 'Token has expired';

      if (!isUnauthorized) {
        return Promise.reject(error); // Reject non-401 errors
      }

      console.log('401 Unauthorized detected.');

      if (isRefreshTokenEndpoint) {
        console.log('Token refresh failed, redirecting to sign-in...');
        logout();
        return Promise.reject(error);
      }

      if (!tokenExpired) {
        console.log('Unauthorized error, logging out...');
        logout();
        return Promise.reject(error);
      }

      console.log('Token has expired, attempting to refresh...');
      try {
        const storedRefreshToken = await SecureStore.getItemAsync(
          REFRESH_TOKEN_KEY
        );

        if (!storedRefreshToken) {
          console.log('No stored refresh token found, logging out...');
          logout();
          return Promise.reject(error);
        }

        // Temporarily set the refresh token for the request
        await addToken(REFRESH_TOKEN_KEY, storedRefreshToken, true, false);

        const refreshResponse = await refreshToken(axiosInstance);
        const { access_token: newAccessToken, refresh_token: newRefreshToken } =
          refreshResponse.data;

        // Update tokens
        await addToken(REFRESH_TOKEN_KEY, newRefreshToken, false, true);
        await addToken(ACCESS_TOKEN_KEY, newAccessToken);

        // Retry the original request with the new access token
        error.config.headers['Authorization'] = newAccessToken;
        return axiosInstance.request(error.config);
      } catch (refreshError) {
        console.log('Token refresh failed, logging out...');
        logout();
        return Promise.reject(refreshError);
      }
    }
  );

  // if token exists, set it to axios header
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = token;
  }

  // login method
  const login = async (credentials: LoginCredentials) => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', credentials.username);
      formData.append('password', credentials.password);
      const response = await logInAPI(axiosInstance, formData);
      const access_token = response.data.access_token;
      const refresh_token = response.data.refresh_token;
      await addToken(ACCESS_TOKEN_KEY, access_token);
      await addToken(REFRESH_TOKEN_KEY, refresh_token, false);

      router.replace('/home'); // navigate to home page
    } catch (error) {
      console.log('Login error:', error);
      throw error;
    }
  };

  // signup method
  const signup = async (email: string) => {
    const response = await signUpAPI(axiosInstance, email);
    if (response) {
      router.push('/confirm-code?type=signUp');
    }
  };

  // logout method
  const logout = () => {
    removeTokens();
    router.replace('/sign-in'); // navigate to sign-in page
  };

  const addToken = async (
    key: string,
    token: string,
    set_token: boolean = true,
    store: boolean = true
  ) => {
    if (store) {
      await SecureStore.setItemAsync(key, token);
    }
    if (set_token) {
      setToken(token);
      axiosInstance.defaults.headers.common['Authorization'] = token;
    }
  };

  const removeTokens = async () => {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    setToken(null);
    delete axiosInstance.defaults.headers.common['Authorization'];
  };

  const value = {
    token,
    axiosInstance,
    login,
    signup,
    logout,
    addToken,
    removeTokens,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// custom hook to use auth context
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
