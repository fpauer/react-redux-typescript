import * as axios from 'axios';
import UtilHelper from '../../helpers/util.helper';
import AuthHelper from '../auth/helpers/auth.helper';

export const paymentRenewActions = {
	PAYMENT_RENEW_STARTED: 'PAYMENT_RENEW_STARTED',
	PAYMENT_RENEW_SUCCEEDED: 'PAYMENT_RENEW_SUCCEEDED',
	PAYMENT_RENEW_FAILED: 'PAYMENT_RENEW_FAILED'
};

export class PaymentRenewActionCreators {

	private static paymentRenewStarted() {
		return {
			type: paymentRenewActions.PAYMENT_RENEW_STARTED
		}
	}

	private static paymentRenewSucceeded(data) {
		return {
			type: paymentRenewActions.PAYMENT_RENEW_SUCCEEDED,
			data
		}
	}

	private static paymentRenewFailed(data) {
		return {
			type: paymentRenewActions.PAYMENT_RENEW_FAILED,
			data
		}
	}

	static updateCustomerSource(stripeToken: string) {
		return dispatch => {
			dispatch(PaymentRenewActionCreators.paymentRenewStarted());

			axios
				.patch(
					UtilHelper.apiPrefixed('users/stripe-source'),
					{
						cardToken: stripeToken,
						userToken: AuthHelper.getToken()
					}
				)
				.then((response: any) => dispatch(PaymentRenewActionCreators.paymentRenewSucceeded([response.data.data])))
				.catch(error => dispatch(PaymentRenewActionCreators.paymentRenewFailed([error.response.data.error])))
		}
	}
}