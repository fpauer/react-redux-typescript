import * as React from 'react';
import Binder from '../../../../helpers/binder.helper';
import {connect} from 'react-redux';
import {hashHistory} from 'react-router';
import RegisterStepPropsInterface from '../../interfaces/registerStepProps.interface';
import {RegisterProfileDataClass} from '../../classes/registerProfile.class';
import {AuthActionsCreators} from '../../../auth/auth.actions';
import * as _ from 'underscore';
import Config from '../../../app/app.config';

let autoBind = require('react-autobind');
let MaskedInput = require('react-input-mask');

class RegisterProfile extends React.Component<any, any> {

	constructor(props) {
		super(props);
		autoBind(this);
	}

	componentWillMount() {
		this.setState(this.props.auth.register.profile.data);
	}

	componentDidMount() {
		if(!this.props.auth.register.speciality.data.professionSpecialInfo) {
			this.props.dispatch(AuthActionsCreators.getPlacesAvailability(this.props.auth.register.speciality.data));
		} else {
			this.props.dispatch(AuthActionsCreators.receivedRegisterAvailability(true));
		}

		this._setCurrentCityData();
	}

	componentWillUnmount() {
		this.props.dispatch(AuthActionsCreators.resetEmailCheck());
	}

	componentDidUpdate() {
		if(this.props.auth.register.profile.emailAvailable) {
			this._navigateNextStep(false);
		}

		window['jQuery']('.auth-form.register').foundation();
	}

	private _setCurrentCityData() {
		this.setState({
			cityData: _.findWhere(this.props.auth.register.speciality.availableZips, { id: this.props.auth.register.speciality.data.zipCode })
		})
	}

	_validateFields(validationErrors) {
		let requireResult = true;
		_.each(['address', 'email', 'firstName', 'lastName', 'phone'], field => !this.state[field] ? requireResult = false : null);
		!requireResult ? validationErrors.push('Please fill all information.') : null;

		if(this.props.auth.register.profile.hasPlaces !== false) {
			!Config.passwordRegex.test(this.state.password) ? validationErrors.push('Password rules: minimum 8 characters, at least 1 uppercase alphabet, 1 lowercase alphabet and 1 number.') : null;
            !(this.state.password===this.state.passwordRepeat) ? validationErrors.push('Password does not match.') : null;
		}

		!Config.emailRegex.test(this.state.email) ? validationErrors.push('Please enter valid email.') : null;

		!Config.phoneRegex.test(this.state.phone) ? validationErrors.push('Please enter valid phone number.') : null;
	}

	_navigateNextStep(event) {
		if(event) event.preventDefault();

		let validationErrors = [];
		this._validateFields(validationErrors);
		if(validationErrors.length) {
			this.props.dispatch(AuthActionsCreators.authFailed(validationErrors));
			return;
		}

		if(!this.props.auth.register.profile.emailAvailable) {
			this.props.dispatch(AuthActionsCreators.checkEmailUnique(this.state.email));
			return;
		}

		if(!this.props.auth.register.speciality.data.professionSpecialInfo && this.props.auth.register.profile.hasPlaces !== false) {
			this.props.navigateNextStep(this.state, event);
		} else {
			this.props.dispatch(AuthActionsCreators.processRegister(Object.assign({}, this.props.auth.register, {
				profile: Object.assign({}, this.props.auth.register.profile, {
					data: this.state
				})
			})));
		}

		this.props.dispatch(AuthActionsCreators.resetEmailCheck());
	}

	_navigateLogin(event) {
		event.preventDefault();
		hashHistory.replace('/auth/login');
	}

