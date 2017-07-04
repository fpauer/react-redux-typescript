import * as React from 'react';
import {connect} from 'react-redux';
import {ProfileStatementPropsInterface} from './interfaces/profileStatementProps.interface';
import EditableTextarea from '../editableTextarea/editableTextarea.container';
import {ProfileStatementStateClass} from './classes/profileStatementState.class';
import Binder from '../../helpers/binder.helper';

let autoBind = require('react-autobind');

class ProfileStatement extends React.Component<any, any> {

	constructor(props) {
		super(props);
		autoBind(this);
	}

	componentWillMount() {
		this._setBlankState();
	}

	private _setBlankState() {
		this.setState(new ProfileStatementStateClass(this.props.detailedInfo.statement || ''));
	}

	onDone() {
		this.props.onInfoGathered(this.state);
	}

	render() {
		return (
			<div className="profile-start-statement padded">

				<div className="editable-field">
					<div className="title">
						Professional Statement
					</div>
					<div className="container">
						<textarea onChange={Binder.initInput.bind({}, this, 'statement')} value={this.state.statement}></textarea>
					</div>

					<div className="proceed">
						<button className="button" type="button" onClick={this.onDone}>
							Finish and Select Plan
						</button>
					</div>
				</div>

			</div>
		);
	}

	// We need to specify ownProps because this component has it's own props passed to it
	static mapStateToProps(state, ownProps: ProfileStatementPropsInterface) {
		return {
			profile: state.profile,
			detailedInfo: state.auth.user.detailedInfo
		}
	}
}

export default connect(ProfileStatement.mapStateToProps)(ProfileStatement);