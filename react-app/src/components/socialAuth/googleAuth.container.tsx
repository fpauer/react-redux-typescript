import * as React from 'react';
import {connect} from 'react-redux';
import {AuthActionsCreators} from '../auth/auth.actions';

class GoogleAuth extends React.Component<any, {}> {

	componentDidMount() {
		this.props.dispatch(AuthActionsCreators.authGoogle(this.props.location.query.code));
	}

	render() {
		return <div className="text-center">Google auth</div>;
	}

	static mapStateToProps(state) {
		return {
			auth: state.auth
		}
	}
}

export default connect(GoogleAuth.mapStateToProps)(GoogleAuth);