	render() {

		let profileForm = (
			<form onSubmit={this._navigateNextStep} className="auth-form register">
				<div className="row">
					{
						!this.props.auth.register.socialRegister ? (
							<div className="columns small-12">
								<input type="email" value={this.state.email}
								       placeholder="Email"
								       onChange={Binder.initInput.bind({}, this, 'email')} required
								/>
							</div>
						) : ''
					}
					<div className="flexible columns small-12">
						<input type="text" value={this.state.firstName}
						       placeholder="First Name"
						       onChange={Binder.initInput.bind({}, this, 'firstName')} required
						       className="flexible-child"
						/>
						<input type="text" value={this.state.lastName}
						       placeholder="Last Name"
						       onChange={Binder.initInput.bind({}, this, 'lastName')} required
						       className="flexible-child"
						/>
					</div>
					<div className="columns small-12">
						<input type="text" value={this.state.address}
						       placeholder="Street Address"
						       onChange={Binder.initInput.bind({}, this, 'address')} required
						/>
					</div>
					<div className="columns small-12">
						<input type="text" value={this.state.addressDetails}
						       placeholder="Apt, Suite, Bldg (optional)"
						       onChange={Binder.initInput.bind({}, this, 'addressDetails')}
						/>
					</div>

					<div className="flexible columns small-12">
						<input type="text" value={this.state.cityData.city}
						       className="flexible-child"
						       disabled
						/>
						<input type="text" value={this.state.cityData.state}
						       className="flexible-child"
						       disabled
						/>
						<input type="text" value={this.state.cityData.code}
						       className="flexible-child"
						       disabled
						/>
					</div>

					<div className="columns small-12">
						<MaskedInput
							mask="999-999-9999"
							maskChar={null}
							value={this.state.phone}
							onChange={Binder.initInput.bind({}, this, 'phone')}
							className="masked"
							placeholder="Phone"
							required
						/>
					</div>

					{
						this.props.auth.register.profile.hasPlaces !== false ? (
							<div className="columns small-12">
								<input type="password" value={this.state.password}
								       placeholder="Create password"
								       onChange={Binder.initInput.bind({}, this, 'password')} required
								/>
								<div className="field-description">
									Password must be 8 characters or more with at least 1 uppercase letter, 1 lowercase letter, and 1 number.
								</div>
							</div>
						) : ''
					}

					{
						this.props.auth.register.profile.hasPlaces !== false ? (
								<div className="columns small-12">
									<input type="password" value={this.state.passwordRepeat}
										   placeholder="Repeat password"
										   onChange={Binder.initInput.bind({}, this, 'passwordRepeat')} required
									/>
									<div className="field-description">
										Please, repeat the password.
									</div>
								</div>
							) : ''
					}
				</div>

				<div className="description text-center">
					By selecting "Continue", you agree to GPROSPlus&trade;&nbsp;
					<a className="trigger" data-open="terms-use-modal">
						Terms of Use
					</a>
					,&nbsp;
					<a className="trigger" data-open="privacy-policy-modal">
						Privacy Policy
					</a>
					&nbsp;and&nbsp;
					<a className="trigger" data-open="participation-agreement-modal">
						Participation Agreement.
					</a>

					<div className="reveal large iframe-reveal" id="terms-use-modal" data-reveal="">
						<iframe src="http://gprosplus.net/terms/"></iframe>
						<button className="close-button" data-close="" type="button">
							<span>&times;</span>
						</button>
					</div>

					<div className="reveal large iframe-reveal" id="privacy-policy-modal" data-reveal="">
						<iframe src="http://gprosplus.net/privacy/"></iframe>
						<button className="close-button" data-close="" type="button">
							<span>&times;</span>
						</button>
					</div>

					<div className="reveal large iframe-reveal" id="participation-agreement-modal" data-reveal="">
						<iframe src="http://gprosplus.net/agreement/"></iframe>
						<button className="close-button" data-close="" type="button">
							<span>&times;</span>
						</button>
					</div>

				</div>

				<div className="proceed-static">
					<button className="button" type="submit">
						Continue
					</button>
				</div>
			</form>
		);

		let content = this.props.auth.register.profile.hasPlaces ? (
			<div className="register-profile">

				<div>
					<div className="title">
						Congratulations!
					</div>

					<div className="description">
						We have a spot available for your profession in your geographical area. Complete your registration now to reserve your market exclusivity.
					</div>
				</div>

				{profileForm}

			</div>
		) : this.props.auth.register.profile.hasPlaces === false ? (
			<div className="register-profile">
				<div className="title">
					Sorry!
				</div>

				<div className="description">
					Due to overwhelming demand, we do not currently have a spot available for your profession in your geographical area. Please complete the form below to reserve a place on our waiting list. We will notify you on a first-come-first-served basis if a position becomes available.
				</div>

				{profileForm}
			</div>
		) : '';

		return (
			<div className="register-profile">

				{
					!this.props.auth.register.profile.partialUserCreated ? content : (
						<div>
							<div className="title">
								Thanks!
							</div>

							{
								this.props.auth.register.profile.hasPlaces === false ? (
									<div className="description">
										Thanks for your interest in GPROSPlus&trade;! We will notify you as soon as a position for your profession becomes available in your geographical area.
									</div>
								) : (
									<div className="description">
										Thank you for your interest in GPROSPlus&trade;! We will review your registration and contact you within one business day.
									</div>
								)
							}

							<div className="proceed-static">
								<button className="button" type="button" onClick={this._navigateLogin}>
									Ok
								</button>
							</div>

						</div>
					)
				}
			</div>
		);
	}

	// We need to specify ownProps because this component has it's own props passed to it
	static mapStateToProps(state, ownProps: RegisterStepPropsInterface) {
		return {
			auth: state.auth
		}
	}
}

export default connect(RegisterProfile.mapStateToProps)(RegisterProfile);