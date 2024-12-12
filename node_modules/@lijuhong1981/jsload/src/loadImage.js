import Check from "@lijuhong1981/jscheck/src/Check.js";
import defer from "@lijuhong1981/jstask/src/defer.js";

/**
 * 加载图片
 * @param {string} url 图片url
 * @param {object} options 加载配置项
 * @param {string} options.crossOrigin 可选，crossOrigin设置
 * @param {Function} options.onLoad 可选，加载成功回调函数
 * @param {Function} options.onError 可选，加载出错回调函数
 * @param {Image} result 输出的Image对象，可不填
 * @returns {Image} 返回Image对象
 */
function loadImage(url, options = {}, result = new Image()) {
    Check.typeOf.string('url', url);

    const readyPromise = defer();
    result.readyPromise = readyPromise.promise;

    result.onload = () => {
        result.onload = undefined;
        result.onerror = undefined;

        if (typeof options.onLoad === 'function')
            options.onLoad(result);
        readyPromise.resolve(result);
    }

    result.onerror = (error) => {
        result.onload = undefined;
        result.onerror = undefined;

        if (typeof options.onError === 'function')
            options.onError(error);
        readyPromise.reject(error);
    }

    result.crossOrigin = options.crossOrigin || 'anonymous';
    result.src = url;

    return result;
};

export default loadImage;