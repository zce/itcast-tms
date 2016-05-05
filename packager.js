/**
 * Automatic pack
 * please use `npm run pack`
 */

'use strict'

const fs = require('fs')
const path = require('path')
const os = require('os')
const exec = require('child_process').exec

const packager = require('electron-packager')
const argv = require('minimist')(process.argv.slice(2))

const packageJson = require('./package.json')

// const app_name = argv.name || argv.n || packageJson.productName
const app_icon = argv.icon || argv.i || 'assets/app'

const electron_version = argv.version || argv.v

const use_asar = argv.asar || argv.a || false
const build_all_platform = argv.all || false

const out_dir = './dist/releases'

const options = {
  'dir': './build',
  'name': packageJson.productName,
  'build-version': packageJson.version,
  'icon': app_icon,
  'ignore': [],
  'overwrite': true,
  // prune: true,
  'version': '0.37.8',
  'app-version': packageJson.version,
  'asar': use_asar,
  'asar-unpack': '',
  'asar-unpack-dir': '',
  'download': {},
  'app-bundle-id': 'net.wedn.tms',
  'helper-bundle-id': 'net.wedn.tms.helper',
  'app-category-type': 'public.app-category.developer-tools',
  'app-copyright': 'Copyright (c) 2016 WEDN.NET.',
  'version-string': {
    CompanyName: 'WEDN.NET',
    FileDescription: '教学管理系统',
    OriginalFilename: 'TMS.exe',
    ProductName: packageJson.productName,
    InternalName: 'TMS.exe'
  }
}

try {
  options.version = electron_version || require('./node_modules/electron-prebuilt/package.json').version
} catch (e) {}

(function startPack () {
  if (build_all_platform) {
    // build for all platforms
    const archs = ['ia32', 'x64']
    const platforms = ['linux', 'win32', 'darwin']
    platforms.forEach(platform => {
      archs.forEach(arch => {
        pack(platform, arch, log(platform, arch))
      })
    })
  } else {
    // build for current platform only
    pack(os.platform(), os.arch(), log(os.platform(), os.arch()))
  }
}())

function pack (platform, arch, callback) {
  // darwin 只有64位
  if (platform === 'darwin' && arch === 'ia32') return

  // 不同平台不同图标扩展名
  const ext = platform === 'darwin' ? '.icns' : platform === 'win32' ? '.ico' : '.png'
  packager(Object.assign({}, options, {
    icon: options.icon + ext,
    'app-version': packageJson.version || options.version,
    arch: arch,
    // out: `${out_dir}/v${packageJson.version}`, // /${platform}-${arch}
    out: `${out_dir}/${platform}`, // /${platform}-${arch}
    platform: platform,
  }), callback)
}

/**
 * 输出到控制台
 * @param  {string} platform 系统平台
 * @param  {string} arch     位数
 * @return {function}        log func
 */
function log (platform, arch) {
  return (err, files) => {
    if (err) return console.error(err)
    console.log(`${platform}-${arch} finished!`)
  }
}
