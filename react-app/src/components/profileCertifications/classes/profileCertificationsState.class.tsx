import {ProfileCertificationsStateInterface} from '../interfaces/profileCertificationsState.interface';

export class ProfileCertificationsStateClass implements ProfileCertificationsStateInterface {
	certifications: string;

	constructor(defaultCertifications = '') {
		this.certifications = defaultCertifications;
	}
}