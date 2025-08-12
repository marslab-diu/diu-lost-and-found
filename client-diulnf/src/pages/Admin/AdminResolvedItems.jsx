import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const AdminResolvedItems = () => {
    const axiosSecure = useAxiosSecure();
    const [selectedItem, setSelectedItem] = useState(null);

    // resolved items
    const { data: items = [], isLoading } = useQuery({
        queryKey: ['resolved-items'],
        queryFn: async () => {
            const response = await axiosSecure.get('/found-reports/resolved');
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

    return (
        <div className="p-0">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Resolved Items</h1>
                <p className="text-gray-600 mt-2">Items that have been successfully handed over</p>
            </div>
            
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
                                <th>Hand Over Date</th>
                                <th>Hand Over Time</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="9" className="text-center py-8">
                                        <div className="loading loading-spinner loading-lg"></div>
                                        <p className="mt-2">Loading resolved items...</p>
                                    </td>
                                </tr>
                            ) : items.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="text-center py-8 text-gray-500">
                                        No resolved items found
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
                                        <td>{formatDate(item.handedOverAt)}</td>
                                        <td>{formatTime(item.handedOverAt)}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm rounded-full btn-outline border-gray-700"
                                                onClick={() => setSelectedItem(item)}
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
                        
                        <div className="flex flex-col md:flex-row gap-6 p-8 pb-4 items-center">
                            <div className="w-48 h-40 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                <img
                                    src={selectedItem.imageUrl || "/default-item.jpg"}
                                    alt="Resolved Item"
                                    className="w-full h-full object-cover"
                                    onError={e => { e.currentTarget.src = "/default-item.jpg"; }}
                                />
                            </div>
                            <div className="flex-1 grid grid-cols-3 gap-x-8 gap-y-2 w-full">
                                <div>
                                    <span className="font-semibold text-gray-700">Item ID</span>
                                    <div>{selectedItem.reportId}</div>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-700">Item</span>
                                    <div>{selectedItem.itemName}</div>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-700">Color</span>
                                    <div>{selectedItem.color}</div>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-700">Found Date</span>
                                    <div>{formatDate(selectedItem.found_date)}</div>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-700">Found Time</span>
                                    <div>{selectedItem.found_time || 'N/A'}</div>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-700">Location</span>
                                    <div>{selectedItem.found_location}</div>
                                </div>
                                <div className="col-span-3">
                                    <span className="font-semibold text-gray-700">Item Description</span>
                                    <div className="mt-1 text-gray-800">{selectedItem.description}</div>
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
                                    <h3 className="font-semibold text-gray-700 text-lg">Found By</h3>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-700">Name</span>
                                    <div>{selectedItem.reportedByUser?.name || 'N/A'}</div>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-700">ID</span>
                                    <div>{selectedItem.reportedByUser?.universityId || 'N/A'}</div>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-700">Email</span>
                                    <div>{selectedItem.reportedByUser?.email || 'N/A'}</div>
                                </div>
                                <div className="col-span-2">
                                    <span className="font-semibold text-gray-700">Department</span>
                                    <div>{selectedItem.reportedByUser?.department || 'N/A'}</div>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-700">Phone</span>
                                    <div>{selectedItem.reportedByUser?.phone || 'N/A'}</div>
                                </div>
                            </div>
                        </div>

                        {selectedItem.storedBy && (
                            <>
                                <div className="divider m-0"></div>
                                <div className="p-8 py-4">
                                    <h3 className="font-semibold text-gray-700 mb-4 text-lg">Received By</h3>
                                    <div className="grid grid-cols-3 gap-x-8 gap-y-2">
                                        <div>
                                            <span className="font-semibold text-gray-700">Admin Email</span>
                                            <div>{selectedItem.storedBy}</div>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-gray-700">Stored Date</span>
                                            <div>{formatDate(selectedItem.storedAt)}</div>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-gray-700">Stored Time</span>
                                            <div>{formatTime(selectedItem.storedAt)}</div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                       
                        {selectedItem.takenByUser && (
                            <>
                                <div className="divider m-0"></div>
                                <div className="flex flex-col md:flex-row items-center gap-6 p-8 pb-4">
                                    <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                        <img
                                            src="/default-avatar.jpg"
                                            alt="Receiver"
                                            className="w-full h-full object-cover"
                                            onError={e => { e.currentTarget.src = "/avatar.jpg"; }}
                                        />
                                    </div>
                                    <div className="flex-1 grid grid-cols-3 gap-x-8 gap-y-2 w-full">
                                        <div className="col-span-3 mb-2">
                                            <h3 className="font-semibold text-gray-700 text-lg">Taken By</h3>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-gray-700">Name</span>
                                            <div>{selectedItem.takenByUser?.name || 'N/A'}</div>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-gray-700">ID</span>
                                            <div>{selectedItem.takenByUser?.universityId || 'N/A'}</div>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-gray-700">Email</span>
                                            <div>{selectedItem.takenByUser?.email || 'N/A'}</div>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="font-semibold text-gray-700">Department</span>
                                            <div>{selectedItem.takenByUser?.department || 'N/A'}</div>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-gray-700">Phone</span>
                                            <div>{selectedItem.takenByUser?.phone || 'N/A'}</div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        
                        {selectedItem.handedOverBy && (
                            <>
                                <div className="divider m-0"></div>
                                <div className="p-8 py-4">
                                    <h3 className="font-semibold text-gray-700 mb-4 text-lg">Handed Over By</h3>
                                    <div className="grid grid-cols-3 gap-x-8 gap-y-2">
                                        <div>
                                            <span className="font-semibold text-gray-700">Admin Email</span>
                                            <div>{selectedItem.handedOverBy}</div>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-gray-700">Handover Date</span>
                                            <div>{formatDate(selectedItem.handedOverAt)}</div>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-gray-700">Handover Time</span>
                                            <div>{formatTime(selectedItem.handedOverAt)}</div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="divider m-0"></div>
                        
                  
                        <div className="flex justify-end gap-3 px-8 py-6">
                            <button 
                                className="btn btn-outline rounded-full" 
                                onClick={() => setSelectedItem(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                    <div className="modal-backdrop" onClick={() => setSelectedItem(null)}></div>
                </div>
            )}
        </div>
    );
};

export default AdminResolvedItems;