/* eslint strict: 0, no-shadow: 0, no-unused-vars: 0, no-console: 0 */
'use strict';

// const fs = require('fs');
// const path = require('path');
const os = require('os');
// const webpack = require('webpack');
// const cfg = require('./webpack.config.production.js');
const packager = require('electron-packager');
const del = require('del');
const exec = require('child_process').exec;
const argv = require('minimist')(process.argv.slice(2));
const pkg = require('./package.json');
const devDeps = Object.keys(pkg.devDependencies);

const appName = argv.name || argv.n || pkg.productName;
const shouldUseAsar = argv.asar || argv.a || false;
const shouldBuildAll = argv.all || false;

const DEFAULT_OPTIONS = {
  // cache: 'cache',
  dir: './',
  name: appName,
  asar: shouldUseAsar,
  ignore: [
    '/log($|/)',
    // '/node_modules($|/)',
    '/src($|/)',
    '/temp($|/)',
    '/test($|/)',
    '/.DS_Store($|/)',
    '/.gitignore($|/)',
    '/gulpfile.js($|/)',
    '/packager.js($|/)',
    '/README.md($|/)'
  ].concat(devDeps.map(name => `/node_modules/${name}($|/)`))
};
// fs.existsSync(path.resolve(__dirname, DEFAULT_OPTIONS.dir)) || fs.mkdirSync(path.resolve(__dirname, DEFAULT_OPTIONS.dir));
// console.log(fs.existsSync(path.resolve(__dirname, DEFAULT_OPTIONS.dir)) );

const icon = argv.icon || argv.i || 'src/app';

if (icon) {
  DEFAULT_OPTIONS.icon = icon;
}

const version = argv.version || argv.v;

if (version) {
  DEFAULT_OPTIONS.version = version;
  startPack();
} else {
  // use the same version as the currently-installed electron-prebuilt
  // exec('npm list electron-prebuilt', (err, stdout) => {
  //   DEFAULT_OPTIONS.version = err ? '0.37.6' : stdout.split('electron-prebuilt@')[1].replace(/\s/g, '').trim();
  //   // console.log(DEFAULT_OPTIONS.version);
  //   startPack();
  // });
  try {
    var prebuiltPackage = require('./node_modules/electron-prebuilt/package.json');
    DEFAULT_OPTIONS.version = prebuiltPackage.version;
  } catch (e) {
    DEFAULT_OPTIONS.version = '0.37.6';
  }
  startPack();
}


function startPack() {
  console.log('start pack...');
  del('release/**/*')
    .then(paths => {
      if (shouldBuildAll) {
        // build for all platforms
        const archs = ['ia32', 'x64'];
        const platforms = ['linux', 'win32', 'darwin'];
        platforms.forEach(platform => {
          archs.forEach(arch => {
            pack(platform, arch, log(platform, arch));
          });
        });
      } else {
        // build for current platform only
        pack(os.platform(), os.arch(), log(os.platform(), os.arch()));
      }
    })
    .catch(err => {
      console.error(err);
    });
}

function pack(platform, arch, cb) {
  // there is no darwin ia32 electron
  if (platform === 'darwin' && arch === 'ia32') return;

  const iconObj = {
    icon: DEFAULT_OPTIONS.icon + (() => {
      let extension = '.png';
      if (platform === 'darwin') {
        extension = '.icns';
      } else if (platform === 'win32') {
        extension = '.ico';
      }
      return extension;
    })()
  };

  const opts = Object.assign({}, DEFAULT_OPTIONS, iconObj, {
    platform: platform,
    arch: arch,
    // prune: true,
    'app-version': pkg.version || DEFAULT_OPTIONS.version,
    out: `release` ///${platform}-${arch}
  });
  // console.log(opts);
  packager(opts, cb);
}

function log(platform, arch) {
  return (err, filepath) => {
    if (err) return console.error(err);
    console.log(`${platform}-${arch} finished!`);
  };
}
