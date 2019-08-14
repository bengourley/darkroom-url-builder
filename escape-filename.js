module.exports = escapeFilename;

var slugg = require("slugg");

function escapeFilename(name) {
  // If name is not a string just return an empty string
  if (typeof name !== "string") return "";

  // eslint-disable-next-line no-useless-escape
  var extensionRegExp = /\.[0-9a-z_\-]+$/i;
  var match = name.match(extensionRegExp);

  // slugify the whole name, up to the file extension if it has one
  if (match) return slugg(name.substring(0, match.index)) + match[0];
  return slugg(name);
}
