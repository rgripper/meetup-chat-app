import { ChatState, ChatStateType } from "./ChatState";
import { ChatDataHandler } from "./ChatService";

export class DummyChatService {

    private chatState: ChatState;

    constructor(url: string, private handler: ChatDataHandler) {
        console.log(url);
        this.chatState = { type: ChatStateType.NotInitialized };
        this.join('Me');
        this.setUpHandler(handler);
    }

    join (userName: string) {
        this.chatState = { type: ChatStateType.AuthenticatedAndInitialized, data: { user: { name: userName }, messages: [], otherUsers: [] } }
        this.handler.handleState(this.chatState);
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
                handler.handleMessageReceived({ sender: randomUser, text: 'Testos! ' + prob });
                return;
            }
            else if (prob > 0.05) {
                const newUser = { name: 'John' + prob };
                this.chatState.data.otherUsers.push(newUser);
                handler.handleUserJoined(newUser);
                return;
            }
            else {
                if (this.chatState.data.otherUsers.length == 0) return;
                const leavingUser = this.chatState.data.otherUsers.pop()!;
                handler.handleUserReft(leavingUser);
            }
        }, 1000);

    }
}