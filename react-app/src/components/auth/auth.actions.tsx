import * as axios from 'axios';
import * as _ from 'underscore';
import UtilHelper from '../../helpers/util.helper';
import {AuthAction} from './interfaces/authAction.interface';
import AuthHelper from './helpers/auth.helper';
import {User} from './interfaces/user.interface';
import Config from '../app/app.config';
import RegisterInterface from '../register/interfaces/registerState.interface';
import {error} from 'util';

export enum authActions {
	AUTH_STARTED,
	AUTH_FAIL,
	AUTH_SUCCESS,
	AUTH_RESET,
	USER_EXTRACT,
	USER_EXTRACT_SUCCESS,
	REGISTER_NAVIGATE_NEXT_STEP,
	REGISTER_NAVIGATE_PREV_STEP,
	REGISTER_RECEIVED_SPECIALITIES,
	REGISTER_PROFESSIONS_DONE,
	REGISTER_PROFILE_DONE,
	REGISTER_ZIP_LOCATION_SUCCESS,
	REGISTER_ZIP_RETRIEVE_SUCCESS,
	REGISTER_ZIP_LOCATION_DONE,
	REGISTER_LOCATION_RESET,
	REGISTER_ZIP_RESET,
	REGISTER_PLACES_AVAILABILITY_SUCCESS,
	REGISTER_PROFESSION_INFO_SUCCESS,
	REGISTER_BILLING_INFO_SUCCESS,
	REGISTER_SOCIAL,
	REGISTER_CANCEL,
	AUTH_SUCCESS_MESSAGE,
	AUTH_RESET_ERRORS,
	REGISTER_NAVIGATE_STEP_NEEDED,
	REGISTER_NAVIGATE_STEP_DONE,
	REGISTER_SHOW_MANUAL_ZIP_DONE,
	REGISTER_API_ZIPS_RECEIVED,
	REGISTER_API_ZIPS_RECEIVED_DONE,
	REGISTER_PARTIAL_CREATED,
	REGISTER_EMAIL_CHECKED,
	REGISTER_RESET_EMAIL_CHECK
}

export class AuthActionsCreators {

	static processLogin(data: {}) {
		return AuthActionsCreators.processAuth('auth/login', data);
	}

	static processRegister(data: RegisterInterface) {

		let registerData = {
			profession:          data.speciality.data.profession,
			subProfessions:      data.speciality.data.subProfessions,
			location:            data.speciality.data.location,
			zipCode:             data.speciality.data.zipCode,
			email:               data.socialEmail || data.profile.data.email.toLowerCase(),
			firstName:           data.profile.data.firstName,
			lastName:            data.profile.data.lastName,
			address:             data.profile.data.address,
			addressDetails:      data.profile.data.addressDetails,
			phone:               data.profile.data.phone,
			socialRegister:      data.socialRegister,
			socialRegisterToken: data.socialRegisterToken
		};

		data.profile.hasPlaces !== false ? registerData['password'] = data.profile.data.password : null;

		if(!data.speciality.data.professionSpecialInfo && data.profile.hasPlaces) {
			registerData = Object.assign({}, registerData, {
				stripeToken:         data.billing.data.stripeToken,
				//insurancePlans:      data.billing.data.insurancePlans,
				billingPlan:         data.billing.data.billingPlan.id,
				waitingList:         false
			})
		} else {
			registerData = Object.assign({}, registerData, {
				professionSpecialInfo: data.speciality.data.professionSpecialInfo,
				waitingList: data.profile.hasPlaces === false ? !data.profile.hasPlaces : false
			});
		}

		return AuthActionsCreators.processAuth('auth/register', registerData);
	}

	private static processAuth(path: string, data: {}) {
		return dispatch => {
			dispatch(AuthActionsCreators.authStarted());

			axios
				.post(
					UtilHelper.apiPrefixed(path),
					data
				)
				.then((response: any) => {

					// If we created user without billing, just for registering him
					if(response.status === 202) {
						dispatch(AuthActionsCreators.registerPartialUserCreated());
						return;
					}

					dispatch(AuthActionsCreators.authSuccess(response.data.data))
				})
				.catch(error => dispatch(AuthActionsCreators.authFailed(error.response.data.error)))
		}
	}

	static registerPartialUserCreated() {
		return {
			type: authActions.REGISTER_PARTIAL_CREATED
		}
	}

	static registerNavigateStep() {
		return {
			type: authActions.REGISTER_NAVIGATE_STEP_NEEDED
		}
	}

	static registerNavigateStepDone() {
		return {
			type: authActions.REGISTER_NAVIGATE_STEP_DONE
		}
	}

	static resetAuth() {
		return {
			type: authActions.AUTH_RESET
		}
	}

