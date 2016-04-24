/*
 * @Author: iceStone
 * @Date:   2015-08-31 11:40:15
 * @Last Modified by:   iceStone
 * @Last Modified time: 2015-12-30 22:10:58
 */
'use strict';

const gulp = require("gulp");
const gulpLoadPlugins = require("gulp-load-plugins");
const browserSync = require("browser-sync");
const del = require("del");

const plugins = gulpLoadPlugins();

const distDir = 'core';

gulp.task('less', () => {
  return gulp.src(['src/less/*.less', '!src/less/_*.less'])
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.less())
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.stream({ match: "**/*.css" }));
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

gulp.task('main', ['useref'], () => {
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
    '!src/less',
    '!src/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest(distDir));
});

gulp.task('clean', del.bind(null, [distDir, 'dist', 'src/css']));

gulp.task('serve', ['less'], () => {
  browserSync({
    open: false,
    // notify: false,
    port: 2016,
    server: {
      baseDir: ['src'],
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  });

  gulp.watch([
    'src/*.html',
    // 'src/**/*.css',
    'src/**/*.js'
  ]).on('change', browserSync.reload);

  gulp.watch('src/less/**/*.less', ['less']);
});

gulp.task('serve:dist', () => {
  browserSync({
    open: false,
    notify: false,
    port: 2016,
    server: {
      baseDir: [distDir]
    }
  });
});

gulp.task('build', ['main', 'extras'], () => {
  return gulp.src(distDir + '/**/*').pipe(plugins.size({
    title: 'build',
    gzip: true
  }));
});

gulp.task('default', ['clean'], () => {
  gulp.start('build');
});

// gulp.task('pack', [], () => {
//   require('./packager')
// });
