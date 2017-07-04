import {Reducer} from 'redux';
import {AppState} from '../app/interfaces/app.state.interface';
import {authActions} from './auth.actions';
import {AuthAction} from './interfaces/authAction.interface';
import {AppStateClass} from '../app/classes/app.state.class';
import {Auth} from './interfaces/auth.interface';
import {AuthClass} from './classes/auth.class';
import RegisterClass from '../register/classes/registerState.class';
import * as _ from 'underscore';
import AuthHelper from './helpers/auth.helper';
import {ProfileActions} from "../profile/profile.actions";

export const authReducer: Reducer<Auth> = (state: Auth = new AuthClass(), action: AuthAction) => {
	let newRegister;
	switch (action.type) {

		case authActions.AUTH_STARTED:
			return Object.assign({}, state, {errors: [], messages: [], inflight: true});

		case authActions.AUTH_FAIL:
			return Object.assign({}, state, {errors: action.errors, inflight: false});

		case authActions.AUTH_RESET_ERRORS:
			return Object.assign({}, state, {errors: []});

		case authActions.AUTH_SUCCESS:
			return Object.assign({}, state, {inflight: false, token: action.token, user: action.user});

		case authActions.AUTH_SUCCESS_MESSAGE:
			return Object.assign({}, state, {inflight: false, messages: action.data, errors: []});

		case authActions.AUTH_RESET:
			let cleanRegister = _.extend(new RegisterClass(), {
				socialRegister: state.register.socialRegister,
				socialRegisterToken: state.register.socialRegisterToken,
				socialEmail: state.register.socialEmail
			});

			return Object.assign({}, state, {inflight: false, errors: [], messages: [], register: cleanRegister});

		case authActions.USER_EXTRACT:
			return Object.assign({}, state, {inflight: true, token: action.token});

		case authActions.USER_EXTRACT_SUCCESS:
			AuthHelper.updateUser(action.user);
			return Object.assign({}, state, {inflight: false, user: action.user});

		case authActions.REGISTER_NAVIGATE_NEXT_STEP:

			newRegister = Object.assign({}, state.register, {registerStep: state.register.registerStep + 1});
			return Object.assign({}, state, {register: newRegister});

		case authActions.REGISTER_NAVIGATE_STEP_NEEDED:

			newRegister = Object.assign({}, state.register, {shouldNavigateNextStep: true});
			return Object.assign({}, state, {register: newRegister});

		case authActions.REGISTER_NAVIGATE_STEP_DONE:

			newRegister = Object.assign({}, state.register, {shouldNavigateNextStep: false});
			return Object.assign({}, state, {register: newRegister});

		case authActions.REGISTER_NAVIGATE_PREV_STEP:

			newRegister = Object.assign({}, state.register, {registerStep: state.register.registerStep - 1});
			return Object.assign({}, state, {register: newRegister});

		case authActions.REGISTER_RECEIVED_SPECIALITIES:

			newRegister = _.extend(Object.assign({}, state.register), {
				speciality: _.extend(state.register.speciality, {
					professions: action.professions
				})
			});

			return Object.assign({}, state, {register: newRegister});

		case authActions.REGISTER_PROFESSIONS_DONE:

			newRegister = _.extend(Object.assign({}, state.register), {
				speciality: _.extend(state.register.speciality, {
					data: {
						profession: action.professionData.profession || state.register.speciality.professions[0].items[0].id,
						location: (action.professionData.location && (action.professionData.location.latitude || action.professionData.location.longitude)) ?
							          action.professionData.location : state.register.speciality.data.location,
						zipCode: action.professionData.zipCode,
						professionSpecialInfo: action.professionData.professionSpecialInfo,
						subProfessions: action.professionData.subProfessions && action.professionData.subProfessions.length ? action.professionData.subProfessions.split(', ') : []
					}
				})
			});

			return Object.assign({}, state, {register: newRegister});

		case authActions.REGISTER_PROFILE_DONE:

			newRegister = _.extend(Object.assign({}, state.register), {
				profile: _.extend(state.register.profile, {
					data: action.profileData
				})
			});

			return Object.assign({}, state, {register: newRegister});

		case authActions.REGISTER_PARTIAL_CREATED:

			newRegister = _.extend(Object.assign({}, state.register), {
				profile: _.extend(state.register.profile, {
					partialUserCreated: true
				})
			});

			return Object.assign({}, state, {register: newRegister, inflight: false});

		case authActions.REGISTER_ZIP_LOCATION_SUCCESS:

			newRegister = Object.assign({}, state.register, {
				speciality: Object.assign({}, state.register.speciality, {
					data: Object.assign({}, state.register.speciality.data, {
						location: action.data
					}),
					coordinatesRetrieved: true
				})
			});

			return Object.assign({}, state, {register: newRegister});

		case authActions.REGISTER_ZIP_LOCATION_DONE:

			newRegister = Object.assign({}, state.register, {
				speciality: Object.assign({}, state.register.speciality, {
					coordinatesRetrieved: false
				})
			});

			return Object.assign({}, state, {register: newRegister});

		case authActions.REGISTER_ZIP_RETRIEVE_SUCCESS:

			newRegister = Object.assign({}, state.register, {
				speciality: Object.assign({}, state.register.speciality, {
					data: Object.assign({}, state.register.speciality.data, {
						zipCode: action.data.zipCode,
						location: action.data.location
					}),
					showManualZip: true
				})
			});

			return Object.assign({}, state, {register: newRegister});

		case authActions.REGISTER_SHOW_MANUAL_ZIP_DONE:

			newRegister = Object.assign({}, state.register, {
				speciality: Object.assign({}, state.register.speciality, {
					showManualZip: false
				})
			});

			return Object.assign({}, state, {register: newRegister});

		case authActions.REGISTER_API_ZIPS_RECEIVED:

			newRegister = Object.assign({}, state.register, {
				speciality: Object.assign({}, state.register.speciality, {
					availableZipsUpdated: true,
					availableZips: action.data
				})
			});

			return Object.assign({}, state, {register: newRegister});

		case authActions.REGISTER_API_ZIPS_RECEIVED_DONE:

			newRegister = Object.assign({}, state.register, {
				speciality: Object.assign({}, state.register.speciality, {
					availableZipsUpdated: false
				})
			});

			return Object.assign({}, state, {register: newRegister});

		case authActions.REGISTER_LOCATION_RESET:

			newRegister = Object.assign({}, state.register, {
				speciality: Object.assign({}, state.register.speciality, {
					data: Object.assign({}, state.register.speciality.data, {
						location: {
							latitude:  0,
							longitude: 0
						}
					})
				})
			});

			return Object.assign({}, state, {register: newRegister});

		case authActions.REGISTER_PLACES_AVAILABILITY_SUCCESS:

			newRegister = _.extend(Object.assign({}, state.register), {
				profile: _.extend(state.register.profile, {
					hasPlaces: action.data
				})
			});

			return Object.assign({}, state, {register: newRegister, inflight: false});

		case authActions.REGISTER_RESET_EMAIL_CHECK:

			newRegister = _.extend(Object.assign({}, state.register), {
				profile: _.extend(state.register.profile, {
					emailAvailable: false
				})
			});

			return Object.assign({}, state, {register: newRegister, inflight: false});

		case authActions.REGISTER_EMAIL_CHECKED:

			newRegister = _.extend(Object.assign({}, state.register), {
				profile: _.extend(state.register.profile, {
					emailAvailable: action.data
				})
			});

			return Object.assign({}, state, {register: newRegister, inflight: false});

		case authActions.REGISTER_PROFESSION_INFO_SUCCESS:

			newRegister = _.extend(Object.assign({}, state.register), {
				billing: _.extend(state.register.billing, {
					professionInfo: action.data
				})
			});

			return Object.assign({}, state, {register: newRegister, inflight: false});

		case authActions.REGISTER_BILLING_INFO_SUCCESS:

			newRegister = _.extend(Object.assign({}, state.register), {
				billing: _.extend(state.register.billing, {
					data: action.data
				})
			});

			return Object.assign({}, state, {register: newRegister, inflight: false});

		case authActions.REGISTER_SOCIAL:

			newRegister = _.extend(Object.assign({}, state.register), {
				socialRegister: action.data.socialRegister,
				socialRegisterToken: action.data.socialRegisterToken,
				socialEmail: action.data.email
			});

			return Object.assign({}, state, {register: newRegister, inflight: false, errors: []});

		case authActions.REGISTER_CANCEL:

			return Object.assign({}, state, {inflight: false, errors: [], register: new RegisterClass()});


		case ProfileActions.PROFILE_PHOTOS_UPLOADED:

			newRegister = Object.assign({}, state);
			const zipNumber = newRegister.user.zipCode['code'];
			const zipCity = newRegister.user.zipCode['city'];
			const zipState = newRegister.user.zipCode['state'];
			const zipLocation = [zipCity,", ",zipState,' ',zipNumber].join('');

			newRegister.user.detailedInfo = Object.assign({}, newRegister.user.detailedInfo, {
				address: [newRegister.user.address, '\n', newRegister.user.addressDetails, '\n', zipLocation].join('') ,
				email: newRegister.user.email,
				phones: [{type: "Phone", number: newRegister.user.phone}],
				phoneBook: 'Phone: '+newRegister.user.phone
			});
			return newRegister;

		default:
			return state;
	}
};