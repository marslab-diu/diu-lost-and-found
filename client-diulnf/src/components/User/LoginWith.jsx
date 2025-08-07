import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'sonner';
import { AuthContext } from '../../contexts/AuthProvider';
import useProfileCheck from '../../hooks/useProfileCheck';
import useAuth from '../../hooks/useAuth';



const LoginWith = () => {


    const { user, loading, signInWithGoogle, logOutUser, deleteAccount } = useAuth();
    const { checkUserProfile, isChecking } = useProfileCheck();



    const handleLogin = () => {
        signInWithGoogle()
            .then(result => {
                const loggedUser = result.user;

                // Check if email ends with .diu.edu.bd
                if (!/^[\w.-]+@[\w.-]*diu\.edu\.bd$/i.test(loggedUser.email)) {
                    toast.error("Please use your DIU email account (.diu.edu.bd)");

                    deleteAccount()
                        .then(() => {
                            return logOutUser();
                        })
                        .catch(error => {
                            console.error("Error during logout/delete:", error);
                            toast.error("Failed to log out or delete account. Please try again.");
                        });

                    return;
                }

                toast.success(`Welcome ${loggedUser.displayName}`);
                setTimeout(() => {
                    checkUserProfile(loggedUser);
                }, 1000);
                // console.log("function checkUserProfile called");

            })
            .catch(error => {
                console.error("Login error:", error);
                toast.error("Failed to log in. Please try again.");
            });
    };

    // console.log("User in LoginWith:", user);


    return (
        <div>
            <button onClick={handleLogin} className="btn bg-transparent" disabled={loading || isChecking}>
                <FcGoogle size={20} />
                {isChecking ? 'Checking Profile...' : 'Sign in with DIU Email Account'}
            </button>
        </div>
    );
};

export default LoginWith;