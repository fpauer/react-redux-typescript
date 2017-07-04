import * as React from 'react';
import {connect} from 'react-redux';
import {ProfileCertificationsPropsInterface} from './interfaces/profileCertificationsProps.interface';
import EditableTextarea from '../editableTextarea/editableTextarea.container';
import {ProfileCertificationsStateClass} from './classes/profileCertificationsState.class';
import Binder from '../../helpers/binder.helper';

let autoBind = require('react-autobind');

class ProfileCertifications extends React.Component<any, any> {

	constructor(props) {
		super(props);
		autoBind(this);
	}

	componentWillMount() {
		this._setBlankState();
	}

	private _setBlankState() {
		this.setState(new ProfileCertificationsStateClass(this.props.detailedInfo.certifications || ''));
	}

	onDone() {
		this.props.onInfoGathered(this.state);
	}

	render() {
		return (
			<div className="profile-start-certifications padded">
				<EditableTextarea
					value={this.state.certifications}
					onChange={Binder.initInput.bind({}, this, 'certifications')}
					onDone={this.onDone}
					title="Board Certifications"
					doneText={this.props.doneText || 'Next'}
				/>
			</div>
		);
	}

	// We need to specify ownProps because this component has it's own props passed to it
	static mapStateToProps(state, ownProps: ProfileCertificationsPropsInterface) {
		return {
			profile: state.profile,
			detailedInfo: state.auth.user.detailedInfo || {}
		}
	}
}

export default connect(ProfileCertifications.mapStateToProps)(ProfileCertifications);