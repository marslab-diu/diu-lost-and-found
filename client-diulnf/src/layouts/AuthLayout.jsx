import React from 'react';
import Footer from '../components/Shared/Footer';
import { Outlet } from 'react-router';

const AuthLayout = () => {
    return (
        <div>
            <div className='min-h-[calc(100vh-52px)] mx-auto w-11/12'>
                <Outlet></Outlet>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default AuthLayout;