import { ChatStateType } from './client/ChatState';
import * as React from 'react';
import { AppState } from './configureStore';

import { connect } from "react-redux";
import { Message } from "./client/Message";

function MessageListComponent(props: { messages: Message[] }) {
  return (
    <ul>
      {
        props.messages.map(message => {
          return <li key={message.id}>{message.text}</li>
        })
      }
    </ul>
  );
}

const mapStateToProps = (state: AppState) => {

  return { messages: state.chatState.type != ChatStateType.AuthenticatedAndInitialized ? [] : state.chatState.data.messages };
}

export const MessageListContainerComponent = connect(
  mapStateToProps
)(MessageListComponent);