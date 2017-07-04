import * as React from 'react';
import {connect} from 'react-redux';
import {ProfileEducationPropsInterface} from './interfaces/profileEducationProps.interface';
import EditableTextarea from '../editableTextarea/editableTextarea.container';
import {ProfileEducationStateClass} from './classes/profileEducationState.class';
import Binder from '../../helpers/binder.helper';

let autoBind = require('react-autobind');

class ProfileEducation extends React.Component<any, any> {

	constructor(props) {
		super(props);
		autoBind(this);
	}

	componentWillMount() {
		this._setBlankState();
	}

	private _setBlankState() {
		this.setState(new ProfileEducationStateClass(this.props.detailedInfo.education || ''));
	}

	onDone() {
		this.props.onInfoGathered(this.state);
	}

	render() {
		return (
			<div className="profile-start-education padded">
				<EditableTextarea
					value={this.state.education}
					onChange={Binder.initInput.bind({}, this, 'education')}
					onDone={this.onDone}
					title="Education"
					doneText={this.props.doneText || 'Next'}
				/>
			</div>
		);
	}

	// We need to specify ownProps because this component has it's own props passed to it
	static mapStateToProps(state, ownProps: ProfileEducationPropsInterface) {
		return {
			profile: state.profile,
			detailedInfo: state.auth.user.detailedInfo || {}
		}
	}
}

export default connect(ProfileEducation.mapStateToProps)(ProfileEducation);