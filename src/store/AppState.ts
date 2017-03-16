import { ChatState, initialChatState } from "./ChatState";

export const initialAppState: AppState = { chatState: initialChatState };

export interface AppState {
  readonly chatState: ChatState,
}