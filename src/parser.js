/**
 * Dependencies
 */
var Regex = new (require('./regex')).regex();
var Utils = new (require('./utils')).utils();

/**
 * Regex object
 *
 * @constructs
 */
var Parser = function () {};

/**
 * Define a block of comments
 * @param  {index} index - index of line where function/mixin starts
 * @param  {array} array - file as an array of lines
 * @return {array}         array of lines
 */
Parser.prototype.findCommentBlock = function (index, array) {
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

/**
 * Parse a block of comments
 * @param  {array} comments - array of lines
 * @return {object}           function/mixin documentation
 */
Parser.prototype.parseCommentBlock = function (comments) {
  var line, doc = {
    'parameters': [],
    'throws': [],
    'todos': [],
    'alias': false,
    'description': '',
    'access': 'public',
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

    else if (line.is === "description") {
      doc[line.is] += line.value;
    }

    // Anything else
    else {
      doc[line.is] = line.value;
    }

  }.bind(this));

  doc.description = doc.description.substring(1);
  return doc;
};

/**
 * Parse a file
 * @param  {string} content - file content
 * @return {array}            array of documented functions/mixins
 */
Parser.prototype.parseFile = function (content) {
  var array = content.split("\n"),
      tree = [];

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

/**
 * Parse a line to determine what it is
 * @param  {string} line  - line to be parsed
 * @return {object|false}
 */
Parser.prototype.parseLine = function (line) {
  var value;

  // Useless line, skip
  if (line.length === 0 || Regex.isSeparator(line) || Regex.isIgnore(line)) {
    return false;
  }

  value = Regex.isParam(line);
  if (value) {
    return {
      'is': 'parameters',
      'value': {
        'type': value[1],
        'name': value[2],
        'default': value[3] || null,
        'description': value[4]
      },
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

  value = Regex.isReturns(line);
  if (value) {
    return {
      'is': 'return',
      'value': {
        'type': value[1].split('|'),
        'description': value[2]
      }
    }
  }

  value = Regex.isAccess(line);
  if (value) {
    return {
      'is': 'access',
      'value': value[1]
    }
  }

  value = Regex.isThrows(line);
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


module.exports.parser = Parser;