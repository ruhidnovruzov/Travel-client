import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldXIcon, UserXIcon } from 'lucide-react';

const UnauthorizedPage = ({ type = 'forbidden' }) => {
    const isLoginRequired = type === 'login';
    
    return (
        <div className="min-h-[60vh] pt-40 flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="mb-6">
                    {isLoginRequired ? (
                        <UserXIcon className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                    ) : (
                        <ShieldXIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    )}
                    
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {isLoginRequired ? '401' : '403'}
                    </h1>
                    
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        {isLoginRequired ? 'Giriş Tələb Olunur' : 'Giriş Qadağandır'}
                    </h2>
                    
                    <p className="text-gray-600 mb-6">
                        {isLoginRequired 
                            ? 'Bu səhifəyə daxil olmaq üçün hesabınıza giriş etməlisiniz.'
                            : 'Bu səhifəyə daxil olmaq üçün icazəniz yoxdur.'
                        }
                    </p>
                </div>

                <div className="space-y-4">
                    {isLoginRequired ? (
                        <>
                            <Link
                                to="/login"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 inline-block"
                            >
                                Giriş Et
                            </Link>
                            <Link
                                to="/register"
                                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 inline-block"
                            >
                                Qeydiyyat
                            </Link>
                        </>
                    ) : (
                        <Link
                            to="/"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 inline-block"
                        >
                            Ana Səhifəyə Qayıt
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UnauthorizedPage;