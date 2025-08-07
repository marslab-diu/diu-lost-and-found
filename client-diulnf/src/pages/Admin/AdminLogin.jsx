import React, { useState } from 'react';
import icon from '../../assets/icon.svg';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router';

const AdminLogin = () => {

    const {logInUser} = useAuth();
    const [error,setError] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleLogin = (event) => {
        event.preventDefault();
        const form = event.target;
        const email = form.email.value;
        const password = form.password.value;

        logInUser(email, password)
            .then(() => {
                setError('');
                // console.log("Admin logged in successfully");
                navigate('/admin/dashboard', { replace: true });
            })
            .catch(error => {
                setError(error.message);
            });
    };

    return (
        <div className='min-h-[calc(100vh-52px)] flex flex-col items-center justify-center'>
            <img
                src={icon}
                alt="DIU Lost and Found"
                className='mx-auto my-5 w-24 h-24'
            />

            <div className='w-full max-w-2xl mx-auto bg-white rounded-lg p-6'>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <input
                            type="email"
                            name="email"
                            className="input focus:outline-none input-bordered w-full"
                            placeholder="Email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            name="password"
                            className="input focus:outline-none input-bordered w-full"
                            placeholder="Password"
                            required
                        />
                    </div>
                    {error && <p className='text-red-500 text-sm'>{error}</p>}
                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;