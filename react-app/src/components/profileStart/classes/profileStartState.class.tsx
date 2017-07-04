import {ProfileStartStateInterface} from '../interfaces/profileStartState.interface';

export class ProfileStartStateClass implements ProfileStartStateInterface {
	currentStep: number;

	constructor() {
		this.currentStep = 0;
	}

}