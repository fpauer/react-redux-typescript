import UtilHelper from './util.helper';

class Binder {

	static initTarget(self, target, key, event) {
		target[key] = event.target.value;
		self.forceUpdate();
	}

	static initInput(self, key, testPattern = null, event) {
		let regexPassed = testPattern instanceof RegExp;

		// Pattern can be passed or can be not passed, in this case event is being placed
		!event && !regexPassed ? event = testPattern: '';

		let newValue = event.target.value;

		if(regexPassed && !testPattern.test(newValue)) {
			return;
		}

		let newState = {};
		newState[key] = newValue;

		self.setState(Object.assign({}, self.state, newState));
	}

	static initInputArray(self, keys, event) {
		let newState = {};
		UtilHelper.setValueIn(newState, keys, event.target.value);

		self.setState(Object.assign({}, self.state, newState));
	}
}

export default Binder;