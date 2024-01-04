import { Server } from "socket.io";
import Redis from "ioredis";

import { REDIS_CLIENT } from "../secrets";

const pub = new Redis(REDIS_CLIENT);
// const sub = new Redis(REDIS_CLIENT);

class SocketService {
    private _io: Server;

    constructor() {
        console.log("SocketService constructor");
        this._io = new Server({
            cors: {
                origin: '*',
                allowedHeaders: ['*'],
            }
        });
    }

    get io() {
        return this._io;
    }

    initListeners() {
        const io = this._io;

        console.log('initListeners');

        io.on('connection', (socket) => {
            console.log('a user CONNECTED with socketId', socket.id);

            socket.on('chat:message-sent', async ({ message }) => {
                console.log('> new message:', message);

                // publish message to redis
                await pub.publish("MESSAGES", JSON.stringify(message));
            });
        })
    }

}

export default SocketService;
