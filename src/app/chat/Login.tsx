import * as React from 'react';

type Props = { join: (userName: string) => void }
type State = { userName: string }

export class Login extends React.Component<Props, State> {

    readonly state = { userName: '' };

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
            <div className="row">
                <form onSubmit={this.handleFormSubmit} className="col-md-6 col-md-offset-3">
                    <div className="form-group">
                        <label className="control-label">User name</label>
                        <input className="form-control" type="text" onChange={this.handleUserNameChange} required/>
                    </div>
                    <button className="btn btn-primary" type="submit">Join</button>
                </form>
            </div>
        )
    }

}
