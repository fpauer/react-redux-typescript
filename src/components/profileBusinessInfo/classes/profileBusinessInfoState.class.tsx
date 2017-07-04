import {ProfileBusinessInfoStateInterface} from '../interfaces/profileBusinessInfoState.interface';
import * as _ from 'underscore';

export class ProfileBusinessInfoClass implements ProfileBusinessInfoStateInterface {
	address: string;
	businessName: string;
	phoneBook: string;
	email: string;
	website: string;
	phoneType: string;
	phoneNumber: string;
	currentEdit: string;
	phones: any[];

	constructor(detailedInfo = false) {
		this.address            = '';
		this.businessName       = '';
		this.phoneBook          = '';
		this.email              = '';
		this.website            = '';
		this.currentEdit        = '';
		this.phoneType          = '';
		this.phoneNumber        = '';
		this.phones             = [];

		detailedInfo && _.isObject(detailedInfo) && !_.isEmpty(detailedInfo) ? this._initWithDetailedInfo(detailedInfo) : '';
	}

	private _initWithDetailedInfo(detailedInfo: any) {
		this.address            = detailedInfo.address || '';
		this.businessName       = detailedInfo.businessName || '';
		this.phoneBook          = detailedInfo.phoneBook || '';
		this.email              = detailedInfo.email || '';
		this.website            = detailedInfo.website || '';
		this.phones             = detailedInfo.phones || [];
	}
}