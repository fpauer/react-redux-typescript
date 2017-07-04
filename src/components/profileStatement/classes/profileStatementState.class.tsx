import {ProfileStatementStateInterface} from '../interfaces/profileStatementState.interface';

export class ProfileStatementStateClass implements ProfileStatementStateInterface {
	statement: string;

	constructor(defaultStatement = '') {
		this.statement = defaultStatement;
	}
}