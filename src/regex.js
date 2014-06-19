module.exports.isComment = function (line) {
  return line.match(/^\/{2,}/i);
};

module.exports.isParameter = function (line) {
  return line.match(/^\/{2,}\s*@param(?:\s+{\s*([\w-](?:\s*\|?\s*[\w-])*)\s*})?\s+(?:\$([\w-]+))(?:\s+\(([\w-\s]+)\))?(?:\s+-\s*?([\w-\s]+))?/i);
};

module.exports.isReturn = function (line) {
  return line.match(/^\/{2,}\s*@returns(?:\s+{\s*([\w-](?:\s*\|?\s*[\w-])*)\s*})(?:\s+([\w-\s]*))?/i);
};

module.exports.isScope = function (line) {
  return line.match(/^\/{2,}\s*@(private|public|protected)/i);
};

module.exports.isSeparator = function (line) {
  return line.match(/^\/{2,}\s*---/i);
};

module.exports.isFunctionOrMixin = function (line) {
  return line.match(/@(function|mixin)\s+([\w-]+)/i);
};

module.exports.isEmpty = function (line) {
  return line.match(/^\s*$/i);
};

module.exports.isDeprecated = function (line) {
  return line.match(/^\/{2,}\s*@deprecated(?:\s+([\w-\.\s]+))?/i);
};

module.exports.isAuthor = function(line) {
  return line.match(/^\/{2,}\s*@author\s+([\w-\"\s]+)/i);
};