import { Reducer } from 'redux';
import { Message } from './client/Message';
import { User } from './client/User';
import { ChatState } from "./client/ChatService";


export enum ChatActionType {
  Initialized, SelfLeft, MessageReceived, UserJoined, UserLeft
}

export type ChatAction =
  | {
    type: ChatActionType.Initialized,
    payload: { chatState: ChatState }
  }
  | {
    type: ChatActionType.SelfLeft
  }
  | {
    type: ChatActionType.MessageReceived,
    payload: { message: Message }
  }
  | {
    type: ChatActionType.UserJoined,
    payload: { user: User }
  }
  | {
    type: ChatActionType.UserLeft,
    payload: { user: User }
  }

export const chatSessionReducer: Reducer<ChatSession | null> = function (state: ChatSession | null = null, action: ChatAction) {
  switch (action.type) {
    case ChatActionType.SelfJoined:
      return action.payload.chatSession;
    case ChatActionType.SelfJoined:
      return null;
    case ChatActionType.MessageReceived:
      if (state == null) return state;
      return { ...state, messages: state.messages.concat([action.payload.message]) };
    case ChatActionType.UserJoined:
      if (state == null) return state;
      return { ...state, otherUsers: state.otherUsers.concat([action.payload.user]) };
    case ChatActionType.UserLeft:
      if (state == null) return state;
      return { ...state, otherUsers: state.otherUsers.filter(x => x != action.payload.user) };
    default:
      return state;
    //throw Error(`Action is not supported`);
  }
};
