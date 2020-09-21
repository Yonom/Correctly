/**
 * @param {number} start
 * @param {number} end
 */
export function arrayFromRange(start, end) {
  return Array(end - start + 1).fill().map((_, idx) => start + idx);
}

/**
 * @param {string} string
 */
export function camelToTitleCase(string) {
  return string
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
}
