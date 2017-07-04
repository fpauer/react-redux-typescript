import {RegisterBilling, RegisterBillingData} from '../interfaces/registerBilling.interface';

export class RegisterBillingDataClass implements RegisterBillingData {
	creditCard?: any;
	expiration?: any;
	cvv?: any;
	zip?: any;
	billingPlan?: any;
	stripeToken?: string;

	constructor() {
		this.creditCard = '';
		this.expiration  = '';
		this.cvv = '';
		this.zip  = '';
		this.billingPlan = {};
	}
}

export class RegisterBillingClass implements RegisterBilling {
	professionInfo: any;
	data: RegisterBillingData;

	constructor() {
		this.professionInfo = {};
		this.data      = new RegisterBillingDataClass();
	}
}