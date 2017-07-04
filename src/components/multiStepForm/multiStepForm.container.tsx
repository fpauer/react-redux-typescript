import * as React from 'react';
import MultiStepFormPropsInterface from './interfaces/multiStepForm.props.interface';

class MultiStepForm extends React.Component<any, MultiStepFormPropsInterface>{

	render() {
		// need this for passing along props of child
		let currentChild = React.cloneElement(this.props.children[this.props.currentStep]);

		return (
			<div className="multi-step">
				{currentChild}
			</div>
		);
	}
}

export default MultiStepForm;