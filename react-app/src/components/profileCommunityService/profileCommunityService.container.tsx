import * as React from 'react';
import {connect} from 'react-redux';
import {ProfileCommunityServicePropsInterface} from './interfaces/profileCommunityServiceProps.interface';
import EditableTextarea from '../editableTextarea/editableTextarea.container';
import {ProfileCommunityServiceStateClass} from './classes/profileCommunityServiceState.class';
import Binder from '../../helpers/binder.helper';

let autoBind = require('react-autobind');

class ProfileCommunityService extends React.Component<any, any> {

	constructor(props) {
		super(props);
		autoBind(this);
	}

	componentWillMount() {
		this._setBlankState();
	}

	private _setBlankState() {
		this.setState(new ProfileCommunityServiceStateClass(this.props.detailedInfo.communityService || ''));
	}

	onDone() {
		this.props.onInfoGathered(this.state);
	}

	render() {
		return (
			<div className="profile-start-community-service padded">
				<EditableTextarea
					value={this.state.communityService}
					onChange={Binder.initInput.bind({}, this, 'communityService')}
					onDone={this.onDone}
					title="Community Philanthropy"
					doneText={this.props.doneText || 'Next'}
				/>
			</div>
		);
	}

	// We need to specify ownProps because this component has it's own props passed to it
	static mapStateToProps(state, ownProps: ProfileCommunityServicePropsInterface) {
		return {
			profile: state.profile,
			detailedInfo: state.auth.user.detailedInfo || {}
		}
	}
}

export default connect(ProfileCommunityService.mapStateToProps)(ProfileCommunityService);