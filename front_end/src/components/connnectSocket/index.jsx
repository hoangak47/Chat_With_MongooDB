import { io } from 'socket.io-client';

const socket = io('https://chat-with-mongoo-db-l2fr.vercel.app');

export default socket;
