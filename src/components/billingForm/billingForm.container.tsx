import * as React from 'react';
import Binder from '../../helpers/binder.helper';
import {connect} from 'react-redux';
import {AuthActionsCreators} from '../auth/auth.actions';
import * as _ from 'underscore';
import Util from '../../helpers/util.helper';
import * as ReactSelect from 'react-select';
import {BillingFormStateClass} from './classes/billingFormState.class';
import {BillingFormProps} from './interfaces/billingFormProps.interface';
import Spinner from '../spinner/spinner.container';

let MaskedInput = require('react-input-mask');
let autoBind = require('react-autobind');


class BillingForm extends React.Component<any, BillingFormStateClass> {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillMount() {
        this.setState(new BillingFormStateClass());
    }

    validateInputs() {
        let result = true;

        if (!this.state.billingPlan) {
            this.props.dispatch(AuthActionsCreators.authFailed('Please choose a Plan.'));
            return false;
        }

        _.each(['creditCard', 'cvv', 'expiration', 'zip'], field => !this.state[field] ? result = false : null);

        if (!result) {
            this.props.dispatch(AuthActionsCreators.authFailed('Please fill all fields.'));
        }

        return result;
    }

    getBillingToken(event) {
        event.preventDefault();

        if (this.state.type === Util.USER_TYPE.Free) {
            const data = Object.assign({}, this.state, this.props);
            this.props.tokenReceivedHandler(data);
        } else {
            if (!this.validateInputs()) {
                return;
            }

            this.setState({
                inflight: true
            });

            let expiration = this.state.expiration.split('/');

            Stripe.card.createToken({
                number: this.state.creditCard,
                cvc: this.state.cvv,
                exp_month: expiration[0],
                exp_year: expiration[1],
                address_zip: this.state.zip
            }, this.stripeTokenReceived.bind(this));
        }
    }

    stripeTokenReceived(status, response) {
        this.setState({
            inflight: false
        });

        if (response.error) {
            this.props.dispatch(AuthActionsCreators.billingTokenFail(response.error.message));
            return;
        }

        this.setState({
            stripeToken: response.id
        });

        const data = Object.assign({}, this.state, this.props);
        this.props.tokenReceivedHandler(data);
    }

    onTypeSelected(event) {
        let billingPlan = '';
        if (event.currentTarget.value == Util.USER_TYPE.Paid) {
            billingPlan = 'special_offer';
        }

        this.setState({
            type: parseInt(event.currentTarget.value),
            billingPlan: billingPlan
        });
    }

    render() {

        return (
            <form onSubmit={this.getBillingToken} className="auth-form register billing-form">
                <div className="row">
                    <div className="small-12 large-12 columns">
                        {
                            _.map(this.props.advancedFields, (field: string) => {
                                let fieldGenerator = Util.toCamel(field, 'Field', 'get');

                                return this[fieldGenerator] ? this[fieldGenerator]() : '';
                            })
                        }
                        <div className="sign-up-text">

                            <div className="row">
                                <div className="small-1 large-1 columns cell">
                                    <input type="radio" name="type"
                                         value={Util.USER_TYPE.Free}
                                         checked={this.state.type === Util.USER_TYPE.Free}
                                         onChange={this.onTypeSelected} />
                                </div>
                                <div className="small-10 large-11 columns">
                                    <b>
                                    FREE GPROSplus&trade; Profile Listing and Dashboard <br/>
                                    with Limited Exclusivity.
                                    </b>
                                </div>
                            </div>
                            <br/>
                            <div className="row">
                                <div className="small-1 large-1 columns cell">
                                    <input type="radio" name="type"
                                           value={Util.USER_TYPE.Paid}
                                           checked={this.state.type === Util.USER_TYPE.Paid}
                                           onChange={this.onTypeSelected} />
                                </div>
                                <div className="small-10 large-11 columns">
                                    <b>
                                    GPROSlive&trade; Special Offer. Upgrade to GPROSlive&trade; <br/>
                                    Premium &amp; Value Services for one low, monthly fee of <br/>
                                    $19.95.<br/>
                                    </b>
                                    12 month commitment with a 60 day cancellation
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="background-line"></div>
                <p>&nbsp;</p>

                {
                    this.state.type === Util.USER_TYPE.Paid ? (
                        <div>
                            <div className="row">
                                <div className="small-12 large-6 available-billing-cards">
                                    <img src={require('../../assets/images/cc.png')}/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="small-12 large-6">
                                    <MaskedInput mask="9999 9999 9999 9999 9999"
                                                 maskChar={null}
                                                 value={this.state.creditCard}
                                                 onChange={Binder.initInput.bind({}, this, 'creditCard',)} required
                                                 className="masked"
                                                 placeholder="Credit Card Number"
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="flexible small-12 large-6">
                                    <MaskedInput mask="99/9999"
                                                 maskChar={null}
                                                 value={this.state.expiration}
                                                 onChange={Binder.initInput.bind({}, this, 'expiration',)} required
                                                 className="flexible-child masked"
                                                 placeholder="MM/YY"
                                    />
                                    <MaskedInput mask="9999"
                                                 maskChar={null}
                                                 value={this.state.cvv}
                                                 onChange={Binder.initInput.bind({}, this, 'cvv',)} required
                                                 className="flexible-child masked"
                                                 placeholder="CVV"
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="small-12 large-6">
                                    <MaskedInput mask="99999"
                                                 maskChar={null}
                                                 value={this.state.zip}
                                                 onChange={Binder.initInput.bind({}, this, 'zip',)} required
                                                 className="masked"
                                                 placeholder="Zip Code"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : ''
                }

                <div>
                    <button className="button" type="submit">
                        {
                            this.props.submitText ? this.props.submitText : 'Get Started!'
                        }
                    </button>
                </div>

                <Spinner active={this.state.inflight}/>

            </form>
        );
    }

    static mapStateToProps(state, ownProps: BillingFormProps) {
        return {
            auth: state.auth
        }
    }
}

export default connect(BillingForm.mapStateToProps)(BillingForm);