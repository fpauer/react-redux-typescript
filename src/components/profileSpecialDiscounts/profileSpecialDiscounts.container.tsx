import * as React from 'react';
import {connect} from 'react-redux';
import {ProfileSpecialDiscountsPropsInterface} from './interfaces/profileSpecialDiscountsProps.interface';
import EditableTextarea from '../editableTextarea/editableTextarea.container';
import {ProfileSpecialDiscountsStateClass} from './classes/profileSpecialDiscountsState.class';
import Binder from '../../helpers/binder.helper';

let autoBind = require('react-autobind');

class ProfileSpecialDiscounts extends React.Component<any, any> {

	constructor(props) {
		super(props);
		autoBind(this);
	}

	componentWillMount() {
		this._setBlankState();
	}

	private _setBlankState() {
		this.setState(new ProfileSpecialDiscountsStateClass(this.props.detailedInfo.specialDiscounts || ''));
	}

	onDone() {
		this.props.onInfoGathered(this.state);
	}

	render() {
		return (
			<div className="profile-start-special-discounts padded">
				<EditableTextarea
					value={this.state.specialDiscounts}
					onChange={Binder.initInput.bind({}, this, 'specialDiscounts')}
					onDone={this.onDone}
					title="Special GPROSPlus&trade; discounts"
					doneText={this.props.doneText || 'Next'}
				/>
			</div>
		);
	}

	// We need to specify ownProps because this component has it's own props passed to it
	static mapStateToProps(state, ownProps: ProfileSpecialDiscountsPropsInterface) {
		return {
			profile: state.profile,
			detailedInfo: state.auth.user.detailedInfo || {}
		}
	}
}

export default connect(ProfileSpecialDiscounts.mapStateToProps)(ProfileSpecialDiscounts);