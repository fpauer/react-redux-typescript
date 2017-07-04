import SocialAuthInterface from '../interfaces/socialAuthState.interface';
import config from '../../app/app.config';

class SocialAuthState implements SocialAuthInterface {
	facebook:   string;
	google:     string;
	twitter:    string;
	linkedin:   string;

	constructor() {
		this.facebook   = config.facebookLogin;
		this.google     = config.googleLogin;
		this.twitter    = config.twitterLogin;
		this.linkedin   = config.linkedinLogin;
	}
}

export default SocialAuthState;