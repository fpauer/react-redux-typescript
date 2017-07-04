import * as React from 'react';
import {connect} from 'react-redux';
import {ProfilePaymentPropsInterface} from './interfaces/profilePaymentProps.interface';
import BillingForm from '../billingForm/billingForm.container';
import {ProfileActionCreators} from "../profile/profile.actions";
import Util from "../../helpers/util.helper";

let autoBind = require('react-autobind');

class ProfilePayment extends React.Component<any, any> {

	constructor(props) {
		super(props);
		autoBind(this);
	}

	tokenReceivedHandler(billingFormData) {
		if (billingFormData.type === Util.USER_TYPE.Free) {
			this.props.dispatch(ProfileActionCreators.signInFreeSuccess(billingFormData));
		} else {
			this.props.dispatch(ProfileActionCreators.billingSuccess(billingFormData));
		}
	}

	render() {
		return (
			<div className="profile-start-payment padded">

				<div className="title background-line"><span>Sign up</span></div>

				{
					this.props.billing.professionInfo ? (
						<BillingForm
							stripePlans={this.props.billing.professionInfo.stripePlans}
							tokenReceivedHandler={this.tokenReceivedHandler.bind(this)}
							advancedFields={this.props.billing.professionInfo.registerAdvancedFields}
							submitText="Continue"
						/>
					) : ''
				}
			</div>
		);
	}

	// We need to specify ownProps because this component has it's own props passed to it
	static mapStateToProps(state, ownProps: ProfilePaymentPropsInterface) {
		return {
			billing:    state.profile.billing,
			user:    state.auth.user,
			profile: state.profile
		}
	}
}

export default connect(ProfilePayment.mapStateToProps)(ProfilePayment);