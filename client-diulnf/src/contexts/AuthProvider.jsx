import React, { createContext, useEffect, useState } from 'react'
import { deleteUser, getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { app } from '../firebase/firebase.config';


const provider = new GoogleAuthProvider();
export const auth = getAuth(app);
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const signInWithGoogle = () => {
        setLoading(true);
        return signInWithPopup(auth, provider);
    };

    const logOutUser = () => {
        setLoading(true);
        return signOut(auth);
    };

    const deleteAccount = () => {
        setLoading(true);
        return deleteUser(auth.currentUser);
    }   


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            // console.log('current user', currentUser);
            setUser(currentUser);
            setLoading(false);
            // console.log("current user", currentUser);
        });
        return () => unsubscribe();
    }
        , []);
    


    const authData = {
        user,
        setUser,
        setLoading,
        loading,
        signInWithGoogle,
        logOutUser,
        deleteAccount
    };


    return <AuthContext value={authData}>
        {children}
    </AuthContext>
};

export default AuthProvider;