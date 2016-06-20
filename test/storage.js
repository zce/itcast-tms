const storage =  require('../src/core/common/storage.js')

storage.set('hello', { name: '张三' })

console.log(storage.get('hello'))
