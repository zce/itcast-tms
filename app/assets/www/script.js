;(function (window, document) {
  // Source: https://github.com/Alhadis/Snippets/blob/master/js/polyfills/IE8-child-elements.js
  if (!('childElementCount' in document.documentElement)) {
    Object.defineProperty(Element.prototype, 'childElementCount', {
      get: function () {
        for (var c = 0, nodes = this.children, n, i = 0, l = nodes.length; i < l; ++i) {
          (n = nodes[i], n.nodeType === 1) && ++c
        }
        return c
      }
    })
  }

  if (!window.localStorage) {
    Object.defineProperty(window, 'localStorage', new function () {
      var aKeys = []
      var oStorage = {}
      Object.defineProperty(oStorage, 'getItem', {
        value: function (sKey) { return sKey ? this[sKey] : null },
        writable: false,
        configurable: false,
        enumerable: false
      })
      Object.defineProperty(oStorage, 'key', {
        value: function (nKeyId) { return aKeys[nKeyId] },
        writable: false,
        configurable: false,
        enumerable: false
      })
      Object.defineProperty(oStorage, 'setItem', {
        value: function (sKey, sValue) {
          if (!sKey) return
          document.cookie = escape(sKey) + '=' + escape(sValue) + '; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/'
        },
        writable: false,
        configurable: false,
        enumerable: false
      })
      Object.defineProperty(oStorage, 'length', {
        get: function () { return aKeys.length },
        configurable: false,
        enumerable: false
      })
      Object.defineProperty(oStorage, 'removeItem', {
        value: function (sKey) {
          if (!sKey) return
          document.cookie = escape(sKey) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
        },
        writable: false,
        configurable: false,
        enumerable: false
      })
      this.get = function () {
        var iThisIndx
        for (var sKey in oStorage) {
          iThisIndx = aKeys.indexOf(sKey)
          if (iThisIndx === -1) {
            oStorage.setItem(sKey, oStorage[sKey])
          } else {
            aKeys.splice(iThisIndx, 1)
          }
          delete oStorage[sKey]
        }
        for (aKeys; aKeys.length > 0; aKeys.splice(0, 1)) { oStorage.removeItem(aKeys[0]) }
        for (var aCouple, iKey, nIdx = 0, aCouples = document.cookie.split(/\s*;\s*/); nIdx < aCouples.length; nIdx++) {
          aCouple = aCouples[nIdx].split(/\s*=\s*/)
          if (aCouple.length > 1) {
            oStorage[iKey = unescape(aCouple[0])] = unescape(aCouple[1])
            aKeys.push(iKey)
          }
        }
        return oStorage
      }
      this.configurable = false
      this.enumerable = true
    }())
  }

  var questionCount = document.getElementById('questions').childElementCount
  var inputs = document.getElementsByTagName('input')
  var submit = document.getElementById('btn')
  var flags = new Array(questionCount)
  submit.onclick = function () {
    for (var k = 0; k < inputs.length; k++) {
      var h = inputs[k]
      if (h.name === 'hash') {
        continue
      }
      if (h.checked) {
        flags[h.name] = true
      }
    }
    for (var j = 0; j < questionCount; j++) {
      if (!flags[j]) {
        alert('同学，请完整填写表单！')
        return false
      }
    }
  }
}(window, document))
