import {ProfileInsurancePlansStateInterface} from '../interfaces/profileInsurancePlansState.interface';

export class ProfileInsurancePlansStateClass implements ProfileInsurancePlansStateInterface {
	insurancePlans: string;

	constructor(initialInsurancePlans = '') {
		this.insurancePlans = initialInsurancePlans;
	}
}