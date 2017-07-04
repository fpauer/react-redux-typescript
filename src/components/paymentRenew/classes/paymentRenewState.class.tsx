import AuthHelper from '../../auth/helpers/auth.helper';
import {PaymentRenewState} from '../interfaces/paymentRenewState.interface';

export class PaymentRenewStateClass implements PaymentRenewState {

	user: any;
	errors: any[];
	messages: any[];
	inflight: boolean;

	constructor() {
		this.user     = AuthHelper.getUser();
		this.errors   = [];
		this.messages = [];
		this.inflight = false;
	}

}