module.exports = constructUrl

var getActionHash = require('./get-action-hash')

function constructUrl(darkroomUrl, salt, action, uri, filename) {

  if (Array.isArray(action)) {
    action = action.join('/')
  }

  var hash = getActionHash(salt, action, uri)

  filename = filename ? '/' + filename : ''
  return [ darkroomUrl, action, uri + ':' + hash ].join('/') + filename

}