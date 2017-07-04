import * as React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import Binder from '../../helpers/binder.helper';
import {AuthActionsCreators} from '../auth/auth.actions';
import {RestorePasswordInterface} from './interfaces/restorePasswordState.interface';
import {RestorePasswordClass} from './classes/restorePasswordState.class';
import * as _ from 'underscore';
let autoBind = require('react-autobind');

class RestorePassword extends React.Component<any, RestorePasswordInterface> {

	constructor(props) {
		super(props);
		autoBind(this);
	}

	componentWillMount() {
		this.props.dispatch(AuthActionsCreators.resetAuth());
		this._setEmptyState();
	}

	private _setEmptyState() {
		this.setState(new RestorePasswordClass(this.props.location.query.token));
	}

	private _processRestore(event) {
		event.preventDefault();
		this.props.dispatch(AuthActionsCreators.processRestore(_.clone(this.state)));
		this._setEmptyState();
	}

	render() {
		return (
			<div className="restore-password">

				<div className="title">
					Restore Password
				</div>

				<div className="cancel-btn">
					<Link to="/auth/login">Back</Link>
				</div>

				<form className="auth-form single-form" onSubmit={this._processRestore}>

					{
						this.state.token ? (
							<div className="row">
								<div className="columns small-12">
									<input type="password" value={this.state.password}
									       placeholder="Password"
									       onChange={Binder.initInput.bind({}, this, 'password')} required
									/>
								</div>
								<div className="columns small-12">
									<input type="password" value={this.state.passwordConfirm}
									       placeholder="Password confirmation"
									       onChange={Binder.initInput.bind({}, this, 'passwordConfirm')} required
									/>
								</div>
							</div>
						) : (
							<div className="row">
								<div className="columns small-12">
									<input type="email" value={this.state.email}
									       placeholder="Email"
									       onChange={Binder.initInput.bind({}, this, 'email')} required
									/>
								</div>
							</div>
						)
					}

					<div className="proceed">
						<button className="button" type="submit">
							Restore Password
						</button>
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

export default connect(RestorePassword.mapStateToProps)(RestorePassword);