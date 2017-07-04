import * as React from 'react';
import {EditableTextareaPropsInterface} from './interfaces/editableTextareaProps.interface';

class EditableTextarea extends React.Component<EditableTextareaPropsInterface, any> {

	render() {
		return (
			<div className="editable-field">
				<div className="title">
					{ this.props.title }
				</div>
				<div className="container">
					<textarea onChange={this.props.onChange} value={this.props.value}></textarea>
				</div>
				<div className="proceed">
					<button className="button" type="button" onClick={this.props.onDone}>
						{ this.props.doneText || 'Done' }
					</button>
				</div>
			</div>
		);
	}
}

export default EditableTextarea;