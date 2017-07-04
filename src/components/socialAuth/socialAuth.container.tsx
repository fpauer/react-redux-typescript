import * as React from 'react';
import {Link} from 'react-router';
import SocialAuthState from './classes/socialAuthState.class';
import SocialAuthStateInterface from './interfaces/socialAuthState.interface';

class SocialAuth extends React.Component<any, SocialAuthStateInterface> {

	componentWillMount() {
		this._setDefaultState();
	}

	_setDefaultState() {
		this.setState(new SocialAuthState());
	}

	render() {
		return (
			<div className="social-auth">
				<a href={this.state.facebook} className="social facebook">
					<i className="fa fa-facebook" />
				</a>
				<a href={this.state.twitter} className="social twitter">
					<i className="fa fa-twitter" />
				</a>
				<a href={this.state.google} className="social google">
					<i className="fa fa-google" />
				</a>
				<a href={this.state.linkedin} className="social linkedin">
					<i className="fa fa-linkedin" />
				</a>
			</div>
		);
	}
}

export default SocialAuth;