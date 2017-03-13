import * as io from 'socket.io-client';
import { Message, MessageSubmission } from './Message';
import { User } from './User';
import { ChatState, ChatStateType, ChatData } from "./ChatState";

export interface ChatDataHandler {
    handleState: (x: ChatState) => void,
    handleUserReft: (x: User) => void,
    handleUserJoined: (x: User) => void,
    handleMessageReceived: (x: Message) => void,
}

export const initialChatState: ChatState = { type: ChatStateType.NotAuthenticated };

type ServerEvent =
    | {
        type: 'MessageReceived',
        data: Message
    }
    | {
        type: 'UserJoined',
        data: User
    }
    | {
        type: 'UserLeft',
        data: User
    }

export class ChatService {
    private readonly socket: SocketIOClient.Socket;

    constructor(url: string, private handler: ChatDataHandler) {
        this.socket = io(url, { autoConnect: false });
        this.socket.on('connected', () => console.log('conn'));
        this.socket.on('disconnected', () => console.log('disc'));

        this.setUpHandler(this.socket, handler);
        this.socket.connect();
    }

    join(userName: string) {
        this.handler.handleState({ type: ChatStateType.Authenticating, userName });
        this.socket.emit('chat.client.join', userName);
    }

    leave() {
        this.handler.handleState({ type: ChatStateType.NotAuthenticated });
        this.socket.emit('chat.client.leave');
    }

    sendMessage(messageSubmission: MessageSubmission) {
        this.socket.emit('chat.client.message', messageSubmission);
    }

    private setUpHandler(socket: SocketIOClient.Socket, handler: ChatDataHandler) {
        socket.on('chat.server.join-result', function (result: { isSuccessful: true, initialData: ChatData } | { isSuccessful: false, errorMessage: string }) {
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