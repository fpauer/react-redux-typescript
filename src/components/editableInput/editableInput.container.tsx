import * as React from 'react';
import {EditableInputPropsInterface} from './interfaces/editableInputProps.interface';
import UtilHelper from '../../helpers/util.helper';

let MaskedInput = require('react-input-mask');

class EditableInput extends React.Component<EditableInputPropsInterface, any> {

	private _getTypedInput(type) {
		return this[UtilHelper.toCamel(type, 'InputField', '_get')]();
	}

	private _getTextInputField() {
		return <input type="text" onChange={this.props.onChange} value={this.props.value}/>;
	}

	private _getEmailInputField() {
		return <input type="email" onChange={this.props.onChange} value={this.props.value}/>;
	}

	private _getWebsiteInputField() {
		return <input type="text" onChange={this.props.onChange} value={this.props.value} placeholder="www.website.com" pattern="[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?"/>;
	}

	private _getPhoneInputField() {
		let mask = '999-999-9999';
		return this._getMaskedInput(mask);
	}

	private _getMaskedInput(mask) {
		return <MaskedInput
				mask={mask}
                maskChar={null}
                value={this.props.value}
                onChange={this.props.onChange}
                className="masked"
		/>;
	}

	onDone(event) {
		event.preventDefault();
		this.props.onDone();
	}

	render() {
		return (
			<form onSubmit={this.onDone.bind(this)}>
				<div className="editable-field">
					<div className="title">
						{ this.props.title }
					</div>
					<div className="container">
						{this._getTypedInput(this.props.type || 'text')}
					</div>
					<div className="proceed">
						<button className="button" type="submit">
							{ this.props.doneText || 'Done' }
						</button>
					</div>
				</div>
			</form>
		);
	}
}

export default EditableInput;