import * as React from 'react';
import { connect } from "react-redux";

import { Login } from "../app/chat/Login";
import { Chat } from "../app/chat/Chat";
import { AppActions } from "../store/app/createAppActions";
import { AppState } from '../store/app/AppState';
import { ChatStateType, ChatState } from "../store/app/chat/ChatState";

interface Props {
  actions: AppActions
  chatState: ChatState
}

function App(props: Props) {
  switch (props.chatState.type) {
    case ChatStateType.NotAuthenticated:
      return <Login join={props.actions.join}></Login>
    case ChatStateType.Authenticating:
      return <div className="loader">Loading...</div>
    case ChatStateType.AuthenticatedAndInitialized:
      return <Chat leave={props.actions.leave} chatState={props.chatState}></Chat>
    case ChatStateType.AuthenticationFailed:
      return (
        <div>
          <div className="has-error">
            Authentication failed.
            <br />
            {props.chatState.errorMessage}
          </div>
          <Login join={props.actions.join}></Login>
        </div>
      );
  }
}

function mapStateToProps(state: AppState, props: { actions: AppActions }): Props {
  return {
    actions: props.actions,
    chatState: state.chatState
  }
}

export const AppContainer = connect(mapStateToProps)(App);