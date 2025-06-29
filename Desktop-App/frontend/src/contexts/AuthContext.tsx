import {
  createContext,
  useContext,
  ReactNode,
} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  LoginCredentials,
  logInAPI,
  logOutAPI,
  refreshToken,
} from '../api';

interface AuthContextType {
  axiosInstance: any;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  // other methods like signup, reset password, etc.
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate();

  const host_protocol = import.meta.env.VITE_BACKEND_PROTOCOL || "https";
  const host_name = import.meta.env.VITE_BACKEND_HOST || "localhost";
  const host_port = import.meta.env.VITE_BACKEND_PORT || "443";
  const endpoints_prefix = import.meta.env.ENDPOINTS_PREFIX || "/api/v1";
  const host_url = `${host_protocol}://${host_name}:${host_port}${endpoints_prefix}`;

  // axios config
  const axiosInstance = axios.create({
    baseURL: host_url,
    withCredentials: true,
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        if (error.config.url === '/auth/refresh-token') {
          navigate('/login');
        } else{
          try {
            await refreshToken(axiosInstance);
            return axiosInstance.request(error.config);
          } catch (error) {
            navigate('/login');
          }
        }
      }
      return Promise.reject(error);
    }
  );


  // login method
  const login = async (credentials: LoginCredentials) => {
    try {
        const formData = new URLSearchParams();
        formData.append('username', credentials.username);
        formData.append('password', credentials.password);
        await logInAPI(axiosInstance, formData);
        navigate('/service/home'); // navigate to home page
    } catch (error) {
        console.log('Login error:', error);
        throw error;
    }
  };

  // logout method
  const logout = async () => {
    try {
      await logOutAPI(axiosInstance);
      navigate('/login'); // navigate to login page
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  const value = {
    axiosInstance,
    login,
    logout,
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
