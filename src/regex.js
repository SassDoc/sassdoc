var Regex = function () {};

Regex.prototype.isComment = function (line) {
  return line.match(/^\/{2,}/i) || line.match(/^\s*\/?\*+\/?/i);
};

Regex.prototype.isParam = function (line) {
  return line.match(/^@(?:param|arg|argument|parameter)(?:\s+{\s*([\w-](?:\s*\|?\s*[\w-])*)\s*})?\s+(?:\$([\w-]+))(?:\s+\(([\w-\s]+)\))?(?:\s+-\s*?([\w-\s]+))?/i);
};

Regex.prototype.isReturns = function (line) {
  return line.match(/^@returns(?:\s+{\s*([\w-](?:\s*\|?\s*[\w-])*)\s*})(?:\s+([\w-\s]*))?/i);
};

Regex.prototype.isAccess = function (line) {
  return line.match(/^@(private|public|protected)/i) || line.match(/^@access\s+(private|public|protected)/i);
};

Regex.prototype.isSeparator = function (line) {
  return line.match(/^---/i);
};

Regex.prototype.isFunctionOrMixin = function (line) {
  return line.match(/@(function|mixin)\s+([\w-]+)/i);
};

Regex.prototype.isEmpty = function (line) {
  return line.match(/^\s*$/i);
};

Regex.prototype.isDeprecated = function (line) {
  return line.match(/^@deprecated(?:\s+([\w-\$\.\s]+))?/i);
};

Regex.prototype.isAuthor = function (line) {
  return line.match(/^@author\s+([\w-\$\"\.\s]+)/i);
};

Regex.prototype.isTodo = function (line) {
  return line.match(/^@todo\s+([\w-\$\"\.\s]+)/i);
};

Regex.prototype.isIgnore = function (line) {
  return line.match(/^@ignore\s+([\w-\$\"\.\s]+)/i);
};

Regex.prototype.isThrows = function (line) {
  return line.match(/^@throws\s+([\w-\$\"\.\s]+)/i);
};

Regex.prototype.isAlias = function (line) {
  return line.match(/^@alias\s+([\w-]+)/i);
};

module.exports.regex = Regex;
