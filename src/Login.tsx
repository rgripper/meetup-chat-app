import * as React from 'react';

type Props = { login: (userName: string) => void }
type State = { userName: string }

export class Login extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ userName: event.target.value });
    }

    handleFormSubmit = () => {
        this.props.login(this.state.userName);
    }

    render() {
        return (
            <form onSubmit={this.handleFormSubmit}>
                <input type="text" onChange={this.handleUserNameChange} />
            </form>
        )
    }

}
