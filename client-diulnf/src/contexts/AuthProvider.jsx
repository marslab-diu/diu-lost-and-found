import React, { createContext, useEffect, useState } from 'react'
import { createUserWithEmailAndPassword,sendPasswordResetEmail,signInWithEmailAndPassword,updateProfile, deleteUser, getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { app } from '../firebase/firebase.config';


const provider = new GoogleAuthProvider();
export const auth = getAuth(app);
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    // this is for admin only
    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const logInUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    const updateUser = (updatedData) => {
        return updateProfile(auth.currentUser, updatedData);
    };

    const resetPassword = (email) => {
        setLoading(true);
        return sendPasswordResetEmail(auth, email);
    };








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
        deleteAccount,
        createUser,
        logInUser,
        updateUser,
        resetPassword
    };


    return <AuthContext value={authData}>
        {children}
    </AuthContext>
};

export default AuthProvider;