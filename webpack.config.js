var webpack = require('webpack');
var path = require('path');
var env = require('node-env-file');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

try {
  env(path.join(__dirname, '.env'));
} catch(e) {
  console.log('Problem importing env file, ', e);
}

module.exports = {
  entry: [
    'script!jquery/dist/jquery.min.js',
    //'script!foundation-sites/dist/js/foundation.min.js',
    './app/app.jsx',
  ],
  externals: {
    jquery: 'jQuery'
  },
  plugins: [
    new webpack.ProvidePlugin({
      '$': 'jquery',
      'jQuery': 'jquery'
    }),
    // new webpack.DefinePlugin({
    //   'process.env': {
    //     API_KEY: JSON.stringify(process.env.API_KEY),
    //     AUTH_DOMAIN: JSON.stringify(process.env.AUTH_DOMAIN),
    //     DATABASE_URL: JSON.stringify(process.env.DATABASE_URL),
    //     STORAGE_BUCKET: JSON.stringify(process.env.STORAGE_BUCKET),
    //     MESSAGING_SENDER_ID: JSON.stringify(process.env.MESSAGING_SENDER_ID)
    //   }
    // })
  ],
  output: {
    path: __dirname,
    filename: './public/bundle.js'
  },
  resolve: {
    modulesDirectories: [
      'node_modules',
      './app/components',
      './app/api'
    ],
    root: __dirname,
    alias: {
      app: 'app',
      ApplicationStyles: 'app/styles/app.scss',
      actions: 'app/actions/actions.jsx',
      reducers: 'app/reducers/reducers.jsx',
      configureStore: 'app/store/configureStore.jsx'
    },
    extensions: ['', '.js', '.jsx']
  },
  // sassLoader: {
  //   includePaths: [
  //     path.resolve(__dirname, "./node_modules/foundation-sites/scss")
  //   ]
  // },
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0']
        },
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/
      }
    ]
  },
  devtool: process.env.NODE_ENV === 'production' ? undefined : 'cheap-module-eval-source-map'
}
