import React from 'react';
import icon from '../../assets/icon.svg';
import LoginWith from '../../components/User/LoginWith';

const UserLogin = () => {
    return (
        <div className='min-h-[calc(100vh-52px)] flex flex-col items-center justify-center'>
            <img
                src={icon}
                alt="DIU Lost and Found"
                className='mx-auto my-10 w-24 h-24'
            />
            <LoginWith></LoginWith>

        </div>
    );
};

export default UserLogin;