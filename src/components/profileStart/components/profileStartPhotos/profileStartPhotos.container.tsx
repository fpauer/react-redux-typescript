import * as React from 'react';
import {connect} from 'react-redux';
import {MultiStepFormStepInterface} from '../../../multiStepForm/interfaces/multiStepFormStep.interface';
import ProfilePhotos from '../../../profilePhotos/profilePhotos.container';
import {ProfilePhotosStateClass} from './classes/profilePhotosState.class';
import * as _ from 'underscore';

let autoBind = require('react-autobind');

class ProfileStartPhotos extends React.Component<any, ProfilePhotosStateClass> {

	constructor(props) {
		super(props);
		autoBind(this);
	}

	componentWillMount() {
		this._setBlankState();
	}

	private _setBlankState() {
		this.setState(new ProfilePhotosStateClass());
	}

	private onSubmit(event) {
		event.preventDefault();
		this.props.navigateNextStep(this.state.photos);
	}

	onImagesAdded(acceptedFiles) {
		this.setState({
			photos: this.state.photos.concat(acceptedFiles)
		});
	}

	onImageDeleted(image) {
		this.setState({
			photos: _.reject(this.state.photos, (item: any) => item.preview === image.preview)
		});
	}

	render() {

		return (
			<form className="profile-start-photos" onSubmit={this.onSubmit}>
				<div className="title top">
					Welcome to <br /> GPROSPlus&trade;!
				</div>
				<div className="description">
					Let's get started building your professional profile.
				</div>
				<ProfilePhotos destination={this.state.photos} imagesAdded={this.onImagesAdded} imageDeleted={this.onImageDeleted} />
				<div className="proceed">
					<button className="button" type="submit" disabled={this.props.profile.inflight}>
						Next
					</button>
				</div>
			</form>
		);
	}

	// We need to specify ownProps because this component has it's own props passed to it
	static mapStateToProps(state, ownProps: MultiStepFormStepInterface) {
		return {
			profile: state.profile
		};
	}
}

export default connect(ProfileStartPhotos.mapStateToProps)(ProfileStartPhotos);