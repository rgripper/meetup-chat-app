import { ChatService, JoinResult } from "../messaging/ChatService";
import { ChatActionType, ChatAction } from "../store/app/chat/chatStateReducer";
import { Message } from "messaging/Message";
import { ChatStateType } from "../store/app/chat/ChatState";
import { User } from "messaging/User";

export function createChatServiceBoundToStore(chatServerUrl: string, dispatch: (action: ChatAction) => void) {
    return new ChatService(chatServerUrl, {
        handleJoinResult: (joinResult: JoinResult) => dispatch({
            type: ChatActionType.JoinResultReceived,
            payload: {
                chatState: joinResult.isSuccessful
                    ? { type: ChatStateType.AuthenticatedAndInitialized, data: joinResult.initialData }
                    : { type: ChatStateType.AuthenticationFailed, errorMessage: joinResult.errorMessage }
            }
        }),
        handleMessageReceived: (message: Message) => dispatch({
            type: ChatActionType.MessageReceived,
            payload: { message }
        }),
        handleUserJoined: (user: User) => dispatch({
            type: ChatActionType.UserJoined,
            payload: { user }
        }),
        handleUserReft: (userName: string) => dispatch({
            type: ChatActionType.UserLeft,
            payload: { userName }
        }),
    });
}