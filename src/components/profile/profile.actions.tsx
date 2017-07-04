import * as axios from 'axios';
import * as _ from 'underscore';
import UtilHelper from '../../helpers/util.helper';
import {AuthActionsCreators} from '../auth/auth.actions';

export const ProfileActions = {
	PROFILE_INFLIGHT:            'PROFILE_INFLIGHT',
	PROFILE_ERRORS:              'PROFILE_ERRORS',
	PROFILE_RESET_ERRORS:        'PROFILE_RESET_ERRORS',
	PROFILE_PHOTOS_UPLOADED:     'PROFILE_PHOTOS_UPLOADED',
	PROFILE_NEXT_STEP:           'PROFILE_NEXT_STEP',
	PROFILE_NEXT_STEP_DONE:      'PROFILE_NEXT_STEP_DONE',
	PROFILE_LANGUAGES_RETRIEVED: 'PROFILE_LANGUAGES_RETRIEVED',
	PROFILE_API_ZIPS_RECEIVED:   'PROFILE_API_ZIPS_RECEIVED',
	PROFILE_API_ZIPS_RECEIVED_DONE: 'PROFILE_API_ZIPS_RECEIVED_DONE',
	PROFILE_BILLING_INFO_SUCCESS: 'PROFILE_BILLING_INFO_SUCCESS',
	PROFILE_PROFESSION_INFO_SUCCESS: 'PROFILE_PROFESSION_INFO_SUCCESS'
};

export class ProfileActionCreators {

	static profileInflight() {
		return {
			type: ProfileActions.PROFILE_INFLIGHT
		}
	}

	static profilePhotosUploadError(errors = ['Error occured during photos upload. Please try again.']) {
		return this.profileErrors(errors);
	}

	static profileErrors(errors = ['Error occured during profile save.']) {
		return {
			type: ProfileActions.PROFILE_ERRORS,
			data: errors
		}
	}

	static profileResetErrors() {
		return {
			type: ProfileActions.PROFILE_RESET_ERRORS
		}
	}

	static profilePhotosUploaded() {
		return {
			type: ProfileActions.PROFILE_PHOTOS_UPLOADED
		}
	}

	static startBillingDone(data) {
		return {
			type: ProfileActions.PROFILE_BILLING_INFO_SUCCESS,
			data
		}
	}

	static profileCheckInsurancePlans(data) {
		return {
			type: ProfileActions.PROFILE_PROFESSION_INFO_SUCCESS,
			data
		}
	}

	static getProfession(professionId, callback) {
		return dispatch => {
			dispatch(ProfileActionCreators.profileInflight());
			axios
                .get(UtilHelper.apiPrefixed(`professions/${professionId}`))
                .then((response: any) => dispatch(callback(response.data.data)))
                .catch(() => {});
		}
	}

	static profilePhotosUpload(images: any[]) {
		return dispatch => {
			dispatch(ProfileActionCreators.profileInflight());

			const data = new FormData();

			_.each(images, (image: any, key: number) => {
				data.append(`image-${key}`, image)
			});

			axios
				.post(UtilHelper.apiPrefixed('users/profile/photos'), data)
				.then((response: any) => {
					dispatch(ProfileActionCreators.profilePhotosUploaded());
					dispatch(AuthActionsCreators.userExtractSuccess(response.data.data));
				})
				.catch(error => dispatch(ProfileActionCreators.profilePhotosUploadError()));
		}
	}

	static profilePhotosRemove(images: any[], spinner = false) {
		return dispatch => {
			if(spinner) {
				dispatch(ProfileActionCreators.profileInflight());
			}

			axios
				.delete(UtilHelper.apiPrefixed('users/profile/photos', {
					photos: images
				}))
				.then((response: any) => {
					if(spinner) {
						dispatch(ProfileActionCreators.profilePhotosUploaded());
						dispatch(AuthActionsCreators.userExtractSuccess(response.data.data));
					}
				})
				.catch(error => dispatch(ProfileActionCreators.profileErrors()));
		}
	}

	static profileStartDone() {
		return dispatch => {
			dispatch(ProfileActionCreators.profileInflight());

			axios
				.put(UtilHelper.apiPrefixed('users/profile/done'))
				.then((response: any) => dispatch(AuthActionsCreators.userExtractSuccess(response.data.data)))
				.catch(error => dispatch(ProfileActionCreators.profileErrors()))
		}
	}

	static profileInfoNextStep() {
		return {
			type: ProfileActions.PROFILE_NEXT_STEP
		}
	}

	static profileInfoNextStepDone() {
		return {
			type: ProfileActions.PROFILE_NEXT_STEP_DONE
		}
	}

	static profileDetailsSave(data, professionId?) {

		return dispatch => {
			dispatch(ProfileActionCreators.profileInflight());

			axios
				.patch(UtilHelper.apiPrefixed('users/profile/details'), data)
				.then((response: any) => {

					if(professionId) {
						dispatch(
							ProfileActionCreators.getProfession(professionId, ProfileActionCreators.startBillingDone)
						);
					}
					dispatch(AuthActionsCreators.userExtractSuccess(response.data.data));
					dispatch(ProfileActionCreators.profileInfoNextStep());
				})
				.catch(error => {
					dispatch(ProfileActionCreators.profileErrors(error.response.data.error))
				})
		}
	}

	static retrieveLanguages() {
		return dispatch => {
			dispatch(ProfileActionCreators.profileInflight());

			axios
				.get(UtilHelper.apiPrefixed('languages'))
				.then((response: any) => dispatch(ProfileActionCreators._languagesRetrieved(response.data.data)))
				.catch(() => dispatch(ProfileActionCreators.profileErrors(['Error during getting languages.'])))
		}
	}

	private static _languagesRetrieved(data) {
		return {
			type: ProfileActions.PROFILE_LANGUAGES_RETRIEVED,
			data
		}
	}

	static checkApiZipcode(code) {
		return dispatch => {
			axios
                .get(
					UtilHelper.apiPrefixed('users/zips',
						{
							code
						}
					)
				)
                .then((response: any) => {
					if(response.data.data.length) {
						dispatch(ProfileActionCreators.checkApiZipcodeDone(response.data.data));
					} else {
						dispatch(ProfileActionCreators.profileErrors(['Did not find zip code in database.']));
					}
				})
                .catch((error: any) => dispatch(ProfileActionCreators.profileErrors([error.response.data.error])));
		}
	}

	static checkApiZipcodeDone(data) {
		return {
			type: ProfileActions.PROFILE_API_ZIPS_RECEIVED,
			data
		}
	}

	static zipsReceivedDone() {
		return {
			type: ProfileActions.PROFILE_API_ZIPS_RECEIVED_DONE
		}
	}

	static billingSuccess(data) {
		return dispatch => {
			axios
                .patch(UtilHelper.apiPrefixed('users/profile/payment'), data)
                .then((response: any) => {
					if(response.status === 200) {
						dispatch(ProfileActionCreators.profileStartDone());
					}
				})
                .catch(error => {
					dispatch(ProfileActionCreators.profileErrors([error.response.data.error]));
				})
		}
	}

	static signInFreeSuccess(data) {
		return dispatch => {
			axios
                .patch(UtilHelper.apiPrefixed('users/profile/free'), data)
                .then((response: any) => {
					if(response.status === 200) {
						dispatch(ProfileActionCreators.profileStartDone());
					}
				})
                .catch(error => {
					dispatch(ProfileActionCreators.profileErrors([error.response.data.error]));
				})
		}
	}
}