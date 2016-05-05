# Itcast Teaching Management System

[![Build Status](https://travis-ci.org/Micua/itcast-tms.svg?branch=v4.x)](https://travis-ci.org/Micua/itcast-tms)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

This repo is a teaching management system for Itcast, Inc. project. You could use it as a base to build your own desktop app.

## How to use

First, clone the repo via git:

```bash
$ git clone https://github.com/Micua/itcast-tms.git -b v4.x
```

And then install dependencies.

```bash
$ cd itcast-tms
$ npm install
```

### Run it

```bash
$ npm start
```

### Develop it

```bash
$ npm test
```

*Note: requires a node version >= 4 and an npm version >= 2.*


## Native-like UI

If you want to have native-like User Interface (OS X El Capitan and Windows 10), [react-desktop](https://github.com/gabrielbull/react-desktop) may perfect suit for you.


## Maintainers

- [iceStone](https://github.com/Micua)


## LICENSE

ISC © [iceStone](https://github.com/Micua)


## Thanks

- https://github.com/szwacz/electron-boilerplate
- https://github.com/kristoferjoseph/flexboxgrid
- https://philipwalton.github.io/solved-by-flexbox/
- http://www.juxt.com/pov/thoughts/building-native-desktop-apps-with-web-tech
- https://github.com/GitbookIO/nuts
- https://github.com/ArekSredzki/electron-release-server
- https://github.com/maxogden/extract-zip


## TODOS

- Student submit rate info is empty
- Email keyworks reject


## Model

```js
[
	'school_name',
	'academy_name',
	'subject_name',
	'class_count',
	'reasons',
	'class_name',
	'course_name',
	'course_days',
	'head_name',
	'teacher_name',
	'teacher_email',
	'datetime',
	'rated_count',
	'status',
	'questions',
	'emails',
	'leave_count'
]
```
