import {RestorePasswordInterface} from '../interfaces/restorePasswordState.interface';

export class RestorePasswordClass implements RestorePasswordInterface {
	email: string;
	token?: string;
	password?: string;
	passwordConfirm?: string;

	constructor(token = null) {
		this.token           = token;
		this.email           = '';
		this.password        = '';
		this.passwordConfirm = '';
	}
}