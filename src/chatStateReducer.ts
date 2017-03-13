import { Reducer } from 'redux';
import { Message } from './client/Message';
import { User } from './client/User';
import { initialChatState } from "./client/ChatService";
import { ChatState, ChatStateType } from "./client/ChatState";

export enum ChatActionType {
  Initialized, 
  MessageSubmissionCreated, MessageSubmissionInProcess, MessageSubmissionCompleted, 
  MessageReceived, UserJoined, UserLeft
}

export type ChatAction =
  | {
    type: ChatActionType.Initialized,
    payload: { chatState: ChatState }
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

export const chatStateReducer: Reducer<ChatState> = function (state: ChatState = initialChatState, action: ChatAction) {
  switch (action.type) {
    case ChatActionType.Initialized:
      return action.payload.chatState;
    case ChatActionType.MessageReceived:
      if (state.type != ChatStateType.AuthenticatedAndInitialized) throw new Error('Invalid state');
      return { ...state, data: { ...state.data, messages: state.data.messages.concat([action.payload.message]) } };
    case ChatActionType.UserJoined:
      if (state.type != ChatStateType.AuthenticatedAndInitialized) throw new Error('Invalid state');
      return { ...state, data: { ...state.data, otherUsers: state.data.otherUsers.concat([action.payload.user]) } };
    case ChatActionType.UserLeft:
      if (state.type != ChatStateType.AuthenticatedAndInitialized) throw new Error('Invalid state');
      return { ...state, data: { ...state.data, otherUsers: state.data.otherUsers.filter(x => x != action.payload.user) } };
    default:
      return state;
  }


};
