const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const srcDir = path.join(__dirname, "..", "src");

module.exports = {
	entry: {
		main: path.join(srcDir, "main.ts"),
	},
	output: {
		path: path.join(__dirname, "../dist/js"),
		filename: "[name].js",
	},
	optimization: {
		splitChunks: {
			name: "vendor",
			chunks: "initial",
		},
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		// modules: [
		//     path.join(__dirname, "./node_modules"),
		//     path.join(__dirname, "./"),
		// ],
		extensions: [".ts", ".tsx", ".js"],
	},
	plugins: [
		new CopyPlugin({
			patterns: [{from: ".", to: "../", context: "public"}],
			options: {},
		}),
	],
};
