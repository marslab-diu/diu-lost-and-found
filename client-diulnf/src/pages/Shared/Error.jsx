import React from 'react';
import { useNavigate } from 'react-router';

const Error = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center max-w-md mx-auto px-4">
                <div className="text-red-500 mb-6">
                    <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                </div>
                
                <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
                <p className="text-gray-600 mb-8">
                    The page you're looking for doesn't exist or has been moved.
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

export default Error;