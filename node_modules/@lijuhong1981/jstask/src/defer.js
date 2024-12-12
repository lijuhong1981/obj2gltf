/**
 * Creates a deferred object, containing a promise object, and functions to resolve or reject the promise.
 * @returns {object} deferred object
 * @property {Function} resolve Resolves the promise when called.
 * @property {Function} reject Rejects the promise when called.
 * @property {Promise} promise Promise object.
 */
function defer() {
    let resolve;
    let reject;
    const promise = new Promise(function (res, rej) {
        resolve = res;
        reject = rej;
    });

    return {
        resolve: resolve,
        reject: reject,
        promise: promise,
    };
}

export default defer;
