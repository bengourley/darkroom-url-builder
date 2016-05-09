module.exports = constructUrl

var getActionHash = require('./get-action-hash')
  , escapeFilename = require('./escape-filename')

function constructUrl(darkroomUrl, salt, action, uri, filename, format) {

  var hash = getActionHash(salt, action, uri)
  filename = filename ? '/' + escapeFilename(filename) : ''
  if (format) filename += '.' + format
  return [ darkroomUrl ]
    .concat(action)
    .concat([ uri + ':' + hash ]).join('/') + filename + '.' + format

}
