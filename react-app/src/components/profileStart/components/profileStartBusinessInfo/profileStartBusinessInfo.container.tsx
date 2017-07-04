import * as React from 'react';
import {connect} from 'react-redux';
import {MultiStepFormStepInterface} from '../../../multiStepForm/interfaces/multiStepFormStep.interface';
import ProfileBusinessInfo from '../../../profileBusinessInfo/profileBusinessInfo.container';
import * as _ from 'underscore';
import {ProfileActionCreators} from '../../../profile/profile.actions';

let autoBind = require('react-autobind');

class ProfileStartBusinessInfo extends React.Component<any, any> {

	constructor(props) {
		super(props);
		autoBind(this);
	}

	onInfoGathered(data, availableFields) {
		this.props.dispatch(ProfileActionCreators.profileResetErrors());

		const prefix = 'Please fill out ';
		const messages = [];
		if (!data.businessName) {
			messages.push(prefix+availableFields['businessName']);
		}
		if (!data.address) {
			messages.push(prefix+availableFields['address']);
		}
		if (!data.email) {
			messages.push(prefix+availableFields['email']);
		}
		if (data.phones.length === 0) {
			messages.push(prefix+availableFields['phoneBook']);
		}

		if (messages.length > 0) {
			this.props.dispatch(ProfileActionCreators.profileErrors(messages));
		} else {
			this.props.navigateNextStep(data);
		}
	}

	render() {

		return (
			<div className="profile-start-business">
				<ProfileBusinessInfo onInfoGathered={this.onInfoGathered}/>
			</div>
		);
	}

	// We need to specify ownProps because this component has it's own props passed to it
	static mapStateToProps(state, ownProps: MultiStepFormStepInterface) {
		return {
			profile: state.profile,
			userData: state.auth.user || {}
		}
	}
}

export default connect(ProfileStartBusinessInfo.mapStateToProps)(ProfileStartBusinessInfo);