import * as React from 'react';
import {connect} from 'react-redux';
import {ProfileActionCreators} from '../../../profile/profile.actions';
import {MultiStepFormStepInterface} from '../../../multiStepForm/interfaces/multiStepFormStep.interface';
import ProfileInsurancePlans from '../../../profileInsurancePlans/profileInsurancePlans.container';

let autoBind = require('react-autobind');

class profileStartInsurancePlans extends React.Component<any, any> {

	constructor(props) {
		super(props);
		autoBind(this);
	}

	componentWillMount() {
		this.props.dispatch(
			ProfileActionCreators.getProfession(
				this.props.profession.id, ProfileActionCreators.profileCheckInsurancePlans
			)
		);
	}

	componentWillReceiveProps(newProps) {
		const loadedGroup = !!newProps.profession.group.displayName;
		if (loadedGroup && newProps.profession.group.displayName !== 'Health & Wellness') {
			this.props.dispatch(ProfileActionCreators.profileInfoNextStep());
		}
	}

	onInfoGathered(data) {
		this.props.dispatch(ProfileActionCreators.profileResetErrors());
		this.props.navigateNextStep(data);
	}

	render() {
		return (
			<div className="profile-start-education">
				<ProfileInsurancePlans onInfoGathered={this.onInfoGathered}/>
			</div>
		);
	}

	// We need to specify ownProps because this component has it's own props passed to it
	static mapStateToProps(state, ownProps: MultiStepFormStepInterface) {
		return {
			profile: state.profile,
			profession: state.profile.profession || state.auth.user.profession,
		}
	}
}

export default connect(profileStartInsurancePlans.mapStateToProps)(profileStartInsurancePlans);