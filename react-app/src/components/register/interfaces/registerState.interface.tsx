import {RegisterProfile} from './registerProfile.interface';
import RegisterSpeciality from './registerSpeciality.interface';
import {RegisterBilling} from './registerBilling.interface';

interface RegisterState {
	speciality: RegisterSpeciality
	profile: RegisterProfile
	billing: RegisterBilling
	registerStep: number
	socialRegister: boolean
	socialRegisterToken: string
	socialEmail: string
	shouldNavigateNextStep: boolean
}

export default RegisterState;