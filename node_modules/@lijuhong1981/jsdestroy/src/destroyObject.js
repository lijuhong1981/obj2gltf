import destroyHTMLElement from './destroyHTMLElement.js';
import isDestroyed from './isDestroyed.js';

function returnTrue() {
    return true;
}

/**
 * 销毁一个对象下所有属性和方法
 * 销毁完成后会设置object.isDestroyed = function() { return true; };
 * @param {object} object 销毁对象
 * @param {object} config 销毁配置
 * @param {boolean} config.deleteProperty 是否删除对象属性，默认true
 * @param {Array<string>} config.ignoreProperties 需要忽略的属性数组
 * @param {boolean} config.overwriteFunction 是否覆盖对象方法，默认true
 * @param {boolean} config.releaseArray 是否释放数组内容，默认true，为true时会执行array.length = 0
 * @param {boolean} config.destroyHTMLElement 是否销毁HTMLElement，默认true
 * @param {boolean} config.deep 是否向下执行深度销毁，默认false
 * @returns {void}
 */
function destroyObject(object, config) {
    if (isDestroyed(object) || object.isDestroying) {
        console.warn('The object isDestroyed or isDestroying, repeated call destroyObject function are not required.', object);
        return;
    }

    config = Object.assign({
        deleteProperty: true,
        ignoreProperties: [],
        overwriteFunction: true,
        releaseArray: true,
        destroyHTMLElement: true,
    }, config);

    config.ignoreProperties.push('isDestroying', 'isDestroyed', 'destroy', 'undeletable');

    //标记正在执行销毁
    object.isDestroying = true;

    function warnOnDestroyed() {
        console.warn('The object isDestroyed, call function is invalid.', object);
    }

    for (const key in object) {
        //过滤属性
        if (config.ignoreProperties) {
            if (config.ignoreProperties.indexOf(key) !== -1)
                continue;
        }
        try {
            const value = object[key];
            if (value) {
                //有缓存或受保护标记，不执行销毁
                if (value.isCached || value.isProtected)
                    continue;
                if (typeof value === 'function' && config.overwriteFunction === true)
                    object[key] = warnOnDestroyed;
                else if (Array.isArray(value) && config.releaseArray === true)
                    value.length = 0;
                else if (value instanceof HTMLElement && config.destroyHTMLElement === true)
                    destroyHTMLElement(object[key]);
                //如果value是对象且deep为true
                else if (typeof value === 'object' && config.deep === true) {
                    if (typeof value.destroy === 'function')
                        value.destroy();
                    else
                        destroyObject(value, deep);
                }
                if (value.undeletable) //有不可删除标记，不执行delete操作
                    continue;
            }
        } catch (error) {
            console.warn(error);
        }
        if (config.deleteProperty === true)
            delete object[key];
    }

    object.isDestroyed = returnTrue;

    delete object.isDestroying;

    return object;
}

export default destroyObject;