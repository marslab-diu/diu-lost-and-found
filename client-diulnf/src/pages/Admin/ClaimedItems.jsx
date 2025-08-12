import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const ClaimedItems = () => {
    const axiosSecure = useAxiosSecure();
    const [selectedItem, setSelectedItem] = useState(null);

    // Fetch claimed items (without claimer details)
    const { data: items = [], isLoading } = useQuery({
        queryKey: ['claimed-items'],
        queryFn: async () => {
            const response = await axiosSecure.get('/found-reports/claimed');
            return response.data;
        }
    });

    // Fetch item details with claimer info when modal opens
    const { data: itemDetails, isLoading: detailsLoading } = useQuery({
        queryKey: ['item-details', selectedItem?._id],
        enabled: !!selectedItem,
        queryFn: async () => {
            const response = await axiosSecure.get(`/found-reports/details/${selectedItem._id}`);
            return response.data;
        }
    });

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    const formatTime = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const handleDetailsClick = (item) => {
        setSelectedItem(item);
    };

    const closeModal = () => {
        setSelectedItem(null);
    };

    return (
        <div className="p-0">
            <div className="bg-white rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th>Item ID</th>
                                <th>Item</th>
                                <th>Color</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Location</th>
                                <th>Submit Date</th>
                                <th>Submit Time</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="9" className="text-center py-8">
                                        <div className="loading loading-spinner loading-lg"></div>
                                        <p className="mt-2">Loading claimed items...</p>
                                    </td>
                                </tr>
                            ) : items.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="text-center py-8 text-gray-500">
                                        No claimed items found
                                    </td>
                                </tr>
                            ) : (
                                items.map((item) => (
                                    <tr key={item._id} className="hover:bg-base-200">
                                        <td className="font-mono">{item.reportId}</td>
                                        <td>{item.itemName}</td>
                                        <td>{item.color}</td>
                                        <td>{formatDate(item.found_date)}</td>
                                        <td>{item.found_time || 'N/A'}</td>
                                        <td>{item.found_location}</td>
                                        <td>{formatDate(item.createdAt)}</td>
                                        <td>{formatTime(item.createdAt)}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm rounded-full btn-outline border-gray-700"
                                                onClick={() => handleDetailsClick(item)}
                                            >
                                                Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedItem && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-5xl p-0 rounded-2xl">
                        {detailsLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="loading loading-spinner loading-lg"></div>
                                <p className="ml-4">Loading details...</p>
                            </div>
                        ) : itemDetails ? (
                            <>
                            
                                <div className="flex flex-col md:flex-row gap-6 p-8 pb-4 items-center">
                                    <div className="w-48 h-40 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                        <img
                                            src={itemDetails.imageUrl || "/default-item.jpg"}
                                            alt="Found Item"
                                            className="w-full h-full object-cover"
                                            onError={e => { e.currentTarget.src = "/default-item.jpg"; }}
                                        />
                                    </div>
                                    <div className="flex-1 grid grid-cols-3 gap-x-8 gap-y-2 w-full">
                                        <div>
                                            <span className="font-semibold text-gray-700">Item ID</span>
                                            <div>{itemDetails.reportId}</div>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-gray-700">Item</span>
                                            <div>{itemDetails.itemName}</div>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-gray-700">Color</span>
                                            <div>{itemDetails.color}</div>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-gray-700">Date</span>
                                            <div>{formatDate(itemDetails.found_date)}</div>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-gray-700">Time</span>
                                            <div>{itemDetails.found_time || 'N/A'}</div>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-gray-700">Location</span>
                                            <div>{itemDetails.found_location}</div>
                                        </div>
                                        <div className="col-span-3">
                                            <span className="font-semibold text-gray-700">Item Description</span>
                                            <div className="mt-1 text-gray-800">{itemDetails.description}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="divider m-0"></div>

                               
                                <div className="flex flex-col md:flex-row items-center gap-6 p-8 pb-4">
                                    <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                        <img
                                            src="/avatar.jpg"
                                            alt="Founder"
                                            className="w-full h-full object-cover"
                                            onError={e => { e.currentTarget.src = "/avatar.jpg"; }}
                                        />
                                    </div>
                                    <div className="flex-1 grid grid-cols-3 gap-x-8 gap-y-2 w-full">
                                        <div className="col-span-3 mb-2">
                                            <h3 className="font-semibold text-gray-700 text-lg">Founded By</h3>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-gray-700">Name</span>
                                            <div>{itemDetails.reportedByUser?.name || 'N/A'}</div>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-gray-700">ID</span>
                                            <div>{itemDetails.reportedByUser?.universityId || 'N/A'}</div>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-gray-700">Email</span>
                                            <div>{itemDetails.reportedByUser?.email || 'N/A'}</div>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="font-semibold text-gray-700">Department</span>
                                            <div>{itemDetails.reportedByUser?.department || 'N/A'}</div>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-gray-700">Phone</span>
                                            <div>{itemDetails.reportedByUser?.phone || 'N/A'}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Received By Info */}
                                {itemDetails.storedBy && (
                                    <>
                                        <div className="divider m-0"></div>
                                        <div className="p-8 py-4">
                                            <h3 className="font-semibold text-gray-700 mb-4 text-lg">Received By</h3>
                                            <div className="grid grid-cols-3 gap-x-8 gap-y-2">
                                                <div>
                                                    <span className="font-semibold text-gray-700">Admin Email</span>
                                                    <div>{itemDetails.storedBy}</div>
                                                </div>
                                                <div>
                                                    <span className="font-semibold text-gray-700">Stored Date</span>
                                                    <div>{formatDate(itemDetails.storedAt)}</div>
                                                </div>
                                                <div>
                                                    <span className="font-semibold text-gray-700">Stored Time</span>
                                                    <div>{formatTime(itemDetails.storedAt)}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                               
                                {itemDetails.claimsWithUserDetails && itemDetails.claimsWithUserDetails.length > 0 && (
                                    <>
                                        <div className="divider m-0"></div>
                                        <div className="p-8 pt-4">
                                            <h3 className="font-semibold text-gray-700 mb-4 text-lg">Claimed By</h3>
                                            <div className="overflow-x-auto">
                                                <table className="table w-full">
                                                    <thead>
                                                        <tr>
                                                            <th>Name</th>
                                                            <th>Email</th>
                                                            <th>Phone</th>
                                                            <th>University ID</th>
                                                            <th>Department</th>
                                                            <th>Claimed Date</th>
                                                            <th>Message</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {itemDetails.claimsWithUserDetails.map((claim, index) => (
                                                            <tr key={index}>
                                                                <td>{claim.userDetails?.name || 'N/A'}</td>
                                                                <td>{claim.userDetails?.email || 'N/A'}</td>
                                                                <td>{claim.userDetails?.phone || 'N/A'}</td>
                                                                <td>{claim.userDetails?.universityId || 'N/A'}</td>
                                                                <td>{claim.userDetails?.department || 'N/A'}</td>
                                                                <td>{formatDate(claim.claimedAt)}</td>
                                                                <td>
                                                                    {claim.message ? (
                                                                        <div className="tooltip" data-tip={claim.message}>
                                                                            <span className="text-sm truncate max-w-xs block">
                                                                                {claim.message.length > 30 
                                                                                    ? `${claim.message.substring(0, 30)}...` 
                                                                                    : claim.message
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    ) : (
                                                                        'No message'
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500">Failed to load item details</p>
                            </div>
                        )}

                        <div className="divider m-0"></div>
                        
                        {/* Actions - Only Close Button */}
                        <div className="flex justify-end gap-3 px-8 py-6">
                            <button 
                                className="btn btn-outline rounded-full" 
                                onClick={closeModal}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                    <div className="modal-backdrop" onClick={closeModal}></div>
                </div>
            )}
        </div>
    );
};

export default ClaimedItems;