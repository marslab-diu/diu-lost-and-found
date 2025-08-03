import React from 'react';
import logo from '../../assets/logo.svg';
import useAuth from '../../hooks/useAuth';

const AdminTopBar = () => {

    const { user } = useAuth();


    return (
        <div className='w-11/12 mx-auto flex justify-between items-center py-4'>
            <img src={logo} alt="" className='w-56' />

            <div className="avatar">
                <div className="w-12 rounded-full">
                    <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
                </div>
            </div> 





        </div>
    );
};

export default AdminTopBar;