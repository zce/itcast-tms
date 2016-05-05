/*
 * @Author: iceStone
 * @Date:   2015-08-31 11:40:15
 * @Last Modified by:   iceStone
 * @Last Modified time: 2015-12-30 22:10:58
 */
'use strict'

const spawn = require('child_process').spawn

const gulp = require('gulp')
const gulpLoadPlugins = require('gulp-load-plugins')

const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs-extra'))
const del = require('del')
const asar = require('asar')
const electron = require('electron-prebuilt')

const plugins = gulpLoadPlugins()
// const buildTemp = '.tmp'
const repo = 'http://git.oschina.net/micua/tms/raw/master/'

/**
 * 清理临时文件
 */
gulp.task('clean', del.bind(null, [
  './core',
  './build/cache',
  './build/core.asar',
  './build/data.asar',
  './build/itcast-tms.log',
  './build/updater.asar',
  './cache',
  './dist/releases',
  './itcast-log',
  './src/renderer/css',
  './core.asar',
  './data.asar',
  './itcast-tms.log',
  './updater.asar',
  './npm-debug.log'
]))

/**
 * 编译less文件
 */
gulp.task('less', () => {
  return gulp.src(['./src/renderer/less/*.less', '!./src/renderer/less/_*.less'])
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.less())
    .pipe(plugins.sourcemaps.write('./'))
    .pipe(gulp.dest('./src/renderer/css'))
    .pipe(plugins.livereload())
})

/**
 * 行内编译任务
 */
gulp.task('useref', ['less'], () => {
  return gulp.src('./src/renderer/*.html')
    .pipe(plugins.useref())
    .pipe(plugins.if('**/vendor.js', plugins.uglify()))
    .pipe(plugins.if('*.css', plugins.cssnano()))
    .pipe(gulp.dest('./core/renderer'))
})

/**
 * HTML压缩
 */
gulp.task('html', ['useref'], () => {
  return gulp.src('./core/renderer/*.html')
    .pipe(plugins.htmlmin({
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeComments: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      minifyCSS: true,
      minifyJS: true,
    }))
    .pipe(gulp.dest('./core/renderer'))
})

/**
 * 额外文件拷贝到目标路径
 */
gulp.task('extras', () => {
  return gulp.src([
    './src/**/*.*',
    '!./src/renderer/js/**/*.*',
    '!./src/renderer/less/**/*.*',
    '!./src/renderer/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('./core'))
})

/**
 * 文件GZIP压缩
 */
gulp.task('size', ['html', 'extras'], () => {
  return gulp.src('./core/**/*.*')
    .pipe(plugins.size({
      title: 'build',
      gzip: true
    }))
    .pipe(gulp.dest('./core'))
})

/**
 * ASAR 打包任务
 */
const asarPack = (src, dest) => new Promise((resolve, reject) => {
  asar.createPackage(src, dest, resolve)
})

/**
 * 编译归档文件和压缩包
 */
gulp.task('build', ['size'], () => {

  const items = ['core', 'data', 'updater']

  Promise.all(items.map(item => asarPack(`./${item}`, `./build/${item}.asar`)))
    .then(() => {
      console.log('pack to asar done...')
      return fs.mkdirs('./dist/latest')
    })
    .then(() => {

      const index = {}
      const tasks = items.map(item => {
        const pkg = require(`./${item}/package.json`)
        gulp.src(`./build/${item}.asar`)
          .pipe(plugins.rename(item))
          .pipe(plugins.zip(`${item}-${pkg.version}.zip`))
          .pipe(gulp.dest('./dist/packages'))

        index[item] = `${repo}latest/${item}.json`
        return fs.writeJson(`./dist/latest/${item}.json`, {
          url: `${repo}packages/${item}-${pkg.version}.zip`,
          name: pkg.version,
          notes: pkg.notes || pkg.description || '',
          pub_date: new Date()
        })
      })

      return Promise.all(tasks.concat(fs.writeJson(`./dist/latest/index.json`, index)))
    })
    .then(() => {
      console.log('latest manifest file done')
      del('./core')
    })
    .catch(error => {
      console.log(error)
    })
})

gulp.task('default', ['clean'], () => {
  gulp.start('build')
})

/**
 * 监视文件变化自动刷新
 */
gulp.task('watch', ['less'], () => {
  plugins.livereload.listen( /* { basePath: 'src' } */)

  gulp.watch([
    './src/renderer/**/*.html',
    './src/renderer/**/*.js'
  ]).on('change', e => {
    plugins.livereload.changed(e.path)
  })

  gulp.watch('./src/renderer/less/**/*.less', ['less'])
})

gulp.task('test', ['watch'], () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development'
  spawn(electron, ['./'])
})
