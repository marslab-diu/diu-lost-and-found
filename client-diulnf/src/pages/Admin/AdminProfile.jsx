import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const AdminProfile = () => {
    const { user, logOutUser, resetPassword, loading } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);

    // React Hook form setup
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue
    } = useForm({
        defaultValues: {
            name: '',
            universityId: '',
            phone: ''
        }
    });

    // Fetch existing admin profile
    const { data: adminProfile, isLoading: isLoadingProfile } = useQuery({
        queryKey: ['adminProfile'],
        queryFn: async () => {
            const response = await axiosSecure.get(`/admins/${user.email}`);
            return response.data;
        },
        enabled: !!user?.email && !loading,
        retry: false
    });

    // Update profile mutation
    const updateProfileMutation = useMutation({
        mutationFn: async (profileData) => {
            const response = await axiosSecure.put(`/admins/${user.email}`, profileData);
            return response.data;
        },
        onSuccess: () => {
            toast.success('Profile updated successfully!');
            queryClient.invalidateQueries(['adminProfile']);
            setIsEditing(false);
        },
        onError: (error) => {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile. Please try again.');
        }
    });

    useEffect(() => {
        if (adminProfile) {
            // Reset form with existing profile data
            reset({
                name: adminProfile.name || '',
                universityId: adminProfile.universityId || '',
                phone: adminProfile.phone || ''
            });
        } else if (user && !isLoadingProfile) {
            // Prefill with Firebase user data if no profile exists
            setValue('name', user.displayName || '');
        }
    }, [adminProfile, user, isLoadingProfile, reset, setValue]);

    const onSubmit = (data) => {
        updateProfileMutation.mutate(data);
    };

    const handleResetPassword = async () => {
        try {
            await resetPassword(user?.email);
            toast.success(`Password reset email sent to ${user?.email}`);
        } catch (error) {
            console.error('Error sending password reset:', error);
            toast.error('Failed to send password reset email');
        }
    };

    const handleLogout = () => {
        logOutUser()
            .then(() => {
                toast.success('Logged out successfully');
                navigate('/', { replace: true });
            })
            .catch(error => {
                console.error('Logout error:', error);
                toast.error('Failed to logout');
            });
    };

    if (loading || isLoadingProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg"></div>
                    <p className="mt-4">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="py-8">
            <div className="max-w-2xl mx-auto bg-white rounded-lg p-6">
                {/* Profile Picture */}
                {/* <div className="text-center mb-8">
                    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-gray-200 mb-4">
                        {user?.photoURL ? (
                            <img
                                referrerPolicy='no-referrer' 
                                src={user.photoURL} 
                                alt="Admin Profile" 
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <img
                                src="/avatar.jpg"
                                alt="Default Admin Avatar"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='40' fill='%236b7280' text-anchor='middle' dy='.3em'%3EA%3C/text%3E%3C/svg%3E";
                                }}
                            />
                        )}
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">Admin Profile</h2>
                </div> */}

                {/* Profile Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Name */}
                    <div>
                        <input
                            type="text"
                            {...register('name', { 
                                required: 'Full name is required',
                                minLength: {
                                    value: 2,
                                    message: 'Name must be at least 2 characters'
                                }
                            })}
                            placeholder="Full Name"
                            className={`w-full px-4 py-3 border rounded-lg ${
                                errors.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Email (Read-only) */}
                    <div>
                        <input
                            type="email"
                            value={user?.email || adminProfile?.email || ''}
                            readOnly
                            className="w-full px-4 py-3 rounded-lg bg-gray-100 cursor-not-allowed"
                        />
                    </div>

                    {/* University ID */}
                    <div>
                        <input
                            type="text"
                            {...register('universityId', { 
                                required: 'University ID is required',
                            })}
                            placeholder="Employee/Admin ID"
                            className={`w-full px-4 py-3 border rounded-lg ${
                                errors.universityId ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.universityId && (
                            <p className="text-red-500 text-sm mt-1">{errors.universityId.message}</p>
                        )}
                    </div>

                    {/* Phone Number */}
                    <div>
                        <input
                            type="tel"
                            {...register('phone', { 
                                required: 'Phone number is required',
                                pattern: {
                                    value: /^(\+88)?01[3-9]\d{8}$/,
                                    message: 'Please enter a valid Bangladeshi phone number'
                                }
                            })}
                            placeholder="Phone Number (e.g., +8801812345678)"
                            className={`w-full px-4 py-3 border rounded-lg ${
                                errors.phone ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                        )}
                    </div>

               
                    {/* Created At (Read-only) */}
                    <div>
                        <input
                            type="text"
                            value={adminProfile?.createdAt ? `Member since ${new Date(adminProfile.createdAt).toLocaleDateString()}` : 'Member since N/A'}
                            readOnly
                            className="w-full px-4 py-3 rounded-lg bg-gray-100 cursor-not-allowed"
                        />
                    </div>

                    {/* Update Profile Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting || updateProfileMutation.isPending}
                        className="btn text-lg py-6 w-full bg-primary text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {(isSubmitting || updateProfileMutation.isPending) ? 'Updating Profile...' : 'Update Profile'}
                    </button>
                </form>

                {/* Action Buttons */}
                <div className="space-y-3 mt-6">
                    {/* Reset Password Button */}
                    <button
                        onClick={handleResetPassword}
                        className="btn text-lg py-6 w-full bg-orange-500 text-white  rounded-lg font-medium hover:bg-orange-600 transition-colors"
                    >
                        Reset Password
                    </button>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="btn text-lg py-6 w-full bg-error text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                    >
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;