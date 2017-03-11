import * as io from 'socket.io-client';
import { Message } from './Message';
import { User } from './User';
import { ChatState, ChatStateType, ChatData } from "./ChatState";

export interface ChatDataHandler {
    handleState: (x: ChatState) => void,
    handleUserReft: (x: User) => void,
    handleUserJoined: (x: User) => void,
    handleMessageReceived: (x: Message) => void,
}

export const initialChatState: ChatState = { type: ChatStateType.NotInitialized };

type ServerEvent =
    | {
        creationDate: Date,
        type: 'MessageReceived',
        data: Message
    }
    | {
        creationDate: Date,
        type: 'UserJoined',
        data: User
    }
    | {
        creationDate: Date,
        type: 'UserLeft',
        data: User
    }

export class ChatService {
    private readonly socket: SocketIOClient.Socket;

    constructor(url: string, private handler: ChatDataHandler) {
        this.socket = io(url);
        this.setUpHandler(this.socket, handler);
    }

    join(userName: string) {
        this.handler.handleState({ type: ChatStateType.Authenticating });
        this.socket.emit('chat.client.authentication', userName);
    }

    private setUpHandler(socket: SocketIOClient.Socket, handler: ChatDataHandler) {
        socket.on('chat.server.authentication-result', function (result: { isSuccessful: true, initialData: ChatData } | { isSuccessful: false, errorMessage: string }) {
            if (result.isSuccessful) {
                handler.handleState({ type: ChatStateType.AuthenticatedAndInitialized, data: result.initialData });
            }
            else {
                handler.handleState({ type: ChatStateType.AuthenticationFailed, errorMessage: result.errorMessage });
            }
        });

        socket.on('chat.server.event', function (event: ServerEvent) {
            switch (event.type) {
                case 'MessageReceived':
                    handler.handleMessageReceived(event.data);
                    return;
                case 'UserJoined':
                    handler.handleUserJoined(event.data);
                    return;
                case 'UserLeft':
                    handler.handleUserReft(event.data);
                    return;
            }
        });
    }
}