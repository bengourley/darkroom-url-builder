module.exports = escapeFilename

var slugg = require('slugg')

function escapeFilename(name) {

  // If name is falsy, don't try any string manipulation on it
  if (!name) return

  var extensionRegExp = /\.[0-9a-z_\-]+$/i
    , match = name.match(extensionRegExp)

  // slugify the whole name, up to the file extension if it has one
  if (match) return slugg(name.substring(0, match.index)) + match[0]
  return slugg(name)

}