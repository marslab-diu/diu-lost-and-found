import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import {toast} from "sonner";

const FoundReports = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [selectedReport, setSelectedReport] = useState(null);

    // fetch found reports
    const { data: reports = [], isLoading } = useQuery({
        queryKey: ['found-reports-reported'],
        queryFn: async () => {
            const response = await axiosSecure.get('/found-reports/reported');
            return response.data;
        }
    });

    // mutation for storing item
    const storeItemMutation = useMutation({
        mutationFn: async (reportId) => {
            return axiosSecure.patch(`/found-reports/${reportId}/store`, {
                storedBy: user?.email
            });
        },
        onSuccess: () => {
            toast.success('Item stored successfully!');
            queryClient.invalidateQueries(['found-reports-reported']);
            setSelectedReport(null);
        }
    });

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="p-0">
            <div className="bg-white rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th>Found ID</th>
                                <th>Name</th>
                                <th>ID</th>
                                <th>Item</th>
                                <th>Color</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Location</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="9" className="text-center py-8">
                                        <div className="loading loading-spinner loading-lg"></div>
                                        <p className="mt-2">Loading found reports...</p>
                                    </td>
                                </tr>
                            ) : reports.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="text-center py-8 text-gray-500">
                                        No found reports
                                    </td>
                                </tr>
                            ) : (
                                reports.map((report) => (
                                    <tr key={report._id} className="hover:bg-base-200">
                                        <td className="font-mono">{report.reportId}</td>
                                        <td>{report.reportedByUser?.name || 'N/A'}</td>
                                        <td>{report.reportedByUser?.universityId || 'N/A'}</td>
                                        <td>{report.itemName}</td>
                                        <td>{report.color}</td>
                                        <td>{formatDate(report.found_date)}</td>
                                        <td>{report.found_time || 'N/A'}</td>
                                        <td>{report.found_location}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm rounded-full btn-outline border-gray-700"
                                                onClick={() => setSelectedReport(report)}
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

            {selectedReport && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-5xl p-0 rounded-2xl">
                        {/* Reporter Info */}
                        <div className="flex flex-col md:flex-row items-center gap-6 p-8 pb-4">
                            <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                <img
                                    src="/avatar.jpg"
                                    alt="Reporter"
                                    className="w-full h-full object-cover"
                                    onError={e => { e.currentTarget.src = "/avatar.jpg"; }}
                                />
                            </div>
                            <div className="flex-1 grid grid-cols-3 gap-x-8 gap-y-2 w-full">
                                <div>
                                    <span className="font-semibold text-gray-700">Name</span>
                                    <div>{selectedReport.reportedByUser?.name || 'N/A'}</div>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-700">ID</span>
                                    <div>{selectedReport.reportedByUser?.universityId || 'N/A'}</div>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-700">Email</span>
                                    <div>{selectedReport.reportedByUser?.email || 'N/A'}</div>
                                </div>
                                <div className="col-span-2">
                                    <span className="font-semibold text-gray-700">Department</span>
                                    <div>{selectedReport.reportedByUser?.department || 'N/A'}</div>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-700">Phone</span>
                                    <div>{selectedReport.reportedByUser?.phone || 'N/A'}</div>
                                </div>
                            </div>
                        </div>
                        <div className="divider m-0"></div>
                        {/* Item Info */}
                        <div className="flex flex-col md:flex-row gap-6 p-8 pt-4 items-center">
                            <div className="w-48 h-40 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                <img
                                    src={selectedReport.imageUrl || "/default-item.jpg"}
                                    alt="Found Item"
                                    className="w-full h-full object-cover"
                                    onError={e => { e.currentTarget.src = "/default-item.jpg"; }}
                                />
                            </div>
                            <div className="flex-1 grid grid-cols-3 gap-x-8 gap-y-2 w-full">
                                <div>
                                    <span className="font-semibold text-gray-700">Found ID</span>
                                    <div>{selectedReport.reportId}</div>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-700">Item</span>
                                    <div>{selectedReport.itemName}</div>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-700">Color</span>
                                    <div>{selectedReport.color}</div>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-700">Date</span>
                                    <div>{selectedReport.found_date ? new Date(selectedReport.found_date).toLocaleDateString() : 'N/A'}</div>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-700">Time</span>
                                    <div>{selectedReport.found_time || 'N/A'}</div>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-700">Location</span>
                                    <div>{selectedReport.found_location}</div>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-700">Item Description</span>
                                    <div className="mt-1 text-gray-800">{selectedReport.description}</div>
                                </div>
                            </div>
                        </div>
                        <div className="divider m-0"></div>
                        {/* Actions */}
                        <div className="flex justify-end gap-3 px-8 py-6">
                            <button className="btn btn-outline rounded-full" onClick={() => setSelectedReport(null)}>
                                Close
                            </button>
                            <button
                                className="btn rounded-full border-gray-700 bg-lime-300 text-black hover:bg-lime-400"
                                disabled={storeItemMutation.isPending}
                                onClick={() => storeItemMutation.mutate(selectedReport.reportId)}
                            >
                                {storeItemMutation.isPending ? 'Storing...' : 'Item Stored'}
                            </button>
                        </div>
                    </div>
                    <div className="modal-backdrop" onClick={() => setSelectedReport(null)}></div>
                </div>
            )}
        </div>
    );
};

export default FoundReports;