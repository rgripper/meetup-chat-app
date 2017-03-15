import * as React from 'react';

type Props = { join: (userName: string) => void }
type State = { userName: string }

export class Login extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ userName: event.target.value });
    }

    handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        this.props.join(this.state.userName);
    }

    render() {
        return (
            <form onSubmit={this.handleFormSubmit}>
                <input type="text" onChange={this.handleUserNameChange} />
                <button type="submit">Login</button>
            </form>
        )
    }

}
