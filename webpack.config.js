const path = require('path');

module.exports = {
	devtool: "source-map",
	entry: './build-babel/finchart.js',
	output: {
		filename: 'finchart.js',
		path: path.resolve(__dirname, 'dist'),
		library: {
			type: "umd"
		}
	},
	mode: "production"
};