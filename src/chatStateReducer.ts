import { Reducer } from 'redux';
import { Message } from './client/Message';
import { User } from './client/User';
import { initialChatState } from "./client/ChatService";
import { ChatData, ChatState, ChatStateType } from './client/ChatState';

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
    case ChatActionType.MessageReceived: {
      if (state.type != ChatStateType.AuthenticatedAndInitialized) throw new Error('Invalid state');
      const data: ChatData = { ...state.data, messages: state.data.messages.concat([action.payload.message]) };
      return { ...state, data };
    }
    case ChatActionType.UserJoined: {
      if (state.type != ChatStateType.AuthenticatedAndInitialized) throw new Error('Invalid state');
      const data: ChatData = { ...state.data, users: state.data.users.concat([action.payload.user]) };
      return { ...state, data };
    }
    case ChatActionType.UserLeft: {
      if (state.type != ChatStateType.AuthenticatedAndInitialized) throw new Error('Invalid state');
      const data: ChatData = { ...state.data, users: state.data.users.filter(x => x != action.payload.user) };
      return { ...state, data };
    }
    default:
      return state;
  }


};
