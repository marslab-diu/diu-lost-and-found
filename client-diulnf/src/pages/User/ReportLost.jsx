import React from 'react';
import useAuth from '../../hooks/useAuth';

const ReportLost = () => {

    const {user} = useAuth();

    // console.log("User in ReportLost:", user);
    return (
        <div>
            this is the Report Lost Page
            
        </div>
    );
};

export default ReportLost;