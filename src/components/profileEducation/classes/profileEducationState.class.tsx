import {ProfileEducationStateInterface} from '../interfaces/profileEducationState.interface';

export class ProfileEducationStateClass implements ProfileEducationStateInterface {
	education: string;

	constructor(initialEducation = '') {
		this.education = initialEducation;
	}
}