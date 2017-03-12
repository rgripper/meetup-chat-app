import { Reducer } from 'redux';
import { Message, MessageSubmission } from './client/Message';
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
    type: ChatActionType.MessageSubmissionCreated,
    payload: { messageSubmission: MessageSubmission }
  }
  | {
    type: ChatActionType.MessageSubmissionInProcess,
    payload: { messageSubmissionId: number }
  }
  | {
    type: ChatActionType.MessageSubmissionCompleted,
    payload: { messageSubmissionId: number }
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
    case ChatActionType.MessageSubmissionCreated: {
      if (state.type != ChatStateType.AuthenticatedAndInitialized) throw new Error('Invalid state');
      return { ...state, data: { ...state.data, messageSubmissions: state.data.messageSubmissions.concat([action.payload.messageSubmission]) } };
    }
    case ChatActionType.MessageSubmissionInProcess: {
      if (state.type != ChatStateType.AuthenticatedAndInitialized) throw new Error('Invalid state');
      const originalSubmission = state.data.messageSubmissions.find(x => x.id == action.payload.messageSubmissionId)!;
      const updatedSubmission = {...originalSubmission, isInProcess: true };
      return { ...state, data: { ...state.data, messageSubmissions: state.data.messageSubmissions.filter(x => x != originalSubmission).concat([updatedSubmission]) } };
    }
    case ChatActionType.MessageSubmissionCompleted: {
      if (state.type != ChatStateType.AuthenticatedAndInitialized) throw new Error('Invalid state');
      return { ...state, data: { ...state.data, messageSubmissions: state.data.messageSubmissions.filter(x => x.id != action.payload.messageSubmissionId) } };
    }
    default:
      return state;
    //throw Error(`Action is not supported`);
  }


};
