import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import ItemCard from '../../components/User/ItemCard';
import useAuth from '../../hooks/useAuth';

const SearchedResults = () => {
    const axiosSecure = useAxiosSecure();
    const { user, loading } = useAuth();
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('q') || '';
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');


    const { data: items = [], isLoading, error } = useQuery({
        queryKey: ['search-items', searchQuery],
        enabled: !loading && !!user && !!searchQuery,
        queryFn: async () => {
            try {
                const response = await axiosSecure.get(`/found-reports/search?q=${encodeURIComponent(searchQuery)}`);
                return response.data;
            } catch (error) {
                console.error('Error fetching search results:', error);
                throw error;
            }
        },
        retry: 1,
        staleTime: 5 * 60 * 1000,
    });

   
    const filteredItems = useMemo(() => {
        if (!startDate && !endDate) return items;

        return items.filter(item => {
            const itemDate = new Date(item.found_date);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            if (start && end) {
                return itemDate >= start && itemDate <= end;
            } else if (start) {
                return itemDate >= start;
            } else if (end) {
                return itemDate <= end;
            }
            return true;
        });
    }, [items, startDate, endDate]);

 
    const clearFilters = () => {
        setStartDate('');
        setEndDate('');
    };

   
    if (loading) {
        return (
            <div className="py-8">
                <div className="w-11/12 mx-auto px-4">
                    <div className="flex justify-center items-center h-64">
                        <div className="loading loading-spinner loading-lg"></div>
                        <p className="ml-4">Loading...</p>
                    </div>
                </div>
            </div>
        );
    }


    if (error) {
        return (
            <div className="min-h-screen py-8">
                <div className="w-11/12 mx-auto px-4">
                    <div className="text-center py-16">
                        <div className="text-red-400 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-medium text-red-600 mb-2">
                            Error Loading Search Results
                        </h3>
                        <p className="text-gray-500 mb-4">
                            There was an error loading the search results. Please try again.
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

    // Show msg if no search query
    if (!searchQuery) {
        return (
            <div className="py-8">
                <div className="w-11/12 mx-auto px-4">
                    <div className="text-center py-16">
                        <div className="text-gray-400 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-medium text-gray-600 mb-2">
                            No Search Query
                        </h3>
                        <p className="text-gray-500">
                            Please enter a search term to find items.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-8">
            <div className="w-11/12 mx-auto px-4">
               
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-8">
               
                    <div className="flex-1">
                        <h2 className='text-lg font-semibold text-gray-800'>
                            Search results for "{searchQuery}"
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Showing {filteredItems.length} items found
                            {(startDate || endDate) && (
                                <span>
                                    {startDate && endDate ? 
                                        ` between ${new Date(startDate).toLocaleDateString()} and ${new Date(endDate).toLocaleDateString()}` :
                                        startDate ? 
                                            ` from ${new Date(startDate).toLocaleDateString()}` :
                                            ` until ${new Date(endDate).toLocaleDateString()}`
                                    }
                                </span>
                            )}
                        </p>
                    </div>

                   
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <div className="flex items-center gap-2">
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                max={endDate || new Date().toISOString().split('T')[0]}
                                className="px-6 focus-within:outline-none input input-bordered input-sm"
                                placeholder="From date"
                            />
                            <span className="text-gray-500">—</span>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                min={startDate}
                                max={new Date().toISOString().split('T')[0]}
                                className="px-6 focus-within:outline-none input input-bordered input-sm"
                                placeholder="To date"
                            />
                        </div>
                        
                        {(startDate || endDate) && (
                            <button
                                onClick={clearFilters}
                                className="btn btn-sm btn-outline"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

           
                {isLoading && (
                    <div className="flex justify-center items-center h-64">
                        <div className="loading loading-spinner loading-lg"></div>
                        <p className="ml-4">Searching items...</p>
                    </div>
                )}

                
                {!isLoading && filteredItems.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-gray-400 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-medium text-gray-600 mb-2">
                            {items.length === 0 ? 'No Items Found' : 'No Items Match Filter'}
                        </h3>
                        <p className="text-gray-500">
                            {items.length === 0 ? 
                                `No items found matching "${searchQuery}". Try searching with different keywords.` :
                                'No items found for the selected date range. Try adjusting your filters.'
                            }
                        </p>
                        {items.length > 0 && (
                            <button
                                onClick={clearFilters}
                                className="btn btn-primary mt-4"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                )}

                
                {!isLoading && filteredItems.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                        {filteredItems.map((item) => (
                            <ItemCard key={item._id} item={item} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchedResults;