import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { MdLocationOn, MdDateRange, MdAccessTime, MdConfirmationNumber } from 'react-icons/md';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';

const ItemCard = ({ item }) => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [showClaimModal, setShowClaimModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [claimMessage, setClaimMessage] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();

    // Mutation for claiming item
    const claimItemMutation = useMutation({
        mutationFn: async (claimData) => {
            return axiosSecure.patch(`/found-reports/${item.reportId}/claim`, claimData);
        },
        onSuccess: () => {
            toast.success('Claim submitted successfully!');
            queryClient.invalidateQueries(['stored-items-user']);
            setShowClaimModal(false);
            setShowConfirmModal(false);
            reset();
            setClaimMessage('');
        },
        onError: (error) => {
            toast.error('Failed to submit claim');
            console.error('Claim error:', error);
        }
    });

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    const handleClaimClick = () => {
        setShowClaimModal(true);
    };

    const onClaimSubmit = (data) => {
        setClaimMessage(data.message);
        setShowClaimModal(false);
        setShowConfirmModal(true);
    };

    const confirmClaim = () => {
        claimItemMutation.mutate({
            message: claimMessage,
            userId: user?.uid
        });
    };

    return (
        <>
            <div className="bg-white rounded-2xl border-1 border-accent/20 overflow-hidden transition-all duration-300 hover:shadow-xl">
               
                <div className="relative">
                    <img
                        src={item.imageUrl || "/default-item.jpg"}
                        alt={item.itemName}
                        className="w-full h-48 object-cover"
                        onError={e => { e.currentTarget.src = "/default-item.jpg"; }}
                    />
                </div>

                
                <div className="p-4">
                    
                    <h3 className="text-lg font-semibold mb-3">{item.itemName}</h3>

                    <div className="space-y-3 mb-4">
                       
                        <div className="flex items-center gap-5">
                             {/* date */}
                            <div className="flex items-center gap-2">
                                <MdDateRange className="text-gray-500 text-lg flex-shrink-0" />
                                <span className="badge badge-outline badge-sm">{formatDate(item.found_date)}</span>
                            </div>
                            {/* time */}
                            <div className="flex items-center gap-2">
                                <MdAccessTime className="text-gray-500 text-lg flex-shrink-0" />
                                <span className="badge badge-outline badge-sm">{item.found_time || 'N/A'}</span>
                            </div>

                        </div>


                        {/* Location */}
                        <div className="flex items-center gap-2">
                            <MdLocationOn className="text-gray-500 text-lg flex-shrink-0" />
                            <span className="badge badge-outline badge-sm">{item.found_location}</span>
                        </div>

                        {/* Report ID */}
                        <div className="flex items-center gap-2">
                            <MdConfirmationNumber className="text-gray-500 text-lg flex-shrink-0" />
                            <span className="badge badge-outline badge-sm font-mono">{item.reportId}</span>
                        </div>

                        {/* Color */}
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500 text-sm">Color:</span>
                            <span className="badge badge-outline badge-primary badge-sm">{item.color}</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-4 border-t border-gray-200 pt-3">
                        <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>

                    {/* Claim Button */}
                    <button
                        onClick={handleClaimClick}
                        className="btn w-full btn-primary py-2 px-4 rounded-full font-medium transition-colors disabled:cursor-not-allowed"
                        disabled={item.claimedStatus}
                    >
                        {item.claimedStatus ? 'Already Claimed' : 'Claim this item'}
                    </button>
                </div>
            </div>

            {/* Claim Modal */}
            {showClaimModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">Claim Item</h3>
                        <form onSubmit={handleSubmit(onClaimSubmit)}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Message (Optional)
                                </label>
                                <textarea
                                    {...register('message')}
                                    placeholder="Provide additional details about why you believe this is your item..."
                                    rows={4}
                                    className="focus-within:outline-none textarea textarea-bordered w-full resize-none"
                                />
                            </div>
                            <div className="modal-action">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowClaimModal(false);
                                        reset();
                                    }}
                                    className="btn btn-outline"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Continue
                                </button>
                            </div>
                        </form>
                    </div>
                    <div 
                        className="modal-backdrop" 
                        onClick={() => {
                            setShowClaimModal(false);
                            reset();
                        }}
                    ></div>
                </div>
            )}

            {/* Confirm Modal */}
            {showConfirmModal && (
                <div className="modal modal-open">
                    <div className="modal-box text-center">
                        <h3 className="font-bold text-lg mb-4">Confirm Claiming?</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure that you want to claim this item? False claiming will lead you facing disciplinary actions
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => {
                                    setShowConfirmModal(false);
                                    setClaimMessage('');
                                }}
                                className="btn btn-outline rounded-full px-6"
                            >
                                Close
                            </button>
                            <button
                                onClick={confirmClaim}
                                disabled={claimItemMutation.isPending}
                                className="btn bg-lime-300 text-black hover:bg-lime-400 border-none rounded-full px-6"
                            >
                                {claimItemMutation.isPending ? 'Processing...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                    <div 
                        className="modal-backdrop" 
                        onClick={() => {
                            setShowConfirmModal(false);
                            setClaimMessage('');
                        }}
                    ></div>
                </div>
            )}
        </>
    );
};

export default ItemCard;