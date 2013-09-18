/*global describe:true, it:true */

var assert = require('assert')
  , crypto = require('crypto')
  , getActionHash = require('../get-action-hash')

describe('getActionHash()', function () {

  it('should return a string in the form "md5(action, uri, salt)]"', function () {

    var actions = [ '/100/0/', 'nosensical-action' ]
      , uris = [ 'test-uri', '12938190238901280' ]
      , salts = [ 'salty', '~~##salt with ascii chars! [-_-]' ]

    actions.forEach(function (a, i) {

      var md5sum = crypto.createHash('md5')
        , hash = getActionHash(salts[i], actions[i], uris[i])

      md5sum.update(actions[i] + uris[i] + salts[i])
      assert.equal(hash, md5sum.digest('hex'))

    })

  })

})

describe('constructUrl()', function () {
  it('should construct fully formed urls', function () {
  })
})