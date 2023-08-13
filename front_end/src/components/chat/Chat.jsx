import { useSelector } from 'react-redux';
import { SVGSend } from '~/assets/svg';

import React from 'react';
// import socket from '../connnectSocket';

import socketIOClient from 'socket.io-client';

const host = 'http://localhost:5000';

function Chat() {
    const user = useSelector((state) => state?.auth?.login?.data);
    const chat = useSelector((state) => state?.room?.chat?.data);
    // const dispatch = useDispatch();

    const socketRef = React.useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        socketRef.current = socketIOClient.connect(host);
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        const id = window.location.pathname.split('/')[2];

        if (!data.msg.trim()) {
            return;
        }

        await socketRef.current.emit('sendDataClient', {
            msg: data.msg,
            sender: user._id,
            room: id,
            read: [user._id],
            picture: user.picture || null,
            data: chat,
        });

        await socketRef.current.emit('timeRoom', id);

        e.target.reset();
    };

    return (
        <>
            <form className="flex items-center justify-between w-full" method="POST" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="msg"
                    placeholder="Write a message..."
                    className="focus:outline-none focus:ring-2 w-3/4  focus:border-transparent border border-gray-300 rounded-md px-4 py-2 text-black"
                />
                <button className="text-white p-2 px-4 bg-blue-500  rounded-sm flex items-center">
                    Send <SVGSend className="ml-3" />
                </button>
            </form>
        </>
    );
}

export default Chat;
