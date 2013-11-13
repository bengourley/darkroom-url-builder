module.exports = getActionHash

var hash = require('MD5')

function getActionHash(salt, action, uri) {
  return hash('/' + action + '/' + uri + salt)
}