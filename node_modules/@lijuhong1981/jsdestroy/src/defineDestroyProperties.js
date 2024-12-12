import destroyObject from "./destroyObject.js";

function returnFalse() {
    return false;
}

/**
 * 为对象或原型链定义destroy相关Property
 * @param {object|object.prototype} target 对象或原型链
 * @param {Function} destroyFunc 外部传入的destroy方法，可不填
 * @returns {void}
 */
function defineDestroyProperties(target, destroyFunc) {
    Object.defineProperties(target, {
        isDestroyed: {
            configurable: true,
            enumerable: true,
            writable: true,
            value: returnFalse,
        },
        onDestroy: {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function (...args) {
                // console.warn('onDestroy must be overwrited by subclass.');
            }
        },
        destroy: {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function (...args) {
                if (this.isDestroyed()) {
                    console.warn('This object was destroyed.', this);
                } else {
                    this.onDestroy(...args);
                    if (destroyFunc)
                        destroyFunc(this, ...args);
                    else
                        destroyObject(this);
                }
                return this;
            }
        }
    });
}

export default defineDestroyProperties;