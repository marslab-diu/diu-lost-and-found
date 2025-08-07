import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { toast } from 'sonner';

const ManageAdmin = () => {
    const { user, createUser, updateUser, setUser, resetPassword,loading } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    // console.log("User in ManageAdmin:", user);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            universityId: ''
        }
    });

    // Fetch admins
    const { data: admins = [], isLoading, refetch } = useQuery({
        queryKey: ['admins'],
        queryFn: async () => {
            const response = await axiosSecure.get('/admins');
            return response.data;
        },
        enabled: !!user && !loading,
        retry: 1,
        staleTime: 5 * 60 * 1000
    });

    // Create admin mutation
    const createAdminMutation = useMutation({
        mutationFn: async (data) => {
            // Create Firebase user
            const result = await createUser(data.email, data.password);
            const user = result.user;

            // Update Firebase profile
            await updateUser({ displayName: data.name });
            setUser({ ...user, displayName: data.name });

            // Create admin in database
            const adminData = {
                name: data.name,
                email: data.email,
                role: 'admin',
                universityId: data.universityId,
            };

            await axiosSecure.post('/admins', adminData);
            return adminData;
        },
        onSuccess: () => {
            toast.success('Admin created successfully');
            reset();
            setIsModalOpen(false);
            queryClient.invalidateQueries(['admins']);
        },
        onError: (error) => {
            console.error('Error creating admin:', error);
            toast.error(error.message || 'Failed to create admin');
        }
    });

    // Delete admin mutation
    const deleteAdminMutation = useMutation({
        mutationFn: async (adminId) => {
            await axiosSecure.delete(`/admins/${adminId}`);
        },
        onSuccess: () => {
            toast.success('Admin removed successfully');
            queryClient.invalidateQueries(['admins']);
        },
        onError: (error) => {
            console.error('Error removing admin:', error);
            toast.error('Failed to remove admin');
        }
    });

    const onSubmit = async (data) => {
        createAdminMutation.mutate(data);
    };

    const handleEdit = async (admin) => {
        try {
            await resetPassword(admin.email);
            toast.success(`Password reset email sent to ${admin.email}`);
        } catch (error) {
            console.error('Error sending password reset:', error);
            toast.error('Failed to send password reset email');
        }
    };

    const handleRemove = (adminId) => {
        if (window.confirm('Are you sure you want to remove this admin?')) {
            deleteAdminMutation.mutate(adminId);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="p-0">
            {/* Admins Table */}
            <div className="bg-white rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th>Admin ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Password</th>
                                <th>Added On</th>
                                <th>Time</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-8">
                                        <div className="loading loading-spinner loading-lg"></div>
                                        <p className="mt-2">Loading admins...</p>
                                    </td>
                                </tr>
                            ) : admins.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-8 text-gray-500">
                                        No admins found
                                    </td>
                                </tr>
                            ) : (
                                admins.map((admin, index) => (
                                    <tr key={admin._id} className="hover:bg-base-200">
                                        <td className="font-mono">{admin.universityId}</td>
                                        <td className="font-medium">{admin.name}</td>
                                        <td>{admin.email}</td>
                                        <td>
                                            <span className="font-mono">••••••••••••</span>
                                        </td>
                                        <td>{admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : 'N/A'}</td>
                                        <td>{admin.createdAt ? new Date(admin.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(admin)}
                                                    className="btn btn-sm btn-success border-neutral"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleRemove(admin._id)}
                                                    className="btn btn-sm btn-secondary border-gray-700"
                                                    disabled={deleteAdminMutation.isPending}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex justify-between items-center mt-6">   
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="btn btn-primary rounded-full font-light"
                >
                    Add New
                </button>
            </div>

            {/* Add Admin Modal */}
            {isModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">Create New Admin</h2>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="btn btn-sm btn-circle btn-ghost"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {/* Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    {...register('name', { 
                                        required: 'Full name is required',
                                        minLength: {
                                            value: 2,
                                            message: 'Name must be at least 2 characters'
                                        }
                                    })}
                                    placeholder="Enter admin's full name"
                                    className={`input input-bordered w-full focus:outline-none ${
                                        errors.name ? 'input-error' : ''
                                    }`}
                                    disabled={createAdminMutation.isPending}
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    {...register('email', { 
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Invalid email address'
                                        }
                                    })}
                                    placeholder="admin@diu.edu.bd"
                                    className={`input input-bordered w-full focus:outline-none ${
                                        errors.email ? 'input-error' : ''
                                    }`}
                                    disabled={createAdminMutation.isPending}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                                )}
                            </div>

                            {/* University ID */}
                            <div>
                                <label htmlFor="universityId" className="block text-sm font-medium text-gray-700 mb-1">
                                    University ID *
                                </label>
                                <input
                                    type="text"
                                    id="universityId"
                                    {...register('universityId', { 
                                        required: 'University ID is required',
                                        pattern: {
                                            value: /^\w+$/,
                                            message: 'University ID should contain only letters and numbers'
                                        }
                                    })}
                                    placeholder="e.g., ADMIN001, EMP12345"
                                    className={`input input-bordered w-full focus:outline-none ${
                                        errors.universityId ? 'input-error' : ''
                                    }`}
                                    disabled={createAdminMutation.isPending}
                                />
                                {errors.universityId && (
                                    <p className="text-red-500 text-sm mt-1">{errors.universityId.message}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Password *
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    {...register('password', { 
                                        required: 'Password is required',
                                        minLength: {
                                            value: 6,
                                            message: 'Password must be at least 6 characters'
                                        }
                                    })}
                                    placeholder="Enter a strong password"
                                    className={`input input-bordered w-full focus:outline-none ${
                                        errors.password ? 'input-error' : ''
                                    }`}
                                    disabled={createAdminMutation.isPending}
                                />
                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="btn btn-ghost flex-1"
                                    disabled={createAdminMutation.isPending}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createAdminMutation.isPending}
                                    className="btn btn-primary flex-1"
                                >
                                    {createAdminMutation.isPending ? (
                                        <span className="flex items-center justify-center">
                                            <div className="loading loading-spinner loading-sm mr-2"></div>
                                            Creating...
                                        </span>
                                    ) : (
                                        'Create Admin'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}></div>
                </div>
            )}
        </div>
    );
};

export default ManageAdmin;