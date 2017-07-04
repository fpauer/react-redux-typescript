import * as React from 'react';
import {render as ReactDomRender} from 'react-dom';
import {Provider} from 'react-redux';
import {Router, Route, hashHistory} from 'react-router';
import App from './components/app/app.container';
import Store from './store';
import AppRoutes from './components/app/app.routes';
import AuthRoutes from './components/auth/auth.routes';
import AuthMiddleware from './middlewares/auth.middleware';
import HttpHelper from './helpers/http.helper';
import NotFound from './components/404/404.container';
import Config from './components/app/app.config';

HttpHelper.decorateAxios();

const rootEl = document.getElementById('react-root');

ReactDomRender(
    <Provider store={Store}>
        <Router history={hashHistory}>
            <Route path="/" component={App} onEnter={AuthMiddleware.isAuthenticated}>
	            {AppRoutes}
            </Route>
	        {AuthRoutes}
	        <Route path="*" component={NotFound}/>
        </Router>
    </Provider>,
    rootEl
);

///////// STYLES
require('./assets/sass/app.scss');
require('font-awesome-webpack');
require ('react-select/scss/default.scss');

////////////// STRIPE
Stripe.setPublishableKey(Config.stripePublishableKey);


//declare let module: { hot: any };

// //Handle hot reloading requests from Webpack
//if (module.hot) {
//    module.hot.accept('./components/app/app.container', () => {
//        // If we receive a HMR request for our App container, then reload it using require (we can't do this dynamically with import)
//        const NextApp = require('./components/app/app.container').default;
//
//        // And render it into the root element again
//        ReactDomRender(
//            <Provider store={Store}>
//                <Router history={hashHistory}>
//                    <Route path="/" component={NextApp}>
//	                    {AppRoutes}
//                    </Route>
//	                {AuthRoutes}
//                </Router>
//            </Provider>,
//            rootEl
//        );
//    })
//}