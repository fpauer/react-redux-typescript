import * as React from 'react';
import {connect} from 'react-redux';
import {ProfileActionCreators} from '../../../profile/profile.actions';
import {MultiStepFormStepInterface} from '../../../multiStepForm/interfaces/multiStepFormStep.interface';
import ProfileEducation from '../../../profileEducation/profileEducation.container';

let autoBind = require('react-autobind');

class ProfileStartEducation extends React.Component<any, any> {

	constructor(props) {
		super(props);
		autoBind(this);
	}

	onInfoGathered(data) {
		this.props.dispatch(ProfileActionCreators.profileResetErrors());

		if(!data.education.length) {
			this.props.dispatch(ProfileActionCreators.profileErrors(['Please enter education.']));
		} else {
			this.props.navigateNextStep(data);
		}
	}

	render() {
		return (
			<div className="profile-start-education">
				<ProfileEducation onInfoGathered={this.onInfoGathered}/>
			</div>
		);
	}

	// We need to specify ownProps because this component has it's own props passed to it
	static mapStateToProps(state, ownProps: MultiStepFormStepInterface) {
		return {
			profile: state.profile
		}
	}
}

export default connect(ProfileStartEducation.mapStateToProps)(ProfileStartEducation);