import {LoginState} from '../interfaces/loginState.interface';

class LoginStateClass implements LoginState{
	email: string;
	password: string;

	constructor() {
		this.email = '';
		this.password = '';
	}
}

export default LoginStateClass;