module.exports = getActionHash;

var hash = require("crypto").createHash;

function getActionHash(salt, action, uri) {
  return hash("md5")
    .update("/" + action.join("/") + "/" + uri + salt)
    .digest("hex");
}
