import React from 'react';
import { Link } from 'react-router';

const Footer = () => {
    return (
        <div className='bg-secondary'>
            <div className='flex flex-col sm:flex-row gap-5 justify-between sm:items-center p-4 text-sm font-semibold mx-auto w-11/12'>
                <div className='flex flex-col sm:flex-row gap-5'>
                    <Link to="/about" className=''>About</Link>
                    <Link to="/help" className=''>Help</Link>
                    <Link to="/locations" className=''>Locations</Link>
                </div>
                <div className='flex flex-col sm:flex-row gap-5'>
                    <Link to="/feedback" className=''>Feedback</Link>
                    <Link to="/terms" className=''>Terms</Link>
                    <Link to="/privacy" className=''>Privacy</Link>
                </div>
            </div>
        </div>
    );
};

export default Footer;