	static authStarted(): {} {
		return {
			type: authActions.AUTH_STARTED
		}
	}

	static authFailed(errors: string[] | string): {} {
		if (!_.isArray(errors)) errors = [errors];

		return {
			type: authActions.AUTH_FAIL,
			errors
		}
	}

	static authResetErrors(): {} {
		return {
			type: authActions.AUTH_RESET_ERRORS
		}
	}

	private static authSuccessMessages(data: string[] | string) {
		if (!_.isArray(data)) data = [data];

		return {
			type: authActions.AUTH_SUCCESS_MESSAGE,
			data
		}
	}

	private static authSuccess(data: AuthAction): {} {
		return {
			type:  authActions.AUTH_SUCCESS,
			token: data.token,
			user:  data.user
		}
	}

	static extractUser() {
		return dispatch => {
			dispatch(AuthActionsCreators.userExtracting());

			axios
				.get(UtilHelper.apiPrefixed('users/profile'))
				.then((response: any) => dispatch(AuthActionsCreators.userExtractSuccess(response.data.data)))
				.catch(() => {});
		}
	}

	private static userExtracting() {
		return {
			type:  authActions.USER_EXTRACT,
			token: AuthHelper.getToken()
		}
	}

	static userExtractSuccess(user: any) {
		return {
			type: authActions.USER_EXTRACT_SUCCESS,
			user
		}
	}

	static authFacebook(code: string) {
		return AuthActionsCreators._handleSocialAuth(UtilHelper.apiPrefixed('auth/facebook') + code);
	}

	static authGoogle(code: string) {
		return AuthActionsCreators._handleSocialAuth(UtilHelper.apiPrefixed('auth/google?code=') + code);
	}

	static authOauth1(token: string) {
		return dispatch => {
			dispatch(AuthActionsCreators.authStarted());

			axios
				.post(
					UtilHelper.apiPrefixed('auth/oauth1'),
					{
						token
					}
				)
				.then((response: any) => AuthActionsCreators._checkSocialLogin(dispatch, response.data.data))
				.catch(error => dispatch(AuthActionsCreators.authFailed(error.response.data.error)));
		}
	}

	static _handleSocialAuth(path: string) {
		return dispatch => {
			dispatch(AuthActionsCreators.authStarted());

			axios
				.post(path)
				.then((response: any) => AuthActionsCreators._checkSocialLogin(dispatch, response.data.data))
				.catch(() => {});
		}
	}

	static _checkSocialLogin(dispatch, data) {
		if (data.token && data.user) {
			return dispatch(AuthActionsCreators.authSuccess(data))
		} else {
			return dispatch(AuthActionsCreators._handleSocialRegister(data))
		}
	}

	static _handleSocialRegister(data) {
		return {
			type: authActions.REGISTER_SOCIAL,
			data
		}
	}

	static registerNavigateNextStep() {
		return {
			type: authActions.REGISTER_NAVIGATE_NEXT_STEP
		}
	}

	static registerNavigatePrevStep() {
		return {
			type: authActions.REGISTER_NAVIGATE_PREV_STEP
		}
	}

	static getProfessions() {
		return dispatch => {
			axios
				.get(UtilHelper.apiPrefixed('profession-groups'))
				.then((response: any) => dispatch(AuthActionsCreators.receivedSpecialities(response.data.data)))
				.catch(() => {});
		}
	}

	static receivedSpecialities(professions) {
		return {
			type: authActions.REGISTER_RECEIVED_SPECIALITIES,
			professions
		}
	}

	static prefessionStepDone(professionData) {
		return {
			type: authActions.REGISTER_PROFESSIONS_DONE,
			professionData
		}
	}

	static profileStepDone(profileData) {
		return {
			type: authActions.REGISTER_PROFILE_DONE,
			profileData
		}
	}

	static getLocationZip(coordinates) {

		return dispatch => {
			dispatch(AuthActionsCreators.resetZipCoordinates());

			axios
				.get(`${Config.googleByCoordinates}${coordinates.latitude},${coordinates.longitude}`)
				.then((response: any) => {

					let zipCodeVariants = _.reduce(response.data.results, (memo: any, item: any) => {
						[].push.apply(memo, item['address_components']);
						return memo;
					}, []).filter((item: any) => !!~item.types.indexOf('postal_code'));

					if(!zipCodeVariants.length) {
						dispatch(AuthActionsCreators.authFailed('We couldn\'t retrieve your zip code based on coordinates.'));
						return;
					}

					dispatch(AuthActionsCreators.receivedZipCode({
						zipCode: zipCodeVariants[0]['short_name'],
						location: {
							latitude: coordinates.latitude,
							longitude: coordinates.longitude
						}
					}));
				})
				.catch(() => {});
		}
	}

