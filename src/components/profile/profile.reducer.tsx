import {Reducer} from 'redux';
import * as _ from 'underscore';

import {ProfileStateInterface} from './interfaces/profileState.interface';
import {ProfileStateClass} from './classes/profileState.class';
import {ProfileActions} from './profile.actions';
import {ProfileAction} from './interfaces/profileAction.interface';
import {authActions} from "../auth/auth.actions";

export const profileReducer: Reducer<ProfileStateInterface> = (state: ProfileStateInterface = new ProfileStateClass(), action: ProfileAction) => {

	switch (action.type) {

		case ProfileActions.PROFILE_INFLIGHT:
			return Object.assign({}, state, {errors: [], messages: [], inflight: true});

		case ProfileActions.PROFILE_PHOTOS_UPLOADED:
			return Object.assign({}, state, {errors: [], messages: [], inflight: false, photosUploaded: true});

		case ProfileActions.PROFILE_ERRORS:
			return Object.assign({}, state, {errors: action.data, messages: [], inflight: false, photosUploaded: false});

        case authActions.AUTH_FAIL:
            return Object.assign({}, state, {errors: action.errors, messages: []});

		case ProfileActions.PROFILE_RESET_ERRORS:
			return Object.assign({}, state, {errors: [], messages: [], inflight: false});

		case ProfileActions.PROFILE_NEXT_STEP:
			return Object.assign({}, state, {nextInfoStep: true, inflight: false, errors: [], messages: []});

		case ProfileActions.PROFILE_NEXT_STEP_DONE:
			return Object.assign({}, state, {nextInfoStep: false});

		case ProfileActions.PROFILE_LANGUAGES_RETRIEVED:
			return Object.assign({}, state, {
			    inflight: false, errors: [], messages: [], availableLanguages: action.data
			});

		case ProfileActions.PROFILE_API_ZIPS_RECEIVED:
			return Object.assign({}, state, {
				showSuggestedZips: true,
				availableZipsUpdated: true,
				availableZips: action.data
			});

		case ProfileActions.PROFILE_API_ZIPS_RECEIVED_DONE:
			return Object.assign({}, state, {
				availableZipsUpdated: false
			});

        case ProfileActions.PROFILE_BILLING_INFO_SUCCESS:
            return Object.assign({}, state, {
                billing: {
                    professionInfo: action.data
                }
            });

        case ProfileActions.PROFILE_PROFESSION_INFO_SUCCESS:
            return Object.assign({}, state, {errors: [], messages: [], inflight: false, profession: action.data});

		default:
			return state;
	}
};