import * as React from 'react';
import { SubmittedMessage } from 'messaging/SubmittedMessage';

type Props = { sendMessage: (x: SubmittedMessage) => void };
type State = { messageText: string }

export class MessageInput extends React.Component<Props, State> {

  readonly state = { messageText: '' };

  constructor(props: Props) {
    super(props);
  }

  handleMessageTextChange = (event: React.FormEvent<HTMLInputElement>) => {
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
            <input className="form-control" type="text" value={this.state.messageText} onInput={this.handleMessageTextChange}/>
          </div>
          <div className="col-sm-3">
            <button type="submit" className="btn btn-primary">Send</button>
          </div>
        </div>
      </form>
    )
  };
}