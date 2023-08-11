import './index.scss';

import axios from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Layout from '~/components/Layout';
import socket from '~/components/connnectSocket';
import { loginRequest, registerRequest } from '~/redux/features/apiRequest';
import { getChatSuccess } from '~/redux/features/roomSlice';

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const auth = useSelector((state) => state.auth.auth);

    const handleLogin = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        dispatch(getChatSuccess([]));

        socket.emit('online', {
            email: data.email,
        });

        loginRequest(data, dispatch, axios, navigate);
    };

    // React.useEffect(() => {
    //     axios
    //         .post(
    //             'http://localhost:5000/api/auth/login',
    //             {
    //                 email: 'as@gmail.com',
    //                 password: 'hoang123',
    //             },
    //             {
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     withCredentials: true,
    //                 },
    //             },
    //         )
    //         .then((res) => {
    //             console.log(res);
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });

    //     // fetch('http://localhost:5000/api/auth/login', {
    //     //     method: 'POST',
    //     //     headers: {
    //     //         'Content-Type': 'application/json',
    //     //     },
    //     //     body: JSON.stringify({
    //     //         email: 'as@gmail.com',
    //     //         password: 'hoang123',
    //     //     }),
    //     // }).then((res) => {
    // }, []);

    const handleRegister = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        registerRequest(data, dispatch, axios);
    };
    return (
        <Layout>
            <div
                className={`container m-auto lg:max-w-screen-lg md:px-8  flex items-center justify-between ${
                    auth ? 'register' : ''
                }`}
            >
                <div className="flex flex-col sm:w-2/3   min-h-[250px]  m-auto mt-36 w-11/12 relative">
                    <form
                        action=""
                        method="post"
                        className={`w-full sm:p-10 p-4 bg-[#1F1F22] auth login_`}
                        onSubmit={handleLogin}
                    >
                        <div className="flex flex-col justify-center items-center w-full ">
                            <h1 className="text-3xl text-white font-bold mb-4">Login</h1>
                            <div className="flex flex-col w-2/3">
                                <label htmlFor="email" className="text-white">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    className="bg-[#1F1F22] border-b-2 border-white text-white focus:outline-none
   focus:border-[#FBBF24] py-2"
                                />
                            </div>
                            <div className="flex flex-col w-2/3">
                                <label htmlFor="password" className="text-white">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    className="bg-[#1F1F22] border-b-2 border-white text-white focus:outline-none focus:border-[#FBBF24] py-2"
                                />
                            </div>
                            <div className="flex flex-col w-2/3">
                                <button
                                    type="submit"
                                    className="bg-[#FBBF24] text-black py-2 mt-4 hover:bg-[#ffd261] transition duration-300"
                                >
                                    Login
                                </button>
                            </div>
                        </div>
                    </form>
                    <form
                        action=""
                        method="post"
                        className={`w-full sm:p-10 p-4 bg-[#1F1F22] auth register_`}
                        onSubmit={handleRegister}
                    >
                        <div className="flex flex-col justify-center items-center w-full    ">
                            <h1 className="text-3xl text-white font-bold mb-4">Register</h1>
                            <div className="flex flex-col w-2/3">
                                <label htmlFor="username" className="text-white">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    className="bg-[#1F1F22] border-b-2 border-white text-white focus:outline-none
    focus:border-[#FBBF24] py-2"
                                />
                            </div>
                            <div className="flex flex-col w-2/3">
                                <label htmlFor="email" className="text-white">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    className="bg-[#1F1F22] border-b-2 border-white text-white focus:outline-none
    focus:border-[#FBBF24] py-2"
                                />
                            </div>
                            <div className="flex flex-col w-2/3">
                                <label htmlFor="password" className="text-white">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    className="bg-[#1F1F22] border-b-2 border-white text-white focus:outline-none
    focus:border-[#FBBF24] py-2"
                                />
                            </div>
                            <div className="flex flex-col w-2/3">
                                <button
                                    type="submit"
                                    className="bg-[#FBBF24] text-black py-2 mt-4 hover:bg-[#ffd261] transition duration-300"
                                >
                                    Register
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default Login;
