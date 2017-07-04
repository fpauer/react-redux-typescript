import {ProfileLanguagesStateInterface} from '../interfaces/profileLanguagesState.interface';

export class ProfileLanguagesStateClass implements ProfileLanguagesStateInterface {
	languages: string[];

	constructor() {
		this.languages = [];
	}
}