import * as React from 'react';
import {CustomTimeInputPropsInterface} from './interfaces/customTimeInputProps.interface';
import UtilHelper from '../../helpers/util.helper';

class CustomTimeInput extends React.Component<CustomTimeInputPropsInterface, any> {

	private _onChange(key, event) {
		let value = event.target.value;
		value.length < 3 && this[UtilHelper.toCamel(key, '', '_validate')](value) ? this.props.onChange(key, value) : '';
	}

	private _validateHours(value) {
		return !value || (value >= 0 && value < 24);
	}

	private _validateMinutes(value) {
		return !value || (value >= 0 && value < 60);
	}

	private _validateSeconds(value) {
		return this._validateMinutes(value);
	}

	private _formatValue(key, event) {
		let value = event.target.value;

		value.length < 3 && this[UtilHelper.toCamel(key, '', '_validate')](value) ? this.props.onChange(key, this._getFormattedValue(value)) : ''
	}

	private _getFormattedValue(value) {
		if(value.length < 2 && value < 10) {
			return `0${value}`;
		}

		return value;
	}

	render() {
		return (
			<div className={'custom-time-input ' + (this.props.noSeconds ? 'no-seconds' : '')}>
				<div className="time-input-text">
					<input type="number" className="number-input" min={0} max={23} maxLength={2}
					       value={this.props.target.hours}
					       onChange={this._onChange.bind(this, 'hours')}
					       onBlur={this._formatValue.bind(this, 'hours')}
					/>
					<span>:</span>
					<input type="number" className="number-input" min={0} max={59} maxLength={2}
					       value={this.props.target.minutes}
					       onChange={this._onChange.bind(this, 'minutes')}
					       onBlur={this._formatValue.bind(this, 'minutes')}
					/>
					<span>:</span>
					<input type="number" className="number-input" min={0} max={59} maxLength={2}
					       value={this.props.target.seconds}
					       onChange={this._onChange.bind(this, 'seconds')}
					       onBlur={this._formatValue.bind(this, 'seconds')}
					/>
				</div>
			</div>
		);
	}
}

export default CustomTimeInput;