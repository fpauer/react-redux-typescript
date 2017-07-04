import * as React from 'react';
import {connect} from 'react-redux';
import {AuthActionsCreators} from '../auth/auth.actions';

class FacebookAuth extends React.Component<any, {}> {

	componentDidMount() {
		this.props.dispatch(AuthActionsCreators.authFacebook(window.location.search));
	}

	render() {
		return <div className="text-center">Facebook auth</div>;
	}

	static mapStateToProps(state) {
		return {
			auth: state.auth
		}
	}
}

export default connect(FacebookAuth.mapStateToProps)(FacebookAuth);