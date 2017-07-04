import * as React from 'react';

class NotFound extends React.Component<any, {}> {
	render() {
		return (
			<div className="not-found">
				<img src={require('../../assets/images/404.png')} />
			</div>
		);
	}
}

export default NotFound;