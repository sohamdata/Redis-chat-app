import { Server } from "socket.io";

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

            socket.on('message', (message) => {
                console.log('message', message);
            });
        })
    }

}

export default SocketService;
