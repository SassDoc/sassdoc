var check = require('./regex');

// Parse a parameter line to get data
module.exports.parseParameter = function (line) {
  var match = check.isParameter(line);

  // Error
  if (!match) return false;

  return {
    'type': match[1],
    'name': match[2],
    'default': (match[3] ? match[3].substr(0, match[3].length - 1).substring(1) : null),
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
  var doc = { parameters: [], description: '' };

  comments.forEach(function (line, index) {
    if (check.isParameter(line)) {
      var parameter = this.parseParameter(line);

      if (parameter !== false) {
        doc.parameters.push(parameter);
      }
    }

    else if (check.isReturn(line)) {
      doc.return = this.parseReturn(line).split('|');
    }

    else if (check.isScope(line)) {
      doc.scope = check.isScope(line)[1];
    }

    else if (check.isSeparator(line)) {
      return;
    }

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