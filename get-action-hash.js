module.exports = getActionHash

var crypto = require('crypto')

function getActionHash(salt, action, uri) {
  var md5sum = crypto.createHash('md5')
  md5sum.update(action + uri + salt)
  return md5sum.digest('hex')
}