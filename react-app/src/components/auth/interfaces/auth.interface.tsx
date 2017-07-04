import {User} from './user.interface';
import Register from '../../register/interfaces/registerState.interface';

export interface Auth {
	inflight: boolean
	errors: string[]
	messages: string[]
	user: User
	register: Register
}