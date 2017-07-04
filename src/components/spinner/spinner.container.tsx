import * as React from 'react';
import {Spinner as SpinnerInterface} from './interfaces/spinner.interface';

class Spinner extends React.Component<SpinnerInterface, {}> {
	render() {
		let spinner = null;
		if(this.props.active) {
			spinner = (
				<div className="spinner">
					<img src={require('../../assets/images/loader.gif')} />
				</div>
			)
		}
		return spinner;
	}
}

export default Spinner;