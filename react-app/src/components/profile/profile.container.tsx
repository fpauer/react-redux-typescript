import * as React from 'react';
import {connect} from 'react-redux';
import * as _ from 'underscore';
import {ProfileActionCreators} from '../profile/profile.actions';
import FormError from '../formError/formError.container';
import Spinner from '../spinner/spinner.container';
import UtilHelper from '../../helpers/util.helper';
import * as inflection from 'inflection';
import Config from '../app/app.config';
import ProfileEducation from '../profileEducation/profileEducation.container';
import ProfileCertifications from '../profileCertifications/profileCertifications.container';
import ProfileStatement from '../profileStatement/profileStatement.container';
import ProfileLanguages from '../profileLanguages/profileLanguages.container';
import ProfileHours from '../profileHours/profileHours.container';
import ProfileBusiness from '../profileBusinessInfo/profileBusinessInfo.container';
import ProfilePhotos from '../profilePhotos/profilePhotos.container';

let autobind = require('react-autobind');

let editableBlocks = {
	businessInfo: 'Business Info',
	education: 'Education',
	certifications: 'Board Certifications',
	languages: 'Languages',
	workingHours: 'Office Hours',
	statement: 'Professional Statement'
};

class Profile extends React.Component<any, any> {

	constructor(props) {
		super(props);
		autobind(this);
	}

	componentDidMount() {
		window['jQuery']('.section.profile-section').foundation();
	}

	componentWillMount() {
		this.setState({});
		this.props.dispatch(ProfileActionCreators.retrieveLanguages());
	}

	editEnable(field) {
		this.setState({
			currentEdit: field
		})
	}

	editDone() {
		this.setState({
			currentEdit: null
		})
	}

	componentWillReceiveProps(newProps) {
		this.props.profile.inflight && !newProps.profile.inflight && !newProps.profile.errors.length ? this.editDone() : '';
	}

	componentDidUpdate(prevProps, prevState) {
		if(prevState.currentEdit !== this.state.currentEdit) {
			switch (this.state.currentEdit) {
				case 'photos':
					this.setState(Object.assign({}, this.state, {
						photos: [].concat(this.props.user.photos),
						deletedPhotos: [],
						newPhotos: []
					}));
					break;
			}
		}
	}

	getCurrentEditForm() {
		switch (this.state.currentEdit) {
			case 'education':
				return <ProfileEducation onInfoGathered={this.onProfileUpdate} doneText="Save"/>;
			case 'certifications':
				return <ProfileCertifications onInfoGathered={this.onProfileUpdate} doneText="Save"/>;
			case 'statement':
				return <ProfileStatement onInfoGathered={this.onProfileUpdate} doneText="Save"/>;
			case 'languages':
				return <ProfileLanguages onInfoGathered={this.onProfileUpdate} doneText="Save"/>;
			case 'workingHours':
				return <ProfileHours onInfoGathered={this.onProfileUpdate} doneText="Save"/>;
			case 'businessInfo':
				return <ProfileBusiness onInfoGathered={this.onProfileUpdate} doneText="Save"/>;
			case 'photos':
				return (
					<div>
						<ProfilePhotos imagesAdded={this.onPhotosAdded} imageDeleted={this.onPhotoDeleted} destination={this.state.photos}/>
						<div className="proceed">
							<button className="button" type="button" onClick={this.photosUpdated}
							        disabled={
							        	(this.state.photos && !this.state.photos.length) ||
							        	this.props.profile.inflight
							        }
							>
								Save
							</button>
						</div>
					</div>
				);
			default:
				this.editDone();
		}
	}

	onPhotoDeleted(image) {
		let newPhotoObject = {
			photos: _.reject(this.state.photos, (item: any) => (image.preview && item.preview === image.preview) || (image.id && item.id === image.id)),
			deletedPhotos: [].concat(this.state.deletedPhotos),
			newPhotos: [].concat(this.state.newPhotos)
		};

		if(image.id) {
			newPhotoObject.deletedPhotos = _.uniq([image.id].concat(newPhotoObject.deletedPhotos))
		} else {
			newPhotoObject.newPhotos = _.reject(newPhotoObject.newPhotos, (item: any) => image.preview && item.preview === image.preview)
		}

		this.setState(Object.assign({}, this.state, newPhotoObject));
	}

	onPhotosAdded(acceptedFiles) {
		this.setState(Object.assign({}, this.state, {
			photos: _.uniq(this.state.photos.concat(acceptedFiles)),
			newPhotos: _.uniq(this.state.newPhotos.concat(acceptedFiles))
		}));
	}

