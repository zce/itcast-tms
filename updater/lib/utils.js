'use strict'
const path = require('path')
const http = require('http')
const crypto = require('crypto')
const fs = require('original-fs')
const download = require('download')
const logger = require('./logger')

const fetchUrl = uri => new Promise((resolve, reject) => {
  // console.time('utils')
  const request = http.get(uri, res => {
    // console.log(`Got response: ${res.statusCode}`)
    // if(res.statusCode !== )
    // consume response body
    res.setEncoding('utf8')
    const contents = []
    res.on('data', chunk => {
      // console.log(`BODY: ${chunk}`)
      contents.push(chunk)
    }).on('end', () => {
      // console.timeEnd('utils')
      // console.log('No more data in response.')
      resolve(contents.join(''))
    }).on('error', reject)
    res.resume()
  }).on('error', reject)
  // 超时操作
  request.setTimeout(3000, () => {
    // handle timeout here
    reject(new Error(`request '${uri} timeout! '`))
  })
})

const cacheRoot = path.resolve(__dirname, '../../cache/')
const fetchFile = (uri, filename, progress) => new Promise((resolve, reject) => {
  download({ extract: true, mode: '755' })
    .get(uri)
    // 输出到下载缓存目录
    .dest(cacheRoot)
    // 监视下载进度
    .use((res, uri, next) => {
      if (!res.headers['content-length']) {
        next()
        return
      }
      const total = parseInt(res.headers['content-length'], 10)
      let current = 0
      res.on('data', chunk => progress && progress((current += chunk.length) / total))
      res.on('end', () => next())
    })
    // .rename(`../${filename}.asar`)
    .run((error, files) => {
      if (error) {
        // console.log(`Got file error: ${error.message}`)
        reject(error)
      } else {
        // resolve(files[0])

        const to = path.resolve(cacheRoot, `../${filename}.asar`)

        // process.noAsar = true

        fs.rename(files[0].path, to, error => {
          if (error) {
            if (filename === 'updater') {
              reject('更新的是更新器，需要重启动')
            } else {
              reject(error)
            }
          } else {
            resolve(to)
          }
        })
      }
    })
})

const getFileStampAsync = (filename, type) => new Promise((resolve, reject) => {
  type = type || 'sha1'
  fs.readFile(filename, (error, buffer) => {
    if (error)
      return reject(error)
    const hash = crypto.createHash(type)
    hash.update(buffer)
    resolve(hash.digest('hex'))
  })
})

const getFileStamp = (filename, type) => {
  type = type || 'sha1'
  const buffer = fs.readFileSync(filename)
  var hash = crypto.createHash(type)
  hash.update(buffer)
  return hash.digest('hex')
}

module.exports = { fetchUrl, fetchFile, getFileStamp}
