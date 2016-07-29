# electron-boilerplate

A boilerplate application for Electron runtime

[![Build Status](https://travis-ci.org/zce/electron-boilerplate.svg?branch=vue-auto-update)](https://travis-ci.org/zce/electron-boilerplate)
[![Dependency Status](https://david-dm.org/zce/electron-boilerplate.svg)](https://david-dm.org/zce/electron-boilerplate)
[![devDependency Status](https://david-dm.org/zce/electron-boilerplate/dev-status.svg)](https://david-dm.org/zce/electron-boilerplate#info=devDependencies)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)


## Quick start

The only development dependency of this project is Node.js. So just make sure you have it installed. Then type few commands known to every Node developer...

```bash
$ git clone https://github.com/zce/electron-boilerplate.git your-proj-name -b vue-auto-update
$ cd your-proj-name
$ npm install
$ npm run watch
# Open a new terminal and run
$ npm run boot
```

... and boom! You have running desktop application on your screen.

### Then you can ...

1. Rewrite the `package.json` (root, app, build)
  - `./package.json` remove all fields without `script`, `dependencies` and `devDependencies`
  - `./app/package.json`
  - `./build/package.json`

2. Put your application icons in `./tasks/resources` to replace original

3. Change asar auto updater repo url
  - create new repo for dist update
  - clone the repo to `./dist`
  - change repo url in `./gulpfile.json`
  - change repo url in `./app/backgrounds/update.js`

4. First of all, Run `npm run dist` to create dist file
  - run `npm run dist` in proj folder
  - commit `dist` folder
  

