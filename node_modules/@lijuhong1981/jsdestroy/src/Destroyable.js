import destroyObject from './destroyObject.js';

/**
 * Destroyable是一个包含了destroy相关Property的class，可用于继承
 * 
 * @abstract
 * @class
*/
class Destroyable {
    isDestroyed() {
        return false;
    }

    /**
     * 执行销毁，由子类实现
     * @abstract
     */
    onDestroy(...args) {
        // console.warn('onDestroy must be overwrited by subclass.');
    }

    /**
     * 销毁自身
     * @returns {this}
     */
    destroy(...args) {
        if (this.isDestroyed()) {
            console.warn('This object was destroyed.', this);
        } else if (this.isDestroying) {
            console.warn('This object is destroying.', this);
        } else {
            this.onDestroy(...args);
            destroyObject(this);
        }
        return this;
    }
}

export default Destroyable;