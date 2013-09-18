module.exports = constructUrl

var getActionHash = require('./get-action-hash')

function constructUrl(darkroomUrl, salt, action, uri) {

  if (Array.isArray(action)) {
    action = action.join('/')
  }

  action = '/' + action + '/'

  var hash = getActionHash(salt, action, uri)
  return [ darkroomUrl, action, uri + ':' + hash ].join('/')

}