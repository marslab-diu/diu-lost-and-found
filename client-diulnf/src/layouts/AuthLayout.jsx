import React from 'react';
import Footer from '../components/Shared/Footer';
import { Outlet } from 'react-router';

const AuthLayout = () => {
    return (
        <div>
            This is the Auth Layout
            <div className='min-h-[calc(100vh-76px)] flex flex-col justify-between'>
                <Outlet></Outlet>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default AuthLayout;