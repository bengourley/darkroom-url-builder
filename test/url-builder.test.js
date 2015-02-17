/*global describe:true, it:true */

var assert = require('assert')
  , crypto = require('crypto')
  , getActionHash = require('../get-action-hash')
  , constructUrl = require('../construct-url')
  , url = require('url')
  , createDarkroomUrlBuilder = require('../url-builder')
  , escapeFilename = require('../escape-filename')

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

describe('escapeFilename()', function () {

  it('should make passed strings URL safe', function () {

    assert.equal(escapeFilename('pathy/pathy.jpg'), 'pathy-pathy.jpg')
    assert.equal(escapeFilename('pathy/pathy.jp:g'), 'pathy-pathy-jp-g')
    assert.equal(escapeFilename('?query.png'), 'query.png')
    assert.equal(escapeFilename('realyrealkflk4lfrjkfksdjbfksdjbk4j234r43_long.gif')
      , 'realyrealkflk4lfrjkfksdjbfksdjbk4j234r43-long.gif')
    assert.equal(escapeFilename('fa-la-di-da.png'), 'fa-la-di-da.png')
    assert.equal(escapeFilename('fa-la-di-da.png'), 'fa-la-di-da.png')
    assert.equal(escapeFilename(''), '')

  })

  it('should return an empty string if the argument passed is not a string', function () {
    assert.equal(escapeFilename(0), '')
    assert.equal(escapeFilename(false), '')
    assert.equal(escapeFilename({}), '')
    assert.equal(escapeFilename([]), '')
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

describe('Builder', function () {

  describe('createBuilder()', function () {
    it('should throw an error if the darkroom credentials are not passed', function () {
      assert.throws(function () {
        createDarkroomUrlBuilder('http://darkroom.io')
      })
      assert.throws(function () {
        createDarkroomUrlBuilder(undefined, 'asdf')
      })
      assert.throws(function () {
        createDarkroomUrlBuilder()
      })
    })
  })

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

  describe('info()', function () {
    it('should build a URL pointing to the /info endpoint', function () {
      var builder = createDarkroomUrlBuilder('http://darkroom.io', 'test salt')
        , url = builder().resource('012ef7ed27c17ea9524f5f5fb3a86921').info()
      assert(/^http:\/\/darkroom.io\/info\/012ef7ed27c17ea9524f5f5fb3a86921:[\w\d]{32}$/.test(url))
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
            .filename('jim.jpeg')
            .url()

      assert(/^http:\/\/darkroom.io\/100\/012ef7ed27c17ea9524f5f5fb3a86921:[\w\d]{32}\/jim.jpeg$/.test(resourceUrl))

    })

    it('should produce a URL with only height', function () {

      var builder = createDarkroomUrlBuilder('http://darkroom.io', 'test salt')
        , resourceUrl = builder()
            .resource('012ef7ed27c17ea9524f5f5fb3a86921')
            .height(100)
            .filename('jim.jpeg')
            .url()

      assert(/^http:\/\/darkroom.io\/0\/100\/012ef7ed27c17ea9524f5f5fb3a86921:[\w\d]{32}\/jim.jpeg$/.test(resourceUrl))

    })

    it('should produce a URL with both height and width', function () {

      var builder = createDarkroomUrlBuilder('http://darkroom.io', 'test salt')
        , resourceUrl = builder()
            .resource('012ef7ed27c17ea9524f5f5fb3a86921')
            .height(100)
            .width(100)
            .filename('jim.jpeg')
            .url()

      assert(/^http:\/\/darkroom.io\/100\/100\/012ef7ed27c17ea9524f5f5fb3a86921:[\w\d]{32}\/jim.jpeg$/
        .test(resourceUrl))

    })

    it('should produce a URL with height, width and mode', function () {

      var createBuilder = createDarkroomUrlBuilder('http://darkroom.io', 'test salt')
        , builer = createBuilder()
            .resource('012ef7ed27c17ea9524f5f5fb3a86921')
            .height(100)
            .width(100)
            .mode('fit')
            .filename('jim.jpeg')

      assert(/^http:\/\/darkroom.io\/100\/100\/fit\/012ef7ed27c17ea9524f5f5fb3a86921:[\w\d]{32}\/jim.jpeg$/
        .test(builer.mode('fit').url()))

      assert(/^http:\/\/darkroom.io\/100\/100\/cover\/012ef7ed27c17ea9524f5f5fb3a86921:[\w\d]{32}\/jim.jpeg$/
        .test(builer.mode('cover').url()))

      assert(/^http:\/\/darkroom.io\/100\/100\/stretch\/012ef7ed27c17ea9524f5f5fb3a86921:[\w\d]{32}\/jim.jpeg$/
        .test(builer.mode('stretch').url()))
    })

    it('should point to the “original” endpoint without height and width', function () {

      var builder = createDarkroomUrlBuilder('http://darkroom.io', 'test salt')
        , resourceUrl = builder()
            .resource('012ef7ed27c17ea9524f5f5fb3a86921')
            .filename('jim.jpeg')
            .url()

      assert(/^http:\/\/darkroom.io\/original\/012ef7ed27c17ea9524f5f5fb3a86921:[\w\d]{32}\/jim.jpeg$/
        .test(resourceUrl))

    })

  })

})
