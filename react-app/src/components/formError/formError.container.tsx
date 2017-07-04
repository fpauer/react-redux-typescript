import * as React from 'react';
import * as ReactDOM from'react-dom'
import FormErrorProps from './interfaces/formError.props.interface';

class FormError extends React.Component<FormErrorProps, {}> {

	componentDidMount() {
		if (this.props.error) {
			var containerDomNode = ReactDOM.findDOMNode(this);
			containerDomNode.scrollIntoView({block: 'end', behavior: 'smooth'});
		}
	}


	render() {
		return (
			<div className="callout alert">
				{this.props.error}
			</div>
		)
	}
}

export default FormError;