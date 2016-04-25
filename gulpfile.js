/*
 * @Author: iceStone
 * @Date:   2015-08-31 11:40:15
 * @Last Modified by:   iceStone
 * @Last Modified time: 2015-12-30 22:10:58
 */
'use strict';

const gulp = require("gulp");
const gulpLoadPlugins = require("gulp-load-plugins");
const del = require("del");
const bs = require("browser-sync").create();
const electron = require('electron-prebuilt')
const spawn = require('child_process').spawn;
const plugins = gulpLoadPlugins();

const distDir = 'core';

gulp.task('clean', del.bind(null, [distDir, 'dist', 'src/css']));

gulp.task('less', () => {
  return gulp.src(['src/less/*.less', '!src/less/_*.less'])
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.less())
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest('src/css'))
    .pipe(bs.stream({ match: "**/*.css" }));
});

gulp.task('useref', ['less'], () => {
  return gulp.src('src/*.html')
    .pipe(plugins.useref())
    // .pipe(plugins.if('*.js', plugins.uglify()))
    .pipe(plugins.if('*.css', plugins.cssnano({
      compatibility: '*'
    })))
    .pipe(gulp.dest(distDir));
});

gulp.task('html', ['useref'], () => {
  return gulp.src(distDir + '/*.html')
    .pipe(plugins.htmlmin({
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeComments: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
    }))
    .pipe(gulp.dest(distDir));
});

gulp.task('extras', () => {
  return gulp.src([
    'src/*',
    'src/*.*',
    'src/im*/*.*',
    'src/node_module*/**/*.*',
    'src/vie*/**/*.*',
    '!src/less',
    '!src/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest(distDir));
});

gulp.task('build', ['html', 'extras'], () => {
  return gulp.src(distDir + '/**/*').pipe(plugins.size({
    title: 'build',
    gzip: true
  }));
});

gulp.task('default', ['clean'], () => {
  gulp.start('build');
});

gulp.task('serve', ['less'], () => {
  serve();
});

gulp.task('test', ['less'], () => {
  serve(() => {
    process.env.NODE_ENV = process.env.NODE_ENV || 'development';
    spawn(electron, ['.']);
  });
});

function serve(callback) {
  bs.init({
    open: false,
    notify: true,
    port: 2016,
    server: {
      baseDir: ['src'],
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  }, callback);

  gulp.watch([
    'src/**/*.html',
    'src/**/*.js'
  ]).on('change', bs.reload);

  gulp.watch('src/less/**/*.less', ['less']);
}
