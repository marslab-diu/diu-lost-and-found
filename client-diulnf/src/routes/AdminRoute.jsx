import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navigate } from 'react-router';
import useAuth from '../hooks/useAuth';
import useAxiosSecure from '../hooks/useAxiosSecure';
import Forbidden from '../pages/Shared/Forbidden';

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();

    // Check if user is admin
    const { data: adminData, isLoading: adminLoading, error } = useQuery({
        queryKey: ['admin', user?.email],
        enabled: !loading && !!user?.email,
        queryFn: async () => {
            try {
                const response = await axiosSecure.get(`/admins/${user.email}`);
                return response.data;
            } catch (error) {
                if (error.response?.status === 404) {
                    return null;
                }
                throw error;
            }
        },
        retry: 1,
        staleTime: 5 * 60 * 1000,
    });

    // Show loading while checking authentication and admin status
    if (loading || adminLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="loading loading-spinner loading-lg"></div>
                    <p className="text-gray-600">Verifying permissions...</p>
                </div>
            </div>
        );
    }

    // If no user is logged in, redirect to login
    if (!user) {
        return <Navigate to="/auth/login" replace />;
    }

    // If user is not an admin (role !== "admin"), show forbidden page
    if (!adminData || adminData.role !== "admin") {
        return <Forbidden />;
    }

    // If user is admin, render the protected content
    return children;
};

export default AdminRoute;