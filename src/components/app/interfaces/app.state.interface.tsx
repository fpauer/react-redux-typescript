import {Auth} from '../../auth/interfaces/auth.interface';
import {PaymentRenewState} from '../../paymentRenew/interfaces/paymentRenewState.interface';

export interface AppState {
	auth: Auth
	paymentRenew: PaymentRenewState
}