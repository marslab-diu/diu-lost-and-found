import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import ItemCard from '../../components/User/ItemCard';
import useAuth from '../../hooks/useAuth';

const RecoveredItems = () => {
    const axiosSecure = useAxiosSecure();
    const { user, loading } = useAuth();

    // Fetch stored items for users - only when user is authenticated and not loading
    const { data: items = [], isLoading, error } = useQuery({
        queryKey: ['stored-items-user'],
        enabled: !loading && !!user, // Only run query when user is loaded and exists
        queryFn: async () => {
            try {
                const response = await axiosSecure.get('/found-reports/stored-for-users');
                return response.data;
            } catch (error) {
                console.error('Error fetching stored items:', error);
                throw error;
            }
        },
        retry: 1, // Only retry once to avoid infinite loops
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Show loading spinner while auth is loading
    if (loading) {
        return (
            <div className="min-h-screen py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-center items-center h-64">
                        <div className="loading loading-spinner loading-lg"></div>
                        <p className="ml-4">Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Show error state if there's an error
    if (error) {
        return (
            <div className="min-h-screen py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center py-16">
                        <div className="text-red-400 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-medium text-red-600 mb-2">
                            Error Loading Items
                        </h3>
                        <p className="text-gray-500 mb-4">
                            There was an error loading the recovered items. Please try again.
                        </p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="btn btn-primary"
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4">
                

                {/* Loading State for Items */}
                {isLoading && (
                    <div className="flex justify-center items-center h-64">
                        <div className="loading loading-spinner loading-lg"></div>
                        <p className="ml-4">Loading items...</p>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && items.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-gray-400 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-4v4.01M7 9v4.01" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-medium text-gray-600 mb-2">
                            No Items Available
                        </h3>
                        <p className="text-gray-500">
                            There are currently no recovered items available for claiming.
                        </p>
                    </div>
                )}

                {/* Items Grid */}
                {!isLoading && items.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-6">
                        {items.map((item) => (
                            <ItemCard key={item._id} item={item} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecoveredItems;