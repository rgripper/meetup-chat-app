import { ChatState, initialChatState } from "./chat/ChatState";

export const initialAppState: AppState = { chatState: initialChatState };

export interface AppState {
  readonly chatState: ChatState,
}