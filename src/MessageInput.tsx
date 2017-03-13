import * as React from 'react';
import { MessageSubmission } from './client/Message';

type Props = { sendMessage: (x: MessageSubmission) => void };
type State = { messageText: string }

export class MessageInput extends React.Component<Props, State> {

  readonly state = { messageText: '' };

  constructor(props: Props) {
    super(props);
  }

  handleMessageTextChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
    this.setState({ messageText: event.currentTarget.value });
  }

  handleMessageSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.props.sendMessage({ text: this.state.messageText });
    this.setState({ messageText: '' });
  }

  render() {
    return (
      <form onSubmit={this.handleMessageSubmit}>
        <textarea value={this.state.messageText} onInput={this.handleMessageTextChange}></textarea>
        <button type="submit">Send</button>
      </form>
    )
  };
}
