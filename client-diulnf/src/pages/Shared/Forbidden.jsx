import React from 'react';
import { useNavigate } from 'react-router';

const Forbidden = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center max-w-md mx-auto px-4">
                <div className="text-red-500 mb-6">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-20 h-20 mx-auto"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                    >
                        <circle cx="12" cy="12" r="9" />
                        <line x1="5" y1="5" x2="19" y2="19" />
                    </svg>
                </div>


                <h1 className="text-6xl font-bold text-gray-800 mb-4">403</h1>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Access Forbidden</h2>
                <p className="text-gray-600 mb-8">
                    You don't have permission to access this page. Admin privileges are required.
                </p>

                <div className="space-x-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="btn btn-outline"
                    >
                        Go Back
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="btn btn-primary"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Forbidden;