/**
 * @param {Array} data An array of SassDoc data objects.
 * @return {Array} The sorted data.
 */
export default function sort (data) {
  return data.sort((a, b) => {
    return compare(a.group[0].toLowerCase(), b.group[0].toLowerCase()) ||
           compare(a.file.path, b.file.path) ||
           compare(a.context.line.start, b.context.line.start)
  })
}

function compare (a, b) {
  switch (true) {
    case a > b: return 1
    case a === b: return 0
    default: return -1
  }
}
