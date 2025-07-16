import React from 'react';
import Footer from '../components/Shared/Footer';
import { Outlet } from 'react-router';
import Navbar from '../components/User/Navbar';

const UserLayout = () => {
    return (
        <div>
            <Navbar></Navbar>
            <div className='min-h-[calc(100vh-172px)] flex flex-col justify-between'>
                <Outlet></Outlet>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default UserLayout;