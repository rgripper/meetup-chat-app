import { ChatState, ChatStateType } from "store/ChatState";
import { ChatDataHandler } from "./ChatService";
import { Message } from './Message';
import { MessageSubmission } from './MessageSubmission';

export class DummyChatService {

    private chatState: ChatState = { type: ChatStateType.NotAuthenticated };

    private readonly dummyNames = ['Sam', 'Bill', 'RubberyJoe', 'Jenny', 'Cyclepath9'];

    private lastMessageId = 0;

    constructor(url: string, private handler: ChatDataHandler) {
        console.log(url);
        this.setUpHandler(handler);
    }

    join(userName: string) {
        const currentUser = { name: userName };
        this.chatState = { type: ChatStateType.AuthenticatedAndInitialized, data: { currentUser, messages: [], users: [currentUser] } };
        this.handler.handleJoinResult({ isSuccessful: true, initialData: this.chatState.data });
    }

    leave() {
        this.chatState = { type: ChatStateType.NotAuthenticated };
    }

    sendMessage(messageSubmission: MessageSubmission) {
        if (this.chatState.type != ChatStateType.AuthenticatedAndInitialized) throw new Error('Invalid state');
        this.lastMessageId++;
        const newMessage: Message = { ...messageSubmission, id: this.lastMessageId, sender: this.chatState.data.currentUser, creationDate: new Date() };
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

            const otherUsers = this.chatState.data.users.filter(x => x != (this.chatState as any).data.currentUser);
            const prob = Math.random();

            if (prob > 0.6) {
                return;
            }
            else if (prob > 0.2) {
                if (otherUsers.length == 0) return;
                const randomUser = otherUsers[this.getRandomInt(0, otherUsers.length)];
                this.lastMessageId++;
                const newMessage: Message = { id: this.lastMessageId, sender: randomUser, text: `Message ${this.lastMessageId} from ${randomUser.name}`, creationDate: new Date() };
                handler.handleMessageReceived(newMessage);
                return;
            }
            else if (prob > 0.05) {
                const newUser = { name: this.getDummyUserName() };
                if (this.chatState.data.users.some(x => x.name == newUser.name)) return;
                this.chatState = { ...this.chatState, data: { ...this.chatState.data, users: this.chatState.data.users.concat([newUser]) } };
                handler.handleUserJoined(newUser);
                return;
            }
            else {
                if (otherUsers.length == 0) return;
                const leavingUser = otherUsers[this.getRandomInt(0, otherUsers.length)];
                this.chatState = { ...this.chatState, data: { ...this.chatState.data, users: this.chatState.data.users.filter(x => x != leavingUser) } };
                handler.handleUserReft(leavingUser);
                return;
            }
        }, 1000);

    }

    private getDummyUserName(): string {
        return this.dummyNames[this.getRandomInt(0, this.dummyNames.length)];
    }
}