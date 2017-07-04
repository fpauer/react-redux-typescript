import * as React from 'react';
import Logo from '../common/logo/logo';
import {connect} from 'react-redux';
import {AuthActionsCreators} from '../auth/auth.actions';
import MultiStepForm from '../multiStepForm/multiStepForm.container';
import RegisterSpecialityStep from './components/register-speciality/registerSpeciality.container';
import RegisterProfileStep from './components/register-profile/registerProfile.container';
import RegisterBillingStep from './components/register-billing/registerBilling.container';
let autoBind = require('react-autobind');

class Register extends React.Component<any, {}> {

	constructor(props) {
		super(props);
		autoBind(this);
	}

	componentWillMount() {
		this.props.dispatch(AuthActionsCreators.resetAuth());
	}

	navigateNextStep() {
		this.props.dispatch(AuthActionsCreators.registerNavigateNextStep());
	}

	navigatePrevStep() {
		this.props.dispatch(AuthActionsCreators.registerNavigatePrevStep());
	}

	professionStepDone(data?) {
		this.props.dispatch(AuthActionsCreators.prefessionStepDone(data));
		this.navigateNextStep();
	}

	profileStepDone(data?, event?) {
		if(event) event.preventDefault();
		this.props.dispatch(AuthActionsCreators.profileStepDone(data));
		this.props.dispatch(AuthActionsCreators.processRegister(this.props.auth.register));
	}

	billingStepDone() {
		this.props.dispatch(AuthActionsCreators.processRegister(this.props.auth.register));
	}

	cancelRegister() {
		this.props.dispatch(AuthActionsCreators.cancelRegister());
		this.props.router.push('/auth/login');
	}

	render() {
		return (
			<div className="register with-header-image">

				<div>
					<div className="header" style={
					{
						backgroundImage: 'url(' + require('../../assets/images/blue-faceted-pattern-top.jpg') + ')'
					}
				}></div>

					<Logo />

					<div className="title background-line">
						<span>Sign up</span>
					</div>

					<div className="cancel-btn">
						<a className="trigger" onClick={this.cancelRegister}>Cancel</a>
					</div>

					{
						this.props.auth.register.registerStep && !this.props.auth.register.profile.partialUserCreated ? (
							<div className="back-btn">
								<a className="trigger" onClick={this.navigatePrevStep}>Back</a>
							</div>
						) : ''
					}

					<MultiStepForm currentStep={this.props.auth.register.registerStep}>
						<RegisterSpecialityStep navigateNextStep={this.professionStepDone} />
						<RegisterProfileStep navigateNextStep={this.profileStepDone} />
						<RegisterBillingStep navigateNextStep={this.billingStepDone}/>
					</MultiStepForm>
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
			auth: state.auth
		}
	}
}

export default connect(Register.mapStateToProps)(Register);