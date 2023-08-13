/* eslint-disable react-hooks/exhaustive-deps */
import './index.scss';

import axios from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Layout from '~/components/Layout';
import { getChatRequest, getRoomsRequest, searchUserRequest } from '~/redux/features/apiRequest';
import { getChatSuccess, getRoomsSuccess } from '~/redux/features/roomSlice';

import { useDebounce } from '@uidotdev/usehooks';
import Room from './room';
import Message from './message';
import Info from './infoChat';
import socket from '~/components/connnectSocket';
import axiosJWT from '~/components/axios';

function Home() {
    const room = useSelector((state) => state?.room?.rooms?.data);
    const user = useSelector((state) => state?.auth?.login?.data);
    const chat = useSelector((state) => state?.room?.chat);
    const search = useSelector((state) => state?.search?.search);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const chat_end = React.useRef(null);

    let axiosJWT_ = axiosJWT(user, dispatch);

    React.useEffect(() => {
        socket.on('timeRoom', (data) => {
            dispatch(getRoomsSuccess(room.map((item) => (item._id === data._id ? data : item))));
        });

        socket.on('sendDataServer', (data) => {
            dispatch(getChatSuccess(data));
            chat_end?.current?.scrollIntoView({ behavior: 'smooth' });
        });
    }, [chat.data]);

    React.useEffect(() => {
        if (user) {
            getRoomsRequest(user, dispatch, axiosJWT_, navigate);
            dispatch(getChatSuccess([]));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [roomActive, setRoomActive] = React.useState(0);

    React.useEffect(() => {
        if (!room) return;
        if (room.length === 0) return;
        if (user) {
            getChatRequest(user, dispatch, axiosJWT_, room[roomActive]?._id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomActive]);

    const [open, setOpen] = React.useState(0);

    const handleOpen = (value) => {
        setOpen(open === value ? 0 : value);
    };
    const [page, setPage] = React.useState(1);
    const chat_ = React.useRef(null);

    const handelInfiniteScroll = () => {
        if (Math.floor(chat_.current.scrollTop) <= chat_.current.offsetHeight - chat_.current.scrollHeight) {
            setPage((prev) => prev + 1);
            chat_?.current?.removeEventListener('scroll', handelInfiniteScroll);
        }
    };

    React.useEffect(() => {
        if (!chat?.data) return;
        if (!user) return;

        getChatRequest(user, dispatch, axiosJWT_, room[roomActive]?._id, page, chat);
    }, [page]);

    React.useEffect(() => {
        if (!chat?.error) {
            chat_?.current?.addEventListener('scroll', handelInfiniteScroll);
        }
        return () => {
            chat_?.current?.removeEventListener('scroll', handelInfiniteScroll);
        };
    }, [chat.loading]);

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
        setKeyword('');
    };

    const [keyword, setKeyword] = React.useState('');

    const debounceKeyword = useDebounce(keyword, 1000);

    React.useEffect(() => {
        if (debounceKeyword) {
            searchUserRequest(user, dispatch, debounceKeyword, axiosJWT_);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounceKeyword]);

    return (
        <Layout chat={room.length > 0}>
            <div className=" m-auto lg:max-w-screen-2xl md:px-8 h-full flex gap-2 text-white hidden-scrollbar relative">
                <Room
                    room={room}
                    roomActive={roomActive}
                    setRoomActive={setRoomActive}
                    search={search}
                    dispatch={dispatch}
                    setPage={setPage}
                    navigate={navigate}
                    showModal={showModal}
                    isModalOpen={isModalOpen}
                    handleCancel={handleCancel}
                    setKeyword={setKeyword}
                    keyword={keyword}
                    debounceKeyword={debounceKeyword}
                />

                <Message
                    room={room}
                    roomActive={roomActive}
                    user={user}
                    chat={chat}
                    chat_={chat_}
                    chat_end={chat_end}
                    dispatch={dispatch}
                />

                <Info
                    room={room}
                    roomActive={roomActive}
                    user={user}
                    open={open}
                    handleOpen={handleOpen}
                    navigate={navigate}
                    dispatch={dispatch}
                />
            </div>
        </Layout>
    );
}

export default Home;
