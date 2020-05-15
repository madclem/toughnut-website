const path = require('path');
const pathOutput = path.resolve(__dirname, 'dist');
const pathNodeModules = path.resolve(__dirname, 'node_modules');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
//   .BundleAnalyzerPlugin;
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const isStandalone = process.env.project === 'standalone';
const env = process.env.NODE_ENV;
const isProd = env === 'production';
console.log('Environment:', env);
console.log('Environment isProd :', isProd);

// var options = {
//   release: process.argv.indexOf('release') !== -1,
//   noCompile: process.argv.indexOf('no-compile') !== -1,
//   start: process.argv.indexOf('start') !== -1,
//   verbose: process.argv.indexOf('verbose') !== -1,
// };


const entry = isProd ? (isStandalone ? './src/js/main/app.js' : { app: './src/js/entry.js' })
	: { app: './src/js/main/app.js', debug: './src/js/debug/debug.js' };

const output =
	isProd ? (isStandalone ? {
		filename: 'assets/js/app.js',
		path: pathOutput
	} : ({
		filename: 'webgl-build.js',
		path: pathOutput,
		library: '',
		libraryTarget: 'umd'
	})) : {
		filename: 'assets/js/[name].js',
		path: pathOutput
	};

console.log('isStandalone', isStandalone);
console.log('output', output);

const devtool = isProd ? 'source-map' : 'inline-source-map';

const optimization = isProd ? {
	minimize: true,
	minimizer: [
		new TerserPlugin({
			extractComments: true,
			cache: true,
			parallel: true,
			sourceMap: true, // Must be set to true if using source-maps in production
			terserOptions: {
				minimize: true,
				// https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
				 extractComments: 'all',
				 compress: {
						 drop_console: true,
				 },
			}
		}),
	]
} : {};

console.log('optimization', optimization);
module.exports = {
	entry,
	devtool,
	output,
	optimization,
	devServer: {
		host: '0.0.0.0',
		contentBase: './dist',
		hot: true,
		disableHostCheck: true
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env',
							{
								plugins: ['@babel/plugin-proposal-class-properties']
							}]
					}
				}
			},
			{
				test: /\.hbs$/,
				exclude: /node_modules/,
				use: {
					loader: 'handlebars-loader'
				}
			},
			{
				test: /\.html$/,
				use: [
					{
						loader: 'html-loader',
						options: { minimize: true }
					}
				]
			},
			{
				test: /\.css$/,
				use: [
					'style-loader', // creates style nodes from JS strings
					'css-loader', // translates CSS into CommonJS
				]
			},
			{
				test: /\.(glsl|vert|frag)$/,
				use: ['raw-loader', 'glslify-loader']
			}
		]
	},
	resolve: {
		alias: {
			alfrid: path.resolve(__dirname, 'src/js/libs/alfrid/alfrid.js'),
			libs: path.resolve(__dirname, 'src/js/libs'),
			shaders: path.resolve(__dirname, 'src/shaders'),
			utils: path.resolve(__dirname, 'src/js/utils'),
			shared: path.resolve(__dirname, 'src/js/shared'),
			consts: path.resolve(__dirname, 'src/js/consts'),
			helpers: path.resolve(__dirname, 'src/js/helpers'),
		}
	}
};
