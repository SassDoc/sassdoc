var check = require('./regex');

// Parse a parameter line to get data
module.exports.parseParameter = function (line) {
  var match = check.isParameter(line);

  // Error
  if (!match) return false;

  return {
    'type': match[1],
    'name': match[2],
    'default': match[3] || null,
    'description': match[4]
  };
};

// Parse a return line
module.exports.parseReturn = function (line) {
  var match = check.isReturn(line);

  // Error
  if (!match) return false;

  return match[1];
};

// Define a block of comments
module.exports.findCommentBlock = function (index, array) {
  var previousLine = index - 1;
  var comments = [];

  // Loop back
  while (previousLine--) {
    // If it's not a comment or if it's an empty line, break
    if ((comments.length > 0 && check.isEmpty(array[previousLine])) || !check.isComment(array[previousLine])) {
      break;
    }

    // Push the new comment line
    comments.unshift(array[previousLine]);
  }

  return comments;
};

// Parse a block of comments
module.exports.parseCommentBlock = function (comments) {
  var doc = {
    'parameters': [],
    'description': '',
    'scope': 'public',
    'deprecated': false,
    'return': {
      'type': null,
      'description': ''
    }
  };

  comments.forEach(function (line, index) {
    // Parameter
    if (check.isParameter(line)) {
      var parameter = this.parseParameter(line);

      if (parameter !== false) {
        doc.parameters.push(parameter);
      }
    }

    // Deprecated flag
    else if (check.isDeprecated(line)) {
      doc.deprecated = check.isDeprecated(line)[1] || true;
    }

    // Return
    else if (check.isReturn(line)) {
      var ret = check.isReturn(line);
      doc.return.type = ret[1].split('|');
      doc.return.description = ret[2];
    }

    // Scope
    else if (check.isScope(line)) {
      doc.scope = check.isScope(line)[1];
    }

    // Separator, skip
    else if (check.isSeparator(line)) {
      return;
    }

    // Description
    else {
      doc.description += (doc.description.length === 0 ? line.substring(3) : '\n' + line.substring(3));
    }
  }.bind(this));

  return doc;
};

// Run
module.exports.parseFile = function (content) {
  var array = content.split("\n"),
      tree = []; //{ 'functions': [], 'mixins': [] };

  // Looping through the file
  array.forEach(function (line, index) {
    var isCallable = check.isFunctionOrMixin(line);

    // If it's either a mixin or a function
    if (isCallable) {
      var item = this.parseCommentBlock(this.findCommentBlock(index, array));
      item.type = isCallable[1];
      item.name = isCallable[2];

      tree.push(item);
    }
  }.bind(this));

  return tree;
};