import * as React from 'react';
import { AppState } from './configureStore';
import { ChatStateType, ChatState } from "./client/ChatState";
import { connect } from "react-redux";
import { UserList } from "./UserList";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { Login } from "./Login";
import { MessageSubmission } from './client/Message';

type Props = { chatState: ChatState, sendMessage: (x: MessageSubmission) => void, login: (userName: string) => void, leave: () => void };

function AppComponent(props: Props) {
  switch (props.chatState.type) {
    case ChatStateType.NotInitialized:
      return <Login login={props.login}></Login>
    case ChatStateType.Authenticating:
      return <div className="loader">Loading...</div>;
    case ChatStateType.AuthenticatedAndInitialized:
      return (
        <div>
          Hi, {props.chatState.data.user.name}
          <button onClick={props.leave}>Logout</button>
          <UserList otherUsers={props.chatState.data.otherUsers}></UserList>
          <MessageList messages={props.chatState.data.messages}></MessageList>
          <MessageInput sendMessage={props.sendMessage}></MessageInput>
        </div>
      );
    case ChatStateType.AuthenticationFailed:
      return (
        <div>
          <div className="has-error">
            Authentication failed.
            <br />
            {props.chatState.errorMessage}
          </div>
          <Login login={props.login}></Login>
        </div>
      );
  }
}

const mapStateToProps = (state: AppState, otherProps: { sendMessage: (x: MessageSubmission) => void, login: (userName: string) => void, leave: () => void }): Props => {
  return { chatState: state.chatState, sendMessage: otherProps.sendMessage, login: otherProps.login, leave: otherProps.leave };
}

export const AppContainer = connect(
  mapStateToProps
)(AppComponent);