import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import { toast } from "sonner";
import { useForm } from 'react-hook-form';

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

const AdminRecoveredItems = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [selectedItem, setSelectedItem] = useState(null);
    const [showHandoverForm, setShowHandoverForm] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm({
        defaultValues: {
            receiver_name: '',
            receiver_email: '',
            receiver_id: '',
            receiver_phone: '',
            receiver_department: ''
        }
    });

    // Fetch stored items
    const { data: items = [], isLoading } = useQuery({
        queryKey: ['stored-items'],
        queryFn: async () => {
            const response = await axiosSecure.get('/found-reports/stored');
            return response.data;
        }
    });

    // Mutation for handing over item
    const handoverItemMutation = useMutation({
        mutationFn: async ({ reportId, receiverData }) => {
            return axiosSecure.patch(`/found-reports/${reportId}/handover`, {
                receiver: receiverData,
                handedOverBy: user?.email
            });
        },
        onSuccess: () => {
            toast.success('Item handed over successfully!');
            queryClient.invalidateQueries(['stored-items']);
            setSelectedItem(null);
            setShowHandoverForm(false);
            reset();
            setSelectedDepartment('');
        },
        onError: (error) => {
            toast.error('Failed to hand over item');
            console.error('Handover error:', error);
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

    const onHandoverSubmit = (data) => {
        const receiverData = {
            name: data.receiver_name,
            email: data.receiver_email,
            universityId: data.receiver_id,
            phone: data.receiver_phone,
            department: data.receiver_department
        };

        handoverItemMutation.mutate({
            reportId: selectedItem.reportId,
            receiverData
        });
    };

    const handleHandoverClick = () => {
        setShowHandoverForm(true);
        reset();
        setSelectedDepartment('');
    };

    return (
        <div className="p-0">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Stored Items</h1>
                <p className="text-gray-600 mt-2">Items currently stored and available for handover</p>
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
                                        <p className="mt-2">Loading stored items...</p>
                                    </td>
                                </tr>
                            ) : items.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="text-center py-8 text-gray-500">
                                        No stored items found
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
                        {/* Item Info - Top Section */}
                        <div className="flex flex-col md:flex-row gap-6 p-8 pb-4 items-center">
                            <div className="w-48 h-40 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                <img
                                    src={selectedItem.imageUrl || "/default-item.jpg"}
                                    alt="Found Item"
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
                                    <span className="font-semibold text-gray-700">Date</span>
                                    <div>{formatDate(selectedItem.found_date)}</div>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-700">Time</span>
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

                        {/* Founded By Info */}
                        <div className="flex flex-col md:flex-row items-center gap-6 p-8 pb-4">
                            <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                <img
                                    src="/default-avatar.jpg"
                                    alt="Founder"
                                    className="w-full h-full object-cover"
                                    onError={e => { e.currentTarget.src = "/default-avatar.jpg"; }}
                                />
                            </div>
                            <div className="flex-1 grid grid-cols-3 gap-x-8 gap-y-2 w-full">
                                <div className="col-span-3 mb-2">
                                    <h3 className="font-semibold text-gray-700 text-lg">Founded By</h3>
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

                        {/* Received By Info */}
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

                        {/* Handover Form */}
                        {showHandoverForm && (
                            <>
                                <div className="divider m-0"></div>
                                <div className="p-8 pt-4">
                                    <h3 className="font-semibold text-gray-700 mb-4">Handover Information</h3>
                                    <form onSubmit={handleSubmit(onHandoverSubmit)} className="grid grid-cols-2 gap-4">
                                        <div>
                                            <input
                                                type="text"
                                                {...register('receiver_name', { required: 'Receiver name is required' })}
                                                placeholder="Receiver Name"
                                                className={`input input-bordered w-full ${errors.receiver_name ? 'input-error' : ''}`}
                                            />
                                            {errors.receiver_name && <p className="text-red-500 text-sm mt-1">{errors.receiver_name.message}</p>}
                                        </div>
                                        <div>
                                            <input
                                                type="text"
                                                {...register('receiver_id', { required: 'Receiver ID is required' })}
                                                placeholder="University ID"
                                                className={`input input-bordered w-full ${errors.receiver_id ? 'input-error' : ''}`}
                                            />
                                            {errors.receiver_id && <p className="text-red-500 text-sm mt-1">{errors.receiver_id.message}</p>}
                                        </div>
                                        <div>
                                            <input
                                                type="email"
                                                {...register('receiver_email', { required: 'Email is required' })}
                                                placeholder="Email"
                                                className={`input input-bordered w-full ${errors.receiver_email ? 'input-error' : ''}`}
                                            />
                                            {errors.receiver_email && <p className="text-red-500 text-sm mt-1">{errors.receiver_email.message}</p>}
                                        </div>
                                        <div>
                                            <input
                                                type="tel"
                                                {...register('receiver_phone', { required: 'Phone is required' })}
                                                placeholder="Phone"
                                                className={`input input-bordered w-full ${errors.receiver_phone ? 'input-error' : ''}`}
                                            />
                                            {errors.receiver_phone && <p className="text-red-500 text-sm mt-1">{errors.receiver_phone.message}</p>}
                                        </div>
                                        <div className="col-span-2">
                                            <select
                                                {...register('receiver_department', { required: 'Department is required' })}
                                                value={selectedDepartment}
                                                onChange={e => {
                                                    setSelectedDepartment(e.target.value);
                                                    setValue('receiver_department', e.target.value);
                                                }}
                                                className={`select select-bordered w-full ${errors.receiver_department ? 'select-error' : ''}`}
                                            >
                                                <option value="">Select Department</option>
                                                {departmentData.map((faculty, facultyIndex) => (
                                                    <optgroup key={facultyIndex} label={faculty.faculty}>
                                                        {faculty.departments.map((department, deptIndex) => (
                                                            <option key={deptIndex} value={department}>
                                                                {department}
                                                            </option>
                                                        ))}
                                                    </optgroup>
                                                ))}
                                            </select>
                                            {errors.receiver_department && <p className="text-red-500 text-sm mt-1">{errors.receiver_department.message}</p>}
                                        </div>
                                        <div className="col-span-2 flex gap-3 mt-4">
                                            <button
                                                type="button"
                                                onClick={() => setShowHandoverForm(false)}
                                                className="btn btn-outline flex-1"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={handoverItemMutation.isPending}
                                                className="btn btn-success flex-1"
                                            >
                                                {handoverItemMutation.isPending ? 'Processing...' : 'Confirm Handover'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </>
                        )}

                        <div className="divider m-0"></div>
                        
                        {/* Actions */}
                        <div className="flex justify-end gap-3 px-8 py-6">
                            <button className="btn btn-outline rounded-full" onClick={() => {
                                setSelectedItem(null);
                                setShowHandoverForm(false);
                                reset();
                                setSelectedDepartment('');
                            }}>
                                Close
                            </button>
                            {!showHandoverForm && (
                                <button
                                    className="btn rounded-full border-gray-700 bg-lime-300 text-black hover:bg-lime-400"
                                    onClick={handleHandoverClick}
                                >
                                    Hand Over Item
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="modal-backdrop" onClick={() => {
                        setSelectedItem(null);
                        setShowHandoverForm(false);
                        reset();
                        setSelectedDepartment('');
                    }}></div>
                </div>
            )}
        </div>
    );
};

export default AdminRecoveredItems;