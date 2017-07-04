const CONFIG = {
	development: {
		apiPrefix:            'http://localhost:3000/api/',
		apiImages:            'http://localhost:3000/images',
		facebookLogin:        'http://localhost:3000/auth/facebook',
		googleLogin:          'http://localhost:3000/auth/google',
		twitterLogin:         'http://localhost:3000/auth/twitter',
		linkedinLogin:        'http://localhost:3000/auth/linkedin'
	},
	production: {
		apiPrefix:            'http://gprosplus-testing-qa.us-west-2.elasticbeanstalk.com/api/',
		apiImages:            'http://gprosplus-testing-qa.us-west-2.elasticbeanstalk.com/images',
		facebookLogin:        'http://gprosplus-testing-qa.us-west-2.elasticbeanstalk.com/auth/facebook',
		googleLogin:          'http://gprosplus-testing-qa.us-west-2.elasticbeanstalk.com/auth/google',
		twitterLogin:         'http://gprosplus-testing-qa.us-west-2.elasticbeanstalk.com/auth/twitter',
		linkedinLogin:        'http://gprosplus-testing-qa.us-west-2.elasticbeanstalk.com/auth/linkedin',
		stripePublishableKey: 'pk_live_HKQep405PYaHNxpWgUc4zg2K',
	}
};

const COMMON_CONFIG = {
	'localStorageKey':          'react',
	'jwtKey':                   'JWT',
	'googleByAddress':          'https://maps.googleapis.com/maps/api/geocode/json?address=',
	'googleByCoordinates':      'https://maps.googleapis.com/maps/api/geocode/json?latlng=',
	'stripePublishableKey':     'pk_test_3luvCs319zmpso32mMj3n5Pc',
	'maxFileUploadSize':        25 * Math.pow(10, 6), // 25 mBytes
	'weekDays':                 [ 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday' ],
	'noImagePath':              '/no-image.jpg',
	'zipCodeRegex.change':      /^\d{0,5}(-)?(\d{0,4})?$/,
	'zipCodeRegex.final':       /^\d{5}(?:(-)?\d{4})?$/,
	'passwordRegex':            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
	'emailRegex':               /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
	'phoneRegex':               /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/
};

export default Object.assign({}, COMMON_CONFIG, CONFIG[__ENVIRONMENT__]);