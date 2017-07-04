import LocalStorage from '../../../helpers/localStorage.helper';

class AuthHelper {
	static logout() {
		AuthHelper.forgetUser();
		AuthHelper.forgetToken();
		location.reload();
	}

	static forgetUser() {
		LocalStorage.remove('user');
	}

	static forgetToken() {
		LocalStorage.remove('token');
	}

	static updateUser(user) {
		LocalStorage.update('user', user);
	}

	static updateToken(token) {
		LocalStorage.update('token', token);
	}

	static getToken() {
		return LocalStorage.get('token');
	}

	static getUser() {
		return LocalStorage.get('user');
	}

	static isAuthenticated() {
		return !!AuthHelper.getToken();
	}
}

export default AuthHelper;