import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { BsExclamationTriangle, BsArchive, BsBookmark, BsPatchCheck } from 'react-icons/bs';
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';

const Dashboard = () => {
    const axiosSecure = useAxiosSecure();

    // Fetch dashboard stats
    const { data: stats = {}, isLoading: statsLoading } = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: async () => {
            const response = await axiosSecure.get('/admin/dashboard/stats');
            return response.data;
        }
    });

    // Fetch activity log
    const { data: activities = [], isLoading: activitiesLoading } = useQuery({
        queryKey: ['activity-log'],
        queryFn: async () => {
            const response = await axiosSecure.get('/admin/dashboard/activity-log');
            return response.data;
        }
    });

    // Fetch submitter leaderboard
    const { data: leaderboard = [], isLoading: leaderboardLoading } = useQuery({
        queryKey: ['submitter-leaderboard'],
        queryFn: async () => {
            const response = await axiosSecure.get('/admin/dashboard/leaderboard');
            return response.data;
        }
    });

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-GB');
    };

    const formatTime = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    };

    const StatCard = ({ icon: Icon, title, count, isLoading }) => (
        <div className="bg-base-200 border-1 border-base-300 rounded-xl p-6 flex flex-col items-start">
            <div className="mb-4">
                <Icon size={32} className="text-gray-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-1">{title}</h3>
            <p className="text-3xl font-semibold text-gray-900">
                {isLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                ) : (
                    count?.toLocaleString() || 0
                )}
            </p>
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard 
                    icon={BsExclamationTriangle}
                    title="Lost Reports"
                    count={stats.lostReports}
                    isLoading={statsLoading}
                />
                <StatCard 
                    icon={IoIosCheckmarkCircleOutline}
                    title="Found Reports"
                    count={stats.foundReports}
                    isLoading={statsLoading}
                />
                <StatCard 
                    icon={BsArchive}
                    title="Recovered Items"
                    count={stats.recoveredItems}
                    isLoading={statsLoading}
                />
                <StatCard 
                    icon={BsBookmark}
                    title="Claimed Items"
                    count={stats.claimedItems}
                    isLoading={statsLoading}
                />
                <StatCard 
                    icon={BsPatchCheck}
                    title="Resolved Items"
                    count={stats.resolvedItems}
                    isLoading={statsLoading}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                <div className="bg-white rounded-xl overflow-hidden">
                    <div className="p-6 border-b">
                        <h2 className="text-lg font-semibold text-gray-900">Activity Log</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-3 font-medium text-gray-600">Date</th>
                                    <th className="text-left p-3 font-medium text-gray-600">Time</th>
                                    <th className="text-left p-3 font-medium text-gray-600">Admin</th>
                                    <th className="text-left p-3 font-medium text-gray-600">Activity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activitiesLoading ? (
                                    <tr>
                                        <td colSpan="4" className="text-center py-8">
                                            <div className="loading loading-spinner loading-md"></div>
                                            <p className="mt-2 text-gray-500">Loading activities...</p>
                                        </td>
                                    </tr>
                                ) : activities.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="text-center py-8 text-gray-500">
                                            No recent activities
                                        </td>
                                    </tr>
                                ) : (
                                    activities.map((activity, index) => (
                                        <tr key={index} className="border-b hover:bg-gray-50">
                                            <td className="p-3">{formatDate(activity.createdAt)}</td>
                                            <td className="p-3">{formatTime(activity.createdAt)}</td>
                                            <td className="p-3">{activity.adminName}</td>
                                            <td className="p-3">{activity.action}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Submitter Leaderboard */}
                <div className="bg-white rounded-xl overflow-hidden">
                    <div className="p-6 border-b">
                        <h2 className="text-lg font-semibold text-gray-900">Submitter Leaderboard</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-3 font-medium text-gray-600">Rank</th>
                                    <th className="text-left p-3 font-medium text-gray-600">Name</th>
                                    <th className="text-left p-3 font-medium text-gray-600">Email</th>
                                    <th className="text-left p-3 font-medium text-gray-600">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboardLoading ? (
                                    <tr>
                                        <td colSpan="4" className="text-center py-8">
                                            <div className="loading loading-spinner loading-md"></div>
                                            <p className="mt-2 text-gray-500">Loading leaderboard...</p>
                                        </td>
                                    </tr>
                                ) : leaderboard.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="text-center py-8 text-gray-500">
                                            No submitters yet
                                        </td>
                                    </tr>
                                ) : (
                                    leaderboard.map((user, index) => (
                                        <tr key={index} className="border-b hover:bg-gray-50">
                                            <td className="p-3 font-medium">{index + 1}</td>
                                            <td className="p-3">{user.name}</td>
                                            <td className="p-3">{user.email}</td>
                                            <td className="p-3 font-semibold">{user.submissionCount}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;