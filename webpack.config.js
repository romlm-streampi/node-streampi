const webpack = require("webpack");
const path = require("path");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = {
	mode: "development",
	target: "web",
	entry: {
		admin: "./pages/admin.tsx",
		client: "./pages/client.tsx",
		index: "./src/index.tsx"
	},
	output: {
		filename: "_[name].js",
		path: path.resolve(__dirname, 'dist')
	},
	resolve: {
		extensions: [].concat(['.js', '.jsx', '.ts', '.tsx'], ['.scss', '.css', '.sass']),
		alias: {
			"@pages": path.resolve(__dirname, "pages" ),
			"@styles": path.resolve(__dirname, "styles"),
			"@components": path.resolve(__dirname, "src", "components"),
			"@model": path.resolve(__dirname, "src", "model"),
			"@utils": path.resolve(__dirname, "src", "utils"),
			"@plugins": path.resolve(__dirname, "plugins", "components")
		}
	},
	module: {
		rules: [
			{
				test: /\.module\.(s?c|sa)ss$/,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							modules: true
						}
					},
					{
						loader: 'sass-loader'
					}
				]
			},
			{
				test: /\.(s?c|sa)ss$/,
				exclude: /\.module\.(s?c|sa)ss$/,
				use: [
					'style-loader',
					'css-loader',
					'sass-loader'
				]
			},
			{
				test: /\.(ts|js)x?$/,
				use: {
					loader: 'babel-loader'
				},
				exclude: /node_modules/
			}
		]
	},
	plugins: [
		new MiniCssExtractPlugin({filename: '[name].css'}),
		new webpack.ProvidePlugin({
			Buffer: ['buffer', 'Buffer'],
			process: ['process']
		})
	]
}
