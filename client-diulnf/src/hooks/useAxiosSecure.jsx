import axios from 'axios';
import React from 'react';
import useAuth from './useAuth';
import { useNavigate } from 'react-router';


const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

const useAxiosSecure = () => {
    const { user, logOutUser } = useAuth();
    const navigate = useNavigate();

    axiosSecure.interceptors.request.use(config => {
        if (user?.accessToken) {
            config.headers.Authorization = `Bearer ${user.accessToken}`;
            // console.log("Bearer Token being sent:", config.headers.Authorization);
            
        } else {
            console.log("No user or accessToken found");
        }
        return config;
    }, error => {
        console.error("Request interceptor error:", error);
        return Promise.reject(error);
    });

    axiosSecure.interceptors.response.use(res => {
        // console.log("Response received:", res.status, res.data);
        return res;
    }, error => {
        console.error("Response error:", error.response);
        const status = error.response?.status;
        
        if (status === 403) {
            navigate('/forbidden');
        } else if (status === 401) {
            console.log("401 error - logging out user");
            logOutUser()
                .then(() => {
                    navigate('/')
                })
                .catch(() => {});
        }

        return Promise.reject(error);
    });

    return axiosSecure;
};

export default useAxiosSecure;