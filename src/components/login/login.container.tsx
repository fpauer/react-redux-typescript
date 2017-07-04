import * as React from 'react';
import {connect} from 'react-redux';
import Logo from '../common/logo/logo';
import {LoginState} from './interfaces/loginState.interface';
import LoginStateClass from './classes/loginState.class';
import Binder from '../../helpers/binder.helper';
import {AuthActionsCreators} from '../auth/auth.actions';
import {Link} from 'react-router';
import SocialAuth from '../socialAuth/socialAuth.container';
let autoBind = require('react-autobind');

class Login extends React.Component<any, LoginState> {

	constructor(props) {
		super(props);
		autoBind(this);
	}

	componentWillMount() {
		this.setState(this._getInitialState());
		this.props.dispatch(AuthActionsCreators.resetAuth());
	}

	private _getInitialState() {
		return new LoginStateClass();
	}

	private handleLogin(event) {
		event.preventDefault();
		this.props.dispatch(AuthActionsCreators.processLogin(this.state));
	}

	render() {
		return (
			<div className="login">

				<Logo />

				<div className="background-line">
					<span>Sign in</span>
				</div>

				<SocialAuth />

				<div className="background-line">
					<span>or use email</span>
				</div>

				<form onSubmit={this.handleLogin} className="auth-form">
					<input type="email" value={this.state.email}
					       placeholder="Email address"
					       onChange={Binder.initInput.bind({}, this, 'email',)} required
					/>
					<input type="password" value={this.state.password}
					       placeholder="Password"
					       onChange={Binder.initInput.bind({}, this, 'password',)} required
					/>
					<div className="controls">
						<button className="login button">Sign in</button>
					</div>
					<hr />
					<div className="text-center">
						<p>
							<Link to="/auth/restore">
								Forgot Password
							</Link>
						</p>
						<p>
							Don't have an account? &nbsp;
							<Link to="/auth/register">
								Sign up
							</Link>
						</p>
					</div>
				</form>
			</div>
		);
	}

	static mapStateToProps(state) {
		return {
			auth: state.auth
		}
	}
}

export default connect(Login.mapStateToProps)(Login);