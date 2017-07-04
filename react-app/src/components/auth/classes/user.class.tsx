import {User} from '../interfaces/user.interface';

export class UserClass implements User {
	id:         number;
	email:      string;
	name:       string;
	isAdmin:    boolean;
	company:    string;
	detailedInfo: Object;
	address: string;
	addressDetails: string;
	zipCode: Object;
	phone: string;

	constructor() {
		this.id      = 0;
		this.email   = '';
		this.name    = '';
		this.isAdmin = false;
		this.company = '';
	}
}