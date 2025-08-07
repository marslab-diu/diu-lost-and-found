import React, { useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router';

const Home = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/user/search', { replace: true });
        } else {
            console.log("User not logged in, redirecting to login page");
            navigate('/auth/login', { replace: true });
        }
    }, [user, navigate]);

    
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="loading loading-ring loading-lg"></div>
            </div>
        </div>
    );
};

export default Home;