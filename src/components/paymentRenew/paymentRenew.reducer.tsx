import {Reducer} from 'redux';
import * as _ from 'underscore';

import {PaymentRenewState} from './interfaces/paymentRenewState.interface';
import {PaymentRenewStateClass} from './classes/paymentRenewState.class';
import {paymentRenewActions} from './paymentRenew.actions';
import {PaymentRenewAction} from './interfaces/paymentRenewAction.interface';

export const paymentRenewReducer: Reducer<PaymentRenewState> = (state: PaymentRenewState = new PaymentRenewStateClass(), action: PaymentRenewAction) => {

	switch (action.type) {

		case paymentRenewActions.PAYMENT_RENEW_STARTED:
			return Object.assign({}, state, {errors: [], messages: [], inflight: true});

		case paymentRenewActions.PAYMENT_RENEW_FAILED:
			return Object.assign({}, state, {errors: action.data, messages: [], inflight: false});

		case paymentRenewActions.PAYMENT_RENEW_SUCCEEDED:
			return Object.assign({}, state, {errors: [], messages: action.data, inflight: false});

		default:
			return state;
	}
};