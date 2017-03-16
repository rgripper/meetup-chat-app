import * as React from 'react';
import { AppState } from '../store/AppState';
import { ChatStateType, ChatState } from "../store/ChatState";
import { connect } from "react-redux";
import { UserList } from "../app/chat/UserList";
import { MessageList } from "../app/chat/MessageList";
import { MessageInput } from "../app/chat/MessageInput";
import { Login } from "../app/chat/Login";
import { MessageSubmission } from '../messaging/MessageSubmission';

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
          <div className="row">
            <div className="col-sm-9"><UserList users={props.chatState.data.users}></UserList></div>
            <div className="col-sm-3"><button className="btn btn-default btn-sm" onClick={props.leave}>Leave</button></div>
          </div>
          
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