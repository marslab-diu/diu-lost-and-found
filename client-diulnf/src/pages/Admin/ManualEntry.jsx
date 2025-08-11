import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';

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

const ManualEntry = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const [isUploading, setIsUploading] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        reset
    } = useForm({
        defaultValues: {
            itemName: '',
            color: '',
            item_description: '',
            found_date: '',
            found_time: '',
            found_location: '',
            founder_name: '',
            founder_email: '',
            founder_id: '',
            founder_phone: '',
            founder_department: ''
        }
    });

    // Image upload handler
    const handleImageUpload = async (file) => {
        if (!file) return null;
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);
            const response = await axiosSecure.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (response.data.success) {
                setUploadedImageUrl(response.data.url);
                toast.success('Image uploaded successfully!');
                return response.data.url;
            }
        } catch (error) {
            toast.error('Failed to upload image.');
            return null;
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 10 * 1024 * 1024) {
            toast.error('File size must be less than 10MB');
            return;
        }
        if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image file');
            return;
        }
        setSelectedFile(file);
        await handleImageUpload(file);
    };

    const removeImage = () => {
        setSelectedFile(null);
        setUploadedImageUrl(null);
        const fileInput = document.getElementById('photo');
        if (fileInput) fileInput.value = '';
    };

    const onSubmit = async (data) => {
        try {
            const submitData = {
                itemName: data.itemName,
                color: data.color,
                item_description: data.item_description,
                found_date: data.found_date,
                found_time: data.found_time,
                found_location: data.found_location,
                imageUrl: uploadedImageUrl || null,
                founder: {
                    name: data.founder_name,
                    email: data.founder_email,
                    universityId: data.founder_id,
                    phone: data.founder_phone,
                    department: data.founder_department
                }
            };

            
            const response = await axiosSecure.post('/found-reports/manual-entry', submitData);
            if (response.data.success) {
                toast.success('Manual found item entry submitted!');
                reset();
                setUploadedImageUrl(null);
                setSelectedFile(null);
                setSelectedDepartment('');
            } else {
                toast.error(response.data.message || 'Failed to submit entry.');
            }
        } catch (error) {
            toast.error('Failed to submit entry.');
        }
    };

    return (
        
            <div className='w-full max-w-6xl mx-auto p-1'>
                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-10">
                    {/* col2 */}
                    <div className='space-y-4'>
                        <div>
                            <input
                                type="text"
                                {...register('itemName', { required: 'Item name is required', minLength: { value: 3, message: 'Name must be at least 3 characters' } })}
                                placeholder="Item Name"
                                className={`input focus:outline-none w-full ${errors.itemName ? 'input-error' : ''}`}
                            />
                            {errors.itemName && <p className="text-red-500 text-sm mt-1">{errors.itemName.message}</p>}
                        </div>
                        <div>
                            <input
                                type="text"
                                {...register('color', { required: 'Please enter the color' })}
                                placeholder="Color (e.g., Black, Red, Blue)"
                                className={`input focus:outline-none input-bordered w-full ${errors.color ? 'input-error' : ''}`}
                            />
                            {errors.color && <p className="text-red-500 text-sm mt-1">{errors.color.message}</p>}
                        </div>
                        <div>
                            <textarea
                                {...register('item_description', { required: 'Item description is required', minLength: { value: 10, message: 'Description must be at least 10 characters' } })}
                                placeholder="Describe the found item in detail"
                                rows={4}
                                className={`textarea focus:outline-none textarea-bordered w-full resize-none ${errors.item_description ? 'textarea-error' : ''}`}
                            />
                            {errors.item_description && <p className="text-red-500 text-sm mt-1">{errors.item_description.message}</p>}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Found Date</label>
                                <input
                                    type="date"
                                    {...register('found_date', { required: 'Found date is required' })}
                                    max={new Date().toISOString().split('T')[0]}
                                    className={`input focus-within:outline-none input-bordered w-full ${errors.found_date ? 'input-error' : ''}`}
                                />
                                {errors.found_date && <p className="text-red-500 text-sm mt-1">{errors.found_date.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Found Time</label>
                                <input
                                    type="time"
                                    {...register('found_time')}
                                    className="input focus-within:outline-none input-bordered w-full"
                                />
                            </div>
                        </div>
                        <div>
                            <input
                                type="text"
                                {...register('found_location', { required: 'Found location is required', minLength: { value: 3, message: 'Location must be at least 3 characters' } })}
                                placeholder="Found Location"
                                className={`input focus:outline-none input-bordered w-full ${errors.found_location ? 'input-error' : ''}`}
                            />
                            {errors.found_location && <p className="text-red-500 text-sm mt-1">{errors.found_location.message}</p>}
                        </div>
                        
                        <div>
                            {!uploadedImageUrl ? (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                                    <input
                                        type="file"
                                        id="photo"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        className="hidden"
                                        disabled={isUploading}
                                    />
                                    <label htmlFor="photo" className={`cursor-pointer flex flex-col items-center ${isUploading ? 'pointer-events-none' : ''}`}>
                                        {isUploading ? (
                                            <>
                                                <div className="loading loading-spinner loading-lg text-blue-500 mb-2"></div>
                                                <span className="text-sm text-gray-600">Uploading image...</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                                <span className="text-sm text-gray-600">Upload Photo if Available</span>
                                                <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</span>
                                            </>
                                        )}
                                    </label>
                                </div>
                            ) : (
                                <div className="border border-gray-300 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700">Uploaded Image:</span>
                                        <button type="button" onClick={removeImage} className="btn btn-sm btn-error">Remove</button>
                                    </div>
                                    <div className="relative">
                                        <img src={uploadedImageUrl} alt="Uploaded item" className="w-full h-48 object-cover rounded-lg" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                        {/* col2 */}
                    <div className='space-y-4'>
                        <div>
                            <input
                                type="text"
                                {...register('founder_name', { required: 'Founder name is required' })}
                                placeholder="Founder Name"
                                className={`input focus:outline-none input-bordered w-full ${errors.founder_name ? 'input-error' : ''}`}
                            />
                            {errors.founder_name && <p className="text-red-500 text-sm mt-1">{errors.founder_name.message}</p>}
                        </div>
                        <div>
                            <input
                                type="email"
                                {...register('founder_email', { required: 'Founder email is required' })}
                                placeholder="Founder Email"
                                className={`input focus:outline-none input-bordered w-full ${errors.founder_email ? 'input-error' : ''}`}
                            />
                            {errors.founder_email && <p className="text-red-500 text-sm mt-1">{errors.founder_email.message}</p>}
                        </div>
                        <div>
                            <input
                                type="text"
                                {...register('founder_id', { required: 'Founder ID is required' })}
                                placeholder="Founder University ID"
                                className={`input focus:outline-none input-bordered w-full ${errors.founder_id ? 'input-error' : ''}`}
                            />
                            {errors.founder_id && <p className="text-red-500 text-sm mt-1">{errors.founder_id.message}</p>}
                        </div>
                        <div>
                            <input
                                type="tel"
                                {...register('founder_phone', { required: 'Founder phone is required' })}
                                placeholder="Founder Phone"
                                className={`input focus:outline-none input-bordered w-full ${errors.founder_phone ? 'input-error' : ''}`}
                            />
                            {errors.founder_phone && <p className="text-red-500 text-sm mt-1">{errors.founder_phone.message}</p>}
                        </div>
                        <div>
                            <select
                                {...register('founder_department', { required: 'Founder department is required' })}
                                value={selectedDepartment}
                                onChange={e => {
                                    setSelectedDepartment(e.target.value);
                                    setValue('founder_department', e.target.value);
                                }}
                                className={`select focus-within:outline-none select-bordered w-full ${errors.founder_department ? 'select-error' : ''}`}
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
                            {errors.founder_department && (
                                <p className="text-red-500 text-sm mt-1">{errors.founder_department.message}</p>
                            )}
                        </div>
                    </div>
                    


                    
                    <button
                        type="submit"
                        disabled={isSubmitting || isUploading}
                        className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center">
                                <div className="loading loading-spinner loading-sm mr-2"></div>
                                Submitting Entry...
                            </span>
                        ) : (
                            'Submit Manual Entry'
                        )}
                    </button>
                </form>
            </div>
            
    );
};

export default ManualEntry;