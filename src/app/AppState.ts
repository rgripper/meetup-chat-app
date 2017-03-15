import { ChatState, initialChatState } from "app/chat/ChatState";

export const initialAppState: AppState = { chatState: initialChatState };

export interface AppState {
  readonly chatState: ChatState,
}