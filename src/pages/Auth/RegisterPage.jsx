// frontend/src/pages/Auth/RegisterPage.js

import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const { register, error, loading, user, clearError } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
        if (error) {
            setMessage(error);
            const timer = setTimeout(() => {
                clearError();
                setMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [user, error, navigate, clearError]);

    const submitHandler = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage('Şifrələr uyğun gəlmir!');
            return;
        }

        const res = await register({ name, email, password });
        if (res.success) {
            setMessage(res.message);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Qeydiyyat</h2>
                {message && <p className="text-red-500 mb-4">{message}</p>}
                {loading && <p className="text-blue-500 mb-4">Yüklənir...</p>}
                <form onSubmit={submitHandler}>
                    <div className="mb-4 text-left">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Ad:</label>
                        <input
                            type="text"
                            id="name"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4 text-left">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Şifrə:</label>
                        <input
                            type="password"
                            id="password"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6 text-left">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">Şifrəni Təkrarla:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition-colors duration-200"
                    >
                        Qeydiyyatdan Keç
                    </button>
                </form>
                <p className="mt-6 text-sm text-gray-600">
                    Artıq hesabınız var? <Link to="/login" className="text-blue-500 hover:text-blue-800">Daxil Ol</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;