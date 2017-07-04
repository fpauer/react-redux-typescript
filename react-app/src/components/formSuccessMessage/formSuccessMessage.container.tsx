import * as React from 'react';
import FormSuccessMessageProps from './interfaces/formSuccessMessage.props.interface';

class FormSuccessMessage extends React.Component<FormSuccessMessageProps, {}> {

	render() {
		return (
			<div className="callout success">
				{this.props.message}
			</div>
		)
	}
}

export default FormSuccessMessage;