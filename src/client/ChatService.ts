import { Message } from './Message';
import { User } from './User';
import { Session } from './ChatSession';
import * as createSocket from 'socket.io-client';

export interface ChatDataHandler {
    handleSession: (x: Session) => void, 
    handleUserReft: (x: User) => void, 
    handleUserJoined: (x: User) => void,
    handleMessageReceived: (x: Message) => void,
}

export enum ServerMessageType {
    MessageReceived, UserJoined, UserLeft
}

export class ChatService {
    constructor(handler: ChatDataHandler) {
        const socket = createSocket ('http://localhost');
        socket.on('connect', function(){});
        socket.on('event', function(data){});
        socket.on('disconnect', function(){});

    }

    join(name: string): Promise<ChatSession> {
        throw new Error();
    }

    leave(): Promise<ChatSession> {
        throw new Error();
    }
}