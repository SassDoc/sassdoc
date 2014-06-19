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

// Parse a line to determine what it is
module.exports.parseLine = function (line) {
  var value;

  if (check.isParameter(line)) {
    return {
      'is': 'parameter',
      'value': this.parseParameter(line)
    }
  }

  value = check.isDeprecated(line);
  if (value) {
    return {
      'is': 'deprecated',
      'value': value[1] || true
    }
  }

  value = check.isAuthor(line);
  if (value) {
    return {
      'is': 'author',
      'value': value[1]
    }
  }

  value = check.isReturn(line);
  if (value) {
    return {
      'is': 'return',
      'value': {
        'type': value[1].split('|'),
        'description': value[2]
      }
    }
  }

  value = check.isScope(line);
  if (value) {
    return {
      'is': 'scope',
      'value': value[1]
    }
  }

  if (check.isSeparator(line)) {
    return false;
  }

  return {
    'is': 'description',
    'value': '\n' + this.stripComments(line)
  }
};

// Strip comments from a line
// @TODO improve
module.exports.stripComments = function (line) {
  return line.substring(3);
};

// Parse a block of comments
module.exports.parseCommentBlock = function (comments) {
  var line, doc = {
    'parameters': [],
    'description': '',
    'scope': 'public',
    'deprecated': false,
    'author': false,
    'return': {
      'type': null,
      'description': false
    }
  };

  comments.forEach(function (line, index) {
    line = this.parseLine(line);

    // Separator
    if (!line) return;

    // Parameter
    if (line.is === 'parameter') {
      doc.parameters.push(line.value);
    }

    // Anything else
    else {
      doc[line.is] = line.value;
    }
  }.bind(this));

  doc.description = doc.description.substring(1);
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