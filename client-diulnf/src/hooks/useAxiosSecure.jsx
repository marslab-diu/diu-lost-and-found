import axios from 'axios';
import useAuth from './useAuth';
import { useNavigate } from 'react-router';
import { auth } from '../contexts/AuthProvider'; 

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const useAxiosSecure = () => {
  const { logOutUser } = useAuth();
  const navigate = useNavigate();

  axiosSecure.interceptors.request.use(async (config) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const token = await currentUser.getIdToken(true); // get fresh token
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error("Error getting fresh token:", error);
      }
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  axiosSecure.interceptors.response.use(res => res, (error) => {
    const status = error.response?.status;
    if (status === 403) {
      navigate('/forbidden');
    } else if (status === 401) {
      logOutUser().then(() => navigate('/')).catch(() => {});
    }
    return Promise.reject(error);
  });

  return axiosSecure;
};

export default useAxiosSecure;
