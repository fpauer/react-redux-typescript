import {combineReducers} from 'redux';
import {authReducer} from '../components/auth/auth.reducer';
import {paymentRenewReducer} from '../components/paymentRenew/paymentRenew.reducer';
import {profileReducer} from '../components/profile/profile.reducer';

const rootReducer = combineReducers({
	auth: authReducer,
	paymentRenew: paymentRenewReducer,
	profile: profileReducer
});

export default rootReducer;