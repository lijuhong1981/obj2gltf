/**
 * 判断对象是否已被销毁过
 * @param {object} object
 * @returns {Boolean}
 */
function isDestroyed(object) {
    if (typeof object.isDestroyed !== 'undefined') {
        if (typeof object.isDestroyed === 'function')
            return object.isDestroyed();
        else
            return object.isDestroyed;
    }
    return false;
}

export default isDestroyed;