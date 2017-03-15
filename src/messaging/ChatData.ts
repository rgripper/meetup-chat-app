import { User } from "./User";
import { Message } from './Message';

export interface ChatData {
    readonly currentUser: User,
    readonly users: User[],
    readonly messages: Message[]
}

