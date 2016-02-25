/**
 * Gulp File
 * @Author: iceStone
 * @Date:   2015-11-25 22:37:51
 * @Last Modified by:   iceStone
 * @Last Modified time: 2016-02-20 10:59:42
 */

'use strict';

const gulp = require('gulp');
const asar = require('asar');
const electron = require('gulp-electron');
const clean = require('gulp-clean');
const packageJson = require('./package.json');

gulp.task('watch', ['dist'], () => {
  gulp.watch(['./core/**/*', './data/**/*'], ['dist']);
});

gulp.task('dist', () => {
  let src = './core';
  let dest = './app/core.asar';
  asar.createPackage(src, dest, () => {
    console.log('done asar.');
  });

  gulp.src('./data/**/*')
    .pipe(gulp.dest('./app/data'));
});

gulp.task('release', ['dist'], () => {
  gulp.src('')
    .pipe(electron({
      src: './app',
      packageJson: packageJson,
      release: './release',
      cache: './cache',
      version: 'v0.36.8',
      packaging: true,
      platforms: ['win32-ia32', 'win32-x64', 'darwin-x64'],
      platformResources: {
        darwin: {
          CFBundleDisplayName: packageJson.name,
          CFBundleIdentifier: packageJson.name,
          CFBundleName: packageJson.name,
          CFBundleVersion: packageJson.version,
          icon: 'icon/app.icns'
        },
        win: {
          "version-string": packageJson.version,
          "file-version": packageJson.version,
          "product-version": packageJson.version,
          "icon": 'icon/app.ico'
        }
      }
    }))
    .pipe(gulp.dest(""));
});

gulp.task('clean', () => {
  gulp.src(['./.eva*', './release', './app/core.asar', './app/data'], { read: false })
    .pipe(clean({ force: true }));
});
