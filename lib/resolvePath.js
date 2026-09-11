"use strict";

// module.exports = resolvePath;

/**
 * Resolve a reference path (e.g. a mtl or texture path from the obj/mtl file)
 * against a directory, using the browser URL parser so that absolute
 * references (https://...) are kept intact and `..` segments are resolved
 * correctly. The node path module cannot do this in the browser because
 * `path.resolve` prepends `process.cwd()` and collapses the `//` in URLs.
 *
 * @param {String} referencePath The reference path to resolve.
 * @param {String} directory The directory to resolve against.
 * @returns {String} The resolved path.
 *
 * @private
 */
function resolvePath(referencePath, directory) {
  // Unify windows-style separators
  referencePath = referencePath.replace(/\\/g, "/");
  directory = directory.replace(/\\/g, "/");
  try {
    // The directory must end with a trailing slash, otherwise the URL parser
    // treats its last segment as a file name and drops it.
    const directoryHref = directory.endsWith("/") ? directory : directory + "/";
    const base = new URL(
      directoryHref,
      typeof location !== "undefined" ? location.href : undefined,
    );
    return new URL(referencePath, base).href;
  } catch (error) {
    // The directory could not be parsed as a URL. Return the reference as-is.
    return referencePath;
  }
}

export default resolvePath;
