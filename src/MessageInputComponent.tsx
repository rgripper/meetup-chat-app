import { MessageSendingStatus, Message } from './client/Message';
import { ChatActionType } from './chatSessionReducer';
import { ChatStateType } from './client/ChatState';
import * as React from 'react';
import { AppState } from './configureStore';
import { connect } from "react-redux";

type Props = { canSendMessage: boolean, sendMessage: (x: string) => void };
type State = { messageText: string }

class MessageInputComponent extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
  }

  handleMessageTextChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    this.setState({ messageText: e.currentTarget.value });
  }

  handleMessageSubmit = () => {
    this.props.sendMessage(this.state.messageText);
  }

  render () {
      return <form onSubmit={this.handleMessageSubmit}>
        <textarea value={this.state.messageText} onInput={this.handleMessageTextChange}></textarea>
        <button type="submit">Send</button>
    </form>
  };
}

const mapStateToProps = (state: AppState) => {
  return { canSendMessage: state.chatState.type == ChatStateType.AuthenticatedAndInitialized };
}

const mapDispatchToProps = (dispatch: (action: any) => void) => {
  let lastLocalMessageId = 0;
  return {
    sendMessage: (text: string) => dispatch({ 
      type: ChatActionType.LocalMessageSendingRequired, 
      { id: lastLocalMessageId++, text, sendingStatus: MessageSendingStatus.Required } as Message 
    })
  }
}

export const MessageInputContainerComponent = connect(
  mapStateToProps, mapDispatchToProps
)(MessageInputComponent);