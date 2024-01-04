import { Server } from "socket.io";
import Redis from "ioredis";

import { REDIS_CLIENT } from "../secrets";

const PUB = new Redis(REDIS_CLIENT);
const SUB = new Redis(REDIS_CLIENT);

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

        // subscribe to redis
        SUB.subscribe("MESSAGES");
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
                await PUB.publish("MESSAGES", JSON.stringify(message));
            });
        })

        SUB.on("message", (channel, message) => {
            if (channel === "MESSAGES") {
                io.emit('chat:message-received', message);
            } else {
                console.log('channel not found');
            }
        });
    }

}

export default SocketService;
