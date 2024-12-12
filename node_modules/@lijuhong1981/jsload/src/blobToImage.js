import loadImage from "./loadImage.js";

/**
 * 转换Blob对象为Image对象
 * @param {Blob} blob 传入的Blob对象
 * @param {Function} onLoad 加载完成回调
 * @param {Function} onError 加载出错回调
 * @param {Image} result 输出的Image对象，可不填
 * @returns {Image} 返回Image对象
 */
function blobToImage(blob, onLoad, onError, result) {
    const objectUrl = window.URL.createObjectURL(blob);

    return loadImage(objectUrl, {
        onLoad: function (image) {
            window.URL.revokeObjectURL(objectUrl);
            if (typeof onLoad === 'function')
                onLoad(image);
        },
        onError: function (error) {
            window.URL.revokeObjectURL(objectUrl);
            if (typeof onError === 'function')
                onError(error);
        },
    }, result);
};

export default blobToImage;