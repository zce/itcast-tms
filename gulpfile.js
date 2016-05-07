/*
 * @Author: iceStone
 * @Date:   2015-08-31 11:40:15
 * @Last Modified by:   iceStone
 * @Last Modified time: 2015-12-30 22:10:58
 */
'use strict'

const path = require('path')
const crypto = require('crypto')
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
  // './core',
  './build/cache',
  './build/core.asar',
  './build/data.asar',
  './build/itcast-tms.log',
  './build/updater.asar',
  './cache',
  // './dist/releases',
  './itcast-log',
  './src/renderer/css',
  './core.asar',
  './data.asar',
  './itcast-tms.log',
  './updater.asar',
  './npm-debug.log'
]))

/**
 * 压缩JS文件
 */
gulp.task('js', () => {
  return gulp.src('./src/main/**/*.js')
    .pipe(plugins.babel())
    .pipe(plugins.uglify())
    .pipe(gulp.dest('./core/main'))
})

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
gulp.task('useref', ['less', 'js'], () => {
  return gulp.src('./src/renderer/*.html')
    .pipe(plugins.useref())
    .pipe(plugins.if('**/vendor.js', plugins.uglify()))
    .pipe(plugins.if('**/bundle.js', plugins.babel()))
    .pipe(plugins.if('**/bundle.js', plugins.uglify()))
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
      minifyJS: true
    }))
    .pipe(gulp.dest('./core/renderer'))
})

/**
 * 额外文件拷贝到目标路径
 */
gulp.task('extras', () => {
  return gulp.src([
    './src/**/*.*',
    '!./src/main/**/*.js',
    '!./src/renderer/js/**/*.*',
    '!./src/renderer/less/**/*.*',
    '!./src/renderer/*.html',
    '!./src/test/**/*.*'
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

const getFileStamp = (filename, type) => {
    type = type || 'sha1'
    const buffer = fs.readFileSync(filename)
    var hash = crypto.createHash(type)
    hash.update(buffer)
    return hash.digest('hex')
  }
  /**
   * 编译归档文件和压缩包
   */
gulp.task('build', ['size'], () => {
  const items = ['core', 'data', 'updater']

  Promise.all(items.map(item => asarPack(`./${item}`, `./build/${item}.asar`)))
    .then(() => {
      console.log('pack to asar done...')
      return fs.mkdirsSync('./dist/latest')
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
          name: getFileStamp(`./build/${item}.asar`), // pkg.version,
          notes: pkg.notes || pkg.description || '',
          pub_date: new Date()
        })
      })

      return Promise.all(tasks.concat(fs.writeJson('./dist/latest/index.json', index)))
    })
    .then(() => {
      console.log('latest manifest file done')
      del('./core')
    })
    .catch(error => {
      console.log(error)
    })
})

gulp.task('zip-releases', () => {
  const pkg = require('./package.json')
  fs.readdir('./dist/releases', (error, dirs) => {
    dirs.forEach(dir => {
      // if(!dir.includes('darwin')) return
      fs.stat(`./dist/releases/${dir}`, (error, stats) => {
        if (stats.isFile()) return
        try {
          gulp.src([`./dist/releases/${dir}`], { base: './dist/releases' })
            // .pipe(plugins.rename(item))
            // .pipe(plugins.zip(`itcast-tms-${pkg.version}-${dir.substr(11)}.zip`))
            .pipe(gulp.dest('./dist/releases'))
        } catch(e) {
          console.error(e);
        }
      })
    })
  })
})

gulp.task('default', ['clean'], () => {
  gulp.start('build')
})

/**
 * 监视文件变化自动刷新
 */
gulp.task('watch', ['less'], () => {
  plugins.livereload.listen()

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
