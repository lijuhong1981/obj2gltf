import blobToImage from "./blobToImage.js";

/**
 * 转换ArrayBuffer对象为Image对象
 * @param {ArrayBuffer} arrayBuffer 传入的ArrayBuffer对象
 * @param {Function} onLoad 加载完成回调
 * @param {Function} onError 加载出错回调
 * @param {Image} result 输出的Image对象，可不填
 * @returns {Image} 返回Image对象
 */
function arrayBufferToImage(arrayBuffer, onLoad, onError, result) {
    const blob = new Blob([new Int8Array(arrayBuffer)]);
    return blobToImage(blob, onLoad, onError, result);
};

export default arrayBufferToImage;