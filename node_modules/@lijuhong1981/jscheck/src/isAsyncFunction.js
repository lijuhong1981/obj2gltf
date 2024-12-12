/**
 * 是否异步函数
 * @param {Function} func
 * @returns {boolean}
 */
function isAsyncFunction(func) {
    return func.constructor.name === 'AsyncFunction';
}

export default isAsyncFunction;