	static registerShowManualZipDone() {
		return {
			type: authActions.REGISTER_SHOW_MANUAL_ZIP_DONE
		}
	}

	static getZipLocation(zipCode) {

		return dispatch => {
			dispatch(AuthActionsCreators.resetZipCoordinates());

			axios
				.get(`${Config.googleByAddress}${zipCode}`)
				.then((response: any) => {

					if(!response.data.results.length) {
						dispatch(AuthActionsCreators.authFailed('Please enter valid zip code.'));
						return;
					}

					let location = response.data.results[0];
					if (!location) return;

					location = location.geometry.location;

					dispatch(AuthActionsCreators.receivedZipCoordinates({
						latitude:  location.lat,
						longitude: location.lng
					}));
				})
				.catch(() => {});
		}
	}

	static receivedZipCoordinates(data) {
		return {
			type: authActions.REGISTER_ZIP_LOCATION_SUCCESS,
			data
		}
	}

	static receivedZipCoordinatesDone() {
		return {
			type: authActions.REGISTER_ZIP_LOCATION_DONE
		}
	}

	static receivedZipCode(data) {
		return {
			type: authActions.REGISTER_ZIP_RETRIEVE_SUCCESS,
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
						dispatch(AuthActionsCreators.checkApiZipcodeDone(response.data.data));
					} else {
						dispatch(AuthActionsCreators.authFailed('Did not find zip code in database.'));
					}
				})
				.catch((error: any) => dispatch(AuthActionsCreators.authFailed(error.response.data.error)));
		}
	}

	static checkApiZipcodeDone(data) {
		return {
			type: authActions.REGISTER_API_ZIPS_RECEIVED,
			data
		}
	}

	static zipsReceivedDone() {
		return {
			type: authActions.REGISTER_API_ZIPS_RECEIVED_DONE
		}
	}

	static resetZipCoordinates() {
		return {
			type: authActions.REGISTER_LOCATION_RESET
		}
	}

	static resetZipCode() {
		return {
			type: authActions.REGISTER_ZIP_RESET
		}
	}

	static getPlacesAvailability(data) {
		return dispatch => {
			dispatch(AuthActionsCreators.authStarted());
			axios
				.put(
					UtilHelper.apiPrefixed('users/available'),
					{
						zipCode: data.zipCode,
						profession: data.profession
					}
				)
				.then((response: any) => dispatch(AuthActionsCreators.receivedRegisterAvailability(response.data.data)))
				.catch((error: any) => dispatch(AuthActionsCreators.authFailed(error.response.data.error)));
		}
	}

	static receivedRegisterAvailability(data) {
		return {
			type: authActions.REGISTER_PLACES_AVAILABILITY_SUCCESS,
			data
		}
	}

	static checkEmailUnique(email) {
		return dispatch => {
			dispatch(AuthActionsCreators.authStarted());
			axios
				.get(
					UtilHelper.apiPrefixed('auth/email/available', {
						email
					})
				)
				.then((response: any) => dispatch(AuthActionsCreators.reveivedEmailAvailability(response.data.data)))
				.catch((error: any) => dispatch(AuthActionsCreators.authFailed(error.response.data.error)));
		}
	}

	static reveivedEmailAvailability(data) {
		return {
			type: authActions.REGISTER_EMAIL_CHECKED,
			data
		}
	}

	static resetEmailCheck() {
		return {
			type: authActions.REGISTER_RESET_EMAIL_CHECK
		}
	}

	static getProfileInfo(professionId) {
		return dispatch => {
			dispatch(AuthActionsCreators.authStarted());
			axios
				.get(UtilHelper.apiPrefixed(`professions/${professionId}`))
				.then((response: any) => dispatch(AuthActionsCreators.reveivedProfessionInfo(response.data.data)))
				.catch(() => {});
		}
	}

	static reveivedProfessionInfo(data) {
		return {
			type: authActions.REGISTER_PROFESSION_INFO_SUCCESS,
			data
		}
	}

	static billingTokenFail(error: string) {
		return this.authFailed(error);
	}

	static billingInfoSuccess(data) {
		return {
			type: authActions.REGISTER_BILLING_INFO_SUCCESS,
			data
		}
	}

	static cancelRegister() {
		return {
			type: authActions.REGISTER_CANCEL
		}
	}

	static processRestore(data) {
		return dispatch => {
			dispatch(AuthActionsCreators.authStarted());

			axios
				.post(UtilHelper.apiPrefixed(`auth/restore`), _.extend(data, {
					hasToken: !!data.token
				}))
				.then((response: any) => dispatch(AuthActionsCreators.authSuccessMessages(response.data.data)))
				.catch((error: any) => dispatch(AuthActionsCreators.authFailed(error.response.data.error)))
		}
	}
}