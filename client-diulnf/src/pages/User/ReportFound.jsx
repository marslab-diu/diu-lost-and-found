import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const ReportFound = () => {
    const axiosSecure = useAxiosSecure();
    const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        defaultValues: {
            itemName: '',
            color: '',
            item_description: '',
            found_date: '',
            found_time: '',
            found_location: '',
            photo: null
        }
    });

    const handleImageUpload = async (file) => {
        if (!file) return null;

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await axiosSecure.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                setUploadedImageUrl(response.data.url);
                toast.success('Image uploaded successfully!');
                return response.data.url;
            }
        } catch (error) {
            console.error('Image upload error:', error);
            toast.error('Failed to upload image. Please try again.');
            return null;
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            toast.error('File size must be less than 10MB');
            return;
        }

        // Validate file type
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
        // Reset the file input
        const fileInput = document.getElementById('photo');
        if (fileInput) fileInput.value = '';
    };

    const onSubmit = async (data) => {
        try {
            const submitData = {
                ...data,
                imageUrl: uploadedImageUrl || null
            };
            
            console.log('Report Found Data:', submitData);

            const response = await axiosSecure.post('/found-reports', submitData);
            if (response.data.success) {
                console.log('Report submitted successfully:', response.data);
            } else {
                console.error('Failed to submit report:', response.data);
                toast.error('Failed to submit report. Please try again.');
                return;
            }

            
            toast.success('Found item report submitted successfully!');
            reset();
            setUploadedImageUrl(null);
            setSelectedFile(null);
        } catch (error) {
            console.error('Error submitting report:', error);
            toast.error('Failed to submit report. Please try again.');
        }
    };

    return (
        <div className='min-h-[calc(100vh-200px)] flex flex-col items-center justify-center py-8'>
            <div className='w-full max-w-2xl mx-auto bg-white p-6'>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* itemName */}
                    <div>
                        <input
                            type="text"
                            id="itemName"
                            {...register('itemName', { 
                                required: 'Item name is required',
                                minLength: {
                                    value: 3,
                                    message: 'Name must be at least 3 characters'
                                }
                            })}
                            placeholder="Item Name"
                            className={`input focus:outline-none input-bordered w-full ${
                                errors.itemName ? 'input-error' : ''
                            }`}
                        />
                        {errors.itemName && (
                            <p className="text-red-500 text-sm mt-1">{errors.itemName.message}</p>
                        )}
                    </div>

                    {/* Color */}
                    <div>
                        <input
                            type="text"
                            id="color_text"
                            {...register('color', { required: 'Please enter the color' })}
                            placeholder="e.g., Black, Red, Blue"
                            className={`input focus:outline-none input-bordered w-full ${
                                errors.color ? 'input-error' : ''
                            }`}
                        />
                        {errors.color && (
                            <p className="text-red-500 text-sm mt-1">{errors.color.message}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <textarea
                            id="item_description"
                            {...register('item_description', { 
                                required: 'Item description is required',
                                minLength: {
                                    value: 10,
                                    message: 'Description must be at least 10 characters'
                                }
                            })}
                            placeholder="Describe your found item in detail (brand, model, distinguishing features, etc.)"
                            rows={4}
                            className={`textarea textarea-bordered w-full focus:outline-none resize-none ${
                                errors.item_description ? 'textarea-error' : ''
                            }`}
                        />
                        {errors.item_description && (
                            <p className="text-red-500 text-sm mt-1">{errors.item_description.message}</p>
                        )}
                    </div>

                    {/* found Date and Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="found_date" className="block text-sm font-medium text-gray-700 mb-1">
                                Found Date
                            </label>
                            <input
                                type="date"
                                id="found_date"
                                {...register('found_date', { 
                                    required: 'found date is required',
                                    validate: (value) => {
                                        const selectedDate = new Date(value);
                                        const today = new Date();
                                        today.setHours(23, 59, 59, 999);
                                        return selectedDate <= today || 'found date cannot be in the future';
                                    }
                                })}
                                max={new Date().toISOString().split('T')[0]}
                                className={`input focus:outline-none focus-within:outline-none input-bordered w-full ${
                                    errors.found_date ? 'input-error' : ''
                                }`}
                            />
                            {errors.found_date && (
                                <p className="text-red-500 text-sm mt-1">{errors.found_date.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="found_time" className="block text-sm font-medium text-gray-700 mb-1">
                                Found Time (Approximate)
                            </label>
                            <input
                                type="time"
                                id="found_time"
                                {...register('found_time')}
                                className="input focus:outline-none focus-within:outline-none input-bordered w-full"
                            />
                        </div>
                    </div>

                    {/* found Location */}
                    <div>
                        <input
                            type="text"
                            id="found_location"
                            {...register('found_location', { 
                                required: 'found location is required',
                                minLength: {
                                    value: 3,
                                    message: 'Location must be at least 3 characters'
                                }
                            })}
                            placeholder="Found Location"
                            className={`input focus:outline-none input-bordered w-full ${
                                errors.found_location ? 'input-error' : ''
                            }`}
                        />
                        {errors.found_location && (
                            <p className="text-red-500 text-sm mt-1">{errors.found_location.message}</p>
                        )}
                    </div>

                    {/* Photo Upload */}
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
                                <label 
                                    htmlFor="photo" 
                                    className={`cursor-pointer flex flex-col items-center ${isUploading ? 'pointer-events-none' : ''}`}
                                >
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
                                            <span className="text-sm text-gray-600">
                                                Upload Photo if Available
                                            </span>
                                            <span className="text-xs text-gray-500 mt-1">
                                                PNG, JPG up to 10MB
                                            </span>
                                        </>
                                    )}
                                </label>
                            </div>
                        ) : (
                            <div className="border border-gray-300 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">Uploaded Image:</span>
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="btn btn-sm btn-error"
                                    >
                                        Remove
                                    </button>
                                </div>
                                <div className="relative">
                                    <img 
                                        src={uploadedImageUrl} 
                                        alt="Uploaded item" 
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting || isUploading}
                        className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center">
                                <div className="loading loading-spinner loading-sm mr-2"></div>
                                Submitting Report...
                            </span>
                        ) : (
                            'Submit Report'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReportFound;