var Regex = function () {};

Regex.prototype.isComment = function (line) {
  return line.match(/^\/{2,}/i);
};

Regex.prototype.isParameter = function (line) {
  return line.match(/^\/{2,}\s*@(?:param|arg|argument|parameter)(?:\s+{\s*([\w-](?:\s*\|?\s*[\w-])*)\s*})?\s+(?:\$([\w-]+))(?:\s+\(([\w-\s]+)\))?(?:\s+-\s*?([\w-\s]+))?/i);
};

Regex.prototype.isReturn = function (line) {
  return line.match(/^\/{2,}\s*@returns(?:\s+{\s*([\w-](?:\s*\|?\s*[\w-])*)\s*})(?:\s+([\w-\s]*))?/i);
};

Regex.prototype.isScope = function (line) {
  return line.match(/^\/{2,}\s*@(private|public|protected)/i);
};

Regex.prototype.isSeparator = function (line) {
  return line.match(/^\/{2,}\s*---/i);
};

Regex.prototype.isFunctionOrMixin = function (line) {
  return line.match(/@(function|mixin)\s+([\w-]+)/i);
};

Regex.prototype.isEmpty = function (line) {
  return line.match(/^\s*$/i);
};

Regex.prototype.isDeprecated = function (line) {
  return line.match(/^\/{2,}\s*@deprecated(?:\s+([\w-\$\.\s]+))?/i);
};

Regex.prototype.isAuthor = function (line) {
  return line.match(/^\/{2,}\s*@author\s+([\w-\$\"\.\s]+)/i);
};

Regex.prototype.isIgnore = function (line) {
  return line.match(/^\/{2,}\s*@ignore\s+([\w-\$\"\.\s]+)/i);
};

Regex.prototype.isThrow = function (line) {
  return line.match(/^\/{2,}\s*@throws\s+([\w-\$\"\.\s]+)/i);
};

module.exports.regex = Regex;
