import Cache from './Cache.js';
import Check from '@lijuhong1981/jscheck/src/Check.js';
import definedValue from '@lijuhong1981/jscheck/src/getDefinedValue.js';
import mergeUrl from '@lijuhong1981/jsurl/src/mergeUrl.js';

const CacheType = Object.freeze({
    COMMON: 0, //公共的
    ALONE: 1, //独立的
});

const commonCache = new Cache();

/**
 * 定义的一个加载器基类
 * 
 * onLoad函数需由子类继承实现
 * 
 * @constructor
 * @param {object} options 初始化配置项，可不填
 * @param {string} options.basePath 加载的basePath，可不填
 * @param {object} options.requestOptions 请求配置项，可不填
 * @param {boolean} options.enableCache 是否使用缓存，可不填
 * @param {CacheType} options.cacheType 缓存类型，可不填
*/
class Loader {
    constructor(options = {}) {
        /**
         * @type {string}
        */
        this.basePath = options.basePath;
        this.requestOptions = options.requestOptions;
        /**
         * @type {boolean}
        */
        this.enableCache = definedValue(options.enableCache, true);
        const cacheType = definedValue(options.cacheType, CacheType.COMMON);
        switch (cacheType) {
            case CacheType.ALONE:
                this.cache = new Cache();
                break;
            case CacheType.COMMON:
            default:
                /**
                 * @type {Cache}
                */
                this.cache = commonCache;
                break;
        }
    }

    /**
     * 将basePath与传入url合成为真正的请求url
     * @param {String} url 传入的url
     * @returns {String} 合成后的url
     */
    mergeUrl(url) {
        return mergeUrl(this.basePath, url);
    }

    /**
     * 确保url可用，可由子类覆盖
     * @param {string} url
     * @returns {string}
     */
    ensureUrl(url) {
        return this.mergeUrl(url);
    }

    /**
     * 由子类实现
     * @param {string} url
     * @param {object} options
     * @returns {any}
     */
    onLoad(url, options) {
        throw new Error('This function must be implemented by a subclass.');
    }

    /**
     * 加载资源
     * @param {string} url 加载url，必填项
     * @param {object} options 加载配置项，可选项
     * @param {object} options.requestOptions 请求配置项，可选项
     * @param {boolean} options.enableCache 是否使用缓存，可选项
     * @param {Function} options.onLoad 加载完成通知函数，可选项
     * @param {Function} options.onError 加载失败通知函数，可选项
     * @returns {any} 由子类决定返回对象
     */
    load(url, options = {}) {
        Check.typeOf.string('url', url);
        url = this.ensureUrl(url);

        const enableCache = definedValue(options.enableCache, this.enableCache);
        if (enableCache) {
            const cached = this.cache.get(url);
            if (cached) {
                if (cached.readyPromise) {
                    cached.readyPromise.then(function () {
                        if (typeof options.onLoad === 'function')
                            options.onLoad(cached);
                    });
                } else {
                    if (typeof options.onLoad === 'function')
                        options.onLoad(cached);
                }

                return cached;
            }
        }

        if (!options.requestOptions && this.requestOptions)
            options.requestOptions = this.requestOptions;
        const result = this.onLoad(url, options);
        if (enableCache) {
            this.cache.set(url, result);
        }
        return result;
    }

    /**
     * 异步加载，返回Promise
     * @param {string} url 加载url
     * @param {object} options 加载配置项，可选项
     * @param {object} options.requestOptions 请求配置项，可选项
     * @param {boolean} options.enableCache 是否使用缓存，可选项
     * @param {Function} options.onLoad 加载完成通知函数，可选项
     * @param {Function} options.onError 加载失败通知函数，可选项
     * @returns {Promise} 返回的Promise对象
     */
    loadAsync(url, options = {}) {
        return new Promise((resolve, reject) => {

            function onLoad(result) {
                if (typeof options.onLoad === 'function')
                    options.onLoad(result);
                resolve(result);
            }

            function onError(error) {
                if (typeof options.onError === 'function')
                    options.onError(error);
                reject(error);
            }

            if (!url) {
                const error = new Error('fetch url ' + url + ' is illegal. ');
                onError(error);
                return;
            }

            const loadOptions = Object.assign({}, options);
            loadOptions.onLoad = onLoad;
            loadOptions.onError = onError;

            this.load(url, loadOptions);
        });
    }

    clearCache(destroy) {
        this.cache.clear(destroy)
    }
};

Object.defineProperties(Loader, {
    CacheType: {
        configurable: false,
        get: function () {
            return CacheType;
        }
    },
    commonCache: {
        configurable: false,
        get: function () {
            return commonCache;
        }
    },
});

export default Loader;