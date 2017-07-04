import * as _ from 'underscore';
import * as _s from 'underscore.string';
import config from '../components/app/app.config';

class UtilHelper {

	static toCamel(text: string, suffix: string = '', prefix: string = ''): string {
		return prefix + _s.camelize('-' + text) + suffix;
	}

	static setValueIn(destination: {}, keys: any[], value: any): {} {
		let result = null;
		_.each(keys, (key: any, index: number) => {
			let nextKey = keys[index + 1];

			if(typeof nextKey === 'undefined') {
				result[key] = value;
				return;
			}

			if(_.isNumber(nextKey)) {
				if(!result) {
					destination[key] = [];
					result = destination[key];
				} else {
					result[key] = [];
					result = result[key];
				}
			} else {
				if(!result) {
					destination[key] = {};
					result = destination[key];
				} else {
					result[key] = {};
					result = result[key];
				}
			}
		});

		return destination;
	}

	static apiPrefixed(path: string, params?: {}) {
		return config.apiPrefix + path + UtilHelper._compactUriParams(params);
	}

	static imgPrefixed(path: string) {
		return config.apiImages + path;
	}

	private static _compactUriParams(params: {}) {
		if(!params) return '';
		let compacted = _.map(params, (value: any, key: string) => {
			return UtilHelper._compactSingleUriParam(value, key);
		});

		return '?' + compacted.join('&');
	}

	private static _compactSingleUriParam(value: any, key: string) {
		if(_.isArray(value) || _.isObject(value)) {
			return `${key}=${encodeURIComponent(JSON.stringify(value))}`;
		} else {
			return `${key}=${encodeURIComponent(value)}`;
		}
	}

	static toggleSimpleArrayExistence(target: any[], item: string | number, self: any) {
		if(UtilHelper.simpleArrayExistence(target, item)) {
			target.splice(target.indexOf(item), 1);
		} else {
			target.push(item);
		}
		self.forceUpdate();
	}

	static simpleArrayExistence(target: any[], item: string | number) {
		return !!~target.indexOf(item);
	}

	static USER_TYPE = {
		Paid: 1, Free: 2
	}

}

export default UtilHelper;