import React, { useEffect, useState } from 'react';
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
    const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState('');

    // Department data organized by faculty
    const departmentData = [
        {
            faculty: "Faculty of Science and Information Technology (FSIT)",
            departments: [
                "Department of Computer Science & Engineering",
                "Department of Computing & Information System (CIS)",
                "Department of Software Engineering",
                "Department of Environmental Science and Disaster Management",
                "Department of Multimedia & Creative Technology (MCT)",
                "Department of Information Technology and Management",
                "Department of Physical Education & Sports Science (PESS)"
            ]
        },
        {
            faculty: "Faculty of Business and Entrepreneurship (FBE)",
            departments: [
                "Department of Business Administration",
                "Department of Management",
                "Department of Real Estate",
                "Department of Tourism & Hospitality Management",
                "Department of Innovation & Entrepreneurship",
                "Department of Finance and Banking",
                "Department of Accounting",
                "Department of Marketing"
            ]
        },
        {
            faculty: "Faculty of Engineering (FE)",
            departments: [
                "Department of Information and Communication Engineering",
                "Department of Textile Engineering",
                "Department of Electrical & Electronic Engineering",
                "Department of Architecture",
                "Department of Civil Engineering"
            ]
        },
        {
            faculty: "Faculty of Health and Life Sciences (FHLS)",
            departments: [
                "Department of Pharmacy",
                "Department of Public Health",
                "Department of Nutrition & Food Engineering",
                "Department of Agricultural Science (AGS)",
                "Department of Genetic Engineering and Biotechnology"
            ]
        },
        {
            faculty: "Faculty of Humanities and Social Sciences (FHSS)",
            departments: [
                "Department of English",
                "Department of Law",
                "Department of Journalism & Mass Communication",
                "Department of Development Studies",
                "Department of Information Science and Library Management"
            ]
        }
    ];

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
            setSelectedDepartment(userProfile.department || '');
        } else if (user && !isLoadingProfile) {
            // Prefill with Firebase user data if no profile exists
            setValue('name', user.displayName || '');
        }
    }, [userProfile, user, isLoadingProfile, reset, setValue]);

    const onSubmit = (data) => {
        updateProfileMutation.mutate(data);
    };

    const handleDepartmentSelect = (department) => {
        setSelectedDepartment(department);
        setValue('department', department);
        setIsDepartmentModalOpen(false); // Close modal immediately when a department is selected
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
                        <button
                            type="button"
                            onClick={() => setIsDepartmentModalOpen(true)}
                            className={`w-full px-4 py-3 border rounded-lg text-left flex justify-between items-center ${
                                errors.department ? 'border-red-500' : 'border-gray-300'
                            } ${selectedDepartment ? 'text-gray-900' : 'text-gray-500'}`}
                        >
                            <span>
                                {selectedDepartment || 'Select Department'}
                            </span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        <input
                            type="hidden"
                            {...register('department', { 
                                required: 'Department is required'
                            })}
                            value={selectedDepartment}
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

            {/* Department Selection Modal */}
            {isDepartmentModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col shadow-md">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h3 className="text-lg font-medium text-gray-800">Select Department</h3>
                            <button
                                onClick={() => setIsDepartmentModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 p-1"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="space-y-6">
                                {departmentData.map((faculty, facultyIndex) => (
                                    <div key={facultyIndex} className="space-y-3">
                                        <h4 className="font-medium text-primary text-lg border-b border-gray-200 pb-2">
                                            {faculty.faculty}
                                        </h4>
                                        <div className="grid gap-2">
                                            {faculty.departments.map((department, deptIndex) => (
                                                <button
                                                    key={deptIndex}
                                                    onClick={() => handleDepartmentSelect(department)}
                                                    className={`text-left p-3 rounded-lg border transition-all duration-200 hover:bg-primary hover:text-white ${
                                                        selectedDepartment === department 
                                                            ? 'border-primary bg-primary text-white' 
                                                            : 'border-gray-200 hover:border-primary'
                                                    }`}
                                                >
                                                    {department}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* No Footer */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;