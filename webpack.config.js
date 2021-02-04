const webpack = require("webpack");
const path = require("path");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = {
	mode: "development",
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
			"@model": path.resolve(__dirname, "src", "model")
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
				use: 'ts-loader',
				exclude: /node_modules/
			}
		]
	},
	plugins: [
		new MiniCssExtractPlugin({filename: '[name].css'})
	]
}