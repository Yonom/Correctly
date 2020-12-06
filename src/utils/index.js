/**
 * @param {number} start
 * @param {number} end
 * @param {number} step
 */
export function arrayFromRange(start, end, step) {
  const array = [];
  for (let i = start; i <= end; i += step) {
    array.push(i);
  }
  return array;
}
