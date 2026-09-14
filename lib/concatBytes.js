"use strict";
// module.exports = concatBytes;

/**
 * Concatenate byte arrays into a single Uint8Array. Replacement for
 * Buffer.concat so the library runs in the browser without a polyfill.
 *
 * @param {Uint8Array[]} arrays The byte arrays to concatenate.
 * @returns {Uint8Array} The concatenated byte array.
 *
 * @private
 */
function concatBytes(arrays) {
  const length = arrays.length;
  let totalLength = 0;
  for (let i = 0; i < length; ++i) {
    totalLength += arrays[i].length;
  }

  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (let i = 0; i < length; ++i) {
    result.set(arrays[i], offset);
    offset += arrays[i].length;
  }
  return result;
}

export default concatBytes;
