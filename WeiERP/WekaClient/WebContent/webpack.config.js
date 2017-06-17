var path = require('path');
var IgnorePlugin = require("webpack").IgnorePlugin;
var UglifyJsPlugin = require("webpack").optimize.UglifyJsPlugin;
var PROD = (process.env.NODE_ENV === 'production')

let plugins = [new IgnorePlugin(/cptable/)];
if(PROD){
    plugins = [new IgnorePlugin(/cptable/),new UglifyJsPlugin({
      sourceMap: true, minimize: true, compress: { warnings: false }
    })];
}
module.exports = {
    entry: [
        'babel-polyfill', './app/index.tsx'
    ],
    output: {
		libraryTarget: 'var',
		library: 'XLSX',
        filename: "bundle.js",
        path: __dirname + "/dist",
        publicPath: "/dist"
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },

    module: {
        loaders: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
            { test: /\.tsx?$/, loaders: ['babel-loader', 'ts-loader'] }
        ],

        preLoaders: [
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { test: /\.js$/, loader: "source-map-loader" }
        ],
        noParse: [/jszip.js$/],
    },
    //plugins:[new IgnorePlugin(/(ycptable|mime-db|har-schema|react-native-fs|react-native-fetch-blob|^es6-promise$|^net$|^tls$|^forever-agent$|^tough-cookie$|^path$)/)]
    plugins:plugins,
    //    // When importing a module whose path matches one of the following, just
    //    // assume a corresponding global variable exists and use that instead.
    //    // This is important because it allows us to avoid bundling all of our
    //    // dependencies, which allows browsers to cache those libraries between builds.
    //    externals: {
    //        "react": "React",
    //        "react-dom": "ReactDOM"
    //    },
    node: {
        fs: "empty",
		Buffer: false
    },
    externals: [
        {
            './cptable': 'var cptable',"./jszip": "jszip"
        }
    ]
};