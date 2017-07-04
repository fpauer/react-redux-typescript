import * as React from 'react';
import {connect} from 'react-redux';
import {ProfileBusinessInfoPropsInterface} from './interfaces/profileBusinessInfoProps.interface';
import {ProfileBusinessInfoClass} from './classes/profileBusinessInfoState.class';
import UtilHelper from '../../helpers/util.helper';
import Binder from '../../helpers/binder.helper';
import EditableTextarea from '../editableTextarea/editableTextarea.container';
import EditableInput from '../editableInput/editableInput.container';
import * as ReactSelect from 'react-select';
import * as _ from 'underscore';
import {ProfileActionCreators} from "../profile/profile.actions";

let autoBind = require('react-autobind');
let MaskedInput = require('react-input-mask');

const availableFields = {
	businessName:       'Business Name',
	address:            'Business Address',
    phoneBook:          'Phones',
	email:              'Email Address',
	website:            'Main Website (optional)'
};

class ProfileStartBusinessInfo extends React.Component<any, ProfileBusinessInfoClass> {

	constructor(props) {
		super(props);
		autoBind(this);
	}

	componentWillMount() {
		this._setBlankState();
	}

	private _setBlankState() {
		this.setState(new ProfileBusinessInfoClass(!_.isEmpty(this.props.detailedInfo) ? this.props.detailedInfo : false));
	}

	editEnable(key: string) {
		this.setState(Object.assign({}, this.state, {
			currentEdit: key
		}))
	}
	onEditDone() {
		this.setState(Object.assign({}, this.state, {
			currentEdit: ''
		}))
	}

	onFormDone() {
	    const data = {
            businessName:       this.state.businessName,
            address:            this.state.address,
            email:              this.state.email,
            phones:             this.state.phones,
			website:            this.state.website,
        };
        this.props.onInfoGathered.bind(this, data, availableFields)();
    }

	private _getCurrentEditField() {
		let fieldGetter = UtilHelper.toCamel(this.state.currentEdit, 'EditField', '_get');
		return this[fieldGetter] ? this[fieldGetter]() : 'Create field getter for ' + this.state.currentEdit;
	}

	private _getEditableTextAreaField() {
		return <EditableTextarea
			value={this.state[this.state.currentEdit]}
			onChange={Binder.initInput.bind({}, this, this.state.currentEdit)}
			onDone={this.onEditDone}
		    title={availableFields[this.state.currentEdit]}
		/>;
	}

	private _getEditableInputField(type?: string) {
		return <EditableInput
			value={this.state[this.state.currentEdit]}
			onChange={Binder.initInput.bind({}, this, this.state.currentEdit)}
			onDone={this.onEditDone}
			title={availableFields[this.state.currentEdit]}
		    type={type}
		/>;
	}

    private _getPhonesField() {
        let options = [
            {value: 'Phone', label: 'Phone'},
            {value: 'Fax', label: 'Fax'},
            {value: 'Mobile', label: 'Mobile'}
        ];

        return (
            <div className="columns small-12" key="insurance-plans-field">
                <label>Phone numbers</label>
                <div className="row">
                    <div className="small-4 large-3 columns">
                        <ReactSelect
                            name="select-phone-type"
                            delimiter=", "
                            simpleValue={true}
                            joinValues={true}
                            options={options}
                            placeholder=""
                            onChange={this.phoneTypeChanged}
                            value={this.state.phoneType}
                        />
                    </div>
                    <div className="small-6 large-6 columns">
                        {this._getPhoneInputField()}
                    </div>
                    <div className="small-2 large-3 columns">
                        <button className="button" type="button" onClick={this.addPhone}>
                             Add
                        </button>
                    </div>
                </div>


                {this.state.phones.map((phone, index) => {
                   return this.phoneRow(phone, index);
                })}

                <div className="proceed">
                    <button className="button" type="button" onClick={this.onEditDone}>
                        Done
                    </button>
                </div>

            </div>
        );
    }

    private _getPhoneInputField() {
        return <MaskedInput
            mask='999-999-9999'
            maskChar={null}
            value={this.state.phoneNumber}
            onChange={Binder.initInput.bind({}, this, 'phoneNumber')}
            className="masked"
        />;
    }

    private phoneRow(phone, index) {
        return <div className="row" key={index}>
            <div className="small-4 large-3 columns">
                {phone.type}
            </div>
            <div className="small-6 large-6 columns">
                {phone.number}
            </div>
            <div className="small-2 large-3 columns">
                <button className="button" type="button" onClick={this.removePhone.bind(this, index)} >
                    Remove
                </button>
            </div>
        </div>
    }

	private _getBusinessNameEditField() {
		return this._getEditableInputField();
	}

	private _getAddressEditField() {
		return this._getEditableTextAreaField();
	}

	private _getPhoneBookEditField() {
		return this._getPhonesField();
	}

	private _getEmailEditField() {
		return this._getEditableInputField('email');
	}

	private _getWebsiteEditField() {
		return this._getEditableInputField('website');
	}

	render() {

		return (
			<div className="profile-business padded">
				<div className="title">
					Business Info
				</div>
				{
					!this.state.currentEdit ? (
						<div>
							<div className="editable-blocks">

								{
									_.map(availableFields, (displayName, field) => {
										return (
											<div className="block" key={`${displayName}-${field}`}>
												<div className="title">
													{displayName}
												</div>
												<div className="flexible" onClick={this.editEnable.bind(this, field)}>
													<div className="content flexible-child full"
													     dangerouslySetInnerHTML={{__html: this.state[field].replace(/\n/g, '<br/>')}}
													></div>
													<div className="edit-trigger flexible-child">
														<i className="fa fa-chevron-right"></i>
													</div>
												</div>
											</div>
										);
									})
								}

							</div>

							<div className="proceed">
								<button className="button" type="button" onClick={this.onFormDone}>
									{this.props.doneText || 'Next'}
								</button>
							</div>

						</div>
					) : this._getCurrentEditField()
				}

			</div>
		);
	}

    phoneTypeChanged(phoneType) {
        this.setState(Object.assign({}, this.state, {phoneType}));
    }

    addPhone() {
	    if (this.state.phoneType && this.state.phoneNumber) {
            const phone = {type: this.state.phoneType, number: this.state.phoneNumber};
            const phones = this.state.phones.concat(phone);
            this.setState(Object.assign({}, this.state, {
                phones: phones, phoneType:'', phoneNumber:'', phoneBook: this.buildPhoneBook(phones)
            }));
        } else {
            this.props.dispatch(ProfileActionCreators.profileErrors(['Please fill out all information.']));
        }
    }

    removePhone(index) {
        const phones = this.state.phones;
        phones.splice(index, 1);
        this.setState(Object.assign({}, this.state, {phones: phones, phoneBook: this.buildPhoneBook(phones)}));
    }

    buildPhoneBook(phones) {
        return phones.reduce((book, phone) => {
            return book + [phone.type, ': ', phone.number, ", "].join('');
        }, '');
    }

	static mapStateToProps(state, ownProps: ProfileBusinessInfoPropsInterface) {
		return {
			profile: state.profile,
			detailedInfo: state.auth.user.detailedInfo || {}
		}
	}

}

export default connect(ProfileStartBusinessInfo.mapStateToProps)(ProfileStartBusinessInfo);