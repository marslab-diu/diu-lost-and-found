import React from 'react';
import Footer from '../components/Shared/Footer';
import { Outlet } from 'react-router';

const AuthLayout = () => {
    return (
        <div>
            This is the Auth Layout
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default AuthLayout;