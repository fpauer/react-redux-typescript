import * as axios from 'axios';
import AuthHelper from '../components/auth/helpers/auth.helper';
import appConfig from '../components/app/app.config';
import {hashHistory} from 'react-router';

const HTTP_STATUSES = {
	unauthorized: 401,
	paymentRequired: 402
};

class Http {

	static paymentRenewRoute = '/payment-renew';

	static decorateAxios() {
		axios.interceptors.request.use(Http.requestJwtInterceptor);
		axios.interceptors.response.use(null, Http.responseJwtInterceptor);
	}

	private static requestJwtInterceptor(config) {
		let token = AuthHelper.getToken();
		if (token) {
			config.headers['Authorization'] = `${appConfig.jwtKey} ${token}`;
		}

		return config;
	}

	private static responseJwtInterceptor(error) {
		if (error.response.status === HTTP_STATUSES.unauthorized) {
			AuthHelper.logout();
		}

		if (error.response.status === HTTP_STATUSES.paymentRequired) {
			hashHistory.replace(Http.paymentRenewRoute);
		}

		return Promise.reject(error);
	}

}

export default Http;