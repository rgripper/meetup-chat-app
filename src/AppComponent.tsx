import * as React from 'react';
import { AppState } from './configureStore';
import { ChatStateType, ChatState } from "./client/ChatState";
import { connect } from "react-redux";

function AppComponent(props: { chatState: ChatState }) {
  return (
    <div>
      { props.chatState.type != ChatStateType.AuthenticatedAndInitialized ? 'Please, log in!' : ('Hi, ' + props.chatState.data.user.name) }
    </div>
  );
}

const mapStateToProps = (state: AppState) => {
  return { chatState: state.chatState };
}

export const AppContainerComponent = connect(
  mapStateToProps
)(AppComponent);