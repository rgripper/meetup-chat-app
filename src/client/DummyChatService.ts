import { ChatState, ChatStateType } from "./ChatState";
import { ChatDataHandler } from "./ChatService";
import { Message, MessageSubmission } from './Message';

export class DummyChatService {

    private chatState: ChatState = { type: ChatStateType.NotInitialized };

    private readonly dummyNames = ['Sam', 'Bill', 'RubberyJoe', 'Jenny', 'Cyclepath9'];

    private lastMessageId = 0;

    constructor(url: string, private handler: ChatDataHandler) {
        console.log(url);
        this.setUpHandler(handler);
    }

    join(userName: string) {
        this.chatState = { type: ChatStateType.AuthenticatedAndInitialized, data: { user: { name: userName }, messages: [], otherUsers: [] } }
        this.handler.handleState(this.chatState);
    }

    leave() {
        this.chatState = { type: ChatStateType.NotInitialized };
        this.handler.handleState(this.chatState);
    }

    sendMessage(messageSubmission: MessageSubmission) {
        if (this.chatState.type != ChatStateType.AuthenticatedAndInitialized) throw new Error('Invalid state');
        this.lastMessageId++;
        const newMessage: Message = { ...messageSubmission, id: this.lastMessageId, sender: this.chatState.data.user };
        this.handler.handleMessageReceived(newMessage);
    }

    private getRandomInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    private setUpHandler(handler: ChatDataHandler) {
        setInterval(() => {
            if (this.chatState.type != ChatStateType.AuthenticatedAndInitialized) return;

            const prob = Math.random();

            if (prob > 0.6) {
                return;
            }
            else if (prob > 0.2) {
                if (this.chatState.data.otherUsers.length == 0) return;
                const randomUser = this.chatState.data.otherUsers[this.getRandomInt(0, this.chatState.data.otherUsers.length)];
                this.lastMessageId++;
                handler.handleMessageReceived({ id: this.lastMessageId, sender: randomUser, text: `Message ${this.lastMessageId} from ${randomUser.name}` });
                return;
            }
            else if (prob > 0.05) {
                const newUser = { name: this.getDummyUserName() };
                if (this.chatState.data.otherUsers.some(x => x.name == newUser.name)) return;
                this.chatState = { ...this.chatState, data: { ...this.chatState.data, otherUsers: this.chatState.data.otherUsers.concat(newUser) } };
                handler.handleUserJoined(newUser);
                return;
            }
            else {
                if (this.chatState.data.otherUsers.length == 0) return;
                const leavingUser = this.chatState.data.otherUsers[this.getRandomInt(0, this.chatState.data.otherUsers.length)];
                this.chatState = { ...this.chatState, data: { ...this.chatState.data, otherUsers: this.chatState.data.otherUsers.filter(x => x != leavingUser) } };
                handler.handleUserReft(leavingUser);
                return;
            }
        }, 1000);

    }

    private getDummyUserName(): string {
        return this.dummyNames[this.getRandomInt(0, this.dummyNames.length)];
    }
}