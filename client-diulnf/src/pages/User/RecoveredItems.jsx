import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import ItemCard from '../../components/User/ItemCard';

const RecoveredItems = () => {
    const axiosSecure = useAxiosSecure();

    // fetch stored items for users
    const { data: items = [], isLoading } = useQuery({
        queryKey: ['stored-items-user'],
        queryFn: async () => {
            const response = await axiosSecure.get('/found-reports/stored-for-users');
            return response.data;
        }
    });

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4">
               
                {/* Loading State */}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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