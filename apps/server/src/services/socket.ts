import { Server } from "socket.io";
import Redis from "ioredis";

import prisma from "./prisma";
import { REDIS_CLIENT } from "../secrets";
import { produceMessage } from "./kafka";

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

        SUB.on("message", async (channel, message) => {
            if (channel === "MESSAGES") {
                console.log('message recieved', message);
                io.emit('chat:message-received', message);

                // add message to db
                // await prisma.message.create({
                //     data: {
                //         text: message,
                //     }
                // });

                // publish message to kafka
                await produceMessage(message);
                console.log('message published to kafka');


            } else {
                console.log('channel not found');
            }
        });
    }

}

export default SocketService;
