import * as React from 'react';
import RegisterStepPropsInterface from '../../interfaces/registerStepProps.interface';
import {connect} from 'react-redux';
import {AuthActionsCreators} from '../../../auth/auth.actions';
import Spinner from '../../../spinner/spinner.container';
import Binder from '../../../../helpers/binder.helper';
import * as _ from 'underscore';
import Config from '../../../app/app.config';
import * as ReactSelect from 'react-select';

let autoBind = require('react-autobind');

class RegisterSpeciality extends React.Component<any, any> {

	constructor(props) {
		super(props);
		autoBind(this);
	}

	componentWillMount() {
		this.setState(this.props.auth.register.speciality.data);
		this.props.dispatch(AuthActionsCreators.getProfessions());
	}

	componentDidUpdate() {

		if(this.props.auth.register.speciality.availableZipsUpdated) {
			this.props.dispatch(AuthActionsCreators.zipsReceivedDone());

			this._checkSuggestedZips(this.props.auth.register.speciality.availableZips);
		}

		if(this.props.auth.register.speciality.coordinatesRetrieved) {
			this.setState({
				location: this.props.auth.register.speciality.data.location,
				inflight: false
			});

			this.props.dispatch(AuthActionsCreators.receivedZipCoordinatesDone());
			this.checkZipCode();
		}

		if(this.props.auth.register.speciality.showManualZip) {
			this.setState({
				manualZip: true,
				zipCode: this.props.auth.register.speciality.data.zipCode,
				location: this.props.auth.register.speciality.data.location
			});

			this.props.dispatch(AuthActionsCreators.registerShowManualZipDone());
		}

		if(this.props.auth.register.shouldNavigateNextStep) {
			this.props.dispatch(AuthActionsCreators.registerNavigateStepDone());
			this._navigateNextStep(this.state);
		}

		if(this.state.inflight && this.props.auth.errors.length) {
			this.setState({
				inflight: false
			});
		}

		if(!this.state.currentProfession && this.state.profession) {
			this.setState({
				currentProfession: this._findSpecialityById(this.state.profession)
			})
		}
	}

	private _checkSuggestedZips(suggestedZips) {

		let stateUpdateConfig = {
			inflight: false
		};

		if(suggestedZips.length === 1) {

			this._navigateNextStep(Object.assign({}, this.state, {
				zipCode: suggestedZips[0].id
			}));
		} else if(suggestedZips.length > 1) {

			stateUpdateConfig = Object.assign({}, stateUpdateConfig, {
				suggestedZips,
				showSuggestedZips: true,
				suggestedZipSelected: null
			});
		}

		this.setState(stateUpdateConfig)
	}

	private _findSpecialityById(specialityId) {
		let allProfessions = _.reduce(this.props.auth.register.speciality.professions, (memo: any, group: any) => {
			[].push.apply(memo, group.items);
			return memo;
		}, []);

		return _.findWhere(allProfessions, { id: specialityId });
	}

	onSpecialityChange(event: any) {
		this.setState({
			profession: event.target.value,
			professionSpecialInfo: '',
			currentProfession: this._findSpecialityById(event.target.value),
			subProfessions: ''
		});
	}

	useGeolocation() {
		navigator.geolocation.getCurrentPosition(this._handleGeolocationApprove);
	}

	private _handleGeolocationApprove(position) {
		this.props.dispatch(AuthActionsCreators.authResetErrors());

		this.setState({
			location: {
				latitude:  position.coords.latitude,
				longitude: position.coords.longitude
			}
		});
		this.props.dispatch(AuthActionsCreators.getLocationZip(position.coords));
	}

	setManualZip() {
		this.setState({
			manualZip: true,
			zipCode: '',
			location: {}
		})
	}

	checkZipCode(event?) {
		event ? event.preventDefault() : '';

		this.props.dispatch(AuthActionsCreators.authResetErrors());

		if(!Config['zipCodeRegex.final'].test(this.state.zipCode) || !this.state.zipCode.length) {
			this.props.dispatch(AuthActionsCreators.authFailed('Please enter valid zip code.'));
			return;
		}

		this.setState({
			inflight: true
		});

		if(this.state.location.longitude && this.state.location.latitude) {
			this.props.dispatch(AuthActionsCreators.checkApiZipcode(this.state.zipCode));
		} else {
			this.props.dispatch(AuthActionsCreators.getZipLocation(this.state.zipCode))
		}
	}

	dontKnowZip() {
		this.setState({
			manualZip: false
		});

		this.props.dispatch(AuthActionsCreators.authResetErrors());
	}

	useSuggestedZip() {
		this.setState({
			showSuggestedZips: false
		});

		let selectedZip = this.state.suggestedZipSelected || this.state.suggestedZips[0].id;

		this._navigateNextStep(Object.assign({}, this.state, {
			zipCode: selectedZip
		}));
	}

	onSuggestedZipChanged(event) {
		this.setState({
			suggestedZipSelected: event.target.value
		});
	}

	resetSuggestions(event) {
		event.preventDefault();

		this.setState({
			showSuggestedZips: false
		});
	}

	professionIsCustom() {
		return this.state.currentProfession && this.state.currentProfession.hasCustomInformation;
	}

	private _checkOtherSpeciality() {
		return !(this.professionIsCustom() && (!this.state.professionSpecialInfo || this.state.professionSpecialInfo.length < 3));
	}

