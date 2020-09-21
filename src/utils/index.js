/**
 * @param {number} start
 * @param {number} end
 */
export function arrayFromRange(start, end) {
  return Array(end - start + 1).fill().map((_, idx) => start + idx);
}
