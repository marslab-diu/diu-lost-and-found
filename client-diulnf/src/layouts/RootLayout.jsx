import React from 'react';
import Footer from '../components/Shared/Footer';
import { Outlet } from 'react-router';
import Navbar from '../components/User/Navbar';
import PrivateRoute from '../routes/PrivateRoute';

const RootLayout = () => {
    return (
        <div>
            <PrivateRoute><Navbar></Navbar></PrivateRoute>           
            <div className='min-h-[calc(100vh-172px)] mx-auto w-11/12'>
                <Outlet></Outlet>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default RootLayout;