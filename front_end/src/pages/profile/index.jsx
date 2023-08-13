import { Avatar } from 'antd';
import axios from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Layout from '~/components/Layout';
import axiosJWT from '~/components/axios';
import textAvatar from '~/components/textAvatar';
import { changePasswordRequest, getProlifeRequest } from '~/redux/features/apiRequest';

function Profile() {
    const location = useLocation();
    const dispatch = useDispatch();
    const user_ = useSelector((state) => state?.auth?.login?.data);

    const _id = location?.state?._id;
    const user_id = location?.state?.user_id;
    const accessToken = location?.state?.accessToken;

    const user = useSelector((state) => state?.user?.profile?.data);

    let axiosJWT_ = axiosJWT(user_, dispatch);

    React.useEffect(() => {
        getProlifeRequest(_id, user_id, accessToken, axiosJWT_, dispatch);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_id]);

    const [error, setError] = React.useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        setError(null);
        for (let i = 1; i <= e.target.childNodes.length - 2; i++) {
            e.target.childNodes[i].childNodes[2].innerText = '';
        }

        if (data.password !== data.confirm_password) {
            return (e.target.childNodes[3].childNodes[2].innerText = 'Password and confirm password must be the same');
        }

        changePasswordRequest(user, accessToken, dispatch, data, axios, setError, e.target);
    };

    return (
        <Layout>
            <div className=" m-auto lg:max-w-screen-lg md:px-8 h-full flex flex-col gap-2 text-white  hidden-scrollbar p-2">
                <span className="text-2xl font-bold">Profile</span>

                <hr className="my-3" />

                <div className="flex sm:flex-row flex-col h-80">
                    <div className="flex-1 sm:h-full relative bg-[#1F1F22]">
                        {user?.avatar ? (
                            <img
                                src={user?.avatar}
                                alt=""
                                className="sm:w-full w-1/3 rounded-full absolute  bg-orange-500 sm:top-[50%] sm:left-[100%] top-full left-1/2 transform translate-x-[-50%] translate-y-[-50%]"
                            />
                        ) : (
                            <Avatar
                                size="large"
                                className="bg-[#f56a00]  absolute sm:top-[50%] sm:left-[100%] transform translate-x-[-50%] translate-y-[-50%] w-28 h-28 lg:w-52 lg:h-52 flex items-center top-full left-1/2"
                                gap={4}
                            >
                                <span className="lg:text-8xl text-6xl">{textAvatar({ text: user?.username })}</span>
                            </Avatar>
                        )}
                    </div>
                    <div className="flex-[3] h-full box-border ">
                        <div className="container sm:pl-[30%] mt-16 sm:mt-0">
                            <div className="flex flex-col gap-2">
                                <span className="text-2xl font-bold mb-4">{user?.username}</span>
                                <span className="text-md">
                                    <span className="font-bold">Email: </span>
                                    {user?.email}
                                </span>

                                <span className="text-md">
                                    <span className="font-bold">Phone: </span>
                                    {user?.phone || 'Chưa cập nhật'}
                                </span>

                                <span className="text-md">
                                    <span className="font-bold">Address: </span>
                                    {user?.address || 'Chưa cập nhật'}
                                </span>
                            </div>

                            {_id === user_id && (
                                <>
                                    <hr className="my-3" />

                                    <form className="flex flex-col gap-2 mt-4" onSubmit={handleSubmit}>
                                        <span className="text-2xl font-bold  mb-4">Change password</span>
                                        <span className="text-md">
                                            <p className="font-bold">Old password: </p>
                                            <input
                                                name="old_password"
                                                type="password"
                                                required
                                                className="bg-[#1F1F22] text-white px-4 py-2 rounded-md"
                                            />
                                            <p className="text-sm text-red-500">
                                                {error?.error_code === 1 && error?.msg}
                                            </p>
                                        </span>

                                        <span className="text-md">
                                            <p className="font-bold">New password: </p>
                                            <input
                                                required
                                                name="password"
                                                type="password"
                                                className="bg-[#1F1F22] text-white px-4 py-2 rounded-md"
                                            />
                                            <p className="text-sm text-red-500">
                                                {error?.error_code === 2 && error?.msg}
                                            </p>
                                        </span>

                                        <span className="text-md">
                                            <p className="font-bold">Confirm password: </p>
                                            <input
                                                required
                                                name="confirm_password"
                                                type="password"
                                                className="bg-[#1F1F22] text-white px-4 py-2 rounded-md"
                                            />
                                            <p className="text-sm text-red-500"></p>
                                        </span>

                                        <button
                                            type="submit"
                                            className="bg-[#f56a00] text-white px-4 py-2 rounded-md w-1/3 "
                                        >
                                            Change
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Profile;
