import React, { useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router';

const Home = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) {
            console.log("Loading user data...");
            return;
        }
        if (user) {
            console.log("User is logged in, redirecting to search page");
            navigate('/user/search', { replace: true });
        } else {
            console.log(user);
            console.log("User not logged in, redirecting to login page");
            navigate('/auth/login', { replace: true });
        }
    }, [user,loading, navigate]);

    
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="loading loading-ring loading-lg"></div>
            </div>
        </div>
    );
};

export default Home;