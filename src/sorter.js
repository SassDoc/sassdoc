export default function sorter(data) {
  let sorted = {};

  Object.keys(data).sort().forEach(type => {
    sorted[type] = {};

    Object.keys(data[type])
      .map(name => data[type][name])
      .sort((a, b) => {
        return compare(a.group[0][0].toLowerCase(), b.group[0][0].toLowerCase()) ||
               compare(a.file.path, b.file.path) ||
               compare(a.context.line.start, b.context.line.start);

      })
      .forEach(item => {
        sorted[type][item.context.name] = item;
      });
  });

  return sorted;
};

function compare(a, b) {
  switch (true) {
    case a > b: return 1;
    case a === b: return 0;
    default: return -1;
  }
}
