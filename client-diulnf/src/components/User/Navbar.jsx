import React, { useContext } from 'react';
import icon from '../../assets/icon.svg';
import { AuthContext } from '../../contexts/AuthProvider';
import { NavLink, useNavigate } from 'react-router';
import { toast } from 'sonner';

const Navbar = () => {

    const { user, loading, logOutUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logOutUser()
            .then(() => {
                toast.success("Logged out successfully");
                navigate('/');

                // alert('Logged out successfully');
            })
            .catch((error) => {
                toast.error("Failed to log out");
                // console.error('Error logging out:', error);
            });
    };

    return (
      <div className="w-11/12 mx-auto px-5 py-10 flex justify-between items-center">
      <div className="flex-1">
        <NavLink to="/user/search">
        <img src={icon} alt="Logo" className="w-10 h-10" />
        </NavLink>
      </div>

      <div className="flex items-center gap-8">
        <NavLink
        to={"/user/report-lost"}
        className="font-medium hover:text-primary"
        >
        Report Lost
        </NavLink>

        <NavLink
        to="/user/report-found"
        className="font-medium hover:text-primary"
        >
        Report Found
        </NavLink>
        
        <NavLink
        to="/user/recovered-items"
        className="font-medium hover:text-primary"
        >
        Recovered Items
        </NavLink>

        {loading ? (
        <div className="loading loading-ring  loading-lg"></div>
        ) : (
        user && (
          <div className="flex items-center gap-2">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="avatar">
            <div className="w-10 h-10 rounded-full cursor-pointer">
              <img
              referrerPolicy="no-referrer"
              className="select-none"
              src={user?.photoURL || "/avatar.jpg"}
              alt="profile"
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
              {user?.displayName || "User"}
            </li>
            <li>
              <NavLink
              to="/user/profile"
              className="btn btn-ghost btn-sm w-full"
              >
              Profile
              </NavLink>
            </li>
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
          </div>
        )
        )}
      </div>
      </div>
    );
};

export default Navbar;