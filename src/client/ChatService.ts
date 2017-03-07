import { Message } from './Message';
import { User } from './User';
import * as createSocket from 'socket.io-client';

export interface ChatDataHandler {
    handleAuthenticated: (x: User) => void,
    handleInitialState: (x: InitialState) => void,
    handleUserReft: (x: User) => void,
    handleUserJoined: (x: User) => void,
    handleMessageReceived: (x: Message) => void,
}


export interface InitialState {
  readonly user: User,
  readonly otherUsers: User[],
  readonly messages: Message[],
}

type ServerMessage =
    | {
        createionDate: Date,
        type: 'Authenticated',
        data: User
    }
    | {
        createionDate: Date,
        type: 'InitialState',
        data: InitialState
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

export function createSocketWithHandler(url: string, handler: ChatDataHandler) {
    const socket = createSocket(url);
    let hasInitialState = false;
    let token: any = null;
    const bufferedMessages: ServerMessage[] = [];
    socket.on('message', function (message: ServerMessage) {
        switch (message.type) {
            case 'Authenticated':
                handler.handleAuthenticated(message.data);
                token = message.data.name;
                socket.emit('GetInitialState', token);
                return;
            case 'InitialState':
                hasInitialState = true;
                handler.handleInitialState(message.data);
                if (bufferedMessages.length > 0) {
                    const orderedBufferedMessages = bufferedMessages.sort((a, b) => a.createionDate.getTime() - b.createionDate.getTime());
                    orderedBufferedMessages.forEach(bufferedMessage => {
                        switch (bufferedMessage.type) {
                            case 'MessageReceived':
                                handler.handleMessageReceived(bufferedMessage.data);
                                return;
                            case 'UserJoined':
                                handler.handleUserJoined(bufferedMessage.data);
                                return;
                            case 'UserLeft':
                                handler.handleUserReft(bufferedMessage.data);
                                return;
                        }
                    })
                }
                return;
            case 'MessageReceived':
                if(hasInitialState) {
                    handler.handleMessageReceived(message.data);
                }
                else {
                    bufferedMessages.push(message);
                }
                return;
            case 'UserJoined':
                if(hasInitialState) {
                    handler.handleUserJoined(message.data);
                }
                else {
                    bufferedMessages.push(message);
                }
                return;
            case 'UserLeft':
                if(hasInitialState) {
                    handler.handleUserReft(message.data);
                }
                else {
                    bufferedMessages.push(message);
                }
                return;
            default: 
                throw new Error('Event is not supported');
        }
    });
    socket.on('disconnect', function () { });
}