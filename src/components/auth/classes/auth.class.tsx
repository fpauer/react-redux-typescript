import {Auth} from '../interfaces/auth.interface';
import {UserClass} from './user.class';
import RegisterInterface from '../../register/interfaces/registerState.interface';
import RegisterClass from '../../register/classes/registerState.class';

export class AuthClass implements Auth {
	user: UserClass;
	inflight: boolean;
	errors: string[];
	messages: string[];
	register: RegisterInterface;

	constructor() {
		this.user     = new UserClass();
		this.inflight = false;
		this.errors   = [];
		this.messages = [];
		this.register = new RegisterClass();
	}
}