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
const packageJson = require('./package.json');

gulp.task('default', ['asar'], () => {
  gulp.watch('./core/**/*', ['asar']);
});

gulp.task('asar', () => {
  let src = './core';
  let dest = './app/core.asar';
  asar.createPackage(src, dest, () => {
    console.log('done asar.');
  });
});

gulp.task('release', () => {
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