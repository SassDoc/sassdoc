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
    var sorted = {};

    Object.keys(data).sort().forEach(function (type) {
      sorted[type] = {};

      Object.keys(data[type])
        .map(function (name) {
          return data[type][name];
        })
        .sort(function (a, b) {
          return compare(a.group[0][0].toLowerCase(), b.group[0][0].toLowerCase()) ||
                 compare(a.file.path, b.file.path) ||
                 compare(a.context.line.start, b.context.line.start);

        })
        .forEach(function (item) {
          sorted[type][item.context.name] = item;
        });
    });

    return sorted;
  },
};
