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
  asar.createPackage('./core', './app/core.asar', () => {
    console.log('done core asar.');
  });
  asar.createPackage('./updater', './app/updater.asar', () => {
    console.log('done updater asar.');
  });

  gulp.src(['./da*/**/*','./version.json'])
    .pipe(gulp.dest('./app'));
});

gulp.task('release', () => {
  gulp.src('')
    .pipe(electron({
      src: './app',
      packageJson: packageJson,
      release: './release',
      cache: './cache',
      version: 'v0.36.10',
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
    .pipe(gulp.dest(''));
});

gulp.task('clean', () => {
  gulp.src(['./.eva*','./app/.eva*', './release', './app/core.asar', './app/updater.asar', './app/temp', './app/data', './app/version.json'], { read: false })
    .pipe(clean({ force: true }));
});


gulp.task('version', () => {
  const fs = require('fs');
  const path = require('path');
  const version = require('./version.json');
  const latest = version.latest.slice(1);

  const target = ['./package.json', './core/package.json', './app/package.json', './updater/package.json'];
  target.forEach((item) => {
    const now = require(item);
    now.version = latest;
    fs.writeFileSync(path.join(__dirname, item), JSON.stringify(now), 'utf8');
  });

});
