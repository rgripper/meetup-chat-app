import { Message } from './Message';
import { User } from './User';
import * as io from 'socket.io-client';

export interface ChatDataHandler {
    handleState: (x: ChatState) => void,
    handleUserReft: (x: User) => void,
    handleUserJoined: (x: User) => void,
    handleMessageReceived: (x: Message) => void,
}

export enum ChatStateType { AuthenticationFailed, AuthenticatedAndInitialized, NotInitialized, Authenticating }

export interface ChatData {
    readonly user: User,
    readonly otherUsers: User[],
    readonly messages: Message[],
}

export type ChatState =
    | {
        readonly type: ChatStateType.NotInitialized
    }
    | {
        readonly type: ChatStateType.Authenticating
    }
    | {
        readonly type: ChatStateType.AuthenticatedAndInitialized,
        readonly data: ChatData
    }
    | {
        readonly type: ChatStateType.AuthenticationFailed,
        readonly errorMessage: string
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
        this.socket.emit('chat.auth-request', userName);
    }

    private setUpHandler(socket: SocketIOClient.Socket, handler: ChatDataHandler) {
        socket.on('chat.auth-response', function (result: { isSuccessful: true, initialData: ChatData } | { isSuccessful: false, errorMessage: string }) {
            if (result.isSuccessful) {
                handler.handleState({ type: ChatStateType.AuthenticatedAndInitialized, data: result.initialData });
            }
            else {
                handler.handleState({ type: ChatStateType.AuthenticationFailed, errorMessage: result.errorMessage });
            }
        });

        socket.on('chat.init-response', function (initState: ChatState) {
            handler.handleState(initState);
        });

        socket.on('chat.event', function (event: ServerEvent) {
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