	private _checkSpeciality() {
		return !!this.state.currentProfession;
	}

	private _navigateNextStep(data) {
		if(!this._checkSpeciality() || !this._checkOtherSpeciality()) {
			this.props.dispatch(AuthActionsCreators.authFailed('Please fill out all fields.'));

			this.setState({
				inflight: false,
				showSuggestedZips: false
			});

			return;
		}

		this.props.navigateNextStep(data);
	}

	private subProfessionsChanged(subProfessions) {
		this.setState(Object.assign({}, this.state, {
			subProfessions: subProfessions
		}))
	}

	private getPreparedAdditionalPracticeAreas() {
		return _.map(this.state.currentProfession.subProfessions, (subProfession: any) => {
			return {
				value: subProfession.id,
				label: subProfession.displayName
			};
		})
	}

	render() {

		let locationType = this.state.manualZip ? (
			<div className="manuzl-zip">
				<form onSubmit={this.checkZipCode}>

					<input type="text"
					       value={this.state.zipCode}
					       onChange={Binder.initInput.bind({}, this, 'zipCode', Config['zipCodeRegex.change'])}
					       required
					       placeholder="Zip Code"
					/>

					<button className="button" type="submit">
						Continue
					</button>

					<div className="text-center">
						<a className="trigger" onClick={this.dontKnowZip}>
							Don't Know My Zip
						</a>
					</div>
				</form>
			</div>
		) : (
			<div className="controls">
				{ navigator.geolocation ? (
					<button className="button" onClick={this.useGeolocation}>
						Use My Current Location
					</button>
				) : '' }
				<button className="button" onClick={this.setManualZip}>
					I Will Enter My Zip Code
				</button>
			</div>
		);

		return (
			<div className="register-speciality">
				<div className="row">
					<div className="small-12 columns">
						<label>Choose Primary Practice
							<select name="speciality"
							        onChange={this.onSpecialityChange}
							        value={this.state.profession}
							>
								<option value={null}>Select One...</option>

								{
									_.map(this.props.auth.register.speciality.professions, function (group: any, index: number) {
										return (
											<optgroup label={group.displayName} key={index}>
												{
													_.map(group.items, function (profession: any, index: number) {
														return <option value={profession.id}
														               key={index}>{profession.displayName}</option>;
													})
												}
											</optgroup>
										)
									})
								}
							</select>
						</label>

						{
							this.state.currentProfession && this.state.currentProfession.subProfessions && this.state.currentProfession.subProfessions.length ? (
								<div className="columns small-12" key="insurance-plans-field">
									<label>Additional Practice Areas
										<ReactSelect
											name="form-field-name"
											multi={true}
											delimiter=", "
											simpleValue={true}
											joinValues={true}
											value={this.state.subProfessions}
											options={this.getPreparedAdditionalPracticeAreas()}
											onChange={this.subProfessionsChanged}
											placeholder=""
										/>
									</label>
								</div>
							) : ''
						}

						{
							this.professionIsCustom() ? (
								<input type="text" value={this.state.professionSpecialInfo}
								       placeholder="Custom profession"
								       onChange={Binder.initInput.bind({}, this, 'professionSpecialInfo')} required
								/>
							) : ''
						}

						{
							this.state.disable && this.state.currentProfession && this.state.currentProfession.pricing ? (
								<div className="description offer">
									{/*
									${this.state.currentProfession.pricing.reservation} refundable deposit to reserve your spot now.
									Deposit goes towards your annual fee of ${this.state.currentProfession.pricing.annual}, due within 45 days.
									Quarterly payments available.

									Congratulations and thank you. Your first-year Charter Member price is ${this.state.currentProfession.pricing.reservation}

									Special Limited Offer! Pay only a $39 start up fee with no service charge for six months, and then a
									$199 flat fee for the following six months.
									 */}
									<h4>Charter Subscriber Lifetime Offer</h4>
									<p><strong>Reserve your GEO limited-exclusivity now and pay:</strong></p>
									<p>$39.00 set up fee for your Personal Profile and Business Dashboard</p>
									<p><strong>First 6 months no charge!</strong></p>
									<p>Then pay a $199.00 annual fee every year as a</p>
									<p><strong>Life-Time Charter-Member Subscriber.</strong></p>
								</div>
							) : ''
						}

						<div className="description">
							GPROSPlus&trade; needs your location to give you limited geographic exclusivity.
						</div>

						{ !this.state.inflight && !this.state.showSuggestedZips ? locationType : <Spinner active={this.state.inflight}/> }

						{
							this.state.showSuggestedZips ? (
								<div className="suggested-zips">

									<label>Select suggested location
										<select name="speciality"
										        onChange={this.onSuggestedZipChanged}
										        value={this.state.suggestedZipSelected || ''}
										>
											{
												_.map(this.state.suggestedZips, function (zip: any, index: number) {
													return <option value={zip.id} key={index}>{zip.state} - {zip.city}</option>;
												})
											}
										</select>
									</label>

									<button className="button" onClick={this.useSuggestedZip}>
										Use Selected Location
									</button>

									<div className="text-center">
										<a className="trigger" onClick={this.resetSuggestions}>
											Reset Suggestions
										</a>
									</div>
								</div>
							) : ''
						}

					</div>
				</div>
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

export default connect(RegisterSpeciality.mapStateToProps)(RegisterSpeciality);