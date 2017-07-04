import * as React from 'react'
import {connect} from 'react-redux';
import FormError from '../formError/formError.container';
import FormSuccessMessage from '../formSuccessMessage/formSuccessMessage.container';
import Spinner from '../spinner/spinner.container';
import AuthHelper from './helpers/auth.helper';
import {} from 'react-router';

let autoBind = require('react-autobind');

class Auth extends React.Component<any, {}> {

	static registerPath = '/auth/register';

	constructor(props) {
		super(props);
		autoBind(this);
	}

	private _renderErrors(error) {
		return <FormError error={error} key={error.toString()}/>
	}

	private _renderSuccess(message) {
		return <FormSuccessMessage message={message} key={message.toString()}/>
	}

	componentDidUpdate() {
		let {user, token} = this.props.auth;
		let {socialRegister, socialRegisterToken} = this.props.auth.register;

		if(token && user) {
			this._handleUserLoggedIn(user, token);
		} else if(socialRegister && socialRegisterToken.length) {
			this._handleSocialRegister();
		}
	}

	_handleUserLoggedIn(user, token) {
		AuthHelper.updateUser(user);
		AuthHelper.updateToken(token);
		this.props.router.push(this.props.location.query.intended || '/');
	}

	_handleSocialRegister() {
		if(this.props.router.location.pathname !== Auth.registerPath) {
			this.props.router.push(Auth.registerPath);
		}
	}

	render() {
		return (
			<div className="auth">
				{this.props.children}
				<Spinner active={this.props.auth.inflight} />
				<div className="errors">
					{this.props.auth.errors.map(this._renderErrors)}
				</div>
				<div className="success-messages">
					{this.props.auth.messages.map(this._renderSuccess)}
				</div>
			</div>
		);
	}

	static mapStateToProps(state) {
		return {
			auth: state.auth
		}
	}
}

export default connect(Auth.mapStateToProps)(Auth);