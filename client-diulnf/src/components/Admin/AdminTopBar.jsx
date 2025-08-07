import React from 'react';
import logo from '../../assets/logo.svg';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

const AdminTopBar = () => {
    const { user, loading, logOutUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logOutUser()
            .then(() => {
                toast.success("Logged out successfully");
                navigate('/');
            })
            .catch((error) => {
                toast.error("Failed to log out");
                console.error('Error logging out:', error);
            });
    };

    return (
        <div className='w-11/12 mx-auto flex justify-between items-center py-4'>
            <img src={logo} alt="Admin Dashboard" className='w-56' />

            <div className="flex items-center">
                {loading ? (
                    <div className="loading loading-ring loading-lg"></div>
                ) : (
                    user && (
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="avatar">
                                <div className="w-12 h-12 rounded-full cursor-pointer">
                                    <img
                                        referrerPolicy="no-referrer"
                                        className="select-none"
                                        src={user?.photoURL || "/avatar.jpg"}
                                        alt="Admin Profile"
                                        onError={(e) => {
                                            e.currentTarget.onerror = null;
                                            e.currentTarget.src = "/avatar.jpg";
                                        }}
                                    />
                                </div>
                            </div>
                            <ul
                                tabIndex={0}
                                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 mt-2"
                            >
                                <li className="mb-2 text-center font-semibold select-none">
                                    {user?.displayName || "Admin"}
                                </li>
                                <li className="mb-1 text-center text-sm text-gray-500 select-none">
                                    {user?.email}
                                </li>
                                <div className="divider my-1"></div>
                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className="btn btn-error btn-sm w-full"
                                    >
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default AdminTopBar;