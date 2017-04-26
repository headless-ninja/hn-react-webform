const cssnext = require('postcss-cssnext');
const postcss = require('postcss');
const webpack = require('webpack');

module.exports = {
  module: {
    loaders: [{
      test: /\.md$/,
      loader: "raw"
    }, {
      test: /\.json$/,
      loader: 'json'
    }, {
      test: /\.pcss$/,
      loader: 'style!css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss'
    }, {
      test: /\.css$/,
      exclude: /highlight.*\.css$/,
      loader: 'style!css?importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss'
    }, {
      test: /highlight.*\.css$/,
      loader: 'style!css'
    }]
  },

  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: postcss([
          require("postcss-import"),
          cssnext()
        ]),
        context: '/',
      },
    })
  ]
};
