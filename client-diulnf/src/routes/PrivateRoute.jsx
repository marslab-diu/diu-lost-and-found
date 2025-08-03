import React from 'react';
import useAuth from '../hooks/useAuth';

const PrivateRoute = ({children}) => {
    const {user} = useAuth();
    
    if (user){
        return children;
    }
};

export default PrivateRoute;