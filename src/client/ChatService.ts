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

type CustomServerEvent =
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

type JoinResult = { isSuccessful: true, initialData: ChatData } | { isSuccessful: false, errorMessage: string };

export class ChatService {
    private readonly socket: SocketIOClient.Socket;

    constructor(url: string, private handler: ChatDataHandler) {
        console.log(url);
        this.socket = io(url, { transports: ['websocket'], autoConnect: false });
        this.socket.on('connect', () => console.log('conn'));
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

    setUpHandler(socket: SocketIOClient.Socket, handler: ChatDataHandler) {
        socket.on('chat.server.join-result', function (result: JoinResult) {
            console.debug('chat.server.join-result');
            if (result.isSuccessful) {
                handler.handleState({ type: ChatStateType.AuthenticatedAndInitialized, data: result.initialData });
            }
            else {
                handler.handleState({ type: ChatStateType.AuthenticationFailed, errorMessage: result.errorMessage });
            }
        });

        socket.on('chat.server.event', function (event: CustomServerEvent) {
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