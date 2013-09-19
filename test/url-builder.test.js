/*global describe:true, it:true */

var assert = require('assert')
  , crypto = require('crypto')
  , getActionHash = require('../get-action-hash')
  , constructUrl = require('../construct-url')
  , url = require('url')
  , createDarkroomUrlBuilder = require('../url-builder')

describe('getActionHash()', function () {

  it('should return a string in the form "md5(action, uri, salt)]"', function () {

    var actions = [ '/100/0/', 'nosensical-action' ]
      , uris = [ 'test-uri', '012ef7ed27c17ea9524f5f5fb3a86921' ]
      , salts = [ 'salty', '~~##salt with ascii chars! [-_-]' ]

    actions.forEach(function (a, i) {

      var md5sum = crypto.createHash('md5')
        , hash = getActionHash(salts[i], actions[i], uris[i])

      md5sum.update('/' + actions[i] + '/' + uris[i] + salts[i])
      assert.equal(hash, md5sum.digest('hex'))

    })

  })

})

describe('constructUrl()', function () {

  it('should construct URLs in the desired format', function () {

    var darkroomUrl = 'http://darkroom.io'
      , salt = 'test salt'
      , actions = [ 'original', [ 100, 200 ] ]
      , uri = '012ef7ed27c17ea9524f5f5fb3a86921'
      , filename = 'jim.jpeg'

    actions.forEach(function (action, i) {
      var parts = url.parse(constructUrl(darkroomUrl, salt, action, uri, filename))
      assert.equal(parts.protocol, 'http:')
      assert.equal(parts.host, 'darkroom.io')
      if (i === 0) assert(/^\/original\/012ef7ed27c17ea9524f5f5fb3a86921/.test(parts.path))
      if (i === 1) assert(/^\/100\/200\/012ef7ed27c17ea9524f5f5fb3a86921/.test(parts.path))
    })

  })

})

describe('Builder()', function () {

  describe('width()', function () {

    it('should only accept numeric values', function () {

      var builder = createDarkroomUrlBuilder('http://darkroom.io', 'test salt')
      assert.throws(function () {
        builder().width('e')
      }, Error)
      assert.throws(function () {
        builder().width('3')
      }, Error)
      assert.throws(function () {
        builder().width(NaN)
      }, Error)
      assert.doesNotThrow(function () {
        builder().width(3000)
      })

    })

  })

  describe('height()', function () {

    it('should only accept numeric values', function () {

      var builder = createDarkroomUrlBuilder('http://darkroom.io', 'test salt')
      assert.throws(function () {
        builder().height('e')
      }, Error)
      assert.throws(function () {
        builder().height('3')
      }, Error)
      assert.throws(function () {
        builder().height(NaN)
      }, Error)
      assert.doesNotThrow(function () {
        builder().height(3000)
      })

    })

  })

  describe('url()', function () {

    it('should error if the resource has not been set', function () {

      var builder = createDarkroomUrlBuilder('http://darkroom.io', 'test salt')
      assert.throws(function () {
        builder().url()
      }, /Cannot build a url without a valid resource/)

    })

    it('should produce a URL with only width', function () {

      var builder = createDarkroomUrlBuilder('http://darkroom.io', 'test salt')
        , resourceUrl = builder()
            .resource('012ef7ed27c17ea9524f5f5fb3a86921')
            .width(100)
            .height(100)
            .filename('jim.jpeg')
            .url()

      assert(resourceUrl)

    })

    it('should produce a URL with only height', function () {

      var builder = createDarkroomUrlBuilder('http://darkroom.io', 'test salt')
        , resourceUrl = builder()
            .resource('012ef7ed27c17ea9524f5f5fb3a86921')
            .height(100)
            .filename('jim.jpeg')
            .url()

      assert(resourceUrl)

    })

    it('should produce a URL with both height and width', function () {

      var builder = createDarkroomUrlBuilder('http://darkroom.io', 'test salt')
        , resourceUrl = builder()
            .resource('012ef7ed27c17ea9524f5f5fb3a86921')
            .height(100)
            .width(100)
            .filename('jim.jpeg')
            .url()

      assert(resourceUrl)

    })

    it('should point to the "original" endpoint without height and width', function () {

      var builder = createDarkroomUrlBuilder('http://darkroom.io', 'test salt')
        , resourceUrl = builder()
            .resource('012ef7ed27c17ea9524f5f5fb3a86921')
            .filename('jim.jpeg')
            .url()

      assert(resourceUrl)
      assert(resourceUrl.indexOf('original'))

    })

  })

})