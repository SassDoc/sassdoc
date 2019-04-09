/**
 * `@groupDescriptions` is should not be used on its own.
 *
 * It gets filled automatically from the lines following the `@group` annotation.
 *
 * @group example
 * This is a group description. It describes the group.
 * It can be split across multiple lines.
 *
 * {
 *   'groupDescriptions': {
 *     'example': 'This is a group description. It describes the group.\nIt can be split across multiple lines.'
 *   }
 * }
 */

export default function groupDescriptions () {
  return {
    name: 'groupDescriptions',
  }
}
