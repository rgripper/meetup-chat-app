import { User } from "./User";
import { Message, MessageSubmission } from './Message';

export interface ChatData {
    readonly user: User,
    readonly otherUsers: User[],
    readonly messages: Message[],
    readonly messageSubmissions: MessageSubmission[],
}

export enum ChatStateType { AuthenticationFailed, AuthenticatedAndInitialized, NotInitialized, Authenticating }

export type ChatState =
    | {
        readonly type: ChatStateType.NotInitialized
    }
    | {
        readonly type: ChatStateType.Authenticating,
        readonly userName: string
    }
    | {
        readonly type: ChatStateType.AuthenticatedAndInitialized,
        readonly data: ChatData
    }
    | {
        readonly type: ChatStateType.AuthenticationFailed,
        readonly errorMessage: string
    }