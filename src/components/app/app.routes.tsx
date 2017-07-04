import * as React from 'react';
import {Route, IndexRoute} from 'react-router';
import Profile from '../profile/profile.container';
import PaymentRenew from '../paymentRenew/paymentRenew.containter';
import ProfileStart from '../profileStart/profileStart.container';

export default (
	<div>

		<IndexRoute component={Profile}/>

		<Route path="profile/start" component={ProfileStart}/>

		<Route path="payment-renew" component={PaymentRenew}/>

	</div>
);