import {ProfileStateInterface} from '../interfaces/profileState.interface';

export class ProfileStateClass implements ProfileStateInterface {
	errors: any[];
	messages: any[];
	inflight: boolean;
	photosUploaded: boolean;
	nextInfoStep: boolean;
	availableLanguages: any[];
	availableZipsUpdated: boolean;
	availableZips?: any[];
	billing?: any;

	constructor() {
		this.errors               = [];
		this.messages             = [];
		this.inflight             = false;
		this.photosUploaded       = false;
		this.nextInfoStep         = false;
		this.availableLanguages   = [];
		this.availableZipsUpdated = false;
		this.availableZips        = [];
		this.billing        = {};
	}
}