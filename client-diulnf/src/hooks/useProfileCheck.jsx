import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { AuthContext } from '../contexts/AuthProvider';
import useAxiosSecure from './useAxiosSecure';

const useProfileCheck = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const [isChecking, setIsChecking] = useState(false);
    const [profileStatus, setProfileStatus] = useState(null);

    const checkUserProfile = async (userToCheck = null) => {
        const currentUser = userToCheck || user;
        if (!currentUser?.email) {
            // console.log('No user found for profile check');
            return;
        }
        
        console.log('Checking profile for user:', currentUser.email);
        setIsChecking(true);
        
        try {
            const response = await axiosSecure.get('/user/profile-status');
            const { exists, isComplete } = response.data;
            
            setProfileStatus(response.data);

            
            // console.log('Profile check response:', response.data);
            
            if (!exists || !isComplete) {
                navigate('/user/profile', { replace: true });
            } else {
                navigate('/user/search', { replace: true });
            }
        } catch (error) {
            console.error('Error checking user profile:', error);
            navigate('/user/profile', { replace: true });
        } finally {
            setIsChecking(false);
        }
    };

    return {
        checkUserProfile,
        isChecking,
        profileStatus
    };
};

export default useProfileCheck;