import * as React from 'react';
import {connect} from 'react-redux';
import {ProfileHoursPropsInterface} from './interfaces/profileHoursProps.interface';
import {ProfileHoursStateClass} from './classes/profileHoursState.class';
import CustomTimeInput from '../customTimeInput/customTimeInput.container';
import Config from '../app/app.config';
import * as _ from 'underscore';
import * as _s from 'underscore.string';

let autoBind = require('react-autobind');

class ProfileHours extends React.Component<any, ProfileHoursStateClass> {

	constructor(props) {
		super(props);
		autoBind(this);
	}

	componentWillReceiveProps(newProps) {

		if(newProps && newProps.hours && !_.isEmpty(newProps.hours)) {
			this.setState(Object.assign({}, this.state, {
				workingHours: newProps.hours
			}))
		}
	}

	componentWillMount() {
		this._resetState();
	}

	private _resetState() {
		let newState: ProfileHoursStateClass =
			    this.props.hours && !_.isEmpty(this.props.hours) ? Object.assign({}, this.state, { workingHours: this.props.hours }) : new ProfileHoursStateClass();
		this.setState(newState);
	}

	private _editEnable(day) {
		this.setState(Object.assign({}, this.state, {
			isEditing: day
		}));
	}

	private _toggleClosed() {
		let newState = Object.assign({}, this.state);
		newState.workingHours[this.state.isEditing].closed = !newState.workingHours[this.state.isEditing].closed;

		this.setState(newState);
	}

	private _editDone() {
		this.setState(Object.assign({}, this.state, {
			isEditing: ''
		}));
	}

	onTimeChanged(timeType, key, value) {
		let newState = Object.assign({}, this.state);
		newState.workingHours[this.state.isEditing][timeType][key] = value;

		this.setState(newState);
	}

	render() {

		return (
			<div className="profile-hours padded">
				<div className="title">
					Office Hours
				</div>

				{
					!this.state.isEditing ? (
						<div className="editable-blocks">
							{
								_.map(Config.weekDays, (day: string) => {
									return (
										<div className="block" key={day} onClick={this._editEnable.bind(this, day)}>
											<div className="flexible">
												<div className="content flexible-child full">
													{_s.capitalize(day)}
												</div>
												<div className="edit-trigger flexible-child">
													<span className="description">
														{
															this.state.workingHours[day].closed ? 'Closed' : (
																`From ${this.state.workingHours[day].from.hours}:${this.state.workingHours[day].from.minutes} to ${this.state.workingHours[day].to.hours}:${this.state.workingHours[day].to.minutes}`
															)
														}
													</span>
													<i className="fa fa-chevron-right"></i>
												</div>
											</div>
										</div>
									);
								})
							}

							<div className="proceed">
								<button className="button" type="button" onClick={this.props.onInfoGathered.bind(this, this.state)}>
									{this.props.doneText || 'Next'}
								</button>
							</div>

						</div>
					) : (
						<div className="editing">
							<div className="title">
								{_s.capitalize(this.state.isEditing)}
							</div>

							<div className="editable-blocks">
								<div className="flexible block" onClick={this._toggleClosed}>
									<div className="flexible-child full">
										Closed
									</div>
									<div className="flexible-child">
										{
											this.state.workingHours[this.state.isEditing].closed ? <i className="fa fa-check"></i> : ''
										}
									</div>
								</div>
							</div>

							{
								!this.state.workingHours[this.state.isEditing].closed ? (
									<div className="edit-hours">
										<div className="small-title">
											From
										</div>
										<CustomTimeInput
											target={this.state.workingHours[this.state.isEditing].from || {}}
											noSeconds={true}
										    onChange={this.onTimeChanged.bind(this, 'from')}
										/>
										<div className="small-title">
											To
										</div>
										<CustomTimeInput
											target={this.state.workingHours[this.state.isEditing].to || {}}
											noSeconds={true}
											onChange={this.onTimeChanged.bind(this, 'to')}
										/>
									</div>
								) : ''
							}

							<div className="proceed">
								<button className="button" type="button" onClick={this._editDone}>
									Ok
								</button>
							</div>

						</div>
					)
				}


			</div>
		);
	}

	static mapStateToProps(state, ownProps: ProfileHoursPropsInterface) {
		return {
			profile: state.profile,
			hours: state.auth.user.detailedInfo ? state.auth.user.detailedInfo.workingHours : null
		}
	}
}

export default connect(ProfileHours.mapStateToProps)(ProfileHours);