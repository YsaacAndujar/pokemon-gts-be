import { Logger } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { AuthGuard } from "src/guards";
import { History } from "./entities/history.entity";

@WebSocketGateway({
    namespace: 'history',
})
export class HistoryGateway implements OnGatewayInit  {
    private readonly clientSockets = new Map<number, Socket>();
    @WebSocketServer()
    server: Server;
    constructor(private readonly authGuard: AuthGuard) { }

    afterInit() {
        Logger.log('History socket initialized')
    }

    async handleConnection(socket: Socket) {
        var token = this.authGuard._extractTokenFromHeader(socket.handshake.headers);
        try {
            if (await this.authGuard.authenticate(socket, token)) {
                const userId = await this.authGuard.getUserIdFromToken(token)
                this.clientSockets.set(userId, socket);
                return true
            }
        } catch (err) {
            socket.emit("error", err.response)
            socket.disconnect(true)
            return err
        }
    }

    sendNotificationToUser(userId: number, history: History): void {
        const socket = this.clientSockets.get(userId);
        if (socket) {
            socket.emit('notification', history); // Enviar mensaje al usuario a través del socket
        } 
    }
    

}