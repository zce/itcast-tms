/*
 * @Author: iceStone
 * @Date:   2015-08-31 11:40:15
 * @Last Modified by:   iceStone
 * @Last Modified time: 2015-12-30 22:10:58
 */
'use strict'

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

const repo = 'http://git.oschina.net/micua/tms/raw/v4.x/'

/**
 * 清理临时文件
 */
gulp.task('clean', del.bind(null, [
  './temp',

  './build/cache',
  './build/core.asar',
  './build/data.asar',
  './build/updater.asar',
  // './dist/releases',
  './src/cache',
  './src/core.asar',
  './src/data.asar',
  './src/updater.asar',
  './src/core/renderer/assets/css',
  './itcast-log',
  './itcast-tms.log',
  './npm-debug.log'
]))

// /**
//  * 编译压缩数据JSON文件
//  */
// gulp.task('data', () => {
//   return gulp.src(['./src/data/*.json'], {base:'./src'})
//     .pipe(plugins.jsonminify())
//     .pipe(gulp.dest('./temp'))
// })

/**
 * 编译压缩脚本文件
 */
gulp.task('scripts', () => {
  return gulp.src(['./src/**/*.js', '!./src/**/node_modules/**/*.*', '!./src/**/renderer/**/*.*', '!./src/**/test/**/*.*'], { base: './src' })
    .pipe(plugins.babel())
    .pipe(plugins.uglify())
    .pipe(gulp.dest('./temp'))
})

/**
 * 编译样式文件
 */
gulp.task('styles', () => {
  return gulp.src(['./src/core/renderer/assets/less/*.less', '!./src/core/renderer/assets/less/_*.less'])
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.less())
    .pipe(plugins.sourcemaps.write('./'))
    .pipe(gulp.dest('./src/core/renderer/assets/css'))
    .pipe(plugins.livereload())
})

/**
 * 行内编译任务
 */
gulp.task('useref', ['scripts', 'styles'], () => {
  gulp.src(['./src/core/renderer/*.html'])
    .pipe(plugins.useref())
    .pipe(plugins.if('**/vendor.js', plugins.uglify()))
    .pipe(plugins.if('**/bundle.js', plugins.babel()))
    .pipe(plugins.if('**/bundle.js', plugins.uglify()))
    .pipe(plugins.if('*.css', plugins.cssnano()))
    .pipe(gulp.dest('./temp/core/renderer'))
  return gulp.src(['./src/updater/*.html'])
    // .pipe(plugins.useref())
    // .pipe(plugins.if('*.js', plugins.babel()))
    // .pipe(plugins.if('*.js', plugins.uglify()))
    // .pipe(plugins.if('*.css', plugins.cssnano()))
    .pipe(gulp.dest('./temp/updater'))
})

/**
 * HTML压缩
 */
gulp.task('html', ['useref'], () => {
  return gulp.src('./temp/**/*.html')
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
    .pipe(gulp.dest('./temp'))
})

/**
 * 额外文件拷贝到目标路径
 */
gulp.task('extras', ['html'], () => {
  return gulp.src([
    './src/**/*.*',
    '!./src/core/{common,main,renderer,static}/**/*.js',
    '!./src/core/renderer/assets/less/**/*.*',
    '!./src/core/renderer/*.html',
    '!./src/updater/{lib}/**/*.js',
    '!./src/updater/*.html',
    '!./src/**/test/**/*.*'
  ], {
    dot: true
  }).pipe(gulp.dest('./temp'))
})

/**
 * 文件GZIP压缩
 */
gulp.task('size', ['extras'], () => {
  return gulp.src('./temp/**/*.*')
    .pipe(plugins.size({
      title: 'build',
      gzip: true
    }))
    .pipe(gulp.dest('./temp'))
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

  Promise.all(items.map(item => asarPack(`./temp/${item}`, `./build/${item}.asar`)))
    .then(() => {
      console.log('pack to asar done...')
      return fs.mkdirsSync('./dist/latest')
    })
    .then(() => {
      const index = {}
      const tasks = items.map(item => {
        const pkg = require(`./temp/${item}/package.json`)
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
      del('./temp')
    })
    .catch(error => {
      console.log(error)
    })
})

gulp.task('default', ['clean'], () => {
  gulp.start('build')
})

gulp.task('zip-releases', () => {
  // const pkg = require('./package.json')
  fs.readdir('./dist/releases', (error, dirs) => {
    if (error) throw error
    dirs.forEach(dir => {
      // if(!dir.includes('darwin')) return
      fs.stat(`./dist/releases/${dir}`, (error, stats) => {
        if (error) throw error
        if (stats.isFile()) return
        try {
          gulp.src([`./dist/releases/${dir}`], { base: './dist/releases' })
            // .pipe(plugins.rename(item))
            // .pipe(plugins.zip(`itcast-tms-${pkg.version}-${dir.substr(11)}.zip`))
            .pipe(gulp.dest('./dist/releases'))
        } catch (e) {
          console.error(e)
        }
      })
    })
  })
})

/**
 * 监视文件变化自动刷新
 */
gulp.task('watch', ['styles'], () => {
  plugins.livereload.listen()

  gulp.watch([
    './src/core/renderer/**/*.html',
    './src/core/renderer/**/*.js'
  ]).on('change', e => {
    plugins.livereload.changed(e.path)
  })

  gulp.watch('./src/core/renderer/assets/less/**/*.less', ['styles'])
})

gulp.task('test', ['watch'], () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development'
  spawn(electron, ['./src'])
})
