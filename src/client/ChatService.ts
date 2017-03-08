import { Message } from './Message';
import { User } from './User';
import * as io from 'socket.io-client';

export interface ChatDataHandler {
    handleAuthenticated: (x: User) => void,
    handleState: (x: ChatState) => void,
    handleUserReft: (x: User) => void,
    handleUserJoined: (x: User) => void,
    handleMessageReceived: (x: Message) => void,
}

export enum ChatStateType { AuthenticationFailed, Initialized }

export interface ChatData {
    readonly user: User,
    readonly otherUsers: User[],
    readonly messages: Message[],
}

export type ChatState = 
| {
    readonly type: ChatStateType.Initialized,
    readonly data: ChatData
}
| {
    readonly type: ChatStateType.AuthenticationFailed,
    readonly errorMessage: string
}

type ServerEvent =
    | {
        createionDate: Date,
        type: 'Authenticated',
        data: User
    }
    | {
        createionDate: Date,
        type: 'InitialState',
        data: ChatState
    }
    | {
        createionDate: Date,
        type: 'MessageReceived',
        data: Message
    }
    | {
        createionDate: Date,
        type: 'UserJoined',
        data: User
    }
    | {
        createionDate: Date,
        type: 'UserLeft',
        data: User
    }

export class SocketWrapper {
    constructor(url: string, userName: string, handler: ChatDataHandler) {
        const socket = io(url);
        this.setUpHandler(socket, handler);
        socket.emit('chat.auth-request', userName);
        socket.emit('chat.join-request', userName);
        
    }

    private setUpHandler(socket: SocketIOClient.Socket, handler: ChatDataHandler) {
        socket.on('chat.auth-response', function (result: { isSuccessful: true } | { isSuccessful: false, errorMessage: string }) {
            if (result.isSuccessful) {
                socket.emit('chat.init-request');
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