import * as React from 'react';
import {connect} from 'react-redux';
import RegisterStepPropsInterface from '../../interfaces/registerStepProps.interface';
import {AuthActionsCreators} from '../../../auth/auth.actions';

import BillingForm from '../../../billingForm/billingForm.container';

let autoBind = require('react-autobind');

class RegisterBilling extends React.Component<any, any> {

	constructor(props) {
		super(props);
		autoBind(this);
	}

	componentDidMount() {
		this.props.dispatch(AuthActionsCreators.getProfileInfo(this.props.auth.register.speciality.data.profession))
	}

	tokenReceivedHandler(billingFormData) {
		this.props.dispatch(AuthActionsCreators.billingInfoSuccess(billingFormData));
		this.props.navigateNextStep(this.props.auth);
	}

	render() {

		return (
			<div className="register-billing">
				{
					!this.props.auth.inflight ? (
						<div>
							<div className="title">
								Almost done
							</div>
							<div className="description">
								We just have a few more questions before you start building your professional profile.
							</div>
						</div>
					) : ''
				}

				<BillingForm
					stripePlans={this.props.auth.register.billing.professionInfo.stripePlans}
					tokenReceivedHandler={this.tokenReceivedHandler.bind(this)}
				    advancedFields={this.props.auth.register.billing.professionInfo.registerAdvancedFields}
				/>

			</div>
		);
	}

	// We need to specify ownProps because this component has it's own props passed to it
	static mapStateToProps(state, ownProps: RegisterStepPropsInterface) {
		return {
			auth: state.auth
		}
	}
}

export default connect(RegisterBilling.mapStateToProps)(RegisterBilling);