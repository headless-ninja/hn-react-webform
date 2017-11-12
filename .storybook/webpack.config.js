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
      test: /\.css$/,
      exclude: /highlight.*\.css$/,
      loader: 'style!css?importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
    }, {
      test: /highlight.*\.css$/,
      loader: 'style!css'
    }]
  },

  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        context: '/',
      },
    })
  ]
};
