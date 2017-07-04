export interface RegisterBillingData {
	creditCard?: number
	expiration?: any
	cvv?: number
	zip?: number
	billingPlan?: any
	stripeToken?: string
}

export interface RegisterBilling {
	professionInfo: any
	data: RegisterBillingData
}