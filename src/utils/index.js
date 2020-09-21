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
export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
