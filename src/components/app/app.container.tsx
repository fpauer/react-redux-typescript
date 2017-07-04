import * as React from 'react'
import {connect} from 'react-redux';
import {AuthActionsCreators} from '../auth/auth.actions';
import Navbar from '../navbar/navbar.container';
import {hashHistory} from 'react-router';

class App extends React.Component<any, {}> {

	componentWillMount() {
		this.props.dispatch(AuthActionsCreators.extractUser());
	}

	componentWillReceiveProps(newProps) {
		let profileGatherRoute = '/profile/start';
		let paymentRenewRoute  = '/payment-renew';
		let currentLocation    = hashHistory.getCurrentLocation().pathname;

		if (!newProps.location.query.noRedirect &&
			currentLocation !== paymentRenewRoute &&
			currentLocation !== profileGatherRoute &&
			newProps.auth.user.id && !newProps.auth.user.detailedInfoGathered
		) {
			hashHistory.replace(profileGatherRoute);
		}
	}

	render() {
		return (
			<div className="app">
				<Navbar />
				{this.props.children}
			</div>
		);
	}

	static mapPropsToState(state) {
		return state;
	}
}

export default connect(App.mapPropsToState)(App);