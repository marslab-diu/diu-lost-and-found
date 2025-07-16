import React from 'react';
import Footer from '../components/Shared/Footer';
import { Outlet } from 'react-router';
import Navbar from '../components/User/Navbar';

const UserLayout = () => {
    return (
        <div>
            This is the User Layout
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default UserLayout;