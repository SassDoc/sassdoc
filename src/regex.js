module.exports.isComment = function (line) {
  return line.match(/^\/{2,}/i);
};

module.exports.isParameter = function (line) {
  return line.match(/^\/{2,}\s*@param\s+\[(number|color|literal|string|map|list|arglist|bool|null)\]\s+\$(\w+)\s*(\(.+\))?\s*:\s*(.+)/i);
};

module.exports.isReturn = function (line) {
  return line.match(/^\/{2,}\s*@return\s+\[(.+)\]/i);
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