import * as React from 'react';
import {connect} from 'react-redux';
import Logo from '../common/logo/logo';
import MultiStepForm from '../multiStepForm/multiStepForm.container';
import {ProfileStartStateClass} from './classes/profileStartState.class';
import Spinner from '../spinner/spinner.container';
import {ProfileActionCreators} from '../profile/profile.actions';
import FormError from '../formError/formError.container';
import ProfileStartPhotos from './components/profileStartPhotos/profileStartPhotos.container';
import ProfileStartBusinessInfo from './components/profileStartBusinessInfo/profileStartBusinessInfo.container';
import ProfileStartEducation from './components/profileStartEducation/profileStartEducation.container';
import ProfileStartCertifications from './components/profileStartCertifications/profileStartCertifications.container';
import ProfileStartStatement from './components/profileStartStatement/profileStartStatement.container';
import ProfileStartLanguages from './components/profileStartLanguages/profileStartLanguages.container';
import ProfileStartHours from './components/profileStartHours/profileStartHours.container';
import ProfileStartWelcome from './components/profileStartWelcome/profileStartWelcome.container';
import ProfileStartPayment from './components/profileStartPayment/profileStartPayment.container';
import ProfileStartInsurancePlans from './components/profileStartInsurancePlans/profileStartInsurancePlans.container';
import ProfileStartSpecialDiscounts from './components/profileStartSpecialDiscounts/profileStartSpecialDiscounts.container';
import ProfileStartCommunityService from './components/profileStartCommunityService/profileStartCommunityService.container';

let autoBind = require('react-autobind');

class ProfileStart extends React.Component<any, ProfileStartStateClass> {

	constructor(props) {
		super(props);
		autoBind(this);
	}

	componentWillReceiveProps(newProps) {
		if(!this.props.profile.photosUploaded && newProps.profile.photosUploaded) {
			this.navigateNextStep();
		}

		if(!this.props.profile.nextInfoStep && newProps.profile.nextInfoStep) {
			this.props.dispatch(ProfileActionCreators.profileInfoNextStepDone());
			this.navigateNextStep();
		}

		if(!this.props.user.detailedInfoGathered && newProps.user.detailedInfoGathered) {
			this.props.router.push({
				pathname: '/',
				query: { noRedirect: true }
			});
		}
	}

	componentWillMount() {
		this._resetLocalState();
	}

	private _resetLocalState() {
		this.setState(new ProfileStartStateClass());
	}

	navigateNextStep() {
		this.setState(Object.assign({}, this.state, {
			currentStep: ++this.state.currentStep
		}))
	}

	profilePhotosDone(data?) {
		this.props.dispatch(ProfileActionCreators.profilePhotosUpload(data));
	}

	updateProfileInfo(data?) {
		this.props.dispatch(ProfileActionCreators.profileDetailsSave(data));
	}

	profileStatementDone(data?) {
		this.props.dispatch(ProfileActionCreators.profileDetailsSave(data, this.props.user.profession.id));
	}

	profilePaymentDone(data?) {
	}

	render() {
		return (
			<div className="profile-start base-form with-header-image">

				<div>
					<div className="header" style={
					{
						backgroundImage: 'url(' + require('../../assets/images/blue-faceted-pattern-top.jpg') + ')'
					}
				}></div>


					{
						this.state.currentStep > 1 && this.state.currentStep < 11 ? (
							<div>
								<Logo />
								<div className="title top">
									Profile Setup
								</div>
							</div>
						) :
						(
							<Logo image="logo.svg" />
						)
					}

					<MultiStepForm currentStep={this.state.currentStep}>
						<ProfileStartWelcome navigateNextStep={this.navigateNextStep}/>
						<ProfileStartPhotos navigateNextStep={this.profilePhotosDone} />
						<ProfileStartBusinessInfo navigateNextStep={this.updateProfileInfo} />
						<ProfileStartInsurancePlans navigateNextStep={this.updateProfileInfo} />
						<ProfileStartEducation navigateNextStep={this.updateProfileInfo} />
						<ProfileStartCertifications navigateNextStep={this.updateProfileInfo} />
						<ProfileStartLanguages navigateNextStep={this.updateProfileInfo} />
						<ProfileStartHours navigateNextStep={this.updateProfileInfo} />
						<ProfileStartSpecialDiscounts navigateNextStep={this.updateProfileInfo} />
						<ProfileStartCommunityService navigateNextStep={this.updateProfileInfo} />
						<ProfileStartStatement navigateNextStep={this.profileStatementDone} />
						<ProfileStartPayment navigateNextStep={this.profilePaymentDone} />
					</MultiStepForm>

					<Spinner active={this.props.profile.inflight} />

					{
						this.props.profile.errors.map((error: string) => {
							return (
								<FormError key={error} error={error} />
							)
						})
					}
				</div>

				<div className="footer" style={
					{
						backgroundImage: 'url(' + require('../../assets/images/line-of-people.jpg') + ')'
					}
				}></div>

			</div>
		);
	}

	static mapStateToProps(state) {
		return {
			user:    state.auth.user,
			profile: state.profile
		}
	}
}

export default connect(ProfileStart.mapStateToProps)(ProfileStart);