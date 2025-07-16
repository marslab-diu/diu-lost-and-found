import React, { useContext } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Toaster, toast } from 'sonner';
import { AuthContext } from '../../contexts/AuthProvider';


const LoginWith = () => {

    const { user, loading, signInWithGoogle, logOutUser, deleteAccount } = useContext(AuthContext);

    const handleLogin = () => {
        signInWithGoogle()
            .then(result => {
                const loggedUser = result.user;






                toast.success(`Welcome ${loggedUser.displayName}`);
            })
            .catch(error => {
                console.error("Login error:", error);
                toast.error("Failed to log in. Please try again.");
            });
    };




    return (
        <div>
            <button onClick={handleLogin} className="btn bg-transparent">
                <FcGoogle size={20}/>
                Sign in with DIU Email Account
            </button>
            <Toaster position="top-center" richColors />
        </div>
    );
};

export default LoginWith;