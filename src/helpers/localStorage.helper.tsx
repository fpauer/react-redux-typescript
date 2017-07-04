import config from '../components/app/app.config';
let localStorage = require('local-storage');

class LocalStorageHelper {
	static set(key: string, data: any) {
		return localStorage.set(LocalStorageHelper._buildKey(key), data);
	}

	static get(key: string) {
		return localStorage.get(LocalStorageHelper._buildKey(key));
	}

	static remove(key: string) {
		return localStorage.remove(LocalStorageHelper._buildKey(key));
	}

	static update(key: string, data: any) {
		LocalStorageHelper.remove(key);
		LocalStorageHelper.set(key, data);
	}

	private static _buildKey(key: string) {
		return `${config.localStorageKey}-${key}`;
	}
}

export default LocalStorageHelper;