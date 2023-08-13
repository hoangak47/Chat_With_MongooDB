import { io } from 'socket.io-client';

const socket = io('https://chat-with-mongoo-db-l2fr.vercel.app', {
    withCredentials: true,
    path: '/socket.io',
    transports: ['websocket'],
});

export default socket;
