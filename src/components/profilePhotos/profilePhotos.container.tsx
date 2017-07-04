import * as React from 'react';
import * as Dropzone from 'react-dropzone';
import {ProfilePhotosPropsInterface} from './interfaces/profilePhotosProps.interface';
import Config from '../app/app.config';
import * as _ from 'underscore';
import UtilHelper from '../../helpers/util.helper';

let autoBind = require('react-autobind');

class ProfilePhotos extends React.Component<ProfilePhotosPropsInterface, any> {

	constructor(props) {
		super(props);
		autoBind(this);
	}

	deleteImage(image) {
		this.props.imageDeleted(image);
	}

	render() {

		return (
			<div className="profile-photos base-form">
				<div className="title">
					Photos
				</div>
				<div className="description">
					Add photos of yourself and your office. This helps you attract customers and stand out from the crowd.
				</div>
				<Dropzone onDrop={this.props.imagesAdded} accept="image/*" className="file-dropzone" maxSize={Config.maxFileUploadSize}>
					<div className="proceed full">
						<button className="button" type="button">
							Upload
						</button>
					</div>
				</Dropzone>
				<div className="preview-container row">
					{
						_.map(this.props.destination, image => {
							return (
								<div className="preview-item columns small-4" key={image.preview || image.url}>
									<img src={image.preview || UtilHelper.imgPrefixed(image.url)} />
									<div className="delete" onClick={this.deleteImage.bind(this, image)}>
										<i className="fa fa-ban"></i>
									</div>
								</div>
							);
						})
					}
				</div>
			</div>
		);
	}
}

export default ProfilePhotos;