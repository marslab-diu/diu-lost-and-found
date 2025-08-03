import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const Profile = () => {
    const { user, logOutUser } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

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
            phone: '',
            department: ''
        }
    });

    // Fetch existing profile
    const { data: userProfile, isLoading: isLoadingProfile } = useQuery({
        queryKey: ['userProfile'],
        queryFn: async () => {
            const response = await axiosSecure.get('/user/profile');
            return response.data;
        },
        enabled: !!user?.email,
        retry: false
    });

    // Update profile mutation
    const updateProfileMutation = useMutation({
        mutationFn: async (profileData) => {
            const response = await axiosSecure.post('/user/profile', profileData);
            return response.data;
        },
        onSuccess: () => {
            toast.success('Profile updated successfully!');
            queryClient.invalidateQueries(['userProfile']);
            // Redirect to search page after successful update
            setTimeout(() => {
                navigate('/user/search', { replace: true });
            }, 1000);
        },
        onError: (error) => {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile. Please try again.');
        }
    });

    
    useEffect(() => {
        if (userProfile) {
            // Reset form with existing profile data
            reset({
                name: userProfile.name || '',
                universityId: userProfile.universityId || '',
                phone: userProfile.phone || '',
                department: userProfile.department || ''
            });
        } else if (user && !isLoadingProfile) {
            // Prefill with Firebase user data if no profile exists
            setValue('name', user.displayName || '');
        }
    }, [userProfile, user, isLoadingProfile, reset, setValue]);

    const onSubmit = (data) => {
        updateProfileMutation.mutate(data);
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

    if (isLoadingProfile) {
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
                <div className="text-center mb-8">
                    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-gray-200 mb-4">
                        {user?.photoURL ? (
                            <img
                                referrerPolicy='no-referrer' 
                                src={user.photoURL} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                            </div>
                        )}
                    </div>
                    
                </div>

                {/* Profile Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

                    <div>
                        <input
                            type="email"
                            value={user?.email || ''}
                            readOnly
                            className="w-full px-4 py-3 rounded-lg bg-gray-100 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <input
                            type="text"
                            {...register('universityId', { 
                                required: 'University ID is required',
                            })}
                            placeholder="Student/Employee ID"
                            className={`w-full px-4 py-3 border rounded-lg  ${
                                errors.universityId ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.universityId && (
                            <p className="text-red-500 text-sm mt-1">{errors.universityId.message}</p>
                        )}
                    </div>

                    <div>
                        <input
                            type="text"
                            {...register('department', { 
                                required: 'Department is required',
                                minLength: {
                                    value: 3,
                                    message: 'Department must be at least 3 characters'
                                }
                            })}
                            placeholder="Department"
                            className={`w-full px-4 py-3 border rounded-lg ${
                                errors.department ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.department && (
                            <p className="text-red-500 text-sm mt-1">{errors.department.message}</p>
                        )}
                    </div>

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

                    <button
                        type="submit"
                        disabled={isSubmitting || updateProfileMutation.isPending}
                        className="w-full bg-primary text-white py-3 rounded-lg font-medium cursor-pointer"
                    >
                        {(isSubmitting || updateProfileMutation.isPending) ? 'Updating Profile...' : 'Update Profile'}
                    </button>
                </form>

                
                <button
                    onClick={handleLogout}
                    className="w-full mt-4 bg-error text-white py-3 rounded-lg font-medium hover:bg-red-700 cursor-pointer"
                >
                    Log Out
                </button>
            </div>
        </div>
    );
};

export default Profile;