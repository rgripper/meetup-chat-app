import * as React from 'react';
import { SubmittedMessage } from 'messaging/SubmittedMessage';

type Props = { sendMessage: (x: SubmittedMessage) => void };
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
    return <div></div>
  };
}