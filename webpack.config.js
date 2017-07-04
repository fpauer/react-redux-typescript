let babel                 = require('babel-loader');
let HtmlWebpackPlugin     = require('html-webpack-plugin');
let webpack               = require('webpack');
let path                  = require('path');
let WebpackNotifierPlugin = require('webpack-notifier');

let config = {
	dist     : __dirname + '/dist',
	src      : __dirname + '/src',
	srcFolder: 'src'
};

let appEntries = [
	'babel-polyfill',
	`./${config.srcFolder}/index.tsx`
];

let distModules = [
	"script!jquery/dist/jquery.min.js",
	"script!foundation-sites/dist/js/foundation.js",
];

if(process.env.ENVIRONMENT !== 'production') {
	[].unshift.apply(appEntries, [
		'webpack-dev-server/client?http://localhost:3001',
		'webpack/hot/only-dev-server',
	]);

} else {
	console.log(process.env.ENVIRONMENT);

	distModules = [
		"script!jquery/dist/jquery.min.js",
		"script!foundation-sites/dist/js/foundation.min.js",
	];
}

module.exports = {
	resolve: {
		extensions: ['', '.ts', '.tsx', '.js', '.jsx']
	},
	entry  : {
		dist: distModules,
		app: appEntries
	},
	output : {
		filename         : '[name].bundle.js',
		sourceMapFilename: '[name].bundle.map',
		path             : config.dist
	},
    externals: {
        'cheerio': 'window',
        'react/addons': true,
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': true
    },

	devtool: '#source-map',
	debug  : true,

	module: {
		loaders: [
			{
				loaders : ['babel', 'ts-loader'],
				test   : /\.tsx?$/,
				exclude: /(node_modules)/
			},
			{
				loader: 'html',
				test  : /\.html?$/
			},
			{
				test: /\.scss$/,
				loaders: ["style-loader", "css-loader", "sass-loader"]
			},
			{
				test: /\.(jpe?g|png|gif)$/i,
				loaders: [
					'file?hash=sha512&digest=hex&name=[hash].[ext]',
					'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
				]
			},
			{
				test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: "url-loader?limit=10000&minetype=application/font-woff"
			},
			{
				test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: "file-loader"
			}
		]
	},

	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new HtmlWebpackPlugin({
			template: path.join(config.src, 'index.html')
		}),
		new WebpackNotifierPlugin({alwaysNotify: true}),
		new webpack.DefinePlugin({
			__ENVIRONMENT__: JSON.stringify(process.env.ENVIRONMENT || 'development')
		})
	]
};