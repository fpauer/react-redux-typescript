import RegisterState from '../interfaces/registerState.interface';
import {RegisterProfile} from '../interfaces/registerProfile.interface';
import RegisterSpeciality from '../interfaces/registerSpeciality.interface';
import {RegisterBilling} from '../interfaces/registerBilling.interface';
import {RegisterProfileClass} from './registerProfile.class';
import RegisterSpecialityClass from './registerSpeciality.class';
import {RegisterBillingClass} from './registerBilling.class';

class RegisterStateClass implements RegisterState {
	registerStep: number;
	speciality: RegisterSpeciality;
	profile: RegisterProfile;
	billing: RegisterBilling;
	socialRegister: boolean;
	socialRegisterToken: string;
	socialEmail: string;
	shouldNavigateNextStep: boolean;

	constructor() {
		this.registerStep           = 0;
		this.profile                = new RegisterProfileClass();
		this.speciality             = new RegisterSpecialityClass();
		this.billing                = new RegisterBillingClass();
		this.shouldNavigateNextStep = false;
	}
}

export default RegisterStateClass;