import {ProfileCommunityServiceStateInterface} from '../interfaces/profileCommunityServiceState.interface';

export class ProfileCommunityServiceStateClass implements ProfileCommunityServiceStateInterface {
	communityService: string;

	constructor(initialCommunityService = '') {
		this.communityService = initialCommunityService;
	}
}