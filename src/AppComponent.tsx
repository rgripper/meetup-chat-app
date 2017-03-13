import * as React from 'react';
import { AppState } from './configureStore';
import { ChatStateType, ChatState } from "./client/ChatState";
import { connect } from "react-redux";
import { UserList } from "./UserList";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { Login } from "./Login";
import { MessageSubmission } from './client/Message';

type Props = { chatState: ChatState, sendMessage: (x: MessageSubmission) => void, login: (userName: string) => void };

function AppComponent(props: Props) {
  if (props.chatState.type == ChatStateType.AuthenticatedAndInitialized) {
    return (
      <div>
        Hi, {props.chatState.data.user.name}
        <UserList otherUsers={props.chatState.data.otherUsers}></UserList>
        <MessageList messages={props.chatState.data.messages}></MessageList>
        <MessageInput sendMessage={props.sendMessage}></MessageInput>
      </div>
    );
  }
  else {
    return (
      <Login login={props.login}></Login>
    )
  }

}

const mapStateToProps = (state: AppState, otherProps: { sendMessage: (x: MessageSubmission) => void, login: (userName: string) => void }): Props => {
  return { chatState: state.chatState, sendMessage: otherProps.sendMessage, login: otherProps.login };
}

export const AppContainer = connect(
  mapStateToProps
)(AppComponent);