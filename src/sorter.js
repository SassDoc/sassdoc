'use strict';

function compare(a, b) {
  if (a > b) {
    return 1;
  }

  if (a === b) {
    return 0;
  }

  return -1;
}

module.exports = {
  postProcess: function (data) {
    var flat = [];

    Object.keys(data).forEach(function (type) {
      Object.keys(data[type]).forEach(function (name) {
        flat.push(data[type][name]);
      });
    });

    flat.sort(function (a, b) {
      return compare(a.group[0][0].toLowerCase(), b.group[0][0].toLowerCase()) ||
             compare(a.context.type, b.context.type) ||
             compare(a.file.path, b.file.path) ||
             compare(a.index, b.index);
    });

    flat.forEach(function (item) {
      console.log(item.group[0][0].toLowerCase(), item.context.type, item.file.path, item.index);
    });

    return data;
  },
};
