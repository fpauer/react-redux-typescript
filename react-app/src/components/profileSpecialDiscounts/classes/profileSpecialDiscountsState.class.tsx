import {ProfileSpecialDiscountsStateInterface} from '../interfaces/profileSpecialDiscountsState.interface';

export class ProfileSpecialDiscountsStateClass implements ProfileSpecialDiscountsStateInterface {
	specialDiscounts: string;

	constructor(initialSpecialDiscounts = '') {
		this.specialDiscounts = initialSpecialDiscounts;
	}
}