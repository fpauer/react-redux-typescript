import {AppState} from '../interfaces/app.state.interface';
import {AuthClass} from '../../auth/classes/auth.class';
import {PaymentRenewStateClass} from '../../paymentRenew/classes/paymentRenewState.class';

export class AppStateClass implements AppState {
	auth: AuthClass;
	paymentRenew: PaymentRenewStateClass;

	constructor() {
		this.auth         = new AuthClass();
		this.paymentRenew = new PaymentRenewStateClass();
	}
}