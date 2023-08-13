// import { io } from 'socket.io-client';

// const socket = io.connect('https://chat-with-mongoo-db-l2fr.vercel.app/');

// export default socket;

import socketIOClient from 'socket.io-client';

const host = 'https://chat-with-mongoo-db-l2fr.vercel.app/';

const socket = socketIOClient.connect(host);

export default socket;
