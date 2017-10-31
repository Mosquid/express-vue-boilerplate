'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');
var path    = require('path');
var del = require('del');
var webpack = require('webpack');
var webpackStream = require('webpack-stream')

let build = false
let plugins = [
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: function (module) {
   		return module.context && (module.context.indexOf('node_modules') !== -1 || module.context.indexOf('scripts') === 0);
    }
  })
]

const config = {
  entry: {
  	client: './client/app.js'
  },
  watch: true,
  output: {
  	filename: "[name].bundle.js",
  },
  plugins: plugins,
  module: {
    rules: [
		  {
		  	test: /\.js$/,
        exclude: [/bower_components/, /node_modules/],
		  	use: [{
          loader: 'babel-loader',
          options: {
	          presets: ["es2015"]
	        }
        }]
		  },
			{
        test: /\.html$/,
        use: 'ng-cache-loader?prefix=[dir]/[dir]'
      },
			{
        test: /\.svg$/,
        use: [{
        	loader: 'svg-sprite-loader'
        }]
      },
			{
        test: /\.scss$/,
        use: [{
            loader: "style-loader" // creates style nodes from JS strings
        }, {
            loader: "css-loader" // translates CSS into CommonJS
        }, {
            loader: "sass-loader" // compiles Sass to CSS
        }]
			},
			{
        test: /\.css$/,
        use: [{
            loader: "style-loader" // creates style nodes from JS strings
        }, {
            loader: "css-loader" // translates CSS into CommonJS
        }]
			},
      {
          test: /\.png$|\.jpg$|\.jpeg$$/,
          loader: "url-loader",
          options:  {
				    limit: 0
				  }
      },
			{
				test: /\.ttf$|\.woff$|\.eot$|\.woff2$/,
				use: [{
					loader: 'file-loader',
					options: {
						name: '../fonts/[name].[ext]'
					}
				}]
			}
    ]
  },
  resolve: {
	  alias: {
	    vue: 'vue/dist/vue.js'
	  }
	}
}

gulp.task('watch-client', ['browser-sync'], function(done) {
  return gulp.src('./client/app.js')
    .pipe(webpackStream(config, webpack).on('error', function(error) {
    	console.log(error.toString())
  		this.emit('end')
    }))
    .on('error', function(error) {
    	console.log(error.toString())
  		this.emit('end')
    })
    .pipe(gulp.dest('public/js/'))
});

gulp.task('default', ['watch-client'], function () {});

gulp.task('browser-sync', ['nodemon'], function() {
	browserSync.init(null, {
		files: ["public/**/*.*"],
		proxy: "http://localhost:3000",
		reloadDebounce: 1000,
	    browser: "google chrome",
	    port: 7000,
	});
});
gulp.task('nodemon', function (cb) {
	var started = false;
	return nodemon({
		ext:'js html json',
		script: 'app.js',
    	ignore: ["views/*", "client/*", "public/*", "uploads/*"],
	}).on('start', function () {
		// to avoid nodemon being started multiple times
		// thanks @matthisk
		if (!started) {
			cb();
			started = true;
		}
	});
});
