import * as React from 'react';
import {connect} from 'react-redux';
import {AuthActionsCreators} from '../auth/auth.actions';

class TwitterAuth extends React.Component<any, {}> {

	componentDidMount() {
		this.props.dispatch(AuthActionsCreators.authOauth1(this.props.location.query.token));
	}

	render() {
		return <div className="text-center">Twitter auth</div>;
	}

	static mapStateToProps(state) {
		return {
			auth: state.auth
		}
	}
}

export default connect(TwitterAuth.mapStateToProps)(TwitterAuth);