var Regex = new (require('./regex')).regex();
var Utils = new (require('./utils')).utils();

// Parse a parameter line to get data
module.exports.parseParameter = function (line) {
  var match = Regex.isParameter(line);

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
  var match = Regex.isReturn(line);

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
    if ((comments.length > 0 && Regex.isEmpty(array[previousLine])) || !Regex.isComment(array[previousLine])) {
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

  if (line.length === 0 || Regex.isSeparator(line) || Regex.isIgnore(line)) {
    return false;
  }

  if (Regex.isParameter(line)) {
    return {
      'is': 'parameters',
      'value': this.parseParameter(line),
      'array': true
    }
  }

  value = Regex.isDeprecated(line);
  if (value) {
    return {
      'is': 'deprecated',
      'value': value[1] || true
    }
  }

  value = Regex.isAuthor(line);
  if (value) {
    return {
      'is': 'author',
      'value': value[1]
    }
  }

  value = Regex.isReturn(line);
  if (value) {
    return {
      'is': 'return',
      'value': {
        'type': value[1].split('|'),
        'description': value[2]
      }
    }
  }

  value = Regex.isScope(line);
  if (value) {
    return {
      'is': 'scope',
      'value': value[1]
    }
  }

  value = Regex.isThrow(line);
  if (value) {
    return {
      'is': 'throws',
      'value': value[1],
      'array': true
    }
  }

  value = Regex.isTodo(line);
  if (value) {
    return {
      'is': 'todos',
      'value': value[1],
      'array': true
    }
  }

  value = Regex.isAlias(line);
  if (value) {
    return {
      'is': 'alias',
      'value': value[1]
    }
  }

  return {
    'is': 'description',
    'value': '\n' + line
  }
};

// Parse a block of comments
module.exports.parseCommentBlock = function (comments) {
  var line, doc = {
    'parameters': [],
    'throws': [],
    'todos': [],
    'alias': false,
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
    line = this.parseLine(Utils.uncomment(line));

    // Separator or @ignore
    if (!line) return;

    // Array things (@throws, @parameters...)
    if (typeof line.array !== "undefined" && line.array === true) {
      doc[line.is].push(line.value);
    }

    // Anything else
    else {
      doc[line.is] += line.value;
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
    var isCallable = Regex.isFunctionOrMixin(line);

    // If it's either a mixin or a function
    if (isCallable) {
      var commentBlock = this.findCommentBlock(index, array);
      var item = this.parseCommentBlock(commentBlock);
      item.type = isCallable[1];
      item.name = isCallable[2];

      tree.push(item);
    }
  }.bind(this));

  return tree;
};