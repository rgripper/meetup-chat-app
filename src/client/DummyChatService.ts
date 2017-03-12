import { ChatState, ChatStateType } from "./ChatState";
import { ChatDataHandler } from "./ChatService";
import { Message } from "./Message";

export class DummyChatService {

    private chatState: ChatState = { type: ChatStateType.NotInitialized };

    private readonly dummyNames = ['Sam', 'Bill', 'RubberyJoe', 'Jenny', 'GoomyTiger9'];

    private lastMessageId = 1;

    constructor(url: string, private handler: ChatDataHandler) {
        console.log(url);
        this.join('Me');
        this.setUpHandler(handler);
    }

    join(userName: string) {
        this.chatState = { type: ChatStateType.AuthenticatedAndInitialized, data: { user: { name: userName }, messages: [], otherUsers: [] } }
        this.handler.handleState(this.chatState);
    }

    sendMessage(message: Message) {
        this.handler.handleMessageReceived({ ...message, id: this.lastMessageId++ });
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
                handler.handleMessageReceived({ id: this.lastMessageId++, sender: randomUser, text: 'Message ' + prob });
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