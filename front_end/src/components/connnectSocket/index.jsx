import { io } from 'socket.io-client';

const socket = io('https://chat-with-mongoo-db-l2fr.vercel.app', {
    transports: ['websocket'],
    autoConnect: false,
});

export default socket;
