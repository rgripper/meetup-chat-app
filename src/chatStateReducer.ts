import { Reducer } from 'redux';
import { Message } from 'messaging/Message';
import { User } from 'messaging/User';
import { ChatState, ChatStateType, initialChatState } from 'app/chat/ChatState';
import { ChatData } from "messaging/ChatData";

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
      const data: ChatData = { ...state.data, users: state.data.users.filter(x => x.name != action.payload.user.name).concat([action.payload.user]) };
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
