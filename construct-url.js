module.exports = constructUrl

var getActionHash = require('./get-action-hash')
  , escapeFilename = require('./escape-filename')

function constructUrl(darkroomUrl, salt, action, uri, filename) {

  if (Array.isArray(action)) {
    action = action.join('/')
  }

  var hash = getActionHash(salt, action, uri)

  filename = filename ? '/' + escapeFilename(filename) : ''
  return [ darkroomUrl, action, uri + ':' + hash ].join('/') + filename

}