import React from 'react';
import Footer from '../components/Shared/Footer';
import { NavLink, Outlet } from 'react-router';
import AdminTopBar from '../components/Admin/AdminTopBar';
import { BsArchive, BsBookmark, BsExclamationTriangle, BsHouseDoor, BsPatchCheck, BsPeople } from 'react-icons/bs';
import { IoIosAddCircleOutline, IoIosCheckmarkCircleOutline } from 'react-icons/io';


const AdminLayout = () => {
    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <AdminTopBar />


            <div className="w-11/12 mx-auto flex flex-1 gap-5 overflow-hidden">

                {/* sidebar */}
                <aside className="w-58 rounded-3xl bg-base-200 py-4 px-1 mt-3 mb-5">
                    <ul className="admin-nav menu space-y-2 text-base-content w-full">
                        <li><NavLink to="/admin" className="flex items-center gap-3 transition-colors hover:bg-base-300">
                            <BsHouseDoor size={22} />
                            <span className='text-lg'>Overview</span>
                        </NavLink>
                        </li>


                        <div className="my-0 divider"></div>
                        
                        <span className='text-lg'>Inputs & Reporting</span>
                        <li><NavLink to="/admin/lost-reports" className="flex items-center gap-2 transition-colors hover:bg-base-300">
                            <BsExclamationTriangle size={22} />
                            <span className='text-lg'>Lost Reports</span>
                        </NavLink>
                        </li>
                        <li><NavLink to="/admin/found-reports" className="flex items-center gap-2 transition-colors hover:bg-base-300">
                            <IoIosCheckmarkCircleOutline size={24} />
                            <span className='text-lg'>Found Reports</span>
                        </NavLink>
                        </li>
                        <li><NavLink to="/admin/admin-entry" className="flex items-center gap-2 transition-colors hover:bg-base-300">
                            <IoIosAddCircleOutline size={24} />
                            <span className='text-lg'>Manual Entry</span>
                        </NavLink>
                        </li>

                        <div className="my-0 divider"></div>
                        
                        <span className='text-lg'>Item Management</span>
                        <li><NavLink to="/admin/lost-reports" className="flex items-center gap-2 transition-colors hover:bg-base-300">
                            <BsArchive size={22} />
                            <span className='text-lg'>Recovered Items</span>
                        </NavLink>
                        </li>
                        <li><NavLink to="/admin/found-reports" className="flex items-center gap-2 transition-colors hover:bg-base-300">
                            <BsBookmark size={22} />
                            <span className='text-lg'>Claimed Items</span>
                        </NavLink>
                        </li>
                        <li><NavLink to="/admin/admin-entry" className="flex items-center gap-2 transition-colors hover:bg-base-300">
                            <BsPatchCheck size={22} />
                            <span className='text-lg'>Resolved Items</span>
                        </NavLink>
                        </li>

                        <div className="my-0 divider"></div>
                        <li><NavLink to="/admin/admin-entry" className="flex items-center gap-2 transition-colors hover:bg-base-300">
                            <BsPeople size={22} />
                            <span className='text-lg'>Manage Admin</span>
                        </NavLink>
                        </li>


                    </ul>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 bg-gray-50 p-6 mt-3 mb-5 overflow-y-auto">
                    <Outlet />
                </main>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default AdminLayout;
