import blobToImage from "./blobToImage.js";

/**
 * 异步转换Blob对象为Image对象
 * @param {Blob} blob 传入的Blob对象
 * @param {Function} onLoad 加载完成回调
 * @param {Function} onError 加载出错回调
 * @param {Image} result 输出的Image对象，可不填
 * @returns {Promise} 返回Promise对象
 */
function blobToImageAsync(blob, onLoad, onError, result) {
    return new Promise(function (resolve, reject) {
        blobToImage(blob, function (image) {
            if (typeof onLoad === 'function')
                onLoad(image);
            resolve(image);
        }, function (error) {
            if (typeof onError === 'function')
                onError(error);
            reject(error);
        }, result);
    });
};

export default blobToImageAsync;