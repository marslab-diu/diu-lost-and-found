import React from 'react';
import Footer from '../components/Shared/Footer';
import { Outlet } from 'react-router';
import Navbar from '../components/User/Navbar';
import PrivateRoute from '../routes/PrivateRoute';

const AuthLayout = () => {
    return (
        <div>
            <Navbar></Navbar>            
            <div className='min-h-[calc(100vh-172px)] mx-auto w-11/12'>
                <Outlet></Outlet>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default AuthLayout;