	photosUpdated() {
		if(this.state.deletedPhotos.length) {
			this.props.dispatch(ProfileActionCreators.profilePhotosRemove(this.state.deletedPhotos, !this.state.newPhotos.length));
		}

		if(this.state.newPhotos.length) {
			this.props.dispatch(ProfileActionCreators.profilePhotosUpload(this.state.newPhotos));
		}
	}

	onProfileUpdate(data) {
		console.warn('onProfileUpdate');
		console.warn(data);
		this.props.dispatch(ProfileActionCreators.profileDetailsSave(data));
	}

	getSpecialDisplayField(field) {
		let method = UtilHelper.toCamel(field, 'Display', '_get');
		return this[method] ? this[method]() : '';
	}

	_getLanguagesDisplay() {
		return _.pluck(this.props.detailedInfo.languages, 'displayName').join(', ');
	}

	_getWorkingHoursDisplay() {
		let countOpened = _.filter(this.props.detailedInfo.workingHours, (item: any) => !item.closed).length;
		return `${countOpened} ${inflection.inflect('working day', countOpened)}.`;
	}

	_getBusinessInfoDisplay() {
		return this.props.detailedInfo.address ? (
			<div dangerouslySetInnerHTML={{__html: this.props.detailedInfo.address.replace(/\n/g, '<br/>')}}></div>
		) : '';
	}

	_getPrimaryPhoto(): any {
		return (_.findWhere(this.props.user.photos, { primary: true }) || {
			url: Config.noImagePath
		})
	}

	render() {
		return (
			<div className="section profile-section">
				<div className="section-title">
					My Profile
				</div>
                <br/>
				<div className="block-title hidden">
					<span>
						{this.props.detailedInfo.completeness || 0}% complete
					</span>
					<i className="fa fa-info-circle" data-open="completeness-recommendations-modal"></i>

					<div className="reveal" id="completeness-recommendations-modal" data-reveal="">
						<h1>Profile Recommendations</h1>
						{
							_.map(this.props.detailedInfo.completenessRecommendation, (recommendation: any) => {
								return (
									<div className="callout warning" key={recommendation}>
										{recommendation}
									</div>
								)
							})
						}
						<button className="close-button" data-close="" type="button">
							<span>&times;</span>
						</button>
					</div>

				</div>

				{
					this.state.currentEdit ? (
						<div className="base-form">
							<div className="back" onClick={this.editDone}>
								<i className="fa fa-chevron-left" aria-hidden="true"></i>
								<span>
									Cancel
								</span>
							</div>
							{this.getCurrentEditForm()}

							{
								_.map(this.props.profile.errors, (error: string) => {
									return <FormError error={error} key={error}/>
								})
							}

							<Spinner active={this.props.profile.inflight}/>

						</div>
					) : (

						<div className="base-form padded">
							<div className="editable-blocks">

								<div className="block photo-block">
									<div className="flexible" onClick={this.editEnable.bind(this, 'photos')}>
										<div className="flexible-child">
											<img src={UtilHelper.imgPrefixed(this._getPrimaryPhoto().url)} />
										</div>
										<div className="flexible-child full title-child vertical-align">
											<span>
												Photos
											</span>
										</div>
										<div className="edit-trigger flexible-child vertical-align">
											<i className="fa fa-chevron-right"></i>
										</div>
									</div>
								</div>

								{
									_.map(editableBlocks, (displayName, field) => {
										return (
											<div className="block" key={displayName + field}>

												<div className="title">
													{displayName}
												</div>

												<div className="flexible" onClick={this.editEnable.bind(this, field)}>
													<div className="content flexible-child full ellipsed">
														{
															_.isArray(this.props.detailedInfo[field]) || _.isObject(this.props.detailedInfo[field]) ||
																!this.props.detailedInfo[field] ?
																	this.getSpecialDisplayField(field) : this.props.detailedInfo[field]
														}
													</div>
													<div className="edit-trigger flexible-child ellipsed">
														<i className="fa fa-chevron-right"></i>
													</div>
												</div>
											</div>
										)
									})
								}
							</div>
						</div>
					)
				}
			</div>
		);
	}

	static mapStateToProps(state) {
		return {
			user: state.auth.user || {},
			detailedInfo: state.auth.user.detailedInfo || {},
			profile: state.profile
		}
	}
}

export default connect(Profile.mapStateToProps)(Profile);