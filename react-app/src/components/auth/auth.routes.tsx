import * as React from 'react';
import {Route, IndexRedirect} from 'react-router';
import Auth from './auth.container';
import Login from '../login/login.container';
import Register from '../register/register.container';
import AuthMiddleware from '../../middlewares/auth.middleware';
import FacebookAuth from '../socialAuth/facebookAuth.container';
import GoogleAuth from '../socialAuth/googleAuth.container';
import TwitterAuth from '../socialAuth/twitterAuth.container';
import LinkedinAuth from '../socialAuth/linkedinAuth.container';
import RestorePassword from '../restorePassword/resorePassword.container';

export default (
	<Route path="/auth" component={Auth} onEnter={AuthMiddleware.isNotAuthenticated}>
		<IndexRedirect to="login"/>
		<Route path="register" component={Register} />
		<Route path="login" component={Login} />
		<Route path="fb" component={FacebookAuth} />
		<Route path="google" component={GoogleAuth} />
		<Route path="twitter" component={TwitterAuth} />
		<Route path="linkedin" component={LinkedinAuth} />
		<Route path="restore" component={RestorePassword}/>
	</Route>
);