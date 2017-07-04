import {BillingFormState} from '../interfaces/billingFormState.interface';
import {RegisterBillingData} from '../../register/interfaces/registerBilling.interface';
import {RegisterBillingDataClass} from '../../register/classes/registerBilling.class';

export class BillingFormStateClass extends RegisterBillingDataClass implements BillingFormState, RegisterBillingData {

	inflight?: boolean;
	type?: number;

	constructor() {
		super();

		this.inflight = false;
		this.type = 1;
		this.billingPlan = 'special_offer';
	}
}