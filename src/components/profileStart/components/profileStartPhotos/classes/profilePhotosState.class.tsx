import {ProfilePhotosStateInterface} from '../interfaces/profilePhotosState.interface';

export class ProfilePhotosStateClass implements ProfilePhotosStateInterface {
	photos: any[];

	constructor() {
		this.photos = [];
	}
}