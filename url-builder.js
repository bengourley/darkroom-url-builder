module.exports = createBuilder

var constructUrl = require('./construct-url')

function createBuilder(darkroomUrl, salt) {
  if (!darkroomUrl || !salt) throw new Error('arguments `darkroomUrl` and `salt` are required')
  return function () {
    return new Builder(darkroomUrl, salt)
  }
}

function Builder(darkroomUrl, salt) {
  this.darkroomUrl = darkroomUrl
  this.salt = salt
}

Builder.prototype.resource = function (resource) {
  this._resource = resource
  return this
}

Builder.prototype.width = function (width) {
  this._width = width
  return this
}

Builder.prototype.height = function (height) {
  this._height = height
  return this
}

Builder.prototype.filename = function (filename) {
  this._filename = filename
  return this
}

Builder.prototype.info = function () {
  return constructUrl(this.darkroomUrl, this.salt, 'info', this._resource)
}

Builder.prototype.url = function () {

  if (!this.resource) throw new Error('Cannot build a url without a valid resource')

  var filename = this._filename ? '/' + this._filename : ''

  if (this._width && this._height) {
    return constructUrl(this.darkroomUrl, this.salt, [ this._width, this._height ], this._resource) + filename
  } else if (!this._width && this._height) {
    return constructUrl(this.darkroomUrl, this.salt, [ 0, this._height ], this._resource) + filename
  } else if (this._width && !this._height) {
    return constructUrl(this.darkroomUrl, this.salt, [ this._width ], this._resource) + filename
  } else {
    return constructUrl(this.darkroomUrl, this.salt, 'original', this._resource) + filename
  }

}
