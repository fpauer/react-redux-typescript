import {RegisterProfile, RegisterProfileData} from '../interfaces/registerProfile.interface';

export class RegisterProfileDataClass implements RegisterProfileData {
	email: string;
	password: string;
	passwordRepeat: string;
	firstName: string;
	lastName: string;
	address: string;
	addressDetails: string;
	phone: any;
	cityData: any;

	constructor() {
		this.email          = '';
		this.password       = '';
		this.passwordRepeat = '';
		this.firstName      = '';
		this.lastName       = '';
		this.address        = '';
		this.addressDetails = '';
		this.phone          = '';
		this.cityData       = {};
	}
}

export class RegisterProfileClass implements RegisterProfile {
	hasPlaces: boolean;
	data: RegisterProfileData;
	partialUserCreated: boolean;
	emailAvailable: boolean;

	constructor() {
		this.hasPlaces          = null;
		this.partialUserCreated = false;
		this.data               = new RegisterProfileDataClass();
		this.emailAvailable     = false;
	}
}