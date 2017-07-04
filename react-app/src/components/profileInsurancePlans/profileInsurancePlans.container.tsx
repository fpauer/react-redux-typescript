import * as React from 'react';
import {connect} from 'react-redux';
import {ProfileInsurancePlansPropsInterface} from './interfaces/profileInsurancePlansProps.interface';
import {ProfileInsurancePlansStateClass} from './classes/profileInsurancePlansState.class';
import * as ReactSelect from 'react-select';

let autoBind = require('react-autobind');

class ProfileInsurancePlans extends React.Component<any, any> {

	constructor(props) {
		super(props);
		autoBind(this);
	}

	componentWillMount() {
		this._setBlankState();
	}

	private _setBlankState() {
		this.setState(new ProfileInsurancePlansStateClass(this.props.specialInfo.insurancePlans || ''));
	}

	onDone() {
		this.props.onInfoGathered(this.state);
	}

	private _getInsurancePlansField() {

		let options = [
			{value: ':DP Smart Health', label: ':DP Smart Health'},
			{value: 'Aetna', label: 'Aetna'},
			{value: 'Affordable Family Health Services', label: 'Affordable Family Health Services'},
			{value: 'Alliance', label: 'Alliance'},
			{value: 'Ambetter', label: 'Ambetter'},
			{value: 'Amerigroup', label: 'Amerigroup'},
			{value: 'Anthem', label: 'Anthem'},
			{value: 'Argus', label: 'Argus'},
			{value: 'Av-Med, Inc.', label: 'Av-Med, Inc.'},
			{value: 'Blue Cross', label: 'Blue Cross'},
			{value: 'Blue Cross Blue Shield', label: 'Blue Cross Blue Shield'},
			{value: 'Blue Shield Of California', label: 'Blue Shield Of California'},
			{value: 'Careington', label: 'Careington'},
			{value: 'CareMore', label: 'CareMore'},
			{value: 'Celtic Insurance Company', label: 'Celtic Insurance Company'},
			{value: 'Cigna', label: 'Cigna'},
			{value: 'Coventry Health Care of Florida', label: 'Coventry Health Care of Florida'},
			{value: 'Dean Health', label: 'Dean Health'},
			{value: 'Dearborn National', label: 'Dearborn National'},
			{value: 'Delta Dental Insurance Company', label: 'Delta Dental Insurance Company'},
			{value: 'Empire Blue Cross', label: 'Empire Blue Cross'},
			{value: 'Eye Benefits', label: 'Eye Benefits'},
			{value: 'EyeMed', label: 'EyeMed'},
			{value: 'Florida Blue', label: 'Florida Blue'},
			{value: 'Florida Health Care Plan, Inc.', label: 'Florida Health Care Plan, Inc.'},
			{value: 'Freedom Life Insurance Company of America', label: 'Freedom Life Insurance Company of America'},
			{value: 'Golden Rule Insurance Company', label: 'Golden Rule Insurance Company'},
			{value: 'HCC Life Insurance Company', label: 'HCC Life Insurance Company'},
			{value: 'HCSC Health Care Service Corporation', label: 'HCSC Health Care Service Corporation'},
			{value: 'Health First Commercial Plans, Inc.', label: 'Health First Commercial Plans, Inc.'},
			{value: 'Health Options, Inc.', label: 'Health Options, Inc.'},
			{value: 'Highmark', label: 'Highmark'},
			{value: 'Humana', label: 'Humana'},
			{value: 'Idental', label: 'Idental'},
			{value: 'IHC Group', label: 'IHC Group'},
			{value: 'Independence Blue Cross IBX or IBC ', label: 'Independence Blue Cross IBX or IBC '},
			{value: 'Kaiser Permanente', label: 'Kaiser Permanente'},
			{value: 'Molina Health Care', label: 'Molina Health Care'},
			{value: 'Molina Healthcare of Florida', label: 'Molina Healthcare of Florida'},
			{value: 'National General Accident & Health', label: 'National General Accident & Health'},
			{value: 'Nationwide Life Insurance Company', label: 'Nationwide Life Insurance Company'},
			{value: 'Patriot', label: 'Patriot'},
			{value: 'Renaissance Dental', label: 'Renaissance Dental'},
			{value: 'Solstice', label: 'Solstice'},
			{value: 'Sunshine Health', label: 'Sunshine Health'},
			{value: 'Sunshine State Health Plan', label: 'Sunshine State Health Plan'},
			{value: 'Triwest', label: 'Triwest'},
			{value: 'UniCare', label: 'UniCare'},
			{value: 'United Healthcare', label: 'United Healthcare'},
			{value: 'UnitedHealthOne', label: 'UnitedHealthOne'},
			{value: 'Vision Perfect or Fusion', label: 'Vision Perfect or Fusion'},
			{value: 'Vision Plan of America', label: 'Vision Plan of America'},
			{value: 'VSP', label: 'VSP'}
		];

		return (
			<div className="columns small-12" key="insurance-plans-field">
				<label>Insurance Plans Accepted
					<ReactSelect
						name="form-field-name"
						multi={true}
						delimiter=", "
						simpleValue={true}
						joinValues={true}
						value={this.state.insurancePlans}
						options={options}
						onChange={this.insurancePlansChanged}
						placeholder=""
						required
					/>
				</label>
                <button className="button" type="button" onClick={this.onDone}>
                    Done
                </button>
			</div>
		);
	}

	insurancePlansChanged(insurancePlans) {
		this.setState(Object.assign({}, this.state, {insurancePlans: insurancePlans, currentEdit: ''}));
	}

	render() {
		return (
			<div className="profile-start-insurance-plans padded">
				{this._getInsurancePlansField()}
			</div>
		);
	}

	// We need to specify ownProps because this component has it's own props passed to it
	static mapStateToProps(state, ownProps: ProfileInsurancePlansPropsInterface) {
		return {
			profile: state.profile,
			specialInfo: state.auth.user.specialInfo || {}
		}
	}
}

export default connect(ProfileInsurancePlans.mapStateToProps)(ProfileInsurancePlans);