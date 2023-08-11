import React from 'react';
import { SVGChat } from '~/assets/svg';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { Avatar } from 'antd';
import { loginSuccess, setAuth } from '~/redux/features/authSlice';
import textAvatar from '../textAvatar';
import { Menu, MenuHandler, MenuItem, MenuList } from '@material-tailwind/react';

import axios from 'axios';
import { logoutRequest } from '~/redux/features/apiRequest';

function Header() {
    const data = useSelector((state) => state?.auth?.login?.data);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const auth = useSelector((state) => state?.auth?.auth);

    const handleAuth = () => {
        dispatch(setAuth(!auth));
    };

    const [result, setResult] = React.useState(null);

    React.useEffect(() => {
        if (!data) {
            navigate('/auth');
        }

        if (!data?.avatar) {
            setResult(textAvatar({ text: data?.username }));
        }

        if (window.location.href.includes('auth')) {
            dispatch(loginSuccess(null));
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Link to={`/`} className="flex items-center text-white">
                <SVGChat />
                <h1 className="md:block hidden ml-4 font-bold text-xl">Chatbase</h1>
            </Link>
            <div className="h-10 flex items-center bg-[#2A2A2D] md:p-6 p-4 rounded-s shadow-md cursor-pointer text-white relative">
                {data ? (
                    <Menu placement="bottom-end">
                        <MenuHandler>
                            <div className="flex items-center">
                                <h2 className="font-bold z-50">Hi, {data.username}</h2>
                                {data?.avatar ? (
                                    <img
                                        src={data?.avatar}
                                        alt=""
                                        className="hidden w-12 h-12 rounded-full ml-6 sm:block z-50 bg-orange-500"
                                        srcSet={data?.avatar}
                                    />
                                ) : (
                                    <Avatar
                                        style={{ backgroundColor: '#f56a00', verticalAlign: 'middle' }}
                                        size="large"
                                        className="ml-6 z-50"
                                        gap={4}
                                    >
                                        {result}
                                    </Avatar>
                                )}
                            </div>
                        </MenuHandler>
                        <MenuList className="bg-[#2A2A2D] w-24 mt-5 ml-5 border-none text-white text-sm">
                            <MenuItem
                                onClick={() => {
                                    navigate(`/profile/${data._id}`, {
                                        state: {
                                            _id: data._id,
                                            user_id: data._id,
                                            accessToken: data.accessToken,
                                        },
                                    });
                                }}
                            >
                                Profile
                            </MenuItem>

                            <MenuItem
                                onClick={() => {
                                    console.log('Settings');
                                }}
                            >
                                Settings
                            </MenuItem>

                            <hr className="my-3" />
                            <MenuItem
                                onClick={() => {
                                    logoutRequest(data, dispatch, axios, navigate);
                                }}
                            >
                                Logout
                            </MenuItem>
                        </MenuList>
                    </Menu>
                ) : (
                    <>
                        {auth ? (
                            <h2 className="font-bold" onClick={handleAuth}>
                                Login now
                            </h2>
                        ) : (
                            <h2 className="font-bold" onClick={handleAuth}>
                                Register now
                            </h2>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

export default Header;
