import * as React from 'react';
import {connect} from 'react-redux';
import AuthHelper from '../auth/helpers/auth.helper';
import BillingForm from '../billingForm/billingForm.container';
import {PaymentRenewStateClass} from './classes/paymentRenewState.class';
import {AuthActionsCreators} from '../auth/auth.actions';
import Spinner from '../spinner/spinner.container';
import FormError from '../formError/formError.container';
import FormSuccessMessage from '../formSuccessMessage/formSuccessMessage.container';
import {PaymentRenewActionCreators} from './paymentRenew.actions';
import * as moment from 'moment';
import {hashHistory} from 'react-router';

let autoBind = require('react-autobind');

class PaymentRenew extends React.Component<any, PaymentRenewStateClass> {

	constructor(props) {
		super(props);
		autoBind(this);
	}

	private _renderErrors(error) {
		return <FormError error={error} key={error.toString()}/>
	}

	private _renderSuccess(message) {
		return <FormSuccessMessage message={message} key={message.toString()}/>
	}

	private _userSubscriptionValid(validTill) {
		return moment(validTill).diff(moment()) > 0;
	}

	componentWillUnmount() {
		if(!this._userSubscriptionValid(this.state.user.billing.validTill)) {
			AuthHelper.logout();
		}
	}

	componentWillMount() {
		let stateData = new PaymentRenewStateClass();

		if(!this.props.user.billing) {
			AuthHelper.logout();
		}

		if(stateData.user.billing && this._userSubscriptionValid(stateData.user.billing.validTill)) {
			hashHistory.replace('/');
		}

		this.setState(stateData);
		this.props.dispatch(AuthActionsCreators.getProfileInfo(stateData.user.profession.id));
	}

	tokenReceivedHandler(billingData) {
		this.props.dispatch(PaymentRenewActionCreators.updateCustomerSource(billingData.stripeToken));
	}

	successHandler() {
		AuthHelper.logout();
	}

	render() {
		return (
			<div className="auth payment-renew">
				<div className="title">
					Subscription expired
				</div>

				{
					!this.props.paymentRenew.messages.length ? (
						<BillingForm
							stripePlans={this.props.stripePlans}
							tokenReceivedHandler={this.tokenReceivedHandler.bind(this)}
							submitText="Renew Subscription"
						/>
					) : ''
				}

				<Spinner active={this.props.paymentRenew.inflight}/>

				<div className="errors">
					{this.props.paymentRenew.errors.map(this._renderErrors)}
				</div>
				<div className="success-messages">
					{this.props.paymentRenew.messages.map(this._renderSuccess)}
				</div>

				{
					this.props.paymentRenew.messages.length ? (
						<button type="button" className="button" onClick={this.successHandler}>
							Ok, thanks
						</button>
					) : ''
				}

			</div>
		);
	}

	static mapStateToProps(state) {
		return {
			paymentRenew: state.paymentRenew,
			stripePlans: state.auth.register.billing.professionInfo.stripePlans,
			user: state.auth.user
		}
	}
}

export default connect(PaymentRenew.mapStateToProps)(PaymentRenew);