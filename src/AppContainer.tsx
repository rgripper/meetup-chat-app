import * as React from 'react';
import { AppState } from './configureStore';
import { ChatStateType, ChatState } from "./client/ChatState";
import { connect } from "react-redux";
import { UserList } from "./UserList";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { Login } from "./Login";
import { MessageSubmission } from './client/Message';

type Props = { chatState: ChatState, sendMessage: (x: MessageSubmission) => void, join: (userName: string) => void, leave: () => void };

function App(props: Props) {
  switch (props.chatState.type) {
    case ChatStateType.NotAuthenticated:
      return <Login join={props.join}></Login>
    case ChatStateType.Authenticating:
      return <div className="loader">Loading...</div>;
    case ChatStateType.AuthenticatedAndInitialized:
      return (
        <div>
          Hi, {props.chatState.data.currentUser.name}
          <button onClick={props.leave}>Logout</button>
          <UserList users={props.chatState.data.users}></UserList>
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
          <Login join={props.join}></Login>
        </div>
      );
  }
}

const mapStateToProps = (state: AppState, otherProps: { sendMessage: (x: MessageSubmission) => void, join: (userName: string) => void, leave: () => void }): Props => {
  return { chatState: state.chatState, sendMessage: otherProps.sendMessage, join: otherProps.join, leave: otherProps.leave };
}

export const AppContainer = connect(
  mapStateToProps
)(App);