import { ChatData } from "messaging/ChatData";

export enum ChatStateType { AuthenticationFailed, AuthenticatedAndInitialized, NotAuthenticated, Authenticating }

export type ChatState =
    | {
        readonly type: ChatStateType.NotAuthenticated
    }
    | {
        readonly type: ChatStateType.Authenticating
    }
    | {
        readonly type: ChatStateType.AuthenticatedAndInitialized,
        readonly data: ChatData
    }
    | {
        readonly type: ChatStateType.AuthenticationFailed,
        readonly errorMessage: string
    }

export const initialChatState: ChatState = { type: ChatStateType.NotAuthenticated };