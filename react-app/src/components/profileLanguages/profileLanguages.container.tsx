import * as React from 'react';
import {connect} from 'react-redux';
import {ProfileLanguagesPropsInterface} from './interfaces/profileLanguagesProps.interface';
import {ProfileLanguagesStateClass} from './classes/profileLanguagesState.class';
import {ProfileActionCreators} from '../profile/profile.actions';
import UtilHelper from '../../helpers/util.helper';
import * as _ from 'underscore';

class ProfileLanguages extends React.Component<any, ProfileLanguagesStateClass> {

	componentWillMount() {
		this._resetState();
		this._retrieveLanguages();
	}

	componentWillReceiveProps(newProps) {
		this._tryInitLanguages(newProps);
	}

	private _tryInitLanguages(props) {
		props.languages.length ? this.setState({
			languages: _.pluck(props.languages, 'id')
		}) : '';
	}

	private _retrieveLanguages() {
		let languages = this.props.profile.availableLanguages;
		!languages || !languages.length ? this.props.dispatch(ProfileActionCreators.retrieveLanguages()) : '';
	}

	private _resetState() {
		this.props.languages.length ? this._tryInitLanguages(this.props) : this.setState(new ProfileLanguagesStateClass());
	}

	private _isChecked(id) {
		return UtilHelper.simpleArrayExistence(this.state.languages, id);
	}

	private _toggleLanguage(id) {
		UtilHelper.toggleSimpleArrayExistence(this.state.languages, id, this);
	}

	render() {
		return (
			<div className="profile-languages padded">
				<div className="title">
					Languages Spoken
				</div>

				{
					this.props.profile.availableLanguages.length ? (
						<div>
							<div className="editable-blocks checkboxes">
								{
									this.props.profile.availableLanguages.map((language => {
										return (
											<div className="block flexible" key={language.id} onClick={this._toggleLanguage.bind(this, language.id)}>
												<div className="title flexible-child full">
													{language.displayName}
												</div>
												<div className="mark flexible-child">
													{
														this._isChecked(language.id) ? (
															<i className="fa fa-check"></i>
														) : ''
													}
												</div>
											</div>
										);
									}))
								}
							</div>

							<div className="proceed">
								<button className="button" type="button" onClick={this.props.onInfoGathered.bind(this, this.state)}>
									{this.props.doneText || 'Next'}
								</button>
							</div>
						</div>
					) : ''
				}

			</div>
		);
	}

	static mapStateToProps(state, ownProps: ProfileLanguagesPropsInterface) {
		return {
			profile: state.profile,
			languages: state.auth.user.detailedInfo ? state.auth.user.detailedInfo.languages : []
		}
	}
}

export default connect(ProfileLanguages.mapStateToProps)(ProfileLanguages);

