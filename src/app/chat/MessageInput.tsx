import * as React from 'react';
import { MessageSubmission } from 'messaging/MessageSubmission';

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
        <div className="form-roup row">
          <div className="col-sm-9">
            <textarea className="form-control" value={this.state.messageText} onInput={this.handleMessageTextChange} required></textarea>
          </div>
          <div className="col-sm-3">
            <button type="submit" className="btn btn-primary">Send</button>
          </div>
        </div>
      </form>
    )
